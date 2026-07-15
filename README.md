# PANKHUDI Contribution Automation

This repository includes a dry-run-first Python CLI for planning PANKHUDI contribution requests.

## Local setup

Run these commands from the repository root:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[test]"
```

On Windows PowerShell:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e ".[test]"
```

## Verify the install

```bash
pytest -q
python -m pankhudi_contribute --help
```

## Dry-run plan command

The default command expects the workbook in the repository root:

```bash
python -m pankhudi_contribute plan
```

Equivalent explicit command:

```bash
python -m pankhudi_contribute plan \
  --input PANKHUDI_All_279_Projects_Complexity_Contribution_Readiness_Updated.xlsx \
  --sheet "Ready to Contribute" \
  --storage-state .secrets/pankhudi-storage-state.json
```

For a CSV test/input file, pass the CSV path with the same required columns:

```bash
python -m pankhudi_contribute plan --input ready_to_contribute.csv
```

The `plan` command never posts data. It reads the workbook or CSV, applies workbook filters, fetches current project data when authentication is available, builds planned payloads, and writes reports under `output/`.

If no authentication is available, the command still writes workbook-level skip reports and clearly states that current API fetch/payload planning was skipped. Provide a Playwright storage-state file or the `PANKHUDI_COOKIE`/`PANKHUDI_AUTHORIZATION` environment variables to fetch current API details.

## Outputs

Dry-run output files are written under `output/`:

- `output/planned_payloads/<projectUid>.json`
- `output/contribution_results.csv`
- `output/contribution_results.xlsx` when `openpyxl` is installed
- `output/submission_journal.jsonl`
- `output/run_summary.json`
- `output/responses/*.json`
- `output/errors/*.json`

The `.secrets/` and `output/` directories are ignored by git.

## Live submit guardrails

Live submission is guarded and requires explicit flags. Running `python -m pankhudi_contribute submit` by itself is expected to stop with a safety message. Use the submit command only after a one-project dry run has been reviewed:

```bash
python -m pankhudi_contribute submit \
  --execute \
  --confirm-batch "SINGLE-PROJECT-VALIDATION" \
  --max-projects 1 \
  --storage-state .secrets/pankhudi-storage-state.json
```

Do not run a larger batch until a single-project dry run and portal verification have succeeded.
