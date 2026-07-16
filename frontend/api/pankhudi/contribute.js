const BASE_URL = "https://pankhudi.wcd.gov.in";
const PROJECTS_PATH = "/API/MasterApi/v1/projects/fetch";
const SAVE_PATH = "/API/MasterApi/v1/project-contributions/save";
const USER_ID = 132975;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const headers = authHeaders();
  if (!headers.Authorization) {
    return res.status(503).json({
      error: "PANKHUDI submit is not configured.",
      setup: "Set PANKHUDI_AUTHORIZATION on the server. Do not store this value in frontend code.",
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
  return headers;
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
