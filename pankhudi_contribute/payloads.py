from __future__ import annotations
from decimal import Decimal
from typing import Literal
from .models import ProjectDetail, USER_ID
from .utils import decimal_json, decimal_string, now_utc_ms

class PayloadValidationError(ValueError):
    pass

def selected_activities(detail: ProjectDetail, overrides: dict[tuple[str, int], Decimal] | None = None) -> list[tuple[int, Decimal, Decimal]]:
    rows: list[tuple[int, Decimal, Decimal]] = []
    seen: set[int] = set()
    for activity in detail.activities:
        if activity.activity_id in seen:
            raise PayloadValidationError(f"duplicate activityId {activity.activity_id}")
        seen.add(activity.activity_id)
        remaining = activity.remaining_qty
        if remaining < 0:
            raise PayloadValidationError(f"negative remaining quantity for activityId {activity.activity_id}")
        if remaining <= 0:
            continue
        selected = (overrides or {}).get((detail.project_uid, activity.activity_id), remaining)
        if selected > remaining:
            raise PayloadValidationError(f"contribution exceeds remaining for activityId {activity.activity_id}")
        if selected > 0:
            rows.append((activity.activity_id, selected, activity.quantity))
    return rows

def build_payload(detail: ProjectDetail, current_qty_mode: Literal["selected", "listed"] = "selected", created_on: str | None = None, overrides: dict[tuple[str, int], Decimal] | None = None) -> dict:
    created_on = created_on or now_utc_ms()
    rows = selected_activities(detail, overrides)
    if not rows:
        raise PayloadValidationError("details must not be empty")
    details = []
    for activity_id, selected, listed in rows:
        current_qty = selected if current_qty_mode == "selected" else listed
        details.append({
            "id": 0, "projectContributionId": None, "activityId": activity_id,
            "contributionQty": decimal_string(selected), "currentQty": decimal_json(current_qty),
            "deliveredQty": 0, "deliveryRemark": None, "deliverOn": None,
            "statusId": 1, "isActive": True, "createdBy": USER_ID, "createdOn": created_on,
            "updatedBy": None, "updatedOn": None,
        })
    return {"request": {"id": 0, "userId": USER_ID, "projectId": detail.project_id, "approvedBy": None, "approvedOn": None, "statusId": 1, "isActive": True, "createdBy": USER_ID, "createdOn": created_on, "updatedBy": None, "updatedOn": None, "details": details}}
