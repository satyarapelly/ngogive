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
New-Item -ItemType Directory -Force -Path ".\docs\pankhudi" | Out-Null

$sourceDataDir = $env:PANKHUDI_SOURCE_DATA_DIR
if (-not $sourceDataDir) {
  $repoSourceData = Join-Path (Get-Location) "..\src\docs\source-data"
  if ((Test-Path $repoSourceData) -and ((Get-ChildItem -Path $repoSourceData -File -ErrorAction SilentlyContinue | Select-Object -First 1) -ne $null)) {
    $sourceDataDir = $repoSourceData
  } else {
    $sourceDataDir = Join-Path (Get-Location) "docs\source-data"
  }
}
$sourceDataDir = [System.IO.Path]::GetFullPath($sourceDataDir)

Write-Host "Using source data directory: $sourceDataDir" -ForegroundColor Cyan
if (-not (Get-Command codex -ErrorAction SilentlyContinue)) {
  throw "Missing codex CLI. Install/sign in to Codex CLI, then rerun this launcher."
}

Write-Host "Starting Codex in workspace-write mode..." -ForegroundColor Cyan
Write-Host "Codex will inspect the existing repository, integrate the module, run tests, and write status documentation." -ForegroundColor Cyan

Get-Content -Raw $taskFile |
  codex exec --sandbox workspace-write `
    "Implement the supplied Give For Society PANKHUDI automation task completely in this repository. Read AGENTS.md first. Inspect and preserve the existing architecture. Use source workbooks from: $sourceDataDir. Work phase by phase, run all relevant tests, and update docs/pankhudi/IMPLEMENTATION_STATUS.md. Do not scrape the PANKHUDI portal and do not fabricate vendor invoices." |
  Tee-Object -FilePath ".\codex-pankhudi-final-output.log"
