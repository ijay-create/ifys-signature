import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Send,
} from "lucide-react";

import "../styles/ContactSection.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const eventOptions = [
  "Birthday",
  "Wedding",
  "Graduation",
  "Baby Shower",
  "Corporate Event",
  "Other",
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  guests: "",
  location: "",
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
        mappedEvent,
      )
        ? mappedEvent
        : "Other",
    }));

    setIsSubmitted(false);
    setErrorMessage("");
  }, [selectedEvent]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSending) {
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
          body: JSON.stringify(formData),
        },
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to send your request.",
        );
      }

      setIsSubmitted(true);
      setFormData(initialForm);
    } catch (error) {
      console.error(
        "QUOTE REQUEST ERROR:",
        error,
      );

      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again.",
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
            INTRO
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
            REQUEST A QUOTE
          </span>

          <h2>
            Planning something
            <span> special?</span>
          </h2>

          <p>
            Tell us about your event and let
            us prepare a personalized quote
            for your fried rice catering
            needs.
          </p>

          <div className="contact-note">
            <span className="contact-note-line" />

            <p>
              Whether it's an intimate
              celebration or a large gathering,
              we're ready to make your event
              deliciously memorable.
            </p>
          </div>
        </motion.div>

        {/* ========================================
            FORM
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
                We've received your quote
                request. We'll review your
                event details and get back to
                you shortly.
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
                  LET'S PLAN IT
                </span>

                <h3>
                  Tell us about your event
                </h3>
              </div>

              {/* ERROR MESSAGE */}

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

              <div className="quote-form-grid">
                {/* NAME */}

                <div className="form-field">
                  <label htmlFor="name">
                    Full Name{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your full name"
                    required
                    disabled={isSending}
                  />
                </div>

                {/* EMAIL */}

                <div className="form-field">
                  <label htmlFor="email">
                    Email Address{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    required
                    disabled={isSending}
                  />
                </div>

                {/* PHONE */}

                <div className="form-field">
                  <label htmlFor="phone">
                    Phone Number{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your phone number"
                    required
                    disabled={isSending}
                  />
                </div>

                {/* EVENT TYPE */}

                <div className="form-field">
                  <label htmlFor="eventType">
                    Event Type{" "}
                    <span>*</span>
                  </label>

                  <select
                    id="eventType"
                    name="eventType"
                    value={
                      formData.eventType
                    }
                    onChange={
                      handleChange
                    }
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
                      ),
                    )}
                  </select>
                </div>

                {/* EVENT DATE */}

                <div className="form-field">
                  <label htmlFor="eventDate">
                    Event Date{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={
                      formData.eventDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                    disabled={isSending}
                  />
                </div>

                {/* GUESTS */}

                <div className="form-field">
                  <label htmlFor="guests">
                    Number of Guests{" "}
                    <span>*</span>
                  </label>

                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    value={
                      formData.guests
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 50"
                    required
                    disabled={isSending}
                  />
                </div>

                {/* LOCATION */}

                <div className="form-field form-field-full">
                  <label htmlFor="location">
                    Event Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Where will your event take place?"
                    disabled={isSending}
                  />
                </div>

                {/* MESSAGE */}

                <div className="form-field form-field-full">
                  <label htmlFor="message">
                    Additional Details
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={
                      formData.message
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Tell us anything else we should know about your event..."
                    disabled={isSending}
                  />
                </div>
              </div>

              {/* SUBMIT */}

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
                quote request.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;