from __future__ import annotations

from decimal import Decimal
from pathlib import Path
from typing import Any

import typer

from .auth import headers_from_storage_state
from .client import PankhudiClient, exact_uid_match, unwrap_project
from .filters import project_eligible, workbook_eligible
from .journal import SubmissionJournal
from .models import ProjectDetail, WorkbookProject
from .payloads import build_payload, selected_activities
from .reader import WorkbookReadError, read_projects
from .reporting import write_reports
from .utils import canonical_hash, now_utc_ms, write_json

app = typer.Typer(help="Dry-run-first PANKHUDI contribution automation")

DEFAULT_INPUT = "PANKHUDI_All_279_Projects_Complexity_Contribution_Readiness_Updated.xlsx"
DEFAULT_SHEET = "Ready to Contribute"
DEFAULT_STORAGE = ".secrets/pankhudi-storage-state.json"

@app.command()
def login(storage_state: str = DEFAULT_STORAGE) -> None:
    typer.echo("Manual login helper placeholder.")
    typer.echo("For now, sign in with your browser and export Playwright storage state to this path:")
    typer.echo(f"  {storage_state}")

@app.command()
def plan(
    input: str = DEFAULT_INPUT,
    sheet: str = DEFAULT_SHEET,
    storage_state: str = DEFAULT_STORAGE,
    project_uid: str | None = None,
    include_complex: bool = False,
    accept_id_refresh: bool = False,
    current_qty_mode: str = "selected",
    output_dir: str = "output",
) -> None:
    """Read workbook rows, fetch current projects when authenticated, and write dry-run payload/report files."""
    out = Path(output_dir)
    try:
        workbook_rows = read_projects(input, sheet)
    except WorkbookReadError as exc:
        raise typer.BadParameter(str(exc)) from exc

    if project_uid:
        workbook_rows = [row for row in workbook_rows if row.project_uid == project_uid]
    if not workbook_rows:
        raise typer.BadParameter("No workbook rows matched the supplied filters")

    headers = headers_from_storage_state(storage_state if Path(storage_state).exists() else None)
    client = PankhudiClient(headers=headers) if headers else None
    journal = SubmissionJournal(out / "submission_journal.jsonl")
    results: list[dict[str, Any]] = []
    summary = _empty_summary(total_workbook_rows=len(workbook_rows), dry_run=True, authenticated=bool(client))

    for row in workbook_rows:
        report = _base_report(row)
        timestamp = now_utc_ms()
        report["Timestamp"] = timestamp
        eligible = workbook_eligible(row, include_complex=include_complex)
        if not eligible.ok:
            _skip(report, results, summary, eligible.reason or "workbook_not_eligible")
            journal.append(projectUid=row.project_uid, projectId=row.project_id, action="dry_run", status="skipped", reason=eligible.reason, payloadHash=None)
            continue
        summary["eligible"] += 1
        if client is None:
            _skip(report, results, summary, "authentication_missing_current_api_fetch_not_run")
            journal.append(projectUid=row.project_uid, projectId=row.project_id, action="dry_run", status="skipped", reason="authentication_missing", payloadHash=None)
            continue
        try:
            search_response = client.search(row.project_uid)
            write_json(out / "responses" / f"{row.project_uid}.search.json", search_response)
            search_project = exact_uid_match(search_response, row.project_uid)
            report["Search status"] = "matched"
            current_project_id = int(search_project.get("projectId") or search_project.get("id"))
            if row.project_id is not None and row.project_id != current_project_id and not accept_id_refresh:
                _skip(report, results, summary, f"project_id_mismatch workbook={row.project_id} api={current_project_id}")
                continue
            detail_response = client.detail(current_project_id)
            write_json(out / "responses" / f"{row.project_uid}.detail.json", detail_response)
            detail = ProjectDetail.from_api(unwrap_project(detail_response))
            report["Detail-fetch status"] = "fetched"
            validation = project_eligible(detail, row.project_uid, include_complex=include_complex, complexity=row.complexity)
            if not validation.ok:
                _skip(report, results, summary, validation.reason or "project_not_eligible")
                continue
            payload = build_payload(detail, current_qty_mode=_current_qty_mode(current_qty_mode))
            payload_hash = canonical_hash(payload)
            if journal.has_successful_payload(payload):
                _skip(report, results, summary, "payload_already_submitted_in_journal")
                continue
            payload_file = out / "planned_payloads" / f"{row.project_uid}.json"
            write_json(payload_file, payload)
            selected = selected_activities(detail)
            report.update({
                "Project ID": detail.project_id,
                "Activity count": len(detail.activities),
                "Selected activity count": len(selected),
                "Total selected quantity": str(sum((qty for _, qty, _ in selected), Decimal("0"))),
                "Validation status": "ready_to_submit",
                "POST status": "dry_run_not_posted",
                "Verification status": "not_run_dry_run",
                "Payload file": str(payload_file),
            })
            summary["ready_to_submit"] += 1
            summary["total_activity_lines"] += len(selected)
            summary["total_selected_quantity"] = str(Decimal(str(summary["total_selected_quantity"])) + sum((qty for _, qty, _ in selected), Decimal("0")))
            results.append(report)
            journal.append(projectUid=row.project_uid, projectId=detail.project_id, action="dry_run", status="planned", reason=None, payloadHash=payload_hash, httpStatus=None, responseId=None)
        except Exception as exc:  # noqa: BLE001 - CLI must record per-project failures and continue
            write_json(out / "errors" / f"{row.project_uid}.json", {"error": str(exc), "timestamp": timestamp})
            _skip(report, results, summary, f"api_or_validation_error: {exc}", api_error=True)
            journal.append(projectUid=row.project_uid, projectId=row.project_id, action="dry_run", status="failed", reason=str(exc), payloadHash=None)

    write_reports(results, out)
    write_json(out / "run_summary.json", summary)
    _print_summary(summary, out)

@app.command()
def submit(execute: bool = False, confirm_batch: str | None = None, max_projects: int = 5, storage_state: str = DEFAULT_STORAGE) -> None:
    if not execute or not confirm_batch:
        typer.echo(_submit_guardrail_message(), err=True)
        raise typer.Exit(code=2)
    headers = headers_from_storage_state(storage_state if Path(storage_state).exists() else None)
    if not headers:
        raise typer.BadParameter("Authentication is missing")
    _client = PankhudiClient(headers=headers)
    _journal = SubmissionJournal()
    typer.echo(f"Ready to submit up to {max_projects} projects for batch {confirm_batch}")
    typer.echo("Live submit loop is intentionally not enabled until a one-project dry-run payload is reviewed.")

def _submit_guardrail_message() -> str:
    return (
        "Live submission is blocked by default. The submit command will not run unless you pass both "
        "--execute and --confirm-batch.\n\n"
        "Run a one-project dry run first, review output/planned_payloads/<projectUid>.json, then use:\n"
        "  python -m pankhudi_contribute submit --execute --confirm-batch \"SINGLE-PROJECT-VALIDATION\" "
        "--max-projects 1 --storage-state .secrets/pankhudi-storage-state.json\n\n"
        "For planning only, use:\n"
        "  python -m pankhudi_contribute plan --input <workbook-or-csv>\n"
    )

def _current_qty_mode(value: str) -> str:
    if value not in {"selected", "listed"}:
        raise typer.BadParameter("--current-qty-mode must be selected or listed")
    return value

def _empty_summary(**extra: Any) -> dict[str, Any]:
    summary: dict[str, Any] = {
        "eligible": 0,
        "excluded_by_end_date": 0,
        "excluded_by_complexity": 0,
        "already_contributed": 0,
        "existing_request": 0,
        "no_remaining_quantity": 0,
        "api_errors": 0,
        "ready_to_submit": 0,
        "total_activity_lines": 0,
        "total_selected_quantity": "0",
        "skipped": 0,
    }
    summary.update(extra)
    return summary

def _base_report(row: WorkbookProject) -> dict[str, Any]:
    return {
        "Project UID": row.project_uid,
        "Project ID": row.project_id or "",
        "Complexity": row.complexity,
        "Expected End Date": row.expected_end_date.isoformat() if row.expected_end_date else "",
        "Centre names": "",
        "Activity count": "",
        "Selected activity count": "",
        "Total selected quantity": "",
        "Search status": "not_run",
        "Detail-fetch status": "not_run",
        "Validation status": "not_run",
        "POST status": "not_run_dry_run",
        "HTTP status": "",
        "Returned contribution/request ID": "",
        "Verification status": "not_run",
        "Skip/failure reason": "",
        "Timestamp": "",
        "Payload file": "",
        "Response file": "",
    }

def _skip(report: dict[str, Any], results: list[dict[str, Any]], summary: dict[str, Any], reason: str, api_error: bool = False) -> None:
    report["Validation status"] = "skipped" if not api_error else "failed"
    report["Skip/failure reason"] = reason
    summary["skipped"] += 1
    if "expired" in reason:
        summary["excluded_by_end_date"] += 1
    elif "complex" in reason:
        summary["excluded_by_complexity"] += 1
    elif "already_contributed" in reason:
        summary["already_contributed"] += 1
    elif "existing_request" in reason:
        summary["existing_request"] += 1
    elif "no_remaining" in reason:
        summary["no_remaining_quantity"] += 1
    elif api_error:
        summary["api_errors"] += 1
    results.append(report)

def _print_summary(summary: dict[str, Any], out: Path) -> None:
    typer.echo("Dry run complete. No POST requests were made.")
    typer.echo(f"Rows processed: {summary['total_workbook_rows']}")
    typer.echo(f"Ready to submit: {summary['ready_to_submit']}")
    typer.echo(f"Skipped: {summary['skipped']}")
    if not summary.get("authenticated"):
        typer.echo("Authentication was not provided; current API fetch and payload planning were skipped.", err=True)
        typer.echo("Provide --storage-state .secrets/pankhudi-storage-state.json or PANKHUDI_COOKIE/PANKHUDI_AUTHORIZATION.", err=True)
    typer.echo(f"Reports written under: {out}")
