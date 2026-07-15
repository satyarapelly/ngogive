from __future__ import annotations
import json
from pathlib import Path
from typing import Any
from .utils import canonical_hash, now_utc_ms

class SubmissionJournal:
    def __init__(self, path: Path | str = "output/submission_journal.jsonl") -> None:
        self.path = Path(path)
    def records(self) -> list[dict[str, Any]]:
        if not self.path.exists(): return []
        return [json.loads(line) for line in self.path.read_text(encoding="utf-8").splitlines() if line.strip()]
    def has_successful_payload(self, payload: Any) -> bool:
        h = canonical_hash(payload)
        return any(r.get("payloadHash") == h and r.get("status") in {"submitted", "verified", "planned"} and r.get("action") != "dry_run" for r in self.records())
    def append(self, **record: Any) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        record.setdefault("timestamp", now_utc_ms())
        with self.path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, sort_keys=True, default=str) + "\n")
