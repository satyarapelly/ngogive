from __future__ import annotations
from dataclasses import dataclass
from .models import MIN_END_DATE, ProjectDetail, WorkbookProject

@dataclass(slots=True)
class ValidationResult:
    ok: bool
    reason: str | None = None

def workbook_eligible(row: WorkbookProject, include_complex: bool = False) -> ValidationResult:
    complexity = row.complexity.strip().lower()
    if complexity == "complex" and not include_complex:
        return ValidationResult(False, "complex_excluded")
    if complexity not in {"minor", "medium", "complex"}:
        return ValidationResult(False, "unsupported_complexity")
    if row.expected_end_date and row.expected_end_date < MIN_END_DATE:
        return ValidationResult(False, "expired_before_2026_08_01")
    if row.readiness_state and not row.readiness_state.lower().startswith("likely enabled"):
        return ValidationResult(False, "readiness_not_enabled")
    return ValidationResult(True)

def project_eligible(detail: ProjectDetail, requested_uid: str, include_complex: bool = False, complexity: str = "") -> ValidationResult:
    if detail.project_uid != requested_uid:
        return ValidationResult(False, "project_uid_mismatch")
    if detail.expected_end_date and detail.expected_end_date < MIN_END_DATE:
        return ValidationResult(False, "expired_before_2026_08_01")
    if detail.approval_status != 4 or detail.project_status != 1:
        return ValidationResult(False, "not_active_approved")
    if detail.is_contributor_added or detail.contributor_participation_id is not None:
        return ValidationResult(False, "already_contributed")
    if detail.contributor_participation_request_id is not None:
        return ValidationResult(False, "existing_request")
    if complexity.lower() == "complex" and not include_complex:
        return ValidationResult(False, "complex_excluded")
    if not any(a.remaining_qty > 0 for a in detail.activities):
        return ValidationResult(False, "no_remaining_quantity")
    return ValidationResult(True)
