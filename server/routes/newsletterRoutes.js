import express from "express";
import { Resend } from "resend";

const router = express.Router();

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error(
    "RESEND_API_KEY is missing. Check your root .env file.",
  );
}

const resend = new Resend(resendApiKey);

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/subscribe", async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    console.log(
      "NEWSLETTER SUBSCRIPTION REQUEST:",
      email,
    );

    const { data, error } =
      await resend.contacts.create({
        email,
        unsubscribed: false,
      });

    if (error) {
      console.error(
        "RESEND CONTACT ERROR:",
        error,
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "We couldn't subscribe your email.",
      });
    }

    console.log(
      "NEWSLETTER SUBSCRIBER ADDED:",
      email,
    );

    return res.status(200).json({
      success: true,
      message:
        "You're subscribed! We'll keep you updated.",
      contact: data,
    });
  } catch (error) {
    console.error(
      "NEWSLETTER SUBSCRIPTION ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again.",
    });
  }
});

export default router;