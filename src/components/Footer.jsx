import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ChefHat,
  Clock3,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import "../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [newsletterEmail, setNewsletterEmail] =
    useState("");

  const [newsletterStatus, setNewsletterStatus] =
    useState("");

  const [newsletterMessage, setNewsletterMessage] =
    useState("");

  const [
    isNewsletterSubmitting,
    setIsNewsletterSubmitting,
  ] = useState(false);

  const instagramUrl =
    "https://www.instagram.com/ifys_signature_fried_rice?stkn=MW0xdmZvZng0cGx3cA==";

  const quickLinks = [
    ["Home", "home"],
    ["About Me", "about"],
    ["Menu & Pricing", "order"],
    ["Order Fried Rice", "order"],
    ["Book Me", "events"],
    ["Contact", "contact"],
  ];

  const serviceLinks = [
    ["Individual Orders", "order"],
    ["Family Meals", "order"],
    ["Birthday Catering", "events"],
    ["Wedding Catering", "events"],
    ["Corporate Events", "events"],
    ["Custom Orders", "events"],
  ];

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();

    if (isNewsletterSubmitting) {
      return;
    }

    const email = newsletterEmail.trim();

    if (!email) {
      setNewsletterStatus("error");
      setNewsletterMessage(
        "Please enter your email address.",
      );
      return;
    }

    try {
      setIsNewsletterSubmitting(true);
      setNewsletterStatus("");
      setNewsletterMessage("");

      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Newsletter server returned an unexpected response (${response.status}).`,
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to subscribe right now.",
        );
      }

      setNewsletterStatus("success");
      setNewsletterMessage(
        "You're subscribed! We'll keep you updated.",
      );

      setNewsletterEmail("");
    } catch (error) {
      console.error(
        "NEWSLETTER SUBSCRIPTION ERROR:",
        error,
      );

      setNewsletterStatus("error");
      setNewsletterMessage(
        error.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <motion.div
        className="footer-cta"
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
          amount: 0.2,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <div className="footer-cta-content">
          <span className="footer-cta-eyebrow">
            <Sparkles
              size={16}
              strokeWidth={1.8}
            />

            GOOD FOOD STARTS HERE
          </span>

          <h2>
            Ready to make your
            <span> table delicious?</span>
          </h2>

          <p>
            Whether you're feeding your family,
            celebrating a special occasion, or
            planning a big event, let's make it
            flavorful.
          </p>
        </div>

        <div className="footer-cta-actions">
          <motion.button
            type="button"
            className="footer-primary-button"
            onClick={() => go("order")}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Order Fried Rice
          </motion.button>

          <motion.button
            type="button"
            className="footer-secondary-button"
            onClick={() => go("events")}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Me for Your Event
          </motion.button>
        </div>
      </motion.div>

      <div className="footer-main">
        <div className="footer-grid">
          <motion.div
            className="footer-brand-column"
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <button
              type="button"
              className="footer-brand"
              onClick={() => go("home")}
              aria-label="Go to homepage"
            >
              <div className="footer-brand-logo">
                <div className="footer-brand-ify">
                  <ChefHat
                    className="footer-brand-chef"
                    size={27}
                    strokeWidth={1.7}
                  />

                  <span>Ify's</span>
                </div>

                <div className="footer-brand-title">
                  <span className="footer-brand-signature">
                    SIGNATURE
                  </span>

                  <span className="footer-brand-rice">
                    FRIED RICE
                  </span>

                  <span className="footer-brand-curve" />
                </div>
              </div>
            </button>

            <p className="footer-description">
              Homemade fried rice made with fresh
              ingredients, bold flavors, and plenty
              of love. Made for everyday meals,
              family gatherings, celebrations, and
              unforgettable moments.
            </p>

            <div className="footer-socials">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Ify's Signature Fried Rice on Instagram"
                className="footer-social"
              >
                <Instagram
                  size={19}
                  strokeWidth={1.8}
                />
              </a>

              <a
                href="#"
                aria-label="TikTok"
                className="footer-social footer-tiktok"
              >
                ♪
              </a>

              <a
                href="mailto:nwabaraifunanya3@gmail.com"
                aria-label="Email"
                className="footer-social"
              >
                <Mail
                  size={19}
                  strokeWidth={1.8}
                />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="footer-column"
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <h3>Quick Links</h3>

            <nav className="footer-links">
              {quickLinks.map(([label, id]) => (
                <button
                  type="button"
                  key={`${label}-${id}`}
                  onClick={() => go(id)}
                >
                  <span>→</span>
                  {label}
                </button>
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="footer-column"
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            <h3>What I Offer</h3>

            <nav className="footer-links">
              {serviceLinks.map(([label, id]) => (
                <button
                  type="button"
                  key={`${label}-${id}`}
                  onClick={() => go(id)}
                >
                  <span>→</span>
                  {label}
                </button>
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="footer-column footer-contact-column"
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
          >
            <h3>Let's Connect</h3>

            <div className="footer-contact-list">
              <a href="tel:+16176500061">
                <span className="contact-icon">
                  <Phone
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="footer-contact-text">
                  <small>Call Me</small>
                  617-650-0061
                </span>
              </a>

              <a href="mailto:nwabaraifunanya3@gmail.com">
                <span className="contact-icon">
                  <Mail
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="footer-contact-text">
                  <small>Email Me</small>
                  nwabaraifunanya3@gmail.com
                </span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-item"
                aria-label="Visit Ify's Signature Fried Rice on Instagram"
              >
                <span className="contact-icon">
                  <Instagram
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="footer-contact-text">
                  <small>Follow Me</small>
                  @ifys_signature_fried_rice
                </span>
              </a>

              <div className="footer-contact-item">
                <span className="contact-icon">
                  <MapPin
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="footer-contact-text">
                  <small>Based In</small>
                  Haverhill, MA 01835
                </span>
              </div>

              <div className="footer-contact-item">
                <span className="contact-icon">
                  <Clock3
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="footer-contact-text">
                  <small>Order Hours</small>
                  By appointment
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="footer-newsletter"
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
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            delay: 0.35,
          }}
        >
          <div className="newsletter-copy">
            <span className="newsletter-icon">
              <Mail
                size={20}
                strokeWidth={1.7}
              />
            </span>

            <div>
              <h3>Stay in the loop</h3>

              <p>
                Get updates, special offers, new
                menu options, and event availability.
              </p>
            </div>
          </div>

          <form
            className="newsletter-form"
            onSubmit={handleNewsletterSubmit}
          >
            <label
              htmlFor="footer-email"
              className="sr-only"
            >
              Email address
            </label>

            <input
              id="footer-email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={newsletterEmail}
              onChange={(event) => {
                setNewsletterEmail(
                  event.target.value,
                );

                if (newsletterStatus) {
                  setNewsletterStatus("");
                  setNewsletterMessage("");
                }
              }}
              disabled={isNewsletterSubmitting}
              required
            />

            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              disabled={isNewsletterSubmitting}
            >
              <span>
                {isNewsletterSubmitting
                  ? "Subscribing..."
                  : "Subscribe"}
              </span>

              <Send
                size={17}
                strokeWidth={1.8}
              />
            </button>
          </form>

          {newsletterMessage && (
            <motion.p
              className={`newsletter-message ${
                newsletterStatus === "success"
                  ? "success"
                  : "error"
              }`}
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              {newsletterMessage}
            </motion.p>
          )}
        </motion.div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            © {currentYear} Ify's Signature Fried
            Rice. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <button type="button">
              Privacy Policy
            </button>

            <span>•</span>

            <button type="button">
              Terms &amp; Conditions
            </button>
          </div>

          <motion.button
            type="button"
            className="back-top"
            onClick={() => go("home")}
            aria-label="Back to top"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Back to top</span>

            <ArrowUp
              size={17}
              strokeWidth={1.8}
            />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;