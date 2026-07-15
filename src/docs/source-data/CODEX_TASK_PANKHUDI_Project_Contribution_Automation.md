# Codex Task: Automate PANKHUDI Project Contribution Requests

## Objective

Build a safe, resumable command-line automation that:

1. Reads the approved pilot project list from the Excel workbook.
2. Processes only projects classified as **Minor** or **Medium** and marked **Ready to Contribute**.
3. Excludes projects whose `expectedEndDate` is earlier than `2026-08-01`.
4. Searches each project by `projectUid`.
5. Fetches the latest project details by `projectId`.
6. Builds the contribution request from the project's current activity/line-item data.
7. Defaults each selected line item to the full remaining required quantity.
8. Submits the request to the PANKHUDI contribution-save endpoint.
9. Re-fetches the project to verify that the contribution request was recorded.
10. Writes a complete audit log and resumable results file.

The tool must default to **dry-run**. It must never POST unless the operator supplies `--execute` and confirms the batch.

---

## Official API Endpoints

### Search project by UID

```text
GET https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch
```

Query parameters:

```text
status=1
stateId=28
districtId=699
projectUid=<PROJECT_UID>
userId=132975
page=0
size=12
```

Example:

```text
https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?status=1&stateId=28&districtId=699&projectUid=PRJ-2026-0010004&userId=132975&page=0&size=12
```

### Fetch current project details

```text
GET https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?projectId=<PROJECT_ID>
```

Example:

```text
https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?projectId=10004
```

### Save contribution request

```text
POST https://pankhudi.wcd.gov.in/API/MasterApi/v1/project-contributions/save
Content-Type: application/json
```

---

## Input Files

Primary input:

```text
PANKHUDI_All_279_Projects_Complexity_Contribution_Readiness_Updated.xlsx
```

Default sheet:

```text
Ready to Contribute
```

Required columns:

- `Project UID`
- `Project ID`
- `Complexity`
- `Expected End Date`
- `Likely Contribute Button State (Derived)`
- `Recommended Action`

The CLI must also accept a different workbook or CSV:

```bash
python -m pankhudi_contribute plan \
  --input PANKHUDI_All_279_Projects_Complexity_Contribution_Readiness_Updated.xlsx \
  --sheet "Ready to Contribute"
```

---

## Default Filtering Rules

A project is eligible only when all conditions are true:

1. `Complexity` is `Minor` or `Medium`.
2. `Expected End Date >= 2026-08-01`.
3. The workbook readiness state starts with `Likely enabled`.
4. Search response returns the exact requested `projectUid`.
5. `approvalStatus == 4`.
6. `projectStatus == 1`.
7. `isContributorAdded == false`.
8. `contributorParticipationId == null`.
9. `contributorParticipationRequestId == null`.
10. At least one activity has a remaining quantity greater than zero.

Default behavior must exclude `Complex` projects. Add an explicit optional override:

```bash
--include-complex
```

Do not process expired projects, unavailable projects, projects already selected by a contributor, or projects with an existing contribution/participation request.

---

## Authentication

Do not hardcode passwords, access tokens, bearer tokens, cookies, CSRF tokens, or session IDs.

Preferred authentication method:

```bash
--storage-state .secrets/pankhudi-storage-state.json
```

Use Playwright's authenticated browser storage state and its API request context so that the same valid PANKHUDI cookies/session are used for API calls.

Optional fallback environment variables:

```text
PANKHUDI_AUTHORIZATION
PANKHUDI_COOKIE
PANKHUDI_CSRF_TOKEN
```

Requirements:

- `.secrets/` must be excluded in `.gitignore`.
- Never print tokens or full cookies.
- Redact authentication values in exceptions and logs.
- Stop with a clear authentication error on `401` or `403`.
- Do not repeatedly retry authentication failures.

Add a helper command that lets the operator sign in manually and save Playwright storage state:

```bash
python -m pankhudi_contribute login \
  --storage-state .secrets/pankhudi-storage-state.json
```

The login command should open a visible browser, wait for the operator to complete sign-in, confirm an authenticated portal page, and then save the storage state locally.

---

## Processing Workflow

For every eligible workbook row:

### Step 1: Search by Project UID

Call the search endpoint with:

```text
status=1
stateId=28
districtId=699
projectUid=<uid>
userId=132975
page=0
size=12
```

Validation:

- HTTP response must be successful.
- Response must contain exactly one matching `projectUid`, or select the exact UID match.
- Reject ambiguous results.
- Capture the returned `projectId`.
- If workbook `Project ID` differs from the search result, use the current API `projectId`, log the mismatch, and require operator review unless `--accept-id-refresh` is supplied.

### Step 2: Fetch Current Project Details

Call:

```text
GET /API/MasterApi/v1/projects/fetch?projectId=<projectId>
```

The detail fetch is the source of truth for:

- `projectId`
- `projectUid`
- `approvalStatus`
- `projectStatus`
- `partialContribution`
- `isContributorAdded`
- `contributorParticipationId`
- `contributorParticipationRequestId`
- `expectedEndDate`
- `activities`
- each current activity ID and quantities

Never use stale `activityId` values from a prior file or a sample request.

### Step 3: Calculate Remaining Activity Quantity

For every activity:

```python
remaining_qty = (
    quantity
    - currentQuantityContributed
    - contributionRequestQuantity
)
```

Treat missing numeric fields as zero.

Rules:

- Skip activities where `remaining_qty <= 0`.
- Fail validation if any quantity is negative.
- Preserve decimals when the activity permits decimals.
- Do not silently round quantities.
- Default-select every activity with a positive remaining quantity.
- Default contribution amount is the entire remaining quantity.
- Allow an optional override CSV for specific project/activity quantities.

Override format:

```csv
projectUid,activityId,contributionQty
PRJ-2026-0010004,38073,1
PRJ-2026-0010004,38074,1
```

### Step 4: Build the Save Payload

Generate one UTC timestamp per project:

```python
created_on = datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")
```

Payload shape:

```json
{
  "request": {
    "id": 0,
    "userId": 132975,
    "projectId": 10004,
    "approvedBy": null,
    "approvedOn": null,
    "statusId": 1,
    "isActive": true,
    "createdBy": 132975,
    "createdOn": "2026-07-15T09:59:35.038Z",
    "updatedBy": null,
    "updatedOn": null,
    "details": [
      {
        "id": 0,
        "projectContributionId": null,
        "activityId": 38073,
        "contributionQty": "1",
        "currentQty": 1,
        "deliveredQty": 0,
        "deliveryRemark": null,
        "deliverOn": null,
        "statusId": 1,
        "isActive": true,
        "createdBy": 132975,
        "createdOn": "2026-07-15T09:59:35.038Z",
        "updatedBy": null,
        "updatedOn": null
      }
    ]
  }
}
```

Field rules:

- `userId = 132975`
- `createdBy = 132975`
- `projectId` comes from the latest fetch.
- `activityId` comes from the latest detail fetch.
- `contributionQty` must be a string representation of the selected remaining quantity.
- `currentQty` must be the same selected quantity as a JSON number, matching the successful browser request pattern.
- `deliveredQty = 0`
- `deliveryRemark = null`
- `deliverOn = null`
- `statusId = 1`
- `isActive = true`
- `approvedBy = null`
- `approvedOn = null`
- Use the same timestamp for the request and all detail rows for that project.
- `details` must not be empty.

Before relying on `currentQty`, compare one manually successful browser request with the generated payload. Add a configuration option if the portal expects the original listed quantity rather than the selected contribution quantity:

```bash
--current-qty-mode selected
--current-qty-mode listed
```

Default to `selected`, matching the provided sample.

### Step 5: Validate Before POST

Block submission if any condition fails:

- Project UID does not match.
- Project is expired or has an end date before `2026-08-01`.
- Project is not active/approved.
- Contributor or participation already exists.
- No remaining activities.
- Any requested contribution exceeds remaining quantity.
- Duplicate activity IDs appear in the payload.
- Project is `Complex` without `--include-complex`.
- The generated payload differs from the latest fetched project state.
- Authentication is missing.
- The project was already successfully submitted in the local results journal.

### Step 6: Dry Run

Default command:

```bash
python -m pankhudi_contribute plan \
  --input PANKHUDI_All_279_Projects_Complexity_Contribution_Readiness_Updated.xlsx \
  --sheet "Ready to Contribute" \
  --storage-state .secrets/pankhudi-storage-state.json
```

Dry run must:

- Fetch current data.
- Apply filters.
- Build payloads.
- Save payload previews.
- Never POST.
- Display a final batch summary:
  - eligible
  - excluded by end date
  - excluded by complexity
  - already contributed
  - existing request
  - no remaining quantity
  - API errors
  - ready to submit
  - total activity lines
  - total selected quantity

Write payloads to:

```text
output/planned_payloads/<projectUid>.json
```

### Step 7: Explicit Execute Mode

Submission command:

```bash
python -m pankhudi_contribute submit \
  --input PANKHUDI_All_279_Projects_Complexity_Contribution_Readiness_Updated.xlsx \
  --sheet "Ready to Contribute" \
  --storage-state .secrets/pankhudi-storage-state.json \
  --execute \
  --confirm-batch "MINOR-MEDIUM-AUGUST-PILOT"
```

Additional safeguards:

- Default `--max-projects 5`.
- Require an explicit larger value for a larger batch.
- Print the exact project count and Project UIDs.
- Require interactive confirmation:
  `Type SUBMIT <count> PROJECTS`
- Support `--project-uid` for a single-project test.
- Support `--from-results` to resume only failed/unprocessed projects.
- Stop the batch after three consecutive API failures.
- Use a conservative delay between POSTs, configurable with `--delay-seconds`, default 2 seconds.
- Retry transient `429`, `502`, `503`, and `504` responses with exponential backoff.
- Never retry a POST blindly after an unknown timeout. Re-fetch the project first to determine whether the request was already created.

### Step 8: Verify After Save

After a successful POST:

1. Parse and save the complete response.
2. Record any returned contribution/request ID.
3. Re-fetch the project details.
4. Confirm at least one of the following:
   - `contributorParticipationRequestId` is now populated.
   - a contribution request object is returned.
   - activity request quantities changed as expected.
   - the save response contains an unambiguous success ID/status.
5. Mark the project `Verified Submitted` only after verification.
6. Otherwise mark it `Submitted - Verification Pending` and do not retry automatically.

---

## Idempotency and Resume

Create an append-only JSON Lines journal:

```text
output/submission_journal.jsonl
```

Each record should include:

```json
{
  "timestamp": "2026-07-15T10:00:00.000Z",
  "projectUid": "PRJ-2026-0010004",
  "projectId": 10004,
  "action": "dry_run|post|verify",
  "status": "planned|skipped|submitted|verified|failed",
  "reason": null,
  "payloadHash": "sha256...",
  "httpStatus": 200,
  "responseId": null
}
```

Idempotency rules:

- Hash a canonical version of each payload.
- Do not POST a payload whose successful hash already exists in the journal.
- Re-fetch before resubmitting any previously failed/unknown project.
- Skip projects that now have a contribution or participation request.
- Support safe restart after interruption.

---

## Reports

Generate:

```text
output/contribution_results.xlsx
output/contribution_results.csv
output/submission_journal.jsonl
output/run_summary.json
output/responses/<projectUid>.json
output/errors/<projectUid>.json
```

The Excel/CSV report must include:

- Project UID
- Project ID
- Complexity
- Expected End Date
- Centre names
- Activity count
- Selected activity count
- Total selected quantity
- Search status
- Detail-fetch status
- Validation status
- POST status
- HTTP status
- Returned contribution/request ID
- Verification status
- Skip/failure reason
- Timestamp
- Payload file
- Response file

Never place secrets in any report.

---

## Project Structure

Implement in Python 3.11+:

```text
pankhudi_contribute/
  __init__.py
  __main__.py
  cli.py
  auth.py
  client.py
  models.py
  filters.py
  payloads.py
  journal.py
  reporting.py
  utils.py
tests/
  test_filters.py
  test_payloads.py
  test_idempotency.py
  test_response_parsing.py
  fixtures/
pyproject.toml
README.md
.env.example
.gitignore
```

Recommended libraries:

- `httpx`
- `playwright`
- `pydantic`
- `openpyxl`
- `typer`
- `tenacity`
- `pytest`

Use type hints throughout.

---

## Response Parsing Requirements

The API may wrap project data in different shapes. Implement robust parsers for common forms:

```json
{"data":{"content":[...]}}
```

```json
{"data":{...}}
```

```json
{"content":[...]}
```

```json
{...project fields...}
```

The parser must never silently choose the first search result unless its `projectUid` exactly matches the requested UID.

Save raw responses for traceability.

---

## Logging

Use structured logging.

Allowed log fields:

- projectUid
- projectId
- activityId
- HTTP method
- endpoint path
- status code
- retry count
- validation result
- elapsed time

Redact:

- Authorization
- Cookie
- CSRF token
- session identifiers
- personal credentials

---

## Tests

Create unit tests covering at least:

1. End date before `2026-08-01` is excluded.
2. End date exactly `2026-08-01` is allowed.
3. Complex project is excluded by default.
4. Existing contributor participation is skipped.
5. Existing participation request is skipped.
6. Remaining quantity calculation.
7. Activity with zero remaining quantity is omitted.
8. Decimal quantities remain decimals.
9. Negative remaining quantity fails validation.
10. Correct payload for a one-activity project.
11. Correct payload for a multi-activity project.
12. Duplicate activity IDs fail validation.
13. Search response exact-UID matching.
14. Project ID mismatch behavior.
15. Idempotency journal prevents duplicate POST.
16. Unknown POST timeout triggers re-fetch, not blind retry.
17. Authentication secrets are redacted from logs.

Use mocked API responses. Tests must never call the live save endpoint.

---

## Manual Pilot Test

Before batch execution, run one known project only:

```bash
python -m pankhudi_contribute plan \
  --project-uid PRJ-2026-0010004 \
  --storage-state .secrets/pankhudi-storage-state.json
```

Review:

- project details
- remaining activities
- generated payload
- selected quantities
- currentQty mode
- headers/cookies
- expected POST response

Then execute only that project:

```bash
python -m pankhudi_contribute submit \
  --project-uid PRJ-2026-0010004 \
  --storage-state .secrets/pankhudi-storage-state.json \
  --execute \
  --max-projects 1 \
  --confirm-batch "SINGLE-PROJECT-VALIDATION"
```

Confirm the request in the PANKHUDI user interface before increasing the batch size.

---

## Acceptance Criteria

The task is complete when:

1. The CLI authenticates using a browser storage state without hardcoded secrets.
2. It reads the Ready to Contribute workbook sheet.
3. It processes Minor and Medium projects only by default.
4. It excludes Expected End Dates before `2026-08-01`.
5. It searches by UID and fetches current details by project ID.
6. It calculates the full remaining quantity for every current activity.
7. It generates a payload matching the successful browser request schema.
8. It defaults to dry-run.
9. Live POST requires explicit execution and batch confirmation.
10. It prevents duplicate requests.
11. It verifies each successful submission by re-fetching.
12. It produces auditable Excel/CSV/JSONL reports.
13. All unit tests pass.
14. No credentials or session material are committed or logged.

---

## Important Non-Goals

- Do not attempt to approve contributions.
- Do not alter project details.
- Do not extend project dates.
- Do not submit delivery or completion data.
- Do not process Complex projects unless explicitly enabled.
- Do not bypass portal authorization, contributor eligibility, or server validation.
- Do not use undocumented direct database access.
- Do not submit all projects without a successful one-project validation and operator confirmation.
