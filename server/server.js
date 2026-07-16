require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();

const PORT = process.env.PORT || 5000;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const ORG_NAME = process.env.ORG_NAME;
const ORG_REGISTERED_ADDRESS = process.env.ORG_REGISTERED_ADDRESS;
const ORG_PAN = process.env.ORG_PAN;
const ORG_80G_NUMBER = process.env.ORG_80G_NUMBER;
const ORG_12A_NUMBER = process.env.ORG_12A_NUMBER;
const ORG_ADDRESS_LINE1 = process.env.ORG_ADDRESS_LINE1;
const ORG_ADDRESS_LINE2 = process.env.ORG_ADDRESS_LINE2;
const ORG_CITY_STATE_PIN = process.env.ORG_CITY_STATE_PIN;
const ORG_EMAIL = process.env.ORG_EMAIL;
const ORG_PHONE = process.env.ORG_PHONE;

const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

if (!razorpay) {
  console.warn("Razorpay credentials are not configured. Donation routes will return a setup error, but non-payment APIs can still run.");
}

app.use(cors());
app.use(express.json());



const DEFAULT_PANKHUDI_PROJECTS_URL =
  "https://pankhudi.wcd.gov.in/API/MasterApi/v1/projects/fetch?status=1&stateId=28&districtId=699&mission=1&categoryId=1&userId=132975&page=0&size=250";
const PANKHUDI_BASE_URL = "https://pankhudi.wcd.gov.in";

const extractPankhudiRows = (payload) => {
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
};

function buildPankhudiProjectsUrl(districtId = "699") {
  if (process.env.PANKHUDI_PROJECTS_URL && !districtId) return process.env.PANKHUDI_PROJECTS_URL;
  const url = new URL(process.env.PANKHUDI_PROJECTS_URL || DEFAULT_PANKHUDI_PROJECTS_URL);
  if (districtId) url.searchParams.set("districtId", String(districtId));
  url.searchParams.set("stateId", "28");
  url.searchParams.set("userId", "132975");
  url.searchParams.set("page", "0");
  url.searchParams.set("size", "250");
  return url.toString();
}

function pankhudiAuthHeaders() {
  const headers = {
    Accept: "application/json, text/plain, */*",
    Origin: PANKHUDI_BASE_URL,
    Referer: `${PANKHUDI_BASE_URL}/`,
    "User-Agent": "GiveForSociety-PANKHUDI-ProjectTracker/1.0",
  };
  if (process.env.PANKHUDI_AUTHORIZATION) headers.Authorization = process.env.PANKHUDI_AUTHORIZATION;
  if (process.env.PANKHUDI_COOKIE) headers.Cookie = process.env.PANKHUDI_COOKIE;
  if (process.env.PANKHUDI_CSRF_TOKEN) {
    headers["X-CSRF-Token"] = process.env.PANKHUDI_CSRF_TOKEN;
    headers["X-XSRF-TOKEN"] = process.env.PANKHUDI_CSRF_TOKEN;
  }
  return headers;
}

function unwrapPankhudiProject(payload) {
  const data = payload?.data ?? payload;
  if (Array.isArray(data?.content) && data.content.length === 1) return data.content[0];
  if (Array.isArray(data) && data.length === 1) return data[0];
  if (data && typeof data === "object") return data;
  throw new Error("Could not parse PANKHUDI project detail.");
}

function buildPankhudiContributionPayload(project) {
  const projectId = Number(project.projectId || project.id);
  const createdOn = new Date().toISOString();
  const details = (project.activities || project.projectActivities || [])
    .map((activity) => {
      const activityId = Number(activity.activityId || activity.id);
      const quantity = toPankhudiNumber(activity.quantity);
      const alreadyContributed = toPankhudiNumber(activity.currentQuantityContributed);
      const requested = toPankhudiNumber(activity.contributionRequestQuantity);
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
        createdBy: 132975,
        createdOn,
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
      userId: 132975,
      projectId,
      approvedBy: null,
      approvedOn: null,
      statusId: 1,
      isActive: true,
      createdBy: 132975,
      createdOn,
      updatedBy: null,
      updatedOn: null,
      details,
    },
  };
}

function toPankhudiNumber(value) {
  const parsed = Number(String(value ?? "0").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

const VIDYANJALI_BASE_URL = "https://vidyanjali.education.gov.in";
const VIDYANJALI_SEARCH_URL = process.env.VIDYANJALI_SEARCH_URL || "";

const normalizeSchool = (row = {}) => {
  const pick = (...keys) => keys.map((key) => row[key]).find((value) => value !== undefined && value !== null && String(value).trim() !== "") || "";
  return {
    udiseCode: String(pick("UDISE Code", "udiseCode", "udise_code", "udise", "school_code", "schoolCode")).trim(),
    schoolName: String(pick("School Name", "schoolName", "school_name", "name", "school")).trim().toUpperCase(),
    address: String(pick("Address", "address", "schoolAddress", "school_address", "location")).trim(),
    state: String(pick("State", "state", "state_name", "stateName") || "TELANGANA").trim().toUpperCase(),
    district: String(pick("District", "district", "district_name", "districtName")).trim().toUpperCase(),
    block: String(pick("Block", "block", "Mandal", "mandal", "block_name", "blockName")).trim(),
    status: String(pick("Status", "status") || "Listed").trim(),
    action: String(pick("Action", "action") || "").trim(),
  };
};

const asArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.schools)) return payload.schools;
  if (Array.isArray(payload?.aaData)) return payload.aaData;
  return [];
};


app.get("/api/pankhudi/projects", async (req, res) => {
  const sourceUrl = buildPankhudiProjectsUrl(req.query.districtId);

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "GiveForSociety-PANKHUDI-ProjectTracker/1.0",
      },
    });

    const responseText = await response.text();
    let payload = {};
    if (responseText) {
      try {
        payload = JSON.parse(responseText);
      } catch (parseError) {
        return res.status(502).json({
          error: "PANKHUDI API returned a non-JSON response.",
          details: parseError.message,
          sourceUrl,
        });
      }
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: `PANKHUDI API returned ${response.status} ${response.statusText}`,
        sourceUrl,
      });
    }

    const projects = extractPankhudiRows(payload);
    return res.json({
      fetchedAt: new Date().toISOString(),
      sourceUrl,
      totalProjects: projects.length,
      projects,
      raw: payload,
    });
  } catch (error) {
    console.error("Error fetching PANKHUDI projects", error);
    return res.status(502).json({
      error: "Unable to fetch PANKHUDI projects.",
      details: error.message,
      sourceUrl,
    });
  }
});

app.post("/api/pankhudi/contribute", async (req, res) => {
  const headers = pankhudiAuthHeaders();
  if (!headers.Authorization) {
    return res.status(503).json({
      error: "PANKHUDI submit is not configured.",
      setup: "Set PANKHUDI_AUTHORIZATION on the server. Do not store this value in frontend code.",
    });
  }

  const projectId = Number(req.body?.projectId);
  if (!projectId) return res.status(400).json({ error: "projectId is required." });

  try {
    const detailUrl = new URL("/API/MasterApi/v1/projects/fetch", PANKHUDI_BASE_URL);
    detailUrl.searchParams.set("projectId", String(projectId));
    const detailResponse = await fetch(detailUrl, { headers });
    const detailPayload = await detailResponse.json().catch(() => ({}));
    if (!detailResponse.ok) {
      return res.status(detailResponse.status).json({
        error: `PANKHUDI detail API returned ${detailResponse.status} ${detailResponse.statusText}`,
        details: detailPayload,
      });
    }

    const payload = buildPankhudiContributionPayload(unwrapPankhudiProject(detailPayload));
    const saveResponse = await fetch(new URL("/API/MasterApi/v1/project-contributions/save", PANKHUDI_BASE_URL), {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const savePayload = await saveResponse.json().catch(() => ({}));
    if (!saveResponse.ok) {
      return res.status(saveResponse.status).json({
        error: `PANKHUDI submit API returned ${saveResponse.status} ${saveResponse.statusText}`,
        details: savePayload,
      });
    }

    return res.json({ submittedAt: new Date().toISOString(), response: savePayload });
  } catch (error) {
    console.error("Error submitting PANKHUDI contribution", error);
    return res.status(500).json({ error: error.message || "Unable to submit PANKHUDI contribution." });
  }
});

app.get("/api/vidyanjali/schools", async (req, res) => {
  const { state = "TELANGANA", district = "", block = "", pageSize = "5000" } = req.query;

  if (!VIDYANJALI_SEARCH_URL) {
    return res.status(503).json({
      error: "Live Vidyanjali search API is not configured on the server.",
      setup: "Set VIDYANJALI_SEARCH_URL to the official Vidyanjali school-search JSON endpoint, then restart the API server.",
    });
  }

  const target = new URL(VIDYANJALI_SEARCH_URL, VIDYANJALI_BASE_URL);
  target.searchParams.set("state", state);
  if (district) target.searchParams.set("district", district);
  if (block) target.searchParams.set("block", block);
  target.searchParams.set("length", pageSize);
  target.searchParams.set("pageSize", pageSize);

  try {
    const response = await fetch(target, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 Vidyanjali live school exporter",
        Referer: `${VIDYANJALI_BASE_URL}/all-schools`,
      },
    });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : JSON.parse(await response.text());
    if (!response.ok) return res.status(response.status).json({ error: payload?.error || "Vidyanjali live search failed." });
    const rows = asArray(payload).map(normalizeSchool).filter((school) => school.udiseCode || school.schoolName);
    return res.json({ source: target.toString(), count: rows.length, schools: rows });
  } catch (error) {
    console.error("Vidyanjali live search failed", error);
    return res.status(502).json({ error: "Unable to complete live Vidyanjali search.", details: error.message });
  }
});

app.get("/org-details", (req, res) => {
  res.json({
    orgName: ORG_NAME || "",
    orgRegisteredAddress: ORG_REGISTERED_ADDRESS || "",
    orgPan: ORG_PAN || "",
    org80gNumber: ORG_80G_NUMBER || "",
    org12aNumber: ORG_12A_NUMBER || "",
    orgAddressLine1: ORG_ADDRESS_LINE1 || "",
    orgAddressLine2: ORG_ADDRESS_LINE2 || "",
    orgCityStatePin: ORG_CITY_STATE_PIN || "",
    orgEmail: ORG_EMAIL || "",
    orgPhone: ORG_PHONE || "",
  });
});

app.post("/api/donations/create-order", async (req, res) => {
  if (!razorpay) return res.status(503).json({ error: "Razorpay credentials are not configured." });
  try {
    const { selectedCause, donorName, email, phone, amount, message } = req.body || {};
    const parsedAmount = Number(amount);

    if (!selectedCause || !donorName || (!email && !phone) || !parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid donation payload." });
    }

    const options = {
      amount: Math.round(parsedAmount * 100),
      currency: "INR",
      receipt: `donation_${Date.now()}_${String(selectedCause).slice(0, 20).replace(/\s+/g, "_")}`,
      notes: { selectedCause, donorName, email: email || "", phone: phone || "", message: message || "" },
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    return res.status(500).json({ error: "Unable to create order." });
  }
});

app.post("/api/donations/verify-payment", (req, res) => {
  if (!razorpay) return res.status(503).json({ error: "Razorpay credentials are not configured." });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationPayload = {} } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment verification payload." });
  }

  const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    const failedDonation = {
      ...donationPayload,
      razorpay_order_id,
      razorpay_payment_id,
      paymentStatus: "failed",
    };
    console.warn("Donation verification failed", failedDonation);
    return res.status(400).json({ verified: false, error: "Signature mismatch." });
  }

  const successfulDonation = {
    ...donationPayload,
    razorpay_order_id,
    razorpay_payment_id,
    paymentStatus: "successful",
  };
  console.log("Donation successful", successfulDonation);

  return res.json({ verified: true, paymentStatus: "successful" });
});

app.listen(PORT, () => {
  console.log(`Razorpay server listening on port ${PORT}`);
});
