# PANKHUDI implementation status

## 2026-07-12 launcher execution attempt

The PANKHUDI task pack is located under `public_html/`, so the launcher must be run from that directory or with `public_html` as the repository path.

Commands attempted in this environment:

```bash
cd /workspace/ngogive/public_html
./run_pankhudi_codex.sh .
```

Result: failed before starting the Codex implementation because the shell script did not have executable permission.

```text
Permission denied
```

The shell launcher has now been marked executable.

```bash
cd /workspace/ngogive/public_html
bash run_pankhudi_codex.sh .
```

Result: failed before starting the Codex implementation because the Codex CLI is not installed in this container.

```text
run_pankhudi_codex.sh: line 13: codex: command not found
```

The launchers now perform an explicit Codex CLI preflight check and create both `docs/source-data/` and `docs/pankhudi/` before invoking Codex.

## Next required action

Install and sign in to the Codex CLI in the target environment, then run:

```bash
cd /path/to/repo/public_html
./run_pankhudi_codex.sh .
```

On Windows PowerShell, run:

```powershell
Set-Location C:\path\to\repo\public_html
Set-ExecutionPolicy -Scope Process Bypass
.\run_pankhudi_codex.ps1 -RepoPath .
```

The full implementation task in `PANKHUDI_AUTOMATION_CODEX_TASK.md` has not completed in this container because the required external `codex` executable is unavailable.

## 2026-07-12 source-data path and launcher re-run

The user indicated source workbooks are under `src/docs/source-data/`. In this container, no files were visible under that path at the time of verification, but the launchers now detect populated `../src/docs/source-data/` automatically when run from `public_html/`. They also accept an explicit override:

```bash
PANKHUDI_SOURCE_DATA_DIR=/path/to/source-data ./run_pankhudi_codex.sh .
```

```powershell
$env:PANKHUDI_SOURCE_DATA_DIR="C:\path\to\source-data"
.\run_pankhudi_codex.ps1 -RepoPath .
```

Re-run attempted:

```bash
cd /workspace/ngogive/public_html
./run_pankhudi_codex.sh .
```

Result: the launcher failed at the explicit preflight because the external Codex CLI is not installed in this container.

```text
Missing codex CLI. Install/sign in to Codex CLI, then rerun this launcher.
```

PowerShell re-run status: neither `pwsh` nor Windows `powershell` is installed in this Linux container, so `run_pankhudi_codex.ps1` could not be executed here. The script has been updated with the same source-data detection logic as the shell launcher.

Follow-up re-run after moving the source-data detection before the Codex CLI preflight:

```bash
cd /workspace/ngogive/public_html
./run_pankhudi_codex.sh .
```

Observed output:

```text
Using source data directory: /workspace/ngogive/public_html/docs/source-data
Missing codex CLI. Install/sign in to Codex CLI, then rerun this launcher.
```

The launcher selected `public_html/docs/source-data` because `src/docs/source-data` was not visible with files in this container. If the workbook files are present on the deployment machine under `src/docs/source-data`, the launcher will select that path automatically; otherwise set `PANKHUDI_SOURCE_DATA_DIR` explicitly.
