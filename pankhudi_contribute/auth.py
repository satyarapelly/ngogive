from __future__ import annotations
import json, os
from pathlib import Path
from typing import Any
from urllib.parse import unquote

API_DEFAULT_HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Origin": "https://pankhudi.wcd.gov.in",
    "Referer": "https://pankhudi.wcd.gov.in/",
    "User-Agent": "Mozilla/5.0 PANKHUDI-Contribute/0.1",
}
TOKEN_KEYS = {"authorization", "access_token", "accesstoken", "access-token", "jwt", "id_token", "idtoken"}
CSRF_COOKIE_NAMES = {"xsrf-token", "x-xsrf-token", "csrf-token", "csrftoken", "csrf_token"}

def headers_from_env() -> dict[str, str]:
    headers = dict(API_DEFAULT_HEADERS)
    if os.getenv("PANKHUDI_AUTHORIZATION"): headers["Authorization"] = os.environ["PANKHUDI_AUTHORIZATION"]
    if os.getenv("PANKHUDI_COOKIE"): headers["Cookie"] = os.environ["PANKHUDI_COOKIE"]
    if os.getenv("PANKHUDI_CSRF_TOKEN"):
        headers["X-CSRF-Token"] = os.environ["PANKHUDI_CSRF_TOKEN"]
        headers["X-XSRF-TOKEN"] = os.environ["PANKHUDI_CSRF_TOKEN"]
    return headers

def headers_from_storage_state(path: str | None) -> dict[str, str]:
    headers = headers_from_env()
    if not path:
        return headers
    state = json.loads(Path(path).read_text(encoding="utf-8"))
    cookies = state.get("cookies", [])
    cookie_header = "; ".join(f"{c['name']}={c['value']}" for c in cookies if "name" in c and "value" in c)
    if cookie_header: headers["Cookie"] = cookie_header
    csrf = _csrf_from_cookies(cookies)
    if csrf:
        headers.setdefault("X-CSRF-Token", csrf)
        headers.setdefault("X-XSRF-TOKEN", csrf)
    token = _authorization_from_local_storage(state)
    if token:
        headers.setdefault("Authorization", token)
    return headers

def _csrf_from_cookies(cookies: list[dict[str, Any]]) -> str | None:
    for cookie in cookies:
        name = str(cookie.get("name", "")).lower()
        if name in CSRF_COOKIE_NAMES:
            return unquote(str(cookie.get("value", "")))
    return None

def _authorization_from_local_storage(state: dict[str, Any]) -> str | None:
    for origin in state.get("origins", []):
        for item in origin.get("localStorage", []):
            key = str(item.get("name", "")).lower()
            value = str(item.get("value", "")).strip()
            if not value:
                continue
            if key == "authorization":
                return value if value.lower().startswith("bearer ") else f"Bearer {value}"
            if key in TOKEN_KEYS or ("token" in key and "csrf" not in key and "xsrf" not in key):
                return value if value.lower().startswith("bearer ") else f"Bearer {value}"
    return None
