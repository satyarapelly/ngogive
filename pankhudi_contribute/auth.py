from __future__ import annotations
import json, os
from pathlib import Path

def headers_from_env() -> dict[str, str]:
    headers = {}
    if os.getenv("PANKHUDI_AUTHORIZATION"): headers["Authorization"] = os.environ["PANKHUDI_AUTHORIZATION"]
    if os.getenv("PANKHUDI_COOKIE"): headers["Cookie"] = os.environ["PANKHUDI_COOKIE"]
    if os.getenv("PANKHUDI_CSRF_TOKEN"): headers["X-CSRF-Token"] = os.environ["PANKHUDI_CSRF_TOKEN"]
    return headers

def headers_from_storage_state(path: str | None) -> dict[str, str]:
    if not path: return headers_from_env()
    state = json.loads(Path(path).read_text(encoding="utf-8"))
    cookies = state.get("cookies", [])
    cookie_header = "; ".join(f"{c['name']}={c['value']}" for c in cookies if "name" in c and "value" in c)
    headers = headers_from_env()
    if cookie_header: headers["Cookie"] = cookie_header
    return headers
