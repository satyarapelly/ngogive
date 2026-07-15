from __future__ import annotations
import csv, json
from pathlib import Path
from typing import Any
from openpyxl import Workbook

FIELDS = ["Project UID","Project ID","Complexity","Expected End Date","Centre names","Activity count","Selected activity count","Total selected quantity","Search status","Detail-fetch status","Validation status","POST status","HTTP status","Returned contribution/request ID","Verification status","Skip/failure reason","Timestamp","Payload file","Response file"]

def write_reports(rows: list[dict[str, Any]], outdir: Path | str = "output") -> None:
    out = Path(outdir); out.mkdir(parents=True, exist_ok=True)
    with (out/"contribution_results.csv").open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELDS); writer.writeheader(); writer.writerows([{k:r.get(k,"") for k in FIELDS} for r in rows])
    wb = Workbook(); ws = wb.active; ws.title = "Results"; ws.append(FIELDS)
    for r in rows: ws.append([r.get(k, "") for k in FIELDS])
    wb.save(out/"contribution_results.xlsx")
    (out/"run_summary.json").write_text(json.dumps({"rows": len(rows)}, indent=2), encoding="utf-8")
