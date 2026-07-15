from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from hashlib import sha256
from pathlib import Path
from typing import Any

SECRET_PATTERNS = [
    re.compile(r"(authorization\s*[:=]\s*)([^,\s]+)", re.I),
    re.compile(r"(cookie\s*[:=]\s*)([^\n]+)", re.I),
    re.compile(r"(csrf[-_ ]?token\s*[:=]\s*)([^,\s]+)", re.I),
    re.compile(r"(session(?:id)?\s*[:=]\s*)([^,\s]+)", re.I),
]

def now_utc_ms() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")

def decimal_or_zero(value: Any) -> Decimal:
    if value in (None, ""):
        return Decimal("0")
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError) as exc:
        raise ValueError(f"Invalid numeric value: {value!r}") from exc

def decimal_json(value: Decimal) -> int | float:
    return int(value) if value == value.to_integral_value() else float(value)

def decimal_string(value: Decimal) -> str:
    return format(value.normalize(), "f") if value != 0 else "0"

def canonical_hash(payload: Any) -> str:
    data = json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str)
    return "sha256:" + sha256(data.encode()).hexdigest()

def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True, default=str), encoding="utf-8")

def redact(value: Any) -> str:
    text = str(value)
    for pattern in SECRET_PATTERNS:
        text = pattern.sub(lambda m: m.group(1) + "[REDACTED]", text)
    return text
