#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${1:-.}"
cd "$REPO_PATH"

test -f AGENTS.md || { echo "Missing AGENTS.md"; exit 1; }
test -f PANKHUDI_AUTOMATION_CODEX_TASK.md || { echo "Missing PANKHUDI_AUTOMATION_CODEX_TASK.md"; exit 1; }
mkdir -p docs/source-data docs/pankhudi

SOURCE_DATA_DIR="${PANKHUDI_SOURCE_DATA_DIR:-}"
if [[ -z "$SOURCE_DATA_DIR" ]]; then
  if find "../src/docs/source-data" -maxdepth 1 -type f -print -quit 2>/dev/null | grep -q .; then
    SOURCE_DATA_DIR="../src/docs/source-data"
  else
    SOURCE_DATA_DIR="docs/source-data"
  fi
fi
SOURCE_DATA_DIR="$(cd "$SOURCE_DATA_DIR" 2>/dev/null && pwd || printf '%s' "$SOURCE_DATA_DIR")"

echo "Using source data directory: $SOURCE_DATA_DIR"
command -v codex >/dev/null 2>&1 || { echo "Missing codex CLI. Install/sign in to Codex CLI, then rerun this launcher."; exit 127; }

cat PANKHUDI_AUTOMATION_CODEX_TASK.md |
  codex exec --sandbox workspace-write \
  "Implement the supplied Give For Society PANKHUDI automation task completely in this repository. Read AGENTS.md first. Inspect and preserve the existing architecture. Use source workbooks from: $SOURCE_DATA_DIR. Work phase by phase, run all relevant tests, and update docs/pankhudi/IMPLEMENTATION_STATUS.md. Do not scrape the PANKHUDI portal and do not fabricate vendor invoices." |
  tee codex-pankhudi-final-output.log
