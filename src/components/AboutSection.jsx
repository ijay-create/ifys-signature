import React from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

import aboutRice from "../assets/images/about-fried-rice.jpg";
import "../styles/AboutSection.css";

const contactDetails = [
  {
    icon: Phone,
    label: "Call or Text",
    value: "617-650-0061",
    href: "tel:+16176500061",
  },
  {
    icon: Mail,
    label: "Email",
    value: "nwabaraifunanya3@gmail.com",
    href: "mailto:nwabaraifunanya3@gmail.com",
  },
];

const instagramUrl =
  "https://www.instagram.com/ifys_signature_fried_rice?stkn=MW0xdmZvZng0cGx3cA==";

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-background-circle about-circle-one" />

      <div className="about-background-circle about-circle-two" />

      <div className="about-container">
        <motion.div
          className="about-copy"
          initial={{
            opacity: 0,
            x: -60,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
        >
          <span className="section-label">
            ABOUT ME
          </span>

          <h2>
            Hi, I'm
            <span> Ify!</span>
          </h2>

          <div className="about-title-line" />

          <p>
            I'm passionate about good food and bringing
            people together around a great meal. Ify's
            Signature Fried Rice was created from a love
            of bold flavors, fresh ingredients, and the
            joy of sharing good food.
          </p>

          <p>
            Whether it's a quiet dinner at home or a big
            celebration, I'm here to make your event
            delicious, memorable, and stress-free.
          </p>

          <div className="about-highlight">
            <span className="about-highlight-mark">
              “
            </span>

            <p>
              Good food. Happy people.
              <br />
              That's the goal! <span>♡</span>
            </p>
          </div>

          <div className="about-mini-details">
            <div>
              <strong>Fresh</strong>
              <span>Ingredients</span>
            </div>

            <div>
              <strong>Bold</strong>
              <span>Flavors</span>
            </div>

            <div>
              <strong>Made</strong>
              <span>With Love</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="about-image-wrap"
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
        >
          <div className="about-image-decoration about-decoration-one" />

          <div className="about-image-decoration about-decoration-two" />

          <Sparkles
            className="sparkle sparkle-one"
            size={25}
            strokeWidth={1.5}
          />

          <div className="about-image-frame">
            <img
              src={aboutRice}
              alt="Colorful fried rice with shrimp and vegetables"
            />

            <div className="about-image-overlay" />

            <div className="about-image-caption">
              <span>Made fresh</span>

              <strong>With love ♡</strong>
            </div>
          </div>

          <Sparkles
            className="sparkle sparkle-two"
            size={20}
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.aside
          className="contact-card"
          initial={{
            opacity: 0,
            x: 60,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
        >
          <div className="contact-bar" />

          <div className="contact-content">
            <span className="contact-eyebrow">
              GET IN TOUCH
            </span>

            <h3>Let's Connect</h3>

            <p className="contact-intro">
              Have a question, planning an event, or
              simply want to order some delicious fried
              rice? I'd love to hear from you.
            </p>

            <div className="contact-list">
              {contactDetails.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    href={item.href}
                    className="contact-item"
                    key={item.label}
                  >
                    <span className="contact-icon">
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    <span className="contact-item-copy">
                      <small>{item.label}</small>

                      <strong>{item.value}</strong>
                    </span>
                  </a>
                );
              })}

              <div className="contact-item contact-location">
                <span className="contact-icon">
                  <MapPin
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="contact-item-copy">
                  <small>Location</small>

                  <strong>
                    Haverhill, MA 01835
                  </strong>
                </span>
              </div>
            </div>

            <div className="contact-divider" />

            <div className="social-section">
              <span>FOLLOW ALONG</span>

              <div className="socials">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram
                    size={18}
                    strokeWidth={1.8}
                  />
                </a>

                <a
                  href="#"
                  aria-label="TikTok"
                  className="tiktok-icon"
                >
                  ♪
                </a>
              </div>
            </div>

            <p className="contact-footer-text">
              Follow for updates and special offers! ♡
            </p>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default AboutSection;