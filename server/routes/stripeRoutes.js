import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing. Check your root .env file."
  );
}

const stripe = new Stripe(stripeSecretKey);

router.post(
  "/create-checkout-session",
  async (req, res) => {
    try {
      const {
        cartItems,
        customer,
      } = req.body;

      if (
        !Array.isArray(cartItems) ||
        cartItems.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Your cart is empty.",
        });
      }

      const lineItems = cartItems.map((item) => {
        const quantity = Math.max(
          1,
          Math.min(Number(item.quantity) || 1, 10)
        );

        const unitAmount = Math.round(
          Number(item.price) * 100
        );

        if (
          !Number.isFinite(unitAmount) ||
          unitAmount <= 0
        ) {
          throw new Error(
            `Invalid price for ${item.pan || "item"}.`
          );
        }

        const proteinNames = Array.isArray(
          item.protein
        )
          ? item.protein
              .map((protein) =>
                typeof protein === "string"
                  ? protein
                  : protein.name
              )
              .filter(Boolean)
              .join(", ")
          : "";

        const descriptionParts = [];

        if (proteinNames) {
          descriptionParts.push(
            `Protein: ${proteinNames}`
          );
        }

        if (item.spice) {
          descriptionParts.push(
            `Spice: ${item.spice}`
          );
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name:
                item.pan ||
                "Ify's Signature Fried Rice",
              description:
                descriptionParts.join(" • ") ||
                "Freshly prepared fried rice",
            },
            unit_amount: unitAmount,
          },
          quantity,
        };
      });

      const session =
        await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: lineItems,

          customer_email:
            customer?.email || undefined,

          phone_number_collection: {
            enabled: true,
          },

          billing_address_collection: "auto",

          submit_type: "pay",

          success_url:
            `${process.env.CLIENT_URL}` +
            "/order-confirmation" +
            "?session_id={CHECKOUT_SESSION_ID}",

          cancel_url:
            `${process.env.CLIENT_URL}/checkout`,

          metadata: {
            customer_name:
              customer?.name || "",

            customer_phone:
              customer?.phone || "",
          },
        });

      return res.status(200).json({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      console.error(
        "STRIPE CHECKOUT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create Stripe checkout.",
      });
    }
  }
);

export default router;