import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  LoaderCircle,
  MapPin,
  MessageCircle,
  PackageCheck,
  Send,
  Store,
  Truck,
} from "lucide-react";

import "../styles/ContactSection.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================
   DELIVERY LINKS
========================================= */

const UBER_EATS_URL = "https://www.ubereats.com/";
const DOORDASH_URL = "https://www.doordash.com/";

/* =========================================
   PAN OPTIONS
========================================= */

const panOptions = [
  {
    id: "small",
    name: "Small Pan",
    price: 45,
    description: "Perfect for smaller gatherings",
  },
  {
    id: "medium",
    name: "Medium Pan",
    price: 65,
    description: "Great for family-sized events",
  },
  {
    id: "large",
    name: "Large Pan",
    price: 100,
    description: "Ideal for larger gatherings",
  },
];

/* =========================================
   PROTEIN OPTIONS
========================================= */

const proteinOptions = [
  {
    id: "chicken",
    name: "Chicken",
    prices: {
      Small: 8,
      Medium: 14,
      Large: 20,
    },
  },
  {
    id: "shrimp",
    name: "Shrimp",
    prices: {
      Small: 12,
      Medium: 20,
      Large: 30,
    },
  },
  {
    id: "beef",
    name: "Beef",
    prices: {
      Small: 10,
      Medium: 17,
      Large: 24,
    },
  },
  {
    id: "mixed",
    name: "Mixed",
    prices: {
      Small: 18,
      Medium: 30,
      Large: 42,
    },
  },
];

const proteinSizes = ["Small", "Medium", "Large"];

/* =========================================
   SPICE OPTIONS
========================================= */

const spiceOptions = [
  "Mild",
  "Medium",
  "Hot",
];

/* =========================================
   ALLERGY OPTIONS
========================================= */

const allergyOptions = [
  "None",
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Egg",
  "Shellfish",
  "Soy",
  "Other",
];

/* =========================================
   EVENT OPTIONS
========================================= */

const eventOptions = [
  "Birthday",
  "Wedding",
  "Graduation",
  "Baby Shower",
  "Corporate Event",
  "Other",
];

/* =========================================
   SERVICE OPTIONS
========================================= */

const serviceOptions = [
  {
    id: "delivery",
    label: "Delivery",
    description:
      "Fridays, Saturdays & Sundays before 3 PM",
  },
  {
    id: "pickup",
    label: "Self Pickup",
    description:
      "Pick up your order yourself",
  },
  {
    id: "late",
    label: "Late Order",
    description:
      "Additional charge may apply",
  },
];

/* =========================================
   INITIAL FORM
========================================= */

const initialForm = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  location: "",

  smallPans: 0,
  mediumPans: 0,
  largePans: 0,

  chickenSize: "",
  shrimpSize: "",
  beefSize: "",
  mixedSize: "",

  spiceLevel: "",
  allergy: "None",
  excludedIngredients: "",

  serviceOption: "",
  deliveryPlatform: "",

  message: "",
};

const ContactSection = ({
  selectedEvent = "",
}) => {
  const [formData, setFormData] =
    useState(initialForm);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  /* =========================================
     PRESELECT EVENT
  ========================================= */

  useEffect(() => {
    if (!selectedEvent) {
      return;
    }

    const eventMap = {
      Birthdays: "Birthday",
      Weddings: "Wedding",
      Graduations: "Graduation",
      "Baby Showers": "Baby Shower",
      "Corporate Events": "Corporate Event",
      "And More!": "Other",
    };

    const mappedEvent =
      eventMap[selectedEvent] ||
      selectedEvent;

    setFormData((currentForm) => ({
      ...currentForm,
      eventType: eventOptions.includes(
        mappedEvent
      )
        ? mappedEvent
        : "Other",
    }));

    setIsSubmitted(false);
    setErrorMessage("");
  }, [selectedEvent]);

  /* =========================================
     HANDLE CHANGE
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setIsSubmitted(false);
    setErrorMessage("");
  };

  /* =========================================
     PAN QUANTITY
  ========================================= */

  const updatePanQuantity = (
    panId,
    change
  ) => {
    const fieldMap = {
      small: "smallPans",
      medium: "mediumPans",
      large: "largePans",
    };

    const fieldName =
      fieldMap[panId];

    if (!fieldName) {
      return;
    }

    setFormData((currentForm) => ({
      ...currentForm,
      [fieldName]: Math.min(
        Math.max(
          Number(currentForm[fieldName]) +
            change,
          0
        ),
        50
      ),
    }));

    setIsSubmitted(false);
    setErrorMessage("");
  };

  /* =========================================
     PROTEIN TOGGLE
  ========================================= */

  const toggleProtein = (
    proteinId
  ) => {
    const fieldMap = {
      chicken: "chickenSize",
      shrimp: "shrimpSize",
      beef: "beefSize",
      mixed: "mixedSize",
    };

    const fieldName =
      fieldMap[proteinId];

    if (!fieldName) {
      return;
    }

    setFormData((currentForm) => ({
      ...currentForm,
      [fieldName]:
        currentForm[fieldName]
          ? ""
          : "Medium",
    }));

    setIsSubmitted(false);
    setErrorMessage("");
  };

  /* =========================================
     CALCULATE TOTAL
  ========================================= */

  const estimatedTotal = useMemo(() => {
    const panTotal =
      Number(formData.smallPans) * 45 +
      Number(formData.mediumPans) * 65 +
      Number(formData.largePans) * 100;

    const proteinTotal =
      (formData.chickenSize
        ? proteinOptions.find(
            (protein) =>
              protein.id === "chicken"
          )?.prices[
            formData.chickenSize
          ] || 0
        : 0) +
      (formData.shrimpSize
        ? proteinOptions.find(
            (protein) =>
              protein.id === "shrimp"
          )?.prices[
            formData.shrimpSize
          ] || 0
        : 0) +
      (formData.beefSize
        ? proteinOptions.find(
            (protein) =>
              protein.id === "beef"
          )?.prices[
            formData.beefSize
          ] || 0
        : 0) +
      (formData.mixedSize
        ? proteinOptions.find(
            (protein) =>
              protein.id === "mixed"
          )?.prices[
            formData.mixedSize
          ] || 0
        : 0);

    return panTotal + proteinTotal;
  }, [formData]);

  /* =========================================
     TOTAL PAN COUNT
  ========================================= */

  const totalPans =
    Number(formData.smallPans) +
    Number(formData.mediumPans) +
    Number(formData.largePans);

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSending) {
      return;
    }

    if (totalPans < 1) {
      setErrorMessage(
        "Please select at least one pan."
      );
      return;
    }

    if (!formData.spiceLevel) {
      setErrorMessage(
        "Please select your preferred spice level."
      );
      return;
    }

    if (!formData.serviceOption) {
      setErrorMessage(
        "Please select a delivery or pickup option."
      );
      return;
    }

    if (
      formData.serviceOption ===
        "delivery" &&
      !formData.deliveryPlatform
    ) {
      setErrorMessage(
        "Please select Uber Eats or DoorDash for delivery."
      );
      return;
    }

    setIsSending(true);
    setErrorMessage("");
    setIsSubmitted(false);

    try {
      const response = await fetch(
        `${API_URL}/api/contact/quote`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...formData,
            totalPans,
            estimatedTotal,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to send your request."
        );
      }

      setIsSubmitted(true);
      setFormData(initialForm);
    } catch (error) {
      console.error(
        "QUOTE REQUEST ERROR:",
        error
      );

      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      className="contact-section"
      id="contact"
    >
      <div className="contact-section-inner">

        {/* ========================================
            LEFT SIDE
        ======================================== */}

        <motion.div
          className="contact-intro"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <span className="section-label">
            BOOKINGS & ORDERS
          </span>

          <h2>
            Let's make your
            <span>
              event delicious.
            </span>
          </h2>

          <p>
            Tell us what you need and we'll
            help you plan your fried rice order
            around your event date, pan sizes,
            proteins, spice level, and delivery
            preference.
          </p>

          {/* BOOKING NOTICE */}

          <div className="booking-notice">
            <div className="booking-notice-icon">
              <CalendarDays
                size={21}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <span className="booking-notice-label">
                BOOKINGS
              </span>

              <h3>
                Book at least one week
                before your event.
              </h3>

              <p>
                We're available to receive
                booking requests Sunday through
                Saturday.
              </p>
            </div>
          </div>

          {/* AVAILABILITY */}

          <div className="service-info-list">

            <div className="service-info-item">
              <span className="service-info-icon">
                <Truck
                  size={18}
                  strokeWidth={1.8}
                />
              </span>

              <div>
                <strong>
                  Delivery
                </strong>

                <span>
                  Fridays, Saturdays &
                  Sundays before 3 PM.
                </span>
              </div>
            </div>

            <div className="service-info-item">
              <span className="service-info-icon">
                <Store
                  size={18}
                  strokeWidth={1.8}
                />
              </span>

              <div>
                <strong>
                  Pick-up by self
                </strong>

                <span>
                  Prefer to collect your
                  order? Self pickup is
                  available.
                </span>
              </div>
            </div>

            <div className="service-info-item service-info-item-warning">
              <span className="service-info-icon">
                <Clock3
                  size={18}
                  strokeWidth={1.8}
                />
              </span>

              <div>
                <strong>
                  Late orders
                </strong>

                <span>
                  Late requests may require
                  an additional charge.
                </span>
              </div>
            </div>

          </div>

          {/* DELIVERY PARTNERS */}

          <div className="delivery-platforms">
            <div className="delivery-platforms-heading">
              <span>
                ORDER FOR DELIVERY
              </span>

              <p>
                For delivery orders, choose
                your preferred delivery partner.
              </p>
            </div>

            <div className="delivery-platform-links">

              <a
                href={UBER_EATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="delivery-platform-link uber-link"
              >
                <span className="delivery-brand-mark uber-mark">
                  U
                </span>

                <span className="delivery-platform-copy">
                  <strong>
                    Uber Eats
                  </strong>

                  <small>
                    Order online
                  </small>
                </span>

                <ExternalLink
                  size={15}
                  strokeWidth={1.8}
                />
              </a>

              <a
                href={DOORDASH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="delivery-platform-link doordash-link"
              >
                <span className="delivery-brand-mark doordash-mark">
                  D
                </span>

                <span className="delivery-platform-copy">
                  <strong>
                    DoorDash
                  </strong>

                  <small>
                    Order online
                  </small>
                </span>

                <ExternalLink
                  size={15}
                  strokeWidth={1.8}
                />
              </a>

            </div>
          </div>

          {/* NOTE */}

          <div className="contact-note">
            <span className="contact-note-line" />

            <p>
              Need help deciding what to
              order? Send us your details and
              we'll help you plan it.
            </p>
          </div>
        </motion.div>

        {/* ========================================
            RIGHT SIDE FORM
        ======================================== */}

        <motion.div
          className="contact-form-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
        >
          {isSubmitted ? (
            <motion.div
              className="quote-success"
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <div className="quote-success-icon">
                <CheckCircle2
                  size={42}
                  strokeWidth={1.6}
                />
              </div>

              <span className="quote-success-eyebrow">
                REQUEST RECEIVED
              </span>

              <h3>
                Thank you!
              </h3>

              <p>
                We've received your booking
                request and order preferences.
                We'll review everything and get
                back to you shortly.
              </p>

              <button
                type="button"
                className="quote-reset-button"
                onClick={() => {
                  setIsSubmitted(false);
                  setErrorMessage("");
                }}
              >
                Send Another Request
              </button>
            </motion.div>
          ) : (
            <form
              className="quote-form"
              onSubmit={handleSubmit}
            >
              <div className="quote-form-heading">
                <span>
                  BUILD YOUR ORDER
                </span>

                <h3>
                  Tell us what you need
                </h3>

                <p>
                  Choose your pans, proteins,
                  spice level and delivery
                  preference below.
                </p>
              </div>

              {/* ERROR */}

              {errorMessage && (
                <motion.div
                  className="quote-error"
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <AlertCircle
                    size={18}
                    strokeWidth={1.8}
                  />

                  <span>
                    {errorMessage}
                  </span>
                </motion.div>
              )}

              {/* ========================================
                  CUSTOMER DETAILS
              ======================================== */}

              <div className="form-section-heading">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    Your details
                  </strong>

                  <small>
                    How can we reach you?
                  </small>
                </div>
              </div>

              <div className="quote-form-grid">

                <div className="form-field">
                  <label htmlFor="name">
                    Full Name{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    disabled={isSending}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">
                    Email Address{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    disabled={isSending}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">
                    Phone Number{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                    disabled={isSending}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="eventType">
                    Event Type{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    disabled={isSending}
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select your event
                    </option>

                    {eventOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="eventDate">
                    Event Date{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    disabled={isSending}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="location">
                    Event / Delivery Location{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Delivery or event address"
                    required
                    disabled={isSending}
                  />
                </div>
              </div>

              {/* ========================================
                  PANS
              ======================================== */}

              <div className="form-section-heading order-section-heading">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    Choose your pans
                  </strong>

                  <small>
                    Select how many pans you need.
                  </small>
                </div>
              </div>

              <div className="pan-selection-grid">
                {panOptions.map(
                  (pan) => {
                    const quantityMap = {
                      small:
                        formData.smallPans,
                      medium:
                        formData.mediumPans,
                      large:
                        formData.largePans,
                    };

                    const quantity =
                      quantityMap[pan.id] || 0;

                    return (
                      <div
                        key={pan.id}
                        className={`pan-selection-card ${
                          quantity > 0
                            ? "selected"
                            : ""
                        }`}
                      >
                        <div className="pan-selection-top">
                          <div>
                            <span className="pan-selection-name">
                              {pan.name}
                            </span>

                            <span className="pan-selection-description">
                              {pan.description}
                            </span>
                          </div>

                          <strong className="pan-selection-price">
                            ${pan.price}
                          </strong>
                        </div>

                        <div className="pan-selection-bottom">
                          <span>
                            Quantity
                          </span>

                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() =>
                                updatePanQuantity(
                                  pan.id,
                                  -1
                                )
                              }
                              disabled={
                                quantity === 0 ||
                                isSending
                              }
                              aria-label={`Remove one ${pan.name}`}
                            >
                              −
                            </button>

                            <strong>
                              {quantity}
                            </strong>

                            <button
                              type="button"
                              onClick={() =>
                                updatePanQuantity(
                                  pan.id,
                                  1
                                )
                              }
                              disabled={isSending}
                              aria-label={`Add one ${pan.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="pan-total-summary">
                <span>
                  Total pans selected
                </span>

                <strong>
                  {totalPans}
                </strong>
              </div>

              {/* ========================================
                  PROTEINS
              ======================================== */}

              <div className="form-section-heading order-section-heading">
                <span>
                  03
                </span>

                <div>
                  <strong>
                    Choose your proteins
                  </strong>

                  <small>
                    Select a protein and size.
                  </small>
                </div>
              </div>

              <div className="protein-selection-list">
                {proteinOptions.map(
                  (protein) => {
                    const fieldMap = {
                      chicken:
                        "chickenSize",
                      shrimp:
                        "shrimpSize",
                      beef:
                        "beefSize",
                      mixed:
                        "mixedSize",
                    };

                    const fieldName =
                      fieldMap[protein.id];

                    const selectedSize =
                      formData[fieldName];

                    return (
                      <div
                        key={protein.id}
                        className={`protein-selection-card ${
                          selectedSize
                            ? "selected"
                            : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="protein-selection-header"
                          onClick={() =>
                            toggleProtein(
                              protein.id
                            )
                          }
                        >
                          <span className="protein-selection-check">
                            {selectedSize
                              ? "✓"
                              : ""}
                          </span>

                          <span className="protein-selection-name">
                            {protein.name}
                          </span>

                          <span className="protein-selection-toggle">
                            {selectedSize
                              ? "Selected"
                              : "Select"}
                          </span>
                        </button>

                        {selectedSize && (
                          <div className="protein-size-options">
                            {proteinSizes.map(
                              (size) => (
                                <label
                                  key={size}
                                  className={`protein-size-option ${
                                    selectedSize ===
                                    size
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={fieldName}
                                    value={size}
                                    checked={
                                      selectedSize ===
                                      size
                                    }
                                    onChange={
                                      handleChange
                                    }
                                    disabled={
                                      isSending
                                    }
                                  />

                                  <span>
                                    {size}
                                  </span>

                                  <strong>
                                    $
                                    {
                                      protein
                                        .prices[
                                        size
                                      ]
                                    }
                                  </strong>
                                </label>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* ========================================
                  SPICE
              ======================================== */}

              <div className="form-section-heading order-section-heading">
                <span>
                  04
                </span>

                <div>
                  <strong>
                    Spice level
                  </strong>

                  <small>
                    How spicy would you like it?
                  </small>
                </div>
              </div>

              <div className="choice-grid spice-grid">
                {spiceOptions.map(
                  (option) => (
                    <label
                      key={option}
                      className={`choice-card ${
                        formData.spiceLevel ===
                        option
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="spiceLevel"
                        value={option}
                        checked={
                          formData.spiceLevel ===
                          option
                        }
                        onChange={handleChange}
                        disabled={isSending}
                      />

                      <span className="choice-card-check">
                        {formData.spiceLevel ===
                        option
                          ? "✓"
                          : ""}
                      </span>

                      <span>
                        {option}
                      </span>
                    </label>
                  )
                )}
              </div>

              {/* ========================================
                  ALLERGIES
              ======================================== */}

              <div className="form-section-heading order-section-heading">
                <span>
                  05
                </span>

                <div>
                  <strong>
                    Allergies & ingredients
                  </strong>

                  <small>
                    Please tell us about any allergies.
                  </small>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="allergy">
                  Do you have a food allergy?
                  <span> *</span>
                </label>

                <select
                  id="allergy"
                  name="allergy"
                  value={formData.allergy}
                  onChange={handleChange}
                  required
                  disabled={isSending}
                >
                  {allergyOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>

              {formData.allergy !==
                "None" && (
                <div className="allergy-alert">
                  <AlertCircle
                    size={18}
                    strokeWidth={1.8}
                  />

                  <div>
                    <strong>
                      Allergy information
                    </strong>

                    <span>
                      Please provide as much detail
                      as possible below so we can
                      review your request carefully.
                    </span>
                  </div>
                </div>
              )}

              <div className="form-field form-field-full allergy-field">
                <label htmlFor="excludedIngredients">
                  Ingredients to Avoid
                </label>

                <input
                  id="excludedIngredients"
                  name="excludedIngredients"
                  type="text"
                  value={
                    formData.excludedIngredients
                  }
                  onChange={handleChange}
                  placeholder="e.g. peanuts, onions, eggs..."
                  disabled={isSending}
                />
              </div>

              {/* ========================================
                  DELIVERY
              ======================================== */}

              <div className="form-section-heading order-section-heading">
                <span>
                  06
                </span>

                <div>
                  <strong>
                    Delivery or pickup
                  </strong>

                  <small>
                    Choose how you'd like to receive
                    your order.
                  </small>
                </div>
              </div>

              <div className="service-choice-grid">
                {serviceOptions.map(
                  (option) => (
                    <label
                      key={option.id}
                      className={`service-choice-card ${
                        formData.serviceOption ===
                        option.id
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="serviceOption"
                        value={option.id}
                        checked={
                          formData.serviceOption ===
                          option.id
                        }
                        onChange={
                          handleChange
                        }
                        disabled={isSending}
                      />

                      <span className="service-choice-icon">
                        {option.id ===
                          "delivery" && (
                          <Truck
                            size={21}
                            strokeWidth={1.7}
                          />
                        )}

                        {option.id ===
                          "pickup" && (
                          <Store
                            size={21}
                            strokeWidth={1.7}
                          />
                        )}

                        {option.id ===
                          "late" && (
                          <Clock3
                            size={21}
                            strokeWidth={1.7}
                          />
                        )}
                      </span>

                      <span className="service-choice-content">
                        <strong>
                          {option.label}
                        </strong>

                        <small>
                          {option.description}
                        </small>
                      </span>

                      <span className="service-choice-radio">
                        {formData.serviceOption ===
                        option.id
                          ? "✓"
                          : ""}
                      </span>
                    </label>
                  )
                )}
              </div>

              {/* DELIVERY PARTNER */}

              {formData.serviceOption ===
                "delivery" && (
                <motion.div
                  className="delivery-partner-selection"
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                >
                  <div className="delivery-partner-heading">
                    <span>
                      DELIVERY PARTNER
                    </span>

                    <p>
                      Select your preferred
                      delivery service.
                    </p>
                  </div>

                  <div className="delivery-partner-grid">

                    <label
                      className={`delivery-partner-card ${
                        formData.deliveryPlatform ===
                        "Uber Eats"
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryPlatform"
                        value="Uber Eats"
                        checked={
                          formData.deliveryPlatform ===
                          "Uber Eats"
                        }
                        onChange={
                          handleChange
                        }
                        disabled={isSending}
                      />

                      <span className="delivery-brand-mark uber-mark">
                        U
                      </span>

                      <span>
                        <strong>
                          Uber Eats
                        </strong>

                        <small>
                          Preferred delivery
                        </small>
                      </span>

                      <span className="delivery-radio">
                        {formData.deliveryPlatform ===
                        "Uber Eats"
                          ? "✓"
                          : ""}
                      </span>
                    </label>

                    <label
                      className={`delivery-partner-card ${
                        formData.deliveryPlatform ===
                        "DoorDash"
                          ? "active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryPlatform"
                        value="DoorDash"
                        checked={
                          formData.deliveryPlatform ===
                          "DoorDash"
                        }
                        onChange={
                          handleChange
                        }
                        disabled={isSending}
                      />

                      <span className="delivery-brand-mark doordash-mark">
                        D
                      </span>

                      <span>
                        <strong>
                          DoorDash
                        </strong>

                        <small>
                          Preferred delivery
                        </small>
                      </span>

                      <span className="delivery-radio">
                        {formData.deliveryPlatform ===
                        "DoorDash"
                          ? "✓"
                          : ""}
                      </span>
                    </label>

                  </div>

                  <p className="delivery-note">
                    You can also order directly
                    through the delivery platforms
                    using the links above.
                  </p>
                </motion.div>
              )}

              {/* LATE ORDER NOTICE */}

              {formData.serviceOption ===
                "late" && (
                <motion.div
                  className="late-order-notice"
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <Clock3
                    size={19}
                    strokeWidth={1.8}
                  />

                  <div>
                    <strong>
                      Late order selected
                    </strong>

                    <p>
                      Late orders may incur an
                      additional charge. We'll
                      confirm the applicable charge
                      with you before your order is
                      finalized.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ========================================
                  ADDITIONAL DETAILS
              ======================================== */}

              <div className="form-section-heading order-section-heading">
                <span>
                  07
                </span>

                <div>
                  <strong>
                    Anything else?
                  </strong>

                  <small>
                    Add any additional information.
                  </small>
                </div>
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="message">
                  Additional Details
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us anything else we should know about your event, order, timing, delivery, or special requests..."
                  disabled={isSending}
                />
              </div>

              {/* ========================================
                  ORDER SUMMARY
              ======================================== */}

              <div className="order-estimate">
                <div className="order-estimate-heading">
                  <span>
                    ESTIMATED ORDER
                  </span>

                  <MessageCircle
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="order-estimate-row">
                  <span>
                    Pans
                  </span>

                  <strong>
                    {totalPans}
                  </strong>
                </div>

                <div className="order-estimate-row">
                  <span>
                    Selected proteins
                  </span>

                  <strong>
                    {
                      [
                        formData.chickenSize,
                        formData.shrimpSize,
                        formData.beefSize,
                        formData.mixedSize,
                      ].filter(Boolean).length
                    }
                  </strong>
                </div>

                <div className="order-estimate-total">
                  <span>
                    Estimated subtotal
                  </span>

                  <strong>
                    ${estimatedTotal.toFixed(2)}
                  </strong>
                </div>

                <p>
                  Final pricing may vary based on
                  delivery, late-order charges, and
                  any additional requirements.
                </p>
              </div>

              {/* ========================================
                  SUBMIT
              ======================================== */}

              <button
                type="submit"
                className="quote-submit-button"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <span>
                      Sending Request...
                    </span>

                    <LoaderCircle
                      className="quote-loading-icon"
                      size={17}
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <>
                    <span>
                      Request My Quote
                    </span>

                    <Send
                      size={17}
                      strokeWidth={2}
                    />
                  </>
                )}
              </button>

              <p className="quote-form-footnote">
                We'll use the information you
                provide only to respond to your
                booking or quote request.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;