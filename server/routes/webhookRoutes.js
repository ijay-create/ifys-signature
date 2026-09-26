import express from "express";
import Stripe from "stripe";

import {
  sendCustomerOrderEmail,
  sendBusinessOrderEmail,
} from "../utils/emailService.js";

const router = express.Router();

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error(
        "STRIPE WEBHOOK SIGNATURE ERROR:",
        error.message
      );

      return res.status(400).send(
        `Webhook Error: ${error.message}`
      );
    }

    try {
      if (
        event.type ===
        "checkout.session.completed"
      ) {
        const session = event.data.object;

        console.log(
          "STRIPE PAYMENT COMPLETED:",
          session.id
        );

        const customerEmail =
          session.customer_details?.email ||
          session.customer_email ||
          "";

        const customerName =
          session.metadata?.customer_name ||
          session.customer_details?.name ||
          "Customer";

        const customerPhone =
          session.metadata?.customer_phone ||
          session.customer_details?.phone ||
          "";

        const lineItems =
          await stripe.checkout.sessions.listLineItems(
            session.id,
            {
              limit: 100,
              expand: ["data.price.product"],
            }
          );

        const items = lineItems.data.map(
          (lineItem) => {
            const product =
              typeof lineItem.price?.product ===
              "object"
                ? lineItem.price.product
                : null;

            return {
              name:
                product?.name ||
                lineItem.description ||
                "Ify's Signature item",

              description:
                product?.description || "",

              quantity:
                lineItem.quantity || 1,

              amount:
                lineItem.amount_total ||
                lineItem.amount_subtotal ||
                0,
            };
          }
        );

        const amount =
          session.amount_total || 0;

        const currency =
          session.currency || "usd";

        await Promise.all([
          sendCustomerOrderEmail({
            customerEmail,
            customerName,
            orderId: session.id,
            amount,
            currency,
            items,
          }),

          sendBusinessOrderEmail({
            customerEmail,
            customerName,
            customerPhone,
            orderId: session.id,
            amount,
            currency,
            items,
          }),
        ]);

        console.log(
          "ORDER EMAILS PROCESSED SUCCESSFULLY"
        );
      }

      return res.json({
        received: true,
      });
    } catch (error) {
      console.error(
        "STRIPE WEBHOOK PROCESSING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Webhook processing failed.",
      });
    }
  }
);

export default router;