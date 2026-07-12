require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
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


const VIDYANJALI_BASE_URL = "https://vidyanjali.education.gov.in";
const DEFAULT_VIDYANJALI_SEARCH_PATH = "/apividya/web/schools/onboard-schools";
const VIDYANJALI_SEARCH_URL = process.env.VIDYANJALI_SEARCH_URL || DEFAULT_VIDYANJALI_SEARCH_PATH;
const VIDYANJALI_TOKEN = process.env.VIDYANJALI_TOKEN || "";
const VIDYANJALI_SECURE_PAYLOAD = process.env.VIDYANJALI_SECURE_PAYLOAD || "";
const VIDYANJALI_LOCAL_SCHOOLS_PATH = path.join(__dirname, "..", "frontend", "public", "data", "vidyanjali", "schools.json");

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

const looksLikeSchoolRows = (value) =>
  Array.isArray(value) && value.some((row) => row && typeof row === "object" && Object.keys(row).some((key) => /school|udise|district|block|mandal/i.test(key)));

const findSchoolRows = (payload) => {
  if (looksLikeSchoolRows(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const preferredKeys = ["data", "results", "schools", "aaData", "records", "rows"];
  for (const key of preferredKeys) {
    if (looksLikeSchoolRows(payload[key])) return payload[key];
  }
  for (const value of Object.values(payload)) {
    const rows = findSchoolRows(value);
    if (rows.length) return rows;
  }
  return [];
};

const matchesSchoolFilters = (school, { state, district, block }) =>
  (!state || school.state === String(state).toUpperCase()) &&
  (!district || school.district === String(district).toUpperCase()) &&
  (!block || school.block === block);

const getLocalVidyanjaliSchools = ({ state, district, block, pageSize }) => {
  const rows = JSON.parse(fs.readFileSync(VIDYANJALI_LOCAL_SCHOOLS_PATH, "utf8"));
  const limit = Number(pageSize) || 5000;
  return rows
    .map(normalizeSchool)
    .filter((school) => (school.udiseCode || school.schoolName) && matchesSchoolFilters(school, { state, district, block }))
    .slice(0, limit);
};

const getVidyanjaliPostConfig = () => {
  if (!VIDYANJALI_TOKEN || !VIDYANJALI_SECURE_PAYLOAD) return null;
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: VIDYANJALI_BASE_URL,
      Referer: `${VIDYANJALI_BASE_URL}/all-schools`,
      token: VIDYANJALI_TOKEN,
      "User-Agent": "Mozilla/5.0 Vidyanjali live school exporter",
    },
    body: JSON.stringify({ secure: VIDYANJALI_SECURE_PAYLOAD }),
  };
};

const sendLocalVidyanjaliFallback = (res, filters, warning = "") => {
  try {
    const rows = getLocalVidyanjaliSchools(filters);
    return res.json({
      source: "bundled Vidyanjali school data",
      mode: "local-fallback",
      count: rows.length,
      schools: rows,
      warning,
    });
  } catch (error) {
    console.error("Vidyanjali local fallback failed", error);
    return res.status(503).json({
      error: "Vidyanjali search failed and bundled fallback data could not be loaded.",
      details: error.message,
    });
  }
};

app.get("/api/vidyanjali/schools", async (req, res) => {
  const { state = "TELANGANA", district = "", block = "", pageSize = "5000" } = req.query;
  const filters = { state, district, block, pageSize };
  const target = new URL(VIDYANJALI_SEARCH_URL, VIDYANJALI_BASE_URL);
  const requestConfig = getVidyanjaliPostConfig();

  if (!requestConfig) {
    return sendLocalVidyanjaliFallback(
      res,
      filters,
      "Live Vidyanjali POST search requires VIDYANJALI_TOKEN and VIDYANJALI_SECURE_PAYLOAD from the browser network trace.",
    );
  }

  try {
    const response = await fetch(target, requestConfig);
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : JSON.parse(await response.text());
    if (!response.ok) return res.status(response.status).json({ error: payload?.error || "Vidyanjali live search failed." });
    const rows = findSchoolRows(payload)
      .map(normalizeSchool)
      .filter((school) => (school.udiseCode || school.schoolName) && matchesSchoolFilters(school, filters))
      .slice(0, Number(pageSize) || 5000);
    return res.json({ source: target.toString(), mode: "live", count: rows.length, schools: rows });
  } catch (error) {
    console.error("Vidyanjali live search failed", error);
    return sendLocalVidyanjaliFallback(res, filters, `Unable to complete live Vidyanjali POST search from ${target.toString()}: ${error.message}`);
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
