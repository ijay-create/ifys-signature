import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChefHat,
  ChevronDown,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";

import "../styles/Navbar.css";

const links = [
  ["Home", "home"],
  ["Order Fried Rice", "order"],
  ["Book Me", "events"],
  ["Menu & Pricing", "order"],
  ["About", "about"],
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (!section) {
      console.error(`Section #${id} does not exist.`);
      return;
    }

    setIsOpen(false);
    setActive(id);

    const navbarHeight =
      window.innerWidth <= 480 ? 70 : 74;

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: Math.max(0, sectionTop - navbarHeight),
      behavior: "smooth",
    });

    window.history.replaceState(
      null,
      "",
      `/#${id}`
    );
  };

  const handleContactClick = () => {
    const contact = document.querySelector(
      "#contact.contact-section"
    );

    if (!contact) {
      console.error(
        "ContactSection not found. Expected <section id='contact' class='contact-section'>."
      );
      return;
    }

    setIsOpen(false);
    setActive("contact");

    const navbarHeight =
      window.innerWidth <= 480 ? 70 : 74;

    const contactTop =
      contact.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: Math.max(0, contactTop - navbarHeight),
      behavior: "smooth",
    });

    window.history.replaceState(
      null,
      "",
      "/#contact"
    );
  };

  const handleHashChange = () => {
    const hash = window.location.hash;

    if (!hash) {
      return;
    }

    const id = hash.substring(1);

    const section = document.getElementById(id);

    if (!section) {
      return;
    }

    setActive(id);

    const navbarHeight =
      window.innerWidth <= 480 ? 70 : 74;

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: Math.max(0, sectionTop - navbarHeight),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      const sections = [
        "home",
        "order",
        "events",
        "about",
        "contact",
      ];

      const currentPosition =
        window.scrollY + 180;

      let currentSection = "home";

      sections.forEach((id) => {
        const section =
          document.getElementById(id);

        if (!section) {
          return;
        }

        const sectionTop =
          section.getBoundingClientRect().top +
          window.scrollY;

        if (currentPosition >= sectionTop) {
          currentSection = id;
        }
      });

      setActive(currentSection);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "hashchange",
      handleHashChange
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "hashchange",
        handleHashChange
      );
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = (id) => {
    scrollToSection(id);
  };

  return (
    <>
      <motion.header
        className={`navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="nav-inner">
          <motion.button
            className="brand"
            type="button"
            onClick={() =>
              handleLinkClick("home")
            }
            aria-label="Go to home"
            whileTap={{ scale: 0.97 }}
          >
            <span className="brand-logo">
              <span className="brand-name-wrap">
                <ChefHat
                  className="brand-chef"
                  size={19}
                  strokeWidth={1.8}
                />

                <span className="brand-script">
                  Ify's
                </span>
              </span>

              <span className="brand-title">
                <span className="brand-title-signature">
                  SIGNATURE
                </span>

                <span className="brand-title-rice">
                  FRIED RICE
                </span>
              </span>
            </span>
          </motion.button>

          <nav
            className="desktop-nav"
            aria-label="Main navigation"
          >
            {links.map(([label, id]) => (
              <button
                key={`${label}-${id}`}
                type="button"
                className={`nav-link ${
                  active === id ? "active" : ""
                }`}
                onClick={() =>
                  handleLinkClick(id)
                }
              >
                {label}
              </button>
            ))}

            {/* CONTACT IS INTENTIONALLY A REAL ANCHOR */}
            <a
              href="#contact"
              className={`nav-link ${
                active === "contact" ? "active" : ""
              }`}
              onClick={(event) => {
                event.preventDefault();
                handleContactClick();
              }}
            >
              Contact
            </a>
          </nav>

          <motion.button
            type="button"
            className="nav-order"
            onClick={() =>
              handleLinkClick("order")
            }
            aria-label="Order fried rice"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingCart
              size={17}
              strokeWidth={2}
            />

            <span>Order Now</span>
          </motion.button>

          <button
            type="button"
            className={`menu-toggle ${
              isOpen ? "menu-toggle-open" : ""
            }`}
            onClick={() =>
              setIsOpen((value) => !value)
            }
            aria-label={
              isOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? (
              <X
                size={25}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={25}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              className="mobile-nav-wrapper"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.28,
                ease: "easeOut",
              }}
            >
              <nav
                className="mobile-nav"
                aria-label="Mobile navigation"
              >
                {links.map(
                  ([label, id], index) => (
                    <motion.button
                      key={`${label}-${id}-mobile`}
                      type="button"
                      className={`mobile-nav-link ${
                        active === id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        handleLinkClick(id)
                      }
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.035,
                        duration: 0.2,
                      }}
                    >
                      <span>{label}</span>

                      {active === id && (
                        <span className="mobile-active-dot" />
                      )}
                    </motion.button>
                  )
                )}

                {/* CONTACT MOBILE */}
                <a
                  href="#contact"
                  className={`mobile-nav-link ${
                    active === "contact"
                      ? "active"
                      : ""
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    handleContactClick();
                  }}
                >
                  <span>Contact</span>

                  {active === "contact" && (
                    <span className="mobile-active-dot" />
                  )}
                </a>

                <motion.button
                  type="button"
                  className="mobile-order"
                  onClick={() =>
                    handleLinkClick("order")
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart
                    size={17}
                    strokeWidth={2}
                  />

                  <span>
                    Order Fried Rice
                  </span>

                  <ChevronDown
                    className="mobile-order-arrow"
                    size={16}
                  />
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div
        className="navbar-spacer"
        aria-hidden="true"
      />
    </>
  );
};

export default Navbar;