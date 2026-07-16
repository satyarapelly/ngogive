import fs from "fs";
import path from "path";

const BASE_URL = "https://pankhudi.wcd.gov.in";
const PROJECTS_PATH = "/API/MasterApi/v1/projects/fetch";
const SAVE_PATH = "/API/MasterApi/v1/project-contributions/save";
const USER_ID = 132975;
const DEFAULT_STORAGE_STATE = ".secrets/pankhudi-storage-state.json";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const headers = authHeaders();
  if (!headers.Authorization) {
    return res.status(503).json({
      error: "PANKHUDI submit is not configured.",
      setup: "Set PANKHUDI_AUTHORIZATION, PANKHUDI_STORAGE_STATE, or PANKHUDI_STORAGE_STATE_JSON on the server. Do not store these values in frontend code.",
    });
  }

  const projectId = Number(req.body?.projectId);
  if (!projectId) {
    return res.status(400).json({ error: "projectId is required." });
  }

  try {
    const detailUrl = new URL(PROJECTS_PATH, BASE_URL);
    detailUrl.searchParams.set("projectId", String(projectId));
    const detailResponse = await fetch(detailUrl, { headers });
    const detailPayload = await detailResponse.json().catch(() => ({}));
    if (!detailResponse.ok) {
      return res.status(detailResponse.status).json({
        error: `PANKHUDI detail API returned ${detailResponse.status} ${detailResponse.statusText}`,
        details: detailPayload,
      });
    }

    const detail = unwrapProject(detailPayload);
    const payload = buildContributionPayload(detail);
    const saveResponse = await fetch(new URL(SAVE_PATH, BASE_URL), {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const savePayload = await saveResponse.json().catch(() => ({}));
    if (!saveResponse.ok) {
      return res.status(saveResponse.status).json({
        error: `PANKHUDI submit API returned ${saveResponse.status} ${saveResponse.statusText}`,
        details: savePayload,
      });
    }

    return res.status(200).json({ submittedAt: new Date().toISOString(), response: savePayload });
  } catch (error) {
    console.error("Error submitting PANKHUDI contribution", error);
    return res.status(500).json({ error: error?.message || "Unable to submit PANKHUDI contribution." });
  }
}

function authHeaders() {
  const headers = {
    accept: "application/json, text/plain, */*",
    origin: BASE_URL,
    referer: `${BASE_URL}/`,
    "user-agent": "GiveForSociety-PANKHUDI-ProjectTracker/1.0",
  };
  if (process.env.PANKHUDI_AUTHORIZATION) headers.Authorization = process.env.PANKHUDI_AUTHORIZATION;
  if (process.env.PANKHUDI_COOKIE) headers.Cookie = process.env.PANKHUDI_COOKIE;
  if (process.env.PANKHUDI_CSRF_TOKEN) {
    headers["X-CSRF-Token"] = process.env.PANKHUDI_CSRF_TOKEN;
    headers["X-XSRF-TOKEN"] = process.env.PANKHUDI_CSRF_TOKEN;
  }
  applyStorageState(headers);
  return headers;
}

function applyStorageState(headers) {
  const state = readStorageState();
  if (!state) return;
  const cookies = Array.isArray(state.cookies) ? state.cookies : [];
  if (!headers.Cookie && cookies.length) {
    headers.Cookie = cookies
      .filter((cookie) => cookie?.name && cookie?.value)
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  }
  if (!headers.Authorization) {
    const token = findTokenInState(state);
    if (token) headers.Authorization = bearer(token);
  }
  const csrf = cookies.find((cookie) => /^(xsrf-token|x-xsrf-token|csrf-token|csrftoken|csrf_token)$/i.test(cookie?.name || ""))?.value;
  if (csrf && !headers["X-CSRF-Token"]) {
    headers["X-CSRF-Token"] = decodeURIComponent(csrf);
    headers["X-XSRF-TOKEN"] = decodeURIComponent(csrf);
  }
}

function readStorageState() {
  if (process.env.PANKHUDI_STORAGE_STATE_JSON) {
    try {
      return JSON.parse(process.env.PANKHUDI_STORAGE_STATE_JSON);
    } catch {
      return null;
    }
  }
  try {
    const storagePath = process.env.PANKHUDI_STORAGE_STATE || DEFAULT_STORAGE_STATE;
    const resolved = resolveStorageStatePath(storagePath);
    if (!fs.existsSync(resolved)) return null;
    return JSON.parse(fs.readFileSync(resolved, "utf-8"));
  } catch {
    return null;
  }
}

function resolveStorageStatePath(storagePath) {
  if (path.isAbsolute(storagePath)) return storagePath;
  const candidates = [
    path.join(process.cwd(), storagePath),
    path.join(process.cwd(), "..", storagePath),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

function findTokenInState(state) {
  const cookieToken = findTokenInEntries((state.cookies || []).map((cookie) => ({ key: cookie.name, value: decodeURIComponent(cookie.value || "") })));
  if (cookieToken) return cookieToken;
  for (const origin of state.origins || []) {
    const token = findTokenInEntries([...(origin.localStorage || []), ...(origin.sessionStorage || [])].map((item) => ({ key: item.name, value: item.value })));
    if (token) return token;
  }
  return "";
}

function findTokenInEntries(entries) {
  for (const { key = "", value = "" } of entries) {
    const normalized = String(key).toLowerCase();
    const text = String(value || "").trim();
    if (!text) continue;
    if (isTokenKey(normalized)) return text;
    const nested = findTokenInJson(text);
    if (nested) return nested;
    if (looksLikeJwt(text)) return text;
  }
  return "";
}

function findTokenInJson(text) {
  try {
    return findTokenNested(JSON.parse(text));
  } catch {
    return "";
  }
}

function findTokenNested(value, parentKey = "") {
  if (Array.isArray(value)) {
    for (const child of value) {
      const token = findTokenNested(child, parentKey);
      if (token) return token;
    }
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      const token = findTokenNested(child, key.toLowerCase());
      if (token) return token;
    }
  } else if (typeof value === "string" && (isTokenKey(parentKey) || looksLikeJwt(value))) {
    return value.trim();
  }
  return "";
}

function isTokenKey(key) {
  return /(^authorization$|access_?token|access-token|id_?token|jwt|token)/i.test(key) && !/(csrf|xsrf)/i.test(key);
}

function looksLikeJwt(value) {
  return String(value).split(".").filter(Boolean).length === 3;
}

function bearer(value) {
  return value.toLowerCase().startsWith("bearer ") ? value : `Bearer ${value}`;
}

function unwrapProject(payload) {
  const data = payload?.data ?? payload;
  if (Array.isArray(data?.content) && data.content.length === 1) return data.content[0];
  if (Array.isArray(data) && data.length === 1) return data[0];
  if (data && typeof data === "object") return data;
  throw new Error("Could not parse PANKHUDI project detail.");
}

function buildContributionPayload(project) {
  const projectId = Number(project.projectId || project.id);
  const activities = project.activities || project.projectActivities || [];
  const details = activities
    .map((activity) => {
      const activityId = Number(activity.activityId || activity.id);
      const quantity = toNumber(activity.quantity);
      const alreadyContributed = toNumber(activity.currentQuantityContributed);
      const requested = toNumber(activity.contributionRequestQuantity);
      const remaining = quantity - alreadyContributed - requested;
      if (!activityId || remaining <= 0) return null;
      return {
        id: 0,
        projectContributionId: null,
        activityId,
        contributionQty: String(remaining),
        currentQty: remaining,
        deliveredQty: 0,
        deliveryRemark: null,
        deliverOn: null,
        statusId: 1,
        isActive: true,
        createdBy: USER_ID,
        createdOn: new Date().toISOString(),
        updatedBy: null,
        updatedOn: null,
      };
    })
    .filter(Boolean);

  if (!projectId) throw new Error("Project detail is missing projectId.");
  if (!details.length) throw new Error("Project has no remaining activity quantity to contribute.");

  return {
    request: {
      id: 0,
      userId: USER_ID,
      projectId,
      approvedBy: null,
      approvedOn: null,
      statusId: 1,
      isActive: true,
      createdBy: USER_ID,
      createdOn: new Date().toISOString(),
      updatedBy: null,
      updatedOn: null,
      details,
    },
  };
}

function toNumber(value) {
  const parsed = Number(String(value ?? "0").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
