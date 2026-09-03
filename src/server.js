import "dotenv/config";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import crypto from "crypto";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================================
   RAZORPAY
========================================================= */

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

console.log(
  "Razorpay Key Loaded:",
  Boolean(RAZORPAY_KEY_ID)
);

console.log(
  "Razorpay Secret Loaded:",
  Boolean(RAZORPAY_KEY_SECRET)
);

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error(
    "❌ Razorpay keys are missing in .env"
  );
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/* =========================================================
   HOME
========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sutram Living Payment Server Running",
  });
});

/* =========================================================
   CREATE RAZORPAY ORDER
========================================================= */

app.post("/api/create-order", async (req, res) => {
  try {
    console.log(
      "----------------------------------------"
    );

    console.log(
      "Create Order Request:",
      req.body
    );

    const amount = Number(req.body?.amount);

    console.log(
      "Amount Received:",
      amount,
      "Type:",
      typeof req.body?.amount
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      console.error(
        "❌ Invalid amount:",
        req.body?.amount
      );

      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const amountInPaise =
      Math.round(amount * 100);

    console.log(
      "Amount in Paise:",
      amountInPaise
    );

    const order =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt:
          "sutram_" +
          Date.now(),
      });

    console.log(
      "✅ Razorpay Order Created:",
      order.id
    );

    return res.json({
      success: true,
      order: order,
      key_id: RAZORPAY_KEY_ID,
    });

  } catch (error) {

    console.error(
      "❌ RAZORPAY CREATE ORDER ERROR"
    );

    console.error(
      "Status:",
      error?.statusCode
    );

    console.error(
      "Error:",
      error?.error
    );

    return res.status(500).json({
      success: false,

      message:
        error?.error?.description ||
        error?.error?.reason ||
        error?.message ||
        "Unable to create payment order",

      razorpayError:
        error?.error?.code ||
        null,
    });
  }
});

/* =========================================================
   VERIFY PAYMENT
========================================================= */

app.post(
  "/api/verify-payment",
  (req, res) => {
    try {

      console.log(
        "Payment Verification Request:",
        req.body
      );

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment details are incomplete",
        });
      }

      const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      const expectedSignature =
        crypto
          .createHmac(
            "sha256",
            RAZORPAY_KEY_SECRET
          )
          .update(body)
          .digest("hex");

      const isValid =
        expectedSignature ===
        razorpay_signature;

      if (!isValid) {

        console.error(
          "❌ Payment signature invalid"
        );

        return res.status(400).json({
          success: false,
          message:
            "Payment verification failed",
        });
      }

      console.log(
        "✅ Payment Verified:",
        razorpay_payment_id
      );

      return res.json({
        success: true,
        message:
          "Payment verified successfully",
      });

    } catch (error) {

      console.error(
        "❌ PAYMENT VERIFICATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to verify payment",
      });
    }
  }
);

/* =========================================================
   SERVER
========================================================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Sutram Living Payment Server running on port ${PORT}`
  );
});