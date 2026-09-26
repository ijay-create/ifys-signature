import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Baby,
  Cake,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Heart,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import eventLeft from "../assets/images/event-left.jpg";
import eventRight from "../assets/images/event-right.jpg";
import eventsBg from "../assets/images/events-bg.jpg";

import "../styles/EventsSection.css";

const events = [
  {
    icon: Cake,
    title: "Birthdays",
    description:
      "Make their special day even more memorable.",
  },
  {
    icon: Heart,
    title: "Weddings",
    description:
      "A delicious addition to your beautiful celebration.",
  },
  {
    icon: GraduationCap,
    title: "Graduations",
    description:
      "Celebrate every milestone with great food.",
  },
  {
    icon: Baby,
    title: "Baby Showers",
    description:
      "Warm, flavorful food for your special gathering.",
  },
  {
    icon: Users,
    title: "Corporate Events",
    description:
      "Feed your team, guests, clients, and colleagues.",
  },
  {
    icon: Sparkles,
    title: "And More!",
    description:
      "Tell us about your event and let's make it work.",
  },
];

const bookingDetails = [
  {
    icon: Users,
    text: "Small & large gatherings",
  },
  {
    icon: Clock3,
    text: "Freshly prepared for your event",
  },
  {
    icon: MapPin,
    text: "Flexible event arrangements",
  },
];

const EventsSection = ({ onEventSelect }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  /*
   * ---------------------------------------------
   * GO DIRECTLY TO CONTACT SECTION
   * ---------------------------------------------
   */
  const goToContactSection = (eventTitle = "") => {
    if (eventTitle) {
      setSelectedEvent(eventTitle);

      if (onEventSelect) {
        onEventSelect(eventTitle);
      }
    }

    const contactSection =
      document.getElementById("contact");

    if (!contactSection) {
      console.error(
        "ContactSection not found. Make sure ContactSection has id='contact'."
      );
      return;
    }

    /*
     * Update browser URL.
     *
     * This makes it absolutely clear that this
     * action belongs to ContactSection and not
     * AboutSection.
     */
    window.history.pushState(
      { section: "contact" },
      "",
      "/#contact"
    );

    /*
     * Calculate the position manually so the fixed
     * navbar does not cover the ContactSection.
     */
    const navbarHeight =
      window.innerWidth <= 480 ? 70 : 74;

    const contactTop =
      contactSection.getBoundingClientRect().top +
      window.scrollY;

    const targetPosition = Math.max(
      0,
      contactTop - navbarHeight
    );

    window.setTimeout(() => {
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleEventClick = (eventTitle) => {
    goToContactSection(eventTitle);
  };

  const handleRequestQuote = () => {
    goToContactSection();
  };

  return (
    <section
      id="events"
      className="events-section"
      style={{
        backgroundImage: `url(${eventsBg})`,
      }}
    >
      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div className="events-background-shape events-shape-one" />

      <div className="events-background-shape events-shape-two" />

      <div className="events-container">
        {/* =========================================
            LEFT EVENT IMAGE
        ========================================= */}

        <motion.div
          className="event-image event-left"
          initial={{
            opacity: 0,
            x: -70,
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
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <div className="event-image-frame">
            <img
              src={eventLeft}
              alt="Ify's Signature Fried Rice prepared for an event"
            />

            <div className="event-image-overlay" />

            <motion.div
              className="event-image-caption"
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5,
                duration: 0.6,
              }}
            >
              <span>Made for</span>

              <strong>Memorable Moments</strong>
            </motion.div>
          </div>

          <div className="event-image-frame-decoration" />
        </motion.div>

        {/* =========================================
            CENTER CONTENT
        ========================================= */}

        <motion.div
          className="event-content"
          initial={{
            opacity: 0,
            y: 45,
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
            duration: 0.75,
            ease: "easeOut",
          }}
        >
          <span className="dark-eyebrow">
            EVENTS & BOOKINGS
          </span>

          <h2>
            Let Me Bring the
            <span> Flavor </span>
            to Your Event
          </h2>

          <p className="event-intro">
            From intimate celebrations to big gatherings,
            Ify's Signature Fried Rice is prepared to bring
            people together. Tell me about your event and
            let's create a delicious experience for your
            guests.
          </p>

          {/* =======================================
              BOOKING DETAILS
          ======================================= */}

          <div className="booking-details">
            {bookingDetails.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  className="booking-detail"
                  key={item.text}
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.2 + index * 0.08,
                    duration: 0.45,
                  }}
                >
                  <span className="booking-detail-icon">
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                    />
                  </span>

                  <span>{item.text}</span>
                </motion.div>
              );
            })}
          </div>

          {/* =======================================
              EVENT TYPES
          ======================================= */}

          <div className="event-types">
            <div className="event-types-heading">
              <span>PERFECT FOR</span>

              <div className="event-heading-line" />
            </div>

            <div className="event-list">
              {events.map((event, index) => {
                const Icon = event.icon;

                const isSelected =
                  selectedEvent === event.title;

                return (
                  <motion.button
                    type="button"
                    className={`event-item ${
                      isSelected ? "selected" : ""
                    }`}
                    key={event.title}
                    onClick={() =>
                      handleEventClick(event.title)
                    }
                    initial={{
                      opacity: 0,
                      y: 15,
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
                      delay: 0.25 + index * 0.07,
                      duration: 0.45,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                  >
                    <span className="event-item-icon">
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />
                    </span>

                    <span className="event-item-copy">
                      <strong>
                        {event.title}
                      </strong>

                      <small>
                        {event.description}
                      </small>
                    </span>

                    <span className="event-item-action">
                      {isSelected ? (
                        <Check
                          size={15}
                          strokeWidth={2.5}
                        />
                      ) : (
                        <CalendarDays
                          size={15}
                          strokeWidth={1.8}
                        />
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* =======================================
              SELECTED EVENT MESSAGE
          ======================================= */}

          {selectedEvent && (
            <motion.div
              className="selected-event-message"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              <CheckCircle2
                size={17}
                strokeWidth={2}
              />

              <span>
                {selectedEvent} selected. Let's plan
                something delicious!
              </span>
            </motion.div>
          )}

          {/* =======================================
              REQUEST A QUOTE
          ======================================= */}

          <div className="event-cta">
            <div className="event-cta-copy">
              <CheckCircle2
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Planning something special? Let's talk.
              </span>
            </div>

            <motion.button
              type="button"
              className="button event-button"
              onClick={handleRequestQuote}
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <CalendarDays
                size={18}
                strokeWidth={2}
              />

              <span>Request a Quote</span>
            </motion.button>
          </div>
        </motion.div>

        {/* =========================================
            RIGHT EVENT IMAGE
        ========================================= */}

        <motion.div
          className="event-image event-right"
          initial={{
            opacity: 0,
            x: 70,
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
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <div className="event-image-frame">
            <img
              src={eventRight}
              alt="Foil pans of Ify's Signature Fried Rice ready for catering"
            />

            <div className="event-image-overlay" />

            <motion.div
              className="event-note"
              initial={{
                opacity: 0,
                rotate: -2,
              }}
              whileInView={{
                opacity: 1,
                rotate: -5,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.55,
                duration: 0.6,
              }}
            >
              Good Food,
              <br />
              Good Vibes,
              <br />
              <strong>Great Moments ♡</strong>
            </motion.div>
          </div>

          <div className="event-image-frame-decoration right-decoration" />
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;