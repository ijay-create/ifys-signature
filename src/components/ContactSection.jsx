import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  LoaderCircle,
  MessageCircle,
  PackageCheck,
  Send,
  Store,
  Truck,
} from "lucide-react";

import AlertModal from "../components/AlertModal";
import "../styles/ContactSection.css";

/*
|--------------------------------------------------------------------------
| API CONFIGURATION
|--------------------------------------------------------------------------
| Local development:
|   http://localhost:5000
|
| Production:
|   https://ifys-signature-api.onrender.com
|
| You can override both with VITE_API_URL in your .env file.
|--------------------------------------------------------------------------
*/
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://ifys-signature-api.onrender.com");

const UBER_EATS_URL = "https://www.ubereats.com/";
const DOORDASH_URL = "https://www.doordash.com/";

const PAN_PRICES = {
  small: 45,
  medium: 65,
  large: 100,
};

const PROTEIN_PRICES = {
  chicken: {
    small: 8,
    medium: 14,
    large: 20,
  },
  shrimp: {
    small: 12,
    medium: 20,
    large: 30,
  },
  beef: {
    small: 10,
    medium: 17,
    large: 24,
  },
  mixed: {
    small: 18,
    medium: 30,
    large: 42,
  },
};

const PROTEIN_OPTIONS = [
  {
    key: "chicken",
    label: "Chicken",
  },
  {
    key: "shrimp",
    label: "Shrimp",
  },
  {
    key: "beef",
    label: "Beef",
  },
  {
    key: "mixed",
    label: "Mixed Protein",
  },
];

const SPICE_LEVELS = ["Mild", "Medium", "Hot"];

const ALLERGY_OPTIONS = [
  "None",
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Egg",
  "Shellfish",
  "Soy",
  "Other",
];

const EVENT_OPTIONS = [
  "Birthday",
  "Wedding",
  "Graduation",
  "Baby Shower",
  "Corporate Event",
  "Other",
];

const SERVICE_OPTIONS = [
  {
    value: "delivery",
    label: "Weekend Delivery",
    description: "Food delivered on Saturday or Sunday.",
    icon: Truck,
  },
  {
    value: "pickup",
    label: "Self Pickup",
    description: "Collect your order from us.",
    icon: Store,
  },
  {
    value: "late",
    label: "Express / Late Order",
    description: "For orders with less than 7 days' notice.",
    icon: Clock3,
  },
];

const createInitialFormData = () => ({
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
});

const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTodayDate = () => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return formatDateForInput(date);
};

const getMinimumBookingDate = () => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 7);

  return formatDateForInput(date);
};

const isWeekendDate = (dateString) => {
  if (!dateString) {
    return false;
  }

  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDay();

  return day === 0 || day === 6;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const ContactSection = () => {
  const [formData, setFormData] = useState(createInitialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [alertModal, setAlertModal] = useState({
    open: false,
    type: "error",
    message: "",
  });

  const todayDate = useMemo(() => getTodayDate(), []);

  const minimumBookingDate = useMemo(
    () => getMinimumBookingDate(),
    []
  );

  const totalPans = useMemo(() => {
    return (
      Number(formData.smallPans || 0) +
      Number(formData.mediumPans || 0) +
      Number(formData.largePans || 0)
    );
  }, [
    formData.smallPans,
    formData.mediumPans,
    formData.largePans,
  ]);

  const panSubtotal = useMemo(() => {
    return (
      Number(formData.smallPans || 0) * PAN_PRICES.small +
      Number(formData.mediumPans || 0) * PAN_PRICES.medium +
      Number(formData.largePans || 0) * PAN_PRICES.large
    );
  }, [
    formData.smallPans,
    formData.mediumPans,
    formData.largePans,
  ]);

  const proteinTotal = useMemo(() => {
    let total = 0;

    PROTEIN_OPTIONS.forEach(({ key }) => {
      const selectedSize = formData[`${key}Size`];

      if (!selectedSize) {
        return;
      }

      total += PROTEIN_PRICES[key][selectedSize] || 0;
    });

    return total;
  }, [
    formData.chickenSize,
    formData.shrimpSize,
    formData.beefSize,
    formData.mixedSize,
  ]);

  const estimatedTotal = panSubtotal + proteinTotal;

  const showAlertModal = (message, type = "error") => {
    setAlertModal({
      open: true,
      type,
      message,
    });
  };

  const closeAlertModal = () => {
    setAlertModal({
      open: false,
      type: "error",
      message: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updatedData = {
        ...previous,
        [name]: value,
      };

      if (name === "serviceOption") {
        updatedData.deliveryPlatform =
          value === "delivery"
            ? previous.deliveryPlatform
            : "";
      }

      return updatedData;
    });

    if (name === "eventDate") {
      setIsSuccess(false);
    }
  };

  const handlePanChange = (size, value) => {
    const numericValue = Math.max(
      0,
      Number.parseInt(value, 10) || 0
    );

    setFormData((previous) => ({
      ...previous,
      [`${size}Pans`]: numericValue,
    }));
  };

  const handleProteinChange = (protein, size) => {
    setFormData((previous) => ({
      ...previous,
      [`${protein}Size`]: size,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!formData.eventType) {
      return "Please select an event type.";
    }

    if (!formData.eventDate) {
      return "Please select the date you want your food delivered.";
    }

    if (!isWeekendDate(formData.eventDate)) {
      return "Please choose a Saturday or Sunday for your food delivery date. You can book your order ahead of time on any day.";
    }

    if (
      formData.eventDate < minimumBookingDate &&
      formData.serviceOption !== "late"
    ) {
      return "Standard orders require at least 7 days' notice. Please choose a weekend date at least 7 days from today, or select Express / Late Order.";
    }

    if (totalPans < 1) {
      return "Please select at least one pan.";
    }

    if (!formData.spiceLevel) {
      return "Please select your preferred spice level.";
    }

    if (!formData.serviceOption) {
      return "Please select delivery, pickup, or express/late order.";
    }

    if (
      formData.serviceOption === "delivery" &&
      !formData.deliveryPlatform
    ) {
      return "Please select your preferred delivery platform.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showAlertModal(validationError, "error");
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const payload = {
        ...formData,

        smallPans: Number(formData.smallPans || 0),
        mediumPans: Number(formData.mediumPans || 0),
        largePans: Number(formData.largePans || 0),

        totalPans,
        panSubtotal,
        proteinTotal,
        estimatedTotal,

        eventDateDisplay: formatDisplayDate(
          formData.eventDate
        ),
      };

      const response = await fetch(
        `${API_URL}/api/contact/quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "We couldn't send your quote request. Please try again."
        );
      }

      setFormData(createInitialFormData());
      setIsSuccess(true);

      showAlertModal(
        "Your quote request has been sent successfully. We’ll review your order and get back to you shortly.",
        "success"
      );
    } catch (error) {
      const errorMessage =
        error.message ||
        "We couldn't send your request. Please try again.";

      showAlertModal(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <AlertModal
          open={alertModal.open}
          type={alertModal.type}
          message={alertModal.message}
          onClose={closeAlertModal}
        />

        <section
          className="contact-section"
          id="contact"
        >
          <div className="contact-container">
            <motion.div
              className="contact-success"
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div className="success-icon">
                <PackageCheck size={34} />
              </div>

              <span className="contact-eyebrow">
                Request Received
              </span>

              <h2>
                Thank You for Choosing{" "}
                <span>Ify’s</span>
              </h2>

              <p>
                Your quote request has been received. We’ll
                review your order details and contact you
                shortly.
              </p>

              <button
                type="button"
                className="contact-reset-button"
                onClick={() => {
                  setIsSuccess(false);
                  closeAlertModal();
                }}
              >
                Submit Another Request
              </button>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <AlertModal
        open={alertModal.open}
        type={alertModal.type}
        message={alertModal.message}
        onClose={closeAlertModal}
      />

      <section
        className="contact-section"
        id="contact"
      >
        <div className="contact-container">
          <motion.div
            className="contact-heading"
            initial={{
              opacity: 0,
              y: 30,
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
              duration: 0.7,
            }}
          >
            <span className="contact-eyebrow">
              Let’s Make It Delicious
            </span>

            <h2>
              Request a{" "}
              <span>Quote</span>
            </h2>

            <p>
              Tell us about your event and order
              requirements. We’ll review everything and
              get back to you with your quote.
            </p>
          </motion.div>

          <motion.div
            className="contact-layout"
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
          >
            <div className="contact-info">
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MessageCircle size={22} />
                </div>

                <div>
                  <span>Need Help?</span>
                  <h3>Let’s Talk About Your Event</h3>
                  <p>
                    Whether it’s a birthday, wedding,
                    graduation, corporate gathering or
                    something special, we’re happy to help
                    you plan the right quantity.
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <span>Booking Notice</span>
                  <h3>Plan Ahead</h3>
                  <p>
                    Standard orders require at least 7
                    days’ notice. Express / Late Orders
                    may be requested for shorter notice.
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Truck size={22} />
                </div>

                <div>
                  <span>Weekend Delivery</span>
                  <h3>Saturday & Sunday</h3>
                  <p>
                    Food delivery is scheduled for
                    weekends. You can submit your booking
                    request ahead of time on any day.
                  </p>
                </div>
              </div>

              <div className="delivery-platforms">
                <span>Order Through</span>

                <div className="platform-links">
                  <a
                    href={UBER_EATS_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Uber Eats
                    <ExternalLink size={14} />
                  </a>

                  <a
                    href={DOORDASH_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    DoorDash
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-section">
                <div className="form-section-heading">
                  <span>01</span>

                  <div>
                    <h3>Your Details</h3>
                    <p>
                      Tell us how we can reach you.
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="080..."
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="eventType">
                      Event Type
                    </label>

                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select event type
                      </option>

                      {EVENT_OPTIONS.map((eventType) => (
                        <option
                          key={eventType}
                          value={eventType}
                        >
                          {eventType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>02</span>

                  <div>
                    <h3>Delivery Date</h3>
                    <p>
                      Select the weekend date you want your
                      food delivered.
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="eventDate">
                      Food Delivery Date
                    </label>

                    <input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      min={
                        formData.serviceOption === "late"
                          ? todayDate
                          : minimumBookingDate
                      }
                      onChange={handleChange}
                    />

                    <small className="field-note">
                      Food delivery is available on
                      Saturdays and Sundays. Standard orders
                      require 7 days’ notice.
                    </small>
                  </div>

                  <div className="form-field">
                    <label htmlFor="location">
                      Delivery / Event Location
                    </label>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Where should we deliver?"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>03</span>

                  <div>
                    <h3>Choose Your Pans</h3>
                    <p>
                      Select how many pans of each size you
                      need.
                    </p>
                  </div>
                </div>

                <div className="pan-selection-grid">
                  <div className="pan-card">
                    <div>
                      <span className="pan-size">
                        Small
                      </span>

                      <strong>
                        ${PAN_PRICES.small}
                      </strong>
                    </div>

                    <input
                      type="number"
                      min="0"
                      value={formData.smallPans}
                      onChange={(event) =>
                        handlePanChange(
                          "small",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="pan-card">
                    <div>
                      <span className="pan-size">
                        Medium
                      </span>

                      <strong>
                        ${PAN_PRICES.medium}
                      </strong>
                    </div>

                    <input
                      type="number"
                      min="0"
                      value={formData.mediumPans}
                      onChange={(event) =>
                        handlePanChange(
                          "medium",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="pan-card">
                    <div>
                      <span className="pan-size">
                        Large
                      </span>

                      <strong>
                        ${PAN_PRICES.large}
                      </strong>
                    </div>

                    <input
                      type="number"
                      min="0"
                      value={formData.largePans}
                      onChange={(event) =>
                        handlePanChange(
                          "large",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>04</span>

                  <div>
                    <h3>Add Your Protein</h3>
                    <p>
                      Choose the protein size you want with
                      your order.
                    </p>
                  </div>
                </div>

                <div className="protein-selection">
                  {PROTEIN_OPTIONS.map(
                    ({ key, label }) => (
                      <div
                        className="protein-row"
                        key={key}
                      >
                        <div className="protein-name">
                          <span>{label}</span>
                        </div>

                        <div className="protein-options">
                          {[
                            "small",
                            "medium",
                            "large",
                          ].map((size) => (
                            <label
                              className="protein-option"
                              key={size}
                            >
                              <input
                                type="radio"
                                name={`${key}Size`}
                                value={size}
                                checked={
                                  formData[
                                    `${key}Size`
                                  ] === size
                                }
                                onChange={() =>
                                  handleProteinChange(
                                    key,
                                    size
                                  )
                                }
                              />

                              <span>
                                {size
                                  .charAt(0)
                                  .toUpperCase() +
                                  size.slice(1)}
                                {" +$"}
                                {
                                  PROTEIN_PRICES[key][
                                    size
                                  ]
                                }
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>05</span>

                  <div>
                    <h3>Flavor & Dietary Needs</h3>
                    <p>
                      Help us prepare your order exactly
                      how you like it.
                    </p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="spiceLevel">
                      Spice Level
                    </label>

                    <select
                      id="spiceLevel"
                      name="spiceLevel"
                      value={formData.spiceLevel}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select spice level
                      </option>

                      {SPICE_LEVELS.map((level) => (
                        <option
                          key={level}
                          value={level}
                        >
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="allergy">
                      Allergies
                    </label>

                    <select
                      id="allergy"
                      name="allergy"
                      value={formData.allergy}
                      onChange={handleChange}
                    >
                      {ALLERGY_OPTIONS.map((allergy) => (
                        <option
                          key={allergy}
                          value={allergy}
                        >
                          {allergy}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field form-field-full">
                    <label htmlFor="excludedIngredients">
                      Ingredients to Exclude
                    </label>

                    <input
                      id="excludedIngredients"
                      name="excludedIngredients"
                      type="text"
                      value={
                        formData.excludedIngredients
                      }
                      onChange={handleChange}
                      placeholder="Anything else we should leave out?"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>06</span>

                  <div>
                    <h3>Delivery Method</h3>
                    <p>
                      Choose how you would like to receive
                      your order.
                    </p>
                  </div>
                </div>

                <div className="service-options">
                  {SERVICE_OPTIONS.map(
                    ({
                      value,
                      label,
                      description,
                      icon: Icon,
                    }) => (
                      <label
                        className={`service-option ${
                          formData.serviceOption === value
                            ? "service-option-active"
                            : ""
                        }`}
                        key={value}
                      >
                        <input
                          type="radio"
                          name="serviceOption"
                          value={value}
                          checked={
                            formData.serviceOption ===
                            value
                          }
                          onChange={handleChange}
                        />

                        <span className="service-icon">
                          <Icon size={20} />
                        </span>

                        <span className="service-copy">
                          <strong>{label}</strong>
                          <small>{description}</small>
                        </span>
                      </label>
                    )
                  )}
                </div>

                {formData.serviceOption ===
                  "delivery" && (
                  <motion.div
                    className="delivery-platform-field"
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                  >
                    <label htmlFor="deliveryPlatform">
                      Preferred Delivery Platform
                    </label>

                    <select
                      id="deliveryPlatform"
                      name="deliveryPlatform"
                      value={formData.deliveryPlatform}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select delivery platform
                      </option>

                      <option value="Uber Eats">
                        Uber Eats
                      </option>

                      <option value="DoorDash">
                        DoorDash
                      </option>
                    </select>
                  </motion.div>
                )}
              </div>

              <div className="form-section">
                <div className="form-section-heading">
                  <span>07</span>

                  <div>
                    <h3>Anything Else?</h3>
                    <p>
                      Add any additional information about
                      your order or event.
                    </p>
                  </div>
                </div>

                <div className="form-field form-field-full">
                  <label htmlFor="message">
                    Additional Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us anything else we should know..."
                  />
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-heading">
                  <span>Order Summary</span>

                  <strong>
                    {totalPans}{" "}
                    {totalPans === 1 ? "Pan" : "Pans"}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Pan Subtotal</span>

                  <strong>
                    ${panSubtotal.toFixed(2)}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Protein Add-ons</span>

                  <strong>
                    ${proteinTotal.toFixed(2)}
                  </strong>
                </div>

                <div className="summary-total">
                  <span>Estimated Total</span>

                  <strong>
                    ${estimatedTotal.toFixed(2)}
                  </strong>
                </div>

                <p className="summary-note">
                  Final pricing may vary depending on your
                  confirmed order requirements.
                </p>
              </div>

              <button
                type="submit"
                className="contact-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="submit-spinner"
                    />

                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Request My Quote
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;