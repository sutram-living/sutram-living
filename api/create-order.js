import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `sutram_${Date.now()}`,
    });
return res.status(200).json({
  success: true,
  order,
  key_id: process.env.RAZORPAY_KEY_ID,
});
    
  } catch (error) {
    console.error("Razorpay order error:", error);

    return res.status(500).json({
      success: false,
      message: error?.error?.description || error.message,
    });
  }
}