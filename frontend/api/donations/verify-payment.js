import crypto from "node:crypto";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: "Razorpay is not configured on server." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationPayload = {} } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment verification payload." });
  }

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    console.warn("Donation verification failed", {
      ...donationPayload,
      razorpay_order_id,
      razorpay_payment_id,
      paymentStatus: "failed",
    });
    return res.status(400).json({ verified: false, error: "Signature mismatch." });
  }

  console.log("Donation successful", {
    ...donationPayload,
    razorpay_order_id,
    razorpay_payment_id,
    paymentStatus: "successful",
  });

  return res.status(200).json({ verified: true, paymentStatus: "successful" });
}
