from __future__ import annotations
from pathlib import Path
import typer
from .auth import headers_from_storage_state
from .client import PankhudiClient
from .journal import SubmissionJournal

app = typer.Typer(help="Dry-run-first PANKHUDI contribution automation")

@app.command()
def login(storage_state: str = ".secrets/pankhudi-storage-state.json") -> None:
    typer.echo("Open the PANKHUDI portal in Playwright manually, sign in, and save storage state.")
    typer.echo(f"Storage state target: {storage_state}")

@app.command()
def plan(input: str = "PANKHUDI_All_279_Projects_Complexity_Contribution_Readiness_Updated.xlsx", sheet: str = "Ready to Contribute", storage_state: str = ".secrets/pankhudi-storage-state.json", project_uid: str | None = None, include_complex: bool = False) -> None:
    typer.echo("Dry run only: fetch, validate, and write planned payloads; no POST will be made.")

@app.command()
def submit(execute: bool = False, confirm_batch: str | None = None, max_projects: int = 5, storage_state: str = ".secrets/pankhudi-storage-state.json") -> None:
    if not execute or not confirm_batch:
        raise typer.BadParameter("submit requires --execute and --confirm-batch")
    headers = headers_from_storage_state(storage_state if Path(storage_state).exists() else None)
    if not headers:
        raise typer.BadParameter("Authentication is missing")
    _client = PankhudiClient(headers=headers)
    _journal = SubmissionJournal()
    typer.echo(f"Ready to submit up to {max_projects} projects for batch {confirm_batch}")
