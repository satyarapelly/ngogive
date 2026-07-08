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
