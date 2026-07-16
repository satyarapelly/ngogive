const DEFAULT_PANKHUDI_PROJECTS_URL =
  "https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?status=1&stateId=28&districtId=699&mission=1&categoryId=1&userId=132975&page=0&size=250";

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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const sourceUrl = buildProjectsUrl(req.query?.districtId);

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        accept: "application/json",
        "user-agent": "GiveForSociety-PANKHUDI-ProjectTracker/1.0",
      },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({
        error: `PANKHUDI API returned ${response.status} ${response.statusText}`,
        sourceUrl,
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
    console.error("Error fetching PANKHUDI projects", error);
    return res.status(500).json({
      error: error?.message || "Unable to fetch PANKHUDI projects.",
      sourceUrl,
    });
  }
}

function buildProjectsUrl(districtId = "699") {
  if (process.env.PANKHUDI_PROJECTS_URL && !districtId) return process.env.PANKHUDI_PROJECTS_URL;
  const url = new URL(process.env.PANKHUDI_PROJECTS_URL || DEFAULT_PANKHUDI_PROJECTS_URL);
  if (districtId) url.searchParams.set("districtId", String(districtId));
  url.searchParams.set("stateId", "28");
  url.searchParams.set("userId", "132975");
  url.searchParams.set("page", "0");
  url.searchParams.set("size", "250");
  return url.toString();
}
