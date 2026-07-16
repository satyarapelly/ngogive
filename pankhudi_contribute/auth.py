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
TOKEN_KEYS = {"authorization", "access_token", "accesstoken", "access-token", "jwt", "id_token", "idtoken", "token"}
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
    token = _authorization_from_cookies(cookies) or _authorization_from_local_storage(state)
    if token:
        headers.setdefault("Authorization", token)
    return headers

def add_session_storage_to_state(state: dict[str, Any], origin_url: str, items: dict[str, str]) -> dict[str, Any]:
    """Return a Playwright storage-state object augmented with captured sessionStorage items."""
    if not items:
        return state
    origins = state.setdefault("origins", [])
    origin = _origin_for_url(origin_url)
    entry = next((candidate for candidate in origins if candidate.get("origin") == origin), None)
    if entry is None:
        entry = {"origin": origin, "localStorage": []}
        origins.append(entry)
    entry["sessionStorage"] = [{"name": key, "value": value} for key, value in items.items()]
    return state

def _csrf_from_cookies(cookies: list[dict[str, Any]]) -> str | None:
    for cookie in cookies:
        name = str(cookie.get("name", "")).lower()
        if name in CSRF_COOKIE_NAMES:
            return unquote(str(cookie.get("value", "")))
    return None

def _authorization_from_cookies(cookies: list[dict[str, Any]]) -> str | None:
    for cookie in cookies:
        key = str(cookie.get("name", "")).lower()
        value = unquote(str(cookie.get("value", ""))).strip()
        token = _token_from_key_value(key, value)
        if token:
            return token
    return None

def _authorization_from_local_storage(state: dict[str, Any]) -> str | None:
    for origin in state.get("origins", []):
        for item in [*origin.get("localStorage", []), *origin.get("sessionStorage", [])]:
            key = str(item.get("name", "")).lower()
            value = str(item.get("value", "")).strip()
            token = _token_from_key_value(key, value)
            if token:
                return token
    return None

def _token_from_key_value(key: str, value: str) -> str | None:
    if not value:
        return None
    if _is_token_key(key):
        return _bearer(value)
    nested_token = _token_from_json_value(value)
    if nested_token:
        return nested_token
    if _looks_like_jwt(value):
        return _bearer(value)
    return None

def _token_from_json_value(value: str) -> str | None:
    try:
        parsed = json.loads(value)
    except json.JSONDecodeError:
        return None
    return _token_from_nested(parsed)

def _token_from_nested(value: Any, parent_key: str = "") -> str | None:
    if isinstance(value, dict):
        for key, child in value.items():
            token = _token_from_nested(child, str(key).lower())
            if token:
                return token
    elif isinstance(value, list):
        for child in value:
            token = _token_from_nested(child, parent_key)
            if token:
                return token
    elif isinstance(value, str) and (_is_token_key(parent_key) or _looks_like_jwt(value)):
        return _bearer(value.strip())
    return None

def _is_token_key(key: str) -> bool:
    return key in TOKEN_KEYS or ("token" in key and "csrf" not in key and "xsrf" not in key)

def _looks_like_jwt(value: str) -> bool:
    parts = value.split(".")
    return len(parts) == 3 and all(parts)

def _bearer(value: str) -> str:
    return value if value.lower().startswith("bearer ") else f"Bearer {value}"

def _origin_for_url(url: str) -> str:
    from urllib.parse import urlparse

    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return url.rstrip("/")
    return f"{parsed.scheme}://{parsed.netloc}"
