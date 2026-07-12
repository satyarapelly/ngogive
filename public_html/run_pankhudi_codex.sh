#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${1:-.}"
cd "$REPO_PATH"

test -f AGENTS.md || { echo "Missing AGENTS.md"; exit 1; }
test -f PANKHUDI_AUTOMATION_CODEX_TASK.md || { echo "Missing PANKHUDI_AUTOMATION_CODEX_TASK.md"; exit 1; }
command -v codex >/dev/null 2>&1 || { echo "Missing codex CLI. Install/sign in to Codex CLI, then rerun this launcher."; exit 127; }

mkdir -p docs/source-data docs/pankhudi

cat PANKHUDI_AUTOMATION_CODEX_TASK.md |
  codex exec --sandbox workspace-write \
  "Implement the supplied Give For Society PANKHUDI automation task completely in this repository. Read AGENTS.md first. Inspect and preserve the existing architecture. Work phase by phase, run all relevant tests, and update docs/pankhudi/IMPLEMENTATION_STATUS.md. Do not scrape the PANKHUDI portal and do not fabricate vendor invoices." |
  tee codex-pankhudi-final-output.log
