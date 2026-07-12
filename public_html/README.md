# PANKHUDI Codex Task Pack

## Files
- `AGENTS.md` — repository instructions and safety rules
- `PANKHUDI_AUTOMATION_CODEX_TASK.md` — complete implementation specification
- `run_pankhudi_codex.ps1` — Windows PowerShell launcher
- `run_pankhudi_codex.sh` — macOS/Linux launcher

## Before running
1. Copy all four files to the root of the NGO website repository.
2. Create `docs/source-data/`.
3. Copy the available workbooks into `docs/source-data/`:
   - `KumuramBheem_Anganwadi_Projects.xlsx`
   - `KumuramBheem_Anganwadi_50K_Itemwise_Implementation_Plan.xlsx`
   - `Give_For_Society_PANKHUDI_25L_Minor_Medium_Bank_Annexure.xlsx`
4. Commit or create a backup of the repository.
5. Sign in to Codex CLI.

## Windows
```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\run_pankhudi_codex.ps1 -RepoPath "C:\path\to\your\ngo-site"
```

## macOS/Linux
```bash
chmod +x run_pankhudi_codex.sh
./run_pankhudi_codex.sh /path/to/ngo-site
```

The task is deliberately stack-adaptive: Codex must inspect and extend the existing NGO site rather than replace it.
