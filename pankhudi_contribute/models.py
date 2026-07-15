from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from .utils import decimal_or_zero

MIN_END_DATE = date(2026, 8, 1)
USER_ID = 132975

@dataclass(slots=True)
class WorkbookProject:
    project_uid: str
    project_id: int | None = None
    complexity: str = ""
    expected_end_date: date | None = None
    readiness_state: str = ""
    recommended_action: str = ""

@dataclass(slots=True)
class Activity:
    activity_id: int
    quantity: Decimal = Decimal("0")
    current_quantity_contributed: Decimal = Decimal("0")
    contribution_request_quantity: Decimal = Decimal("0")
    raw: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_api(cls, data: dict[str, Any]) -> "Activity":
        aid = data.get("activityId", data.get("id"))
        if aid is None:
            raise ValueError("Activity missing activityId")
        return cls(
            activity_id=int(aid),
            quantity=decimal_or_zero(data.get("quantity")),
            current_quantity_contributed=decimal_or_zero(data.get("currentQuantityContributed")),
            contribution_request_quantity=decimal_or_zero(data.get("contributionRequestQuantity")),
            raw=data,
        )

    @property
    def remaining_qty(self) -> Decimal:
        return self.quantity - self.current_quantity_contributed - self.contribution_request_quantity

@dataclass(slots=True)
class ProjectDetail:
    project_uid: str
    project_id: int
    approval_status: int | None = None
    project_status: int | None = None
    expected_end_date: date | None = None
    partial_contribution: Any = None
    is_contributor_added: bool = False
    contributor_participation_id: Any = None
    contributor_participation_request_id: Any = None
    activities: list[Activity] = field(default_factory=list)
    raw: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_api(cls, data: dict[str, Any]) -> "ProjectDetail":
        uid = data.get("projectUid") or data.get("projectUID")
        pid = data.get("projectId") or data.get("id")
        if not uid or pid is None:
            raise ValueError("Project detail missing projectUid/projectId")
        activities = data.get("activities") or data.get("projectActivities") or []
        return cls(
            project_uid=str(uid), project_id=int(pid),
            approval_status=_int_or_none(data.get("approvalStatus")),
            project_status=_int_or_none(data.get("projectStatus")),
            expected_end_date=parse_date(data.get("expectedEndDate")),
            partial_contribution=data.get("partialContribution"),
            is_contributor_added=bool(data.get("isContributorAdded") or False),
            contributor_participation_id=data.get("contributorParticipationId"),
            contributor_participation_request_id=data.get("contributorParticipationRequestId"),
            activities=[Activity.from_api(a) for a in activities], raw=data,
        )

def _int_or_none(value: Any) -> int | None:
    return None if value in (None, "") else int(value)

def parse_date(value: Any) -> date | None:
    if value in (None, ""):
        return None
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    text = str(value).strip().replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(text).date()
    except ValueError:
        return date.fromisoformat(text[:10])
