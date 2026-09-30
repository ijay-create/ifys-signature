import express from "express";
import { sendQuoteRequestEmail } from "../utils/emailService.js";

const router = express.Router();

const cleanString = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const normalizeValue = (value) => {
  return cleanString(value).toLowerCase();
};

const parsePanQuantity = (value) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.floor(parsed);
};

const normalizeSize = (value) => {
  const normalized = normalizeValue(value);

  if (normalized === "small") {
    return "Small";
  }

  if (normalized === "medium") {
    return "Medium";
  }

  if (normalized === "large") {
    return "Large";
  }

  return "";
};

const normalizeServiceOption = (value) => {
  const normalized = normalizeValue(value);

  if (
    normalized === "delivery" ||
    normalized.includes("delivery")
  ) {
    return "delivery";
  }

  if (
    normalized === "pickup" ||
    normalized === "pick-up" ||
    normalized === "pick up" ||
    normalized.includes("pickup") ||
    normalized.includes("pick-up")
  ) {
    return "pickup";
  }

  if (
    normalized === "late" ||
    normalized === "late order" ||
    normalized.includes("late")
  ) {
    return "late";
  }

  return "";
};

const normalizeDeliveryPlatform = (value) => {
  const normalized = normalizeValue(value);

  if (normalized.includes("uber")) {
    return "Uber Eats";
  }

  if (normalized.includes("door")) {
    return "DoorDash";
  }

  return cleanString(value);
};

router.post("/quote", async (req, res) => {
  try {
    console.log("========================================");
    console.log("QUOTE ROUTE HIT");
    console.log(
      "QUOTE BODY:",
      JSON.stringify(req.body, null, 2)
    );
    console.log("========================================");

    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      location,

      smallPans,
      mediumPans,
      largePans,

      chickenSize,
      shrimpSize,
      beefSize,
      mixedSize,

      spiceLevel,
      allergy,
      excludedIngredients,

      serviceOption,
      deliveryPlatform,

      message,
      estimatedTotal,
    } = req.body;

    /* =========================================
       CUSTOMER DETAILS
    ========================================= */

    const cleanName = cleanString(name);
    const cleanEmail = cleanString(email);
    const cleanPhone = cleanString(phone);
    const cleanEventType = cleanString(eventType);
    const cleanEventDate = cleanString(eventDate);
    const cleanLocation = cleanString(location);

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Please enter your full name.",
      });
    }

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    if (!cleanPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter your phone number.",
      });
    }

    if (!cleanEventType) {
      return res.status(400).json({
        success: false,
        message: "Please select your event type.",
      });
    }

    if (!cleanEventDate) {
      return res.status(400).json({
        success: false,
        message: "Please select your event date.",
      });
    }

    /* =========================================
       PAN COUNTS
    ========================================= */

    const parsedSmallPans = parsePanQuantity(smallPans);
    const parsedMediumPans = parsePanQuantity(mediumPans);
    const parsedLargePans = parsePanQuantity(largePans);

    const calculatedTotalPans =
      parsedSmallPans +
      parsedMediumPans +
      parsedLargePans;

    if (calculatedTotalPans < 1) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one pan.",
      });
    }

    /* =========================================
       SPICE LEVEL
    ========================================= */

    const cleanSpiceLevel = cleanString(spiceLevel);

    if (!cleanSpiceLevel) {
      return res.status(400).json({
        success: false,
        message:
          "Please select your preferred spice level.",
      });
    }

    /* =========================================
       SERVICE OPTION
    ========================================= */

    const normalizedServiceOption =
      normalizeServiceOption(serviceOption);

    if (!normalizedServiceOption) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a delivery or pickup option.",
      });
    }

    /* =========================================
       LOCATION
    ========================================= */

    if (!cleanLocation) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your event or delivery location.",
      });
    }

    /* =========================================
       DELIVERY PLATFORM
    ========================================= */

    const normalizedDeliveryPlatform =
      normalizeDeliveryPlatform(deliveryPlatform);

    if (
      normalizedServiceOption === "delivery" &&
      !normalizedDeliveryPlatform
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select Uber Eats or DoorDash for delivery.",
      });
    }

    /* =========================================
       PAN SELECTIONS
    ========================================= */

    const pans = [];

    if (parsedSmallPans > 0) {
      pans.push({
        name: "Small Pan",
        quantity: parsedSmallPans,
        price: 45,
      });
    }

    if (parsedMediumPans > 0) {
      pans.push({
        name: "Medium Pan",
        quantity: parsedMediumPans,
        price: 65,
      });
    }

    if (parsedLargePans > 0) {
      pans.push({
        name: "Large Pan",
        quantity: parsedLargePans,
        price: 100,
      });
    }

    /* =========================================
       PROTEIN PRICES
    ========================================= */

    const proteinPrices = {
      Chicken: {
        Small: 8,
        Medium: 14,
        Large: 20,
      },

      Shrimp: {
        Small: 12,
        Medium: 20,
        Large: 30,
      },

      Beef: {
        Small: 10,
        Medium: 17,
        Large: 24,
      },

      Mixed: {
        Small: 18,
        Medium: 30,
        Large: 42,
      },
    };

    /* =========================================
       PROTEIN SELECTIONS
    ========================================= */

    const proteinSelections = [];

    const addProtein = (
      proteinName,
      selectedSize
    ) => {
      const normalizedSize =
        normalizeSize(selectedSize);

      if (!normalizedSize) {
        return;
      }

      proteinSelections.push({
        name: proteinName,
        size: normalizedSize,
        price:
          proteinPrices[proteinName]?.[
            normalizedSize
          ] || 0,
      });
    };

    addProtein("Chicken", chickenSize);
    addProtein("Shrimp", shrimpSize);
    addProtein("Beef", beefSize);
    addProtein("Mixed", mixedSize);

    /* =========================================
       DELIVERY METHOD
    ========================================= */

    let deliveryMethod = "Not specified";

    if (normalizedServiceOption === "delivery") {
      deliveryMethod = normalizedDeliveryPlatform;
    }

    if (normalizedServiceOption === "pickup") {
      deliveryMethod = "Self Pick-Up";
    }

    if (normalizedServiceOption === "late") {
      deliveryMethod = "Late Order";
    }

    /* =========================================
       LATE ORDER
    ========================================= */

    const lateOrder =
      normalizedServiceOption === "late";

    /* =========================================
       OTHER DETAILS
    ========================================= */

    const cleanAllergy =
      cleanString(allergy) || "None";

    const cleanExcludedIngredients =
      cleanString(excludedIngredients);

    const cleanMessage = cleanString(message);

    /* =========================================
       TOTALS
    ========================================= */

    const finalTotalPans = calculatedTotalPans;

    const parsedEstimatedTotal =
      Number(estimatedTotal);

    const finalEstimatedTotal =
      Number.isFinite(parsedEstimatedTotal) &&
      parsedEstimatedTotal >= 0
        ? parsedEstimatedTotal
        : 0;

    /* =========================================
       SEND EMAIL
    ========================================= */

    const emailResult =
      await sendQuoteRequestEmail({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        eventType: cleanEventType,
        eventDate: cleanEventDate,
        location: cleanLocation,

        pans,

        proteinSelections,

        spiceLevel: cleanSpiceLevel,

        allergy: cleanAllergy,

        excludedIngredients:
          cleanExcludedIngredients,

        serviceOption:
          normalizedServiceOption,

        deliveryPlatform:
          normalizedDeliveryPlatform,

        deliveryMethod,

        lateOrder,

        message: cleanMessage,

        totalPans: finalTotalPans,

        estimatedTotal:
          finalEstimatedTotal,
      });

    console.log(
      "QUOTE REQUEST EMAIL SENT:",
      emailResult?.id || "unknown"
    );

    return res.status(200).json({
      success: true,
      message:
        "Your quote request has been sent successfully.",
      emailId: emailResult?.id || null,
    });
  } catch (error) {
    console.error(
      "QUOTE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Something went wrong while sending your request.",
    });
  }
});

export default router;