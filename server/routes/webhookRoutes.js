import express from "express";
import Stripe from "stripe";

import {
  sendCustomerOrderEmail,
  sendBusinessOrderEmail,
} from "../utils/emailService.js";

const router = express.Router();

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY;

const webhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing."
  );
}

if (!webhookSecret) {
  throw new Error(
    "STRIPE_WEBHOOK_SECRET is missing."
  );
}

const stripe = new Stripe(
  stripeSecretKey
);

/*
 * Keep this route BEFORE express.json()
 * in server.js.
 *
 * Stripe requires the original raw request body
 * when verifying the webhook signature.
 */

router.post(
  "/stripe",
  express.raw({
    type: "application/json",
  }),
  async (req, res) => {
    const signature =
      req.headers["stripe-signature"];

    if (!signature) {
      console.error(
        "STRIPE WEBHOOK ERROR: Missing stripe-signature header."
      );

      return res.status(400).send(
        "Missing Stripe signature."
      );
    }

    let event;

    /*
     * Verify that this request actually came
     * from Stripe.
     */
    try {
      event =
        stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
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

    console.log(
      `STRIPE WEBHOOK RECEIVED: ${event.type} (${event.id})`
    );

    try {
      /*
       * We only need to process a successfully
       * completed Checkout Session.
       */
      if (
        event.type !==
        "checkout.session.completed"
      ) {
        return res.json({
          received: true,
          ignored: true,
          eventType: event.type,
        });
      }

      const session = event.data.object;

      console.log(
        "STRIPE PAYMENT COMPLETED:",
        session.id
      );

      /*
       * CUSTOMER INFORMATION
       */

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

      /*
       * RETRIEVE THE FULL STRIPE LINE ITEMS
       *
       * We expand the Product so we can retrieve
       * the detailed description created in
       * stripeRoutes.js.
       */
      const lineItems =
        await stripe.checkout.sessions.listLineItems(
          session.id,
          {
            limit: 100,
            expand: [
              "data.price.product",
            ],
          }
        );

      /*
       * CONVERT STRIPE ITEMS INTO OUR EMAIL FORMAT
       */

      const items =
        lineItems.data.map(
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
                product?.description ||
                "",

              quantity:
                Number(
                  lineItem.quantity
                ) || 1,

              /*
               * amount_total is the total amount
               * for this line item.
               */
              amount:
                Number(
                  lineItem.amount_total
                ) ||
                Number(
                  lineItem.amount_subtotal
                ) ||
                0,
            };
          }
        );

      const amount =
        Number(
          session.amount_total
        ) || 0;

      const currency =
        session.currency ||
        "usd";

      /*
       * LOG THE COMPLETE ORDER.
       *
       * This is extremely useful when testing
       * Stripe/Render.
       */
      console.log(
        "ORDER DETAILS:",
        JSON.stringify(
          {
            orderId: session.id,
            customerName,
            customerEmail,
            customerPhone,
            amount,
            currency,
            items,
          },
          null,
          2
        )
      );

      /*
       * SEND BOTH EMAILS.
       *
       * Customer:
       *   - order confirmation
       *
       * Business:
       *   - new order notification
       */
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
        "ORDER EMAILS PROCESSED SUCCESSFULLY:",
        session.id
      );

      return res.json({
        received: true,
        success: true,
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