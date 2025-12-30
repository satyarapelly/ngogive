require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();

const PORT = process.env.PORT || 5000;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

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
  const { paymentId, upiId, amount } = req.body || {};

  if (!paymentId || !upiId || !amount) {
    return res.status(400).json({ error: "Missing paymentId, upiId, or amount." });
  }

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    const paymentUpiId = payment?.vpa || "";
    const isUpiPayment = payment?.method === "upi";
    const isCaptured = payment?.status === "captured";
    const upiMatches = paymentUpiId.toLowerCase() === upiId.toLowerCase();
    const expectedAmount = Math.round(Number(amount) * 100);
    const amountMatches = payment?.amount === expectedAmount;

    return res.json({
      verified: Boolean(isUpiPayment && isCaptured && upiMatches && amountMatches),
      payment: {
        id: payment?.id,
        status: payment?.status,
        method: payment?.method,
        vpa: paymentUpiId,
        amount: payment?.amount
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
