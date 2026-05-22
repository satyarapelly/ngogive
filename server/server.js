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

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  process.exit(1);
}

const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

app.use(cors());
app.use(express.json());

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
