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

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

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
    orgPhone: ORG_PHONE || ""
  });
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", donor = {} } = req.body || {};
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount." });
    }

    const options = {
      amount: Math.round(parsedAmount),
      currency,
      receipt: `donation_${Date.now()}`,
      notes: {
        name: donor.name || "",
        email: donor.email || "",
        phone: donor.phone || ""
      }
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    return res.status(500).json({ error: "Unable to create order." });
  }
});

app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment verification payload." });
  }

  const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ verified: false, error: "Signature mismatch." });
  }

  return res.json({ verified: true });
});

app.post("/verify-upi-payment", async (req, res) => {
  const { upiId, amount } = req.body || {};

  if (!upiId || !amount) {
    return res.status(400).json({ error: "Missing upiId or amount." });
  }

  try {
    const expectedAmount = Math.round(Number(amount) * 100);
    const to = Math.floor(Date.now() / 1000);
    const from = to - 7 * 24 * 60 * 60;
    const paymentsResponse = await razorpay.payments.all({ from, to, count: 100 });
    const payments = paymentsResponse?.items || [];
    const match = payments.find((payment) => {
      const paymentUpiId = payment?.vpa || "";
      return (
        payment?.method === "upi" &&
        payment?.status === "captured" &&
        payment?.amount === expectedAmount &&
        paymentUpiId.toLowerCase() === upiId.toLowerCase()
      );
    });

    return res.json({
      verified: Boolean(match),
      payment: {
        id: match?.id,
        status: match?.status,
        method: match?.method,
        vpa: match?.vpa,
        amount: match?.amount
      }
    });
  } catch (error) {
    console.error("Error verifying UPI payment", error);
    return res.status(500).json({ error: "Unable to verify payment." });
  }
});

app.listen(PORT, () => {
  console.log(`Razorpay server listening on port ${PORT}`);
});
