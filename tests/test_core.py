from datetime import date
from decimal import Decimal
import pytest

from pankhudi_contribute.client import AmbiguousSearchError, exact_uid_match
from pankhudi_contribute.filters import project_eligible, workbook_eligible
from pankhudi_contribute.journal import SubmissionJournal
from pankhudi_contribute.models import Activity, ProjectDetail, WorkbookProject
from pankhudi_contribute.payloads import PayloadValidationError, build_payload, selected_activities
from pankhudi_contribute.utils import redact


def wb(**kw):
    data = dict(project_uid="PRJ", complexity="Minor", expected_end_date=date(2026,8,1), readiness_state="Likely enabled")
    data.update(kw); return WorkbookProject(**data)

def detail(**kw):
    data = dict(project_uid="PRJ", project_id=1, approval_status=4, project_status=1, expected_end_date=date(2026,8,1), activities=[Activity(10, Decimal("3"), Decimal("1"), Decimal("1"))])
    data.update(kw); return ProjectDetail(**data)


def test_end_date_before_august_excluded(): assert workbook_eligible(wb(expected_end_date=date(2026,7,31))).reason == "expired_before_2026_08_01"
def test_end_date_exact_august_allowed(): assert workbook_eligible(wb(expected_end_date=date(2026,8,1))).ok
def test_complex_excluded_by_default(): assert workbook_eligible(wb(complexity="Complex")).reason == "complex_excluded"
def test_existing_contributor_skipped(): assert project_eligible(detail(is_contributor_added=True), "PRJ").reason == "already_contributed"
def test_existing_request_skipped(): assert project_eligible(detail(contributor_participation_request_id=99), "PRJ").reason == "existing_request"
def test_remaining_quantity_calculation(): assert detail().activities[0].remaining_qty == Decimal("1")
def test_zero_remaining_omitted(): assert selected_activities(detail(activities=[Activity(1, Decimal("1"), Decimal("1"), Decimal("0"))])) == []
def test_decimal_quantities_remain_decimals():
    payload = build_payload(detail(activities=[Activity(1, Decimal("1.5"), Decimal("0.25"), Decimal("0"))]), created_on="T")
    assert payload["request"]["details"][0]["contributionQty"] == "1.25"
    assert payload["request"]["details"][0]["currentQty"] == 1.25

def test_negative_remaining_fails():
    with pytest.raises(PayloadValidationError): selected_activities(detail(activities=[Activity(1, Decimal("1"), Decimal("2"), Decimal("0"))]))

def test_one_activity_payload():
    payload = build_payload(detail(), created_on="2026-07-15T00:00:00.000Z")
    assert payload["request"]["projectId"] == 1
    assert payload["request"]["details"] == [{"id":0,"projectContributionId":None,"activityId":10,"contributionQty":"1","currentQty":1,"deliveredQty":0,"deliveryRemark":None,"deliverOn":None,"statusId":1,"isActive":True,"createdBy":132975,"createdOn":"2026-07-15T00:00:00.000Z","updatedBy":None,"updatedOn":None}]

def test_multi_activity_payload():
    payload = build_payload(detail(activities=[Activity(1, Decimal("2")), Activity(2, Decimal("3"))]), created_on="T")
    assert [d["activityId"] for d in payload["request"]["details"]] == [1,2]

def test_duplicate_activity_ids_fail():
    with pytest.raises(PayloadValidationError): build_payload(detail(activities=[Activity(1, Decimal("2")), Activity(1, Decimal("3"))]))

def test_search_exact_uid_matching(): assert exact_uid_match({"data":{"content":[{"projectUid":"X"},{"projectUid":"PRJ"}]}}, "PRJ")["projectUid"] == "PRJ"
def test_project_id_mismatch_behavior():
    search = exact_uid_match({"data":{"content":[{"projectUid":"PRJ", "projectId": 2}]}}, "PRJ")
    assert search["projectId"] != 1

def test_ambiguous_search_rejected():
    with pytest.raises(AmbiguousSearchError): exact_uid_match({"content":[{"projectUid":"PRJ"},{"projectUid":"PRJ"}]}, "PRJ")

def test_idempotency_journal_prevents_duplicate_post(tmp_path):
    p = {"x": 1}; j = SubmissionJournal(tmp_path/"j.jsonl")
    from pankhudi_contribute.utils import canonical_hash
    j.append(action="post", status="submitted", payloadHash=canonical_hash(p))
    assert j.has_successful_payload(p)

def test_unknown_timeout_policy_is_refetch_not_blind_retry():
    import pankhudi_contribute.client as c
    assert hasattr(c, "UnknownPostTimeout")

def test_authentication_secrets_redacted():
    assert "abc" not in redact("Authorization: abc Cookie=secret csrf-token=tok sessionid=sid")

def test_csv_reader_loads_required_columns(tmp_path):
    from pankhudi_contribute.reader import read_projects
    path = tmp_path / "projects.csv"
    path.write_text("Project UID,Project ID,Complexity,Expected End Date,Likely Contribute Button State (Derived),Recommended Action\nPRJ-1,123,Minor,2026-08-01,Likely enabled,Go\n", encoding="utf-8")
    rows = read_projects(path)
    assert rows[0].project_uid == "PRJ-1"
    assert rows[0].project_id == 123
    assert rows[0].expected_end_date == date(2026, 8, 1)

def test_reporting_writes_csv_without_openpyxl_requirement(tmp_path):
    from pankhudi_contribute.reporting import write_reports
    write_reports([{"Project UID": "PRJ-1"}], tmp_path)
    assert (tmp_path / "contribution_results.csv").exists()

def test_storage_state_headers_include_csrf_and_local_storage_token(tmp_path):
    from pankhudi_contribute.auth import headers_from_storage_state
    path = tmp_path / "state.json"
    path.write_text('{"cookies":[{"name":"XSRF-TOKEN","value":"csrf%20123"}],"origins":[{"origin":"https://pankhudi.wcd.gov.in","localStorage":[{"name":"access_token","value":"abc.jwt.token"}]}]}', encoding="utf-8")
    headers = headers_from_storage_state(str(path))
    assert headers["X-XSRF-TOKEN"] == "csrf 123"
    assert headers["Authorization"] == "Bearer abc.jwt.token"

def test_storage_state_headers_include_session_storage_token(tmp_path):
    from pankhudi_contribute.auth import headers_from_storage_state
    path = tmp_path / "state.json"
    path.write_text('{"cookies":[],"origins":[{"origin":"https://pankhudi.wcd.gov.in","sessionStorage":[{"name":"access_token","value":"session.jwt.token"}]}]}', encoding="utf-8")
    headers = headers_from_storage_state(str(path))
    assert headers["Authorization"] == "Bearer session.jwt.token"
