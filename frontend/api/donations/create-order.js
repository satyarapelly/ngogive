const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: "Razorpay is not configured on server." });
  }

  try {
    const { selectedCause, donorName, email, phone, amount, message } = req.body || {};
    const parsedAmount = Number(amount);

    if (!selectedCause || !donorName || (!email && !phone) || !parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid donation payload." });
    }

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: Math.round(parsedAmount * 100),
        currency: "INR",
        receipt: `donation_${Date.now()}_${String(selectedCause).slice(0, 20).replace(/\s+/g, "_")}`,
        notes: { selectedCause, donorName, email: email || "", phone: phone || "", message: message || "" },
      }),
    });

    const order = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      throw new Error(order?.error?.description || "Unable to create order.");
    }

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    return res.status(500).json({ error: "Unable to create order." });
  }
}
