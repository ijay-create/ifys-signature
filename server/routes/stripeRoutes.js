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

        /*
         * item.price is the price for ONE complete order set:
         *
         * Pan price
         * + selected protein prices
         *
         * Quantity is then handled separately by Stripe.
         */
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

        /*
         * Build detailed protein information.
         *
         * Example:
         * Chicken — Small — $8.00
         * Shrimp — Medium — $20.00
         */
        const proteinDetails = Array.isArray(
          item.protein
        )
          ? item.protein
              .map((protein) => {
                if (typeof protein === "string") {
                  return protein;
                }

                const name = protein?.name || "";
                const size =
                  protein?.sizeName ||
                  protein?.size ||
                  "";
                const price = Number(
                  protein?.price || 0
                );

                if (!name) {
                  return "";
                }

                const details = [name];

                if (size) {
                  details.push(size);
                }

                if (price > 0) {
                  details.push(
                    `$${price.toFixed(2)}`
                  );
                }

                return details.join(" — ");
              })
              .filter(Boolean)
          : [];

        const descriptionParts = [];

        /*
         * Pan
         */
        if (item.pan) {
          descriptionParts.push(
            `Pan: ${item.pan}`
          );
        }

        /*
         * Protein
         */
        if (proteinDetails.length > 0) {
          descriptionParts.push(
            `Protein: ${proteinDetails.join(
              ", "
            )}`
          );
        } else {
          descriptionParts.push(
            "Protein: None selected"
          );
        }

        /*
         * Spice level
         */
        if (item.spice) {
          descriptionParts.push(
            `Spice: ${item.spice}`
          );
        }

        /*
         * Allergy information
         */
        if (
          item.allergy &&
          item.allergy !== "None reported"
        ) {
          descriptionParts.push(
            `Allergies: ${item.allergy}`
          );
        } else {
          descriptionParts.push(
            "Allergies: None reported"
          );
        }

        /*
         * Ingredients the customer does not want.
         */
        if (
          item.excludedIngredients &&
          item.excludedIngredients !==
            "None specified"
        ) {
          descriptionParts.push(
            `Exclude: ${item.excludedIngredients}`
          );
        } else {
          descriptionParts.push(
            "Exclude: None specified"
          );
        }

        /*
         * Quantity
         */
        descriptionParts.push(
          `Quantity: ${quantity}`
        );

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

      const clientUrl =
        process.env.CLIENT_URL;

      if (!clientUrl) {
        throw new Error(
          "CLIENT_URL is missing. Check your environment variables."
        );
      }

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
            `${clientUrl}/order-confirmation` +
            "?session_id={CHECKOUT_SESSION_ID}",

          cancel_url:
            `${clientUrl}/checkout`,

          metadata: {
            customer_name:
              customer?.name || "",

            customer_phone:
              customer?.phone || "",
          },
        });

      console.log(
        "STRIPE CHECKOUT SESSION CREATED:",
        session.id
      );

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