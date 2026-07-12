const DEFAULT_PANKHUDI_PROJECTS_URL =
  "https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?status=1&stateId=28&districtId=699&mission=1&categoryId=1&userId=132975&page=0&size=250";
const UPSTREAM_TIMEOUT_MS = 25000;
const MAX_UPSTREAM_ATTEMPTS = 3;

function extractPankhudiRows(payload) {
  if (Array.isArray(payload)) return payload;
  const candidates = [
    payload?.data?.content,
    payload?.data?.projects,
    payload?.data?.records,
    payload?.data,
    payload?.content,
    payload?.projects,
    payload?.records,
    payload?.result,
  ];
  return candidates.find(Array.isArray) || [];
}

async function fetchWithTimeout(sourceUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    return await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-IN,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        referer: "https://pankhudi.wcd.gov.in/",
        "user-agent":
          "Mozilla/5.0 (compatible; GiveForSociety-PANKHUDI-ProjectTracker/1.0; +https://giveforsociety.org)",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const sourceUrl = process.env.PANKHUDI_PROJECTS_URL || DEFAULT_PANKHUDI_PROJECTS_URL;

  const attemptErrors = [];

  for (let attempt = 1; attempt <= MAX_UPSTREAM_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchWithTimeout(sourceUrl);
      const responseText = await response.text();
      let payload = {};
      try {
        payload = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        attemptErrors.push({
          attempt,
          status: response.status,
          statusText: response.statusText,
          error: `Invalid JSON from PANKHUDI API: ${parseError.message}`,
          bodyPreview: responseText.slice(0, 300),
        });
        if (attempt < MAX_UPSTREAM_ATTEMPTS) continue;
        return res.status(502).json({
          error: "PANKHUDI API returned a non-JSON response.",
          sourceUrl,
          attempts: attemptErrors,
        });
      }

      if (!response.ok) {
        attemptErrors.push({
          attempt,
          status: response.status,
          statusText: response.statusText,
          bodyPreview: responseText.slice(0, 300),
        });
        if (response.status >= 500 && attempt < MAX_UPSTREAM_ATTEMPTS) continue;
        return res.status(response.status).json({
          error: `PANKHUDI API returned ${response.status} ${response.statusText}`,
          sourceUrl,
          attempts: attemptErrors,
        });
      }

      const projects = extractPankhudiRows(payload);
      return res.status(200).json({
        fetchedAt: new Date().toISOString(),
        sourceUrl,
        totalProjects: projects.length,
        projects,
        raw: payload,
      });
    } catch (error) {
      attemptErrors.push({ attempt, error: error?.message || "Unknown upstream fetch error" });
      if (attempt < MAX_UPSTREAM_ATTEMPTS) continue;
    }
  }

  console.error("Error fetching PANKHUDI projects", attemptErrors);
  return res.status(502).json({
    error: "Unable to fetch PANKHUDI projects after retries.",
    sourceUrl,
    attempts: attemptErrors,
  });
}
