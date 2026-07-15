from __future__ import annotations
from typing import Any

try:
    import httpx
except ModuleNotFoundError:  # optional until live API use
    httpx = None  # type: ignore[assignment]
try:
    from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential
except ModuleNotFoundError:  # lightweight fallback for unit tests
    def retry(*args, **kwargs):
        return lambda fn: fn
    def retry_if_exception_type(*args, **kwargs):
        return None
    def stop_after_attempt(*args, **kwargs):
        return None
    def wait_exponential(*args, **kwargs):
        return None

BASE_URL = "https://pankhudi.wcd.gov.in"
SEARCH_PATH = "/API/MasterApi/v1/projects/fetch"
SAVE_PATH = "/API/MasterApi/v1/project-contributions/save"

class AuthenticationError(RuntimeError): pass
class AmbiguousSearchError(RuntimeError): pass
class UnknownPostTimeout(RuntimeError): pass

_HTTP_STATUS_ERROR = httpx.HTTPStatusError if httpx is not None else RuntimeError

def unwrap_projects(response: Any) -> list[dict[str, Any]]:
    data = response.get("data", response) if isinstance(response, dict) else response
    if isinstance(data, dict) and isinstance(data.get("content"), list):
        return data["content"]
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and ("projectUid" in data or "projectUID" in data):
        return [data]
    return []

def unwrap_project(response: Any) -> dict[str, Any]:
    projects = unwrap_projects(response)
    if len(projects) == 1:
        return projects[0]
    data = response.get("data", response) if isinstance(response, dict) else response
    if isinstance(data, dict):
        return data
    raise ValueError("Could not parse project detail")

def exact_uid_match(response: Any, requested_uid: str) -> dict[str, Any]:
    matches = [p for p in unwrap_projects(response) if (p.get("projectUid") or p.get("projectUID")) == requested_uid]
    if len(matches) != 1:
        raise AmbiguousSearchError(f"expected one exact UID match for {requested_uid}, found {len(matches)}")
    return matches[0]

class PankhudiClient:
    def __init__(self, headers: dict[str, str] | None = None, timeout: float = 30) -> None:
        if httpx is None:
            raise RuntimeError("httpx is required for live API calls")
        self.client = httpx.Client(base_url=BASE_URL, headers=headers or {}, timeout=timeout)
    def _check(self, r: httpx.Response) -> None:
        if r.status_code in (401, 403):
            raise AuthenticationError("PANKHUDI authentication failed")
        r.raise_for_status()
    def search(self, project_uid: str) -> dict[str, Any]:
        r = self.client.get(SEARCH_PATH, params={"status":1,"stateId":28,"districtId":699,"projectUid":project_uid,"userId":132975,"page":0,"size":12})
        self._check(r); return r.json()
    def detail(self, project_id: int) -> dict[str, Any]:
        r = self.client.get(SEARCH_PATH, params={"projectId": project_id})
        self._check(r); return r.json()
    @retry(retry=retry_if_exception_type(_HTTP_STATUS_ERROR), wait=wait_exponential(multiplier=1, min=1, max=8), stop=stop_after_attempt(3))
    def save(self, payload: dict[str, Any]) -> dict[str, Any]:
        r = self.client.post(SAVE_PATH, json=payload)
        if r.status_code in (429, 502, 503, 504):
            r.raise_for_status()
        self._check(r); return r.json()
