import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChefHat,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

import "../styles/Hero.css";

import heroBg from "../assets/images/hero-bg.jpg";
import heroPan from "../assets/images/hero-foil-pan.jpg";

const Hero = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    section?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="hero"
      id="home"
      style={{
        backgroundImage: `url(${heroBg})`,
      }}
    >
      <div className="hero-overlay" />

      <div className="hero-inner">
        {/* LEFT CONTENT */}
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          {/* BRAND */}
          <motion.div
            className="hero-brand"
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            {/* IFY'S */}
            <div className="hero-brand-name">
              <ChefHat
                className="hero-chef-icon"
                size={27}
                strokeWidth={1.8}
              />

              <span>Ify's</span>
            </div>

            {/* SIGNATURE FRIED RICE */}
            <div className="hero-brand-title">
              <strong className="hero-brand-signature">
                SIGNATURE
              </strong>

              <strong className="hero-brand-rice">
                FRIED RICE
              </strong>
            </div>
          </motion.div>

          {/* TAGLINE */}
          <motion.div
            className="hero-tagline"
            initial={{
              opacity: 0,
              x: -35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: "easeOut",
            }}
          >
            Fresh. Flavorful. Made for your table.
          </motion.div>

          {/* DESCRIPTION */}
          <motion.p
            className="hero-description"
            initial={{
              opacity: 0,
              x: -35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: "easeOut",
            }}
          >
            Homemade fried rice made with quality ingredients
            and bold flavors. Perfect for individuals, families,
            events, and every occasion.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            className="hero-actions"
            initial={{
              opacity: 0,
              x: -35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              ease: "easeOut",
            }}
          >
            <motion.button
              type="button"
              className="hero-button hero-button-primary"
              onClick={() => scrollToSection("order")}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingCart
                size={18}
                strokeWidth={2}
              />

              <span>Order Fried Rice</span>

              <ChevronRight
                size={17}
                strokeWidth={2.5}
              />
            </motion.button>

            <motion.button
              type="button"
              className="hero-button hero-button-secondary"
              onClick={() => scrollToSection("events")}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <CalendarDays
                size={18}
                strokeWidth={2}
              />

              <span>Book Me for Your Event</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="hero-visual"
          initial={{
            opacity: 0,
            x: 50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <div className="hero-image-frame">
            <motion.img
              src={heroPan}
              alt="Ify's Signature Fried Rice served in a foil pan"
              initial={{
                scale: 1.04,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: 1.1,
                ease: "easeOut",
              }}
            />

            <div className="hero-image-shade" />

            <motion.div
              className="hero-image-message"
              initial={{
                opacity: 0,
                y: -15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.8,
                ease: "easeOut",
              }}
            >
              Good Food
              <br />
              Brings People Together
              <span>♡</span>
            </motion.div>
          </div>

          {/* GOLD ACCENT */}
          <motion.div
            className="hero-image-accent"
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.7,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;