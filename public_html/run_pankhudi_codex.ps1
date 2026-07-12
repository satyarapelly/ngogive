param(
  [string]$RepoPath = "."
)

$ErrorActionPreference = "Stop"
Set-Location $RepoPath

$taskFile = Join-Path (Get-Location) "PANKHUDI_AUTOMATION_CODEX_TASK.md"
$agentsFile = Join-Path (Get-Location) "AGENTS.md"

if (-not (Test-Path $taskFile)) {
  throw "Missing $taskFile. Copy the Codex task pack into the repository root."
}
if (-not (Test-Path $agentsFile)) {
  throw "Missing $agentsFile. Copy the Codex task pack into the repository root."
}

New-Item -ItemType Directory -Force -Path ".\docs\source-data" | Out-Null

Write-Host "Starting Codex in workspace-write mode..." -ForegroundColor Cyan
Write-Host "Codex will inspect the existing repository, integrate the module, run tests, and write status documentation." -ForegroundColor Cyan

Get-Content -Raw $taskFile |
  codex exec --sandbox workspace-write `
    "Implement the supplied Give For Society PANKHUDI automation task completely in this repository. Read AGENTS.md first. Inspect and preserve the existing architecture. Work phase by phase, run all relevant tests, and update docs/pankhudi/IMPLEMENTATION_STATUS.md. Do not scrape the PANKHUDI portal and do not fabricate vendor invoices." |
  Tee-Object -FilePath ".\codex-pankhudi-final-output.log"
