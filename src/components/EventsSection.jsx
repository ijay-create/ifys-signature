import React, { useMemo, useState } from "react";
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
  Truck,
  Zap,
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

const deliveryOptions = [
  {
    id: "delivery",
    icon: Truck,
    title: "Standard Delivery",
    description: "Saturday & Sunday",
  },
  {
    id: "pickup",
    icon: MapPin,
    title: "Self Pickup",
    description: "Saturday & Sunday",
  },
  {
    id: "late",
    icon: Zap,
    title: "Express / Late",
    description: "Extra charge applies",
  },
];

const MIN_BOOKING_DAYS_AHEAD = 7;

const getDateOnly = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

const addDays = (date, days) => {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
};

const formatDateForInput = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(
    `${dateString}T12:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
};

const getNextAvailableWeekendDates = (
  minimumDate,
  numberOfDates = 8
) => {
  const dates = [];

  let currentDate = getDateOnly(
    minimumDate
  );

  while (dates.length < numberOfDates) {
    const dayOfWeek =
      currentDate.getDay();

    if (
      dayOfWeek === 6 ||
      dayOfWeek === 0
    ) {
      dates.push(
        new Date(currentDate)
      );
    }

    currentDate = addDays(
      currentDate,
      1
    );
  }

  return dates;
};

const EventsSection = ({
  onEventSelect,
  onBookingSelect,
}) => {
  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedService, setSelectedService] =
    useState("delivery");

  /*
   * Customers must book ahead of the
   * requested food date.
   */
  const minimumBookingDate = useMemo(() => {
    return getDateOnly(
      addDays(
        new Date(),
        MIN_BOOKING_DAYS_AHEAD
      )
    );
  }, []);

  /*
   * Only Saturday and Sunday dates
   * are displayed as selectable dates.
   */
  const availableWeekendDates = useMemo(() => {
    return getNextAvailableWeekendDates(
      minimumBookingDate,
      8
    );
  }, [minimumBookingDate]);

  const minimumDateString =
    formatDateForInput(
      minimumBookingDate
    );

  const selectedDateObject =
    selectedDate
      ? new Date(
          `${selectedDate}T12:00:00`
        )
      : null;

  const isValidWeekendDate = (dateString) => {
    if (!dateString) {
      return false;
    }

    const selected = new Date(
      `${dateString}T12:00:00`
    );

    const dayOfWeek =
      selected.getDay();

    const selectedDay =
      getDateOnly(selected);

    return (
      (dayOfWeek === 6 ||
        dayOfWeek === 0) &&
      selectedDay >= minimumBookingDate
    );
  };

  /*
   * ---------------------------------------------
   * SEND BOOKING INFORMATION TO PARENT
   * ---------------------------------------------
   */

  const updateBookingSelection = ({
    eventTitle = selectedEvent,
    date = selectedDate,
    service = selectedService,
  }) => {
    if (!onBookingSelect) {
      return;
    }

    onBookingSelect({
      eventType: eventTitle,
      eventDate: date,
      serviceOption: service,
    });
  };

  /*
   * ---------------------------------------------
   * GO DIRECTLY TO CONTACT SECTION
   * ---------------------------------------------
   */

  const goToContactSection = (
    eventTitle = ""
  ) => {
    if (eventTitle) {
      setSelectedEvent(eventTitle);

      if (onEventSelect) {
        onEventSelect(eventTitle);
      }
    }

    updateBookingSelection({
      eventTitle:
        eventTitle || selectedEvent,
    });

    const contactSection =
      document.getElementById(
        "contact"
      );

    if (!contactSection) {
      console.error(
        "ContactSection not found. Make sure ContactSection has id='contact'."
      );

      return;
    }

    window.history.pushState(
      {
        section: "contact",
      },
      "",
      "/#contact"
    );

    const navbarHeight =
      window.innerWidth <= 480
        ? 70
        : 74;

    const contactTop =
      contactSection.getBoundingClientRect()
        .top + window.scrollY;

    const targetPosition =
      Math.max(
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

  const handleEventClick = (
    eventTitle
  ) => {
    setSelectedEvent(eventTitle);

    if (onEventSelect) {
      onEventSelect(eventTitle);
    }

    updateBookingSelection({
      eventTitle,
    });
  };

  const handleDateSelect = (
    dateString
  ) => {
    if (
      !isValidWeekendDate(
        dateString
      )
    ) {
      return;
    }

    setSelectedDate(dateString);

    updateBookingSelection({
      date: dateString,
    });
  };

  const handleServiceSelect = (
    service
  ) => {
    setSelectedService(service);

    updateBookingSelection({
      service,
    });
  };

  const handleRequestQuote = () => {
    if (!selectedDate) {
      const bookingPicker =
        document.getElementById(
          "event-booking-date"
        );

      bookingPicker?.focus();

      return;
    }

    if (
      !isValidWeekendDate(
        selectedDate
      )
    ) {
      return;
    }

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

              <strong>
                Memorable Moments
              </strong>
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
            From intimate celebrations to
            big gatherings, Ify's Signature
            Fried Rice is prepared fresh for
            your special moments. Choose
            your event, select an available
            weekend date, and book ahead
            for your food.
          </p>

          {/* =======================================
              DELIVERY NOTICE
          ======================================= */}

          <motion.div
            className="food-delivery-notice"
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
              delay: 0.15,
              duration: 0.5,
            }}
          >
            <div className="food-delivery-notice-icon">
              <CalendarDays
                size={17}
                strokeWidth={1.9}
              />
            </div>

            <div className="food-delivery-notice-copy">
              <strong>
                Weekend Food Service
              </strong>

              <span>
                Food delivery and pickup are
                available on Saturdays and
                Sundays only.
              </span>

              <small>
                Please book at least{" "}
                {MIN_BOOKING_DAYS_AHEAD} days
                before your preferred date.
              </small>
            </div>
          </motion.div>

          {/* =======================================
              BOOKING DETAILS
          ======================================= */}

          <div className="booking-details">
            {bookingDetails.map(
              (item, index) => {
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
                      delay:
                        0.2 +
                        index * 0.08,
                      duration: 0.45,
                    }}
                  >
                    <span className="booking-detail-icon">
                      <Icon
                        size={15}
                        strokeWidth={1.8}
                      />
                    </span>

                    <span>
                      {item.text}
                    </span>
                  </motion.div>
                );
              }
            )}
          </div>

          {/* =======================================
              EVENT TYPES
          ======================================= */}

          <div className="event-types">
            <div className="event-types-heading">
              <span>
                PERFECT FOR
              </span>

              <div className="event-heading-line" />
            </div>

            <div className="event-list">
              {events.map(
                (event, index) => {
                  const Icon =
                    event.icon;

                  const isSelected =
                    selectedEvent ===
                    event.title;

                  return (
                    <motion.button
                      type="button"
                      className={`event-item ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      key={event.title}
                      onClick={() =>
                        handleEventClick(
                          event.title
                        )
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
                        delay:
                          0.25 +
                          index * 0.07,
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
                          {
                            event.description
                          }
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
                }
              )}
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
                {selectedEvent} selected.
                Now choose your preferred
                weekend date below.
              </span>
            </motion.div>
          )}

          {/* =======================================
              FOOD DATE
          ======================================= */}

          <div className="event-booking-panel">
            <div className="event-booking-heading">
              <div>
                <span>
                  01 — CHOOSE YOUR FOOD DATE
                </span>

                <h3>
                  When would you like
                  your food?
                </h3>
              </div>

              <CalendarDays
                size={21}
                strokeWidth={1.7}
              />
            </div>

            <p className="event-booking-help">
              Select a Saturday or Sunday.
              Weekday food delivery and
              pickup are not available.
            </p>

            <div className="weekend-date-list">
              {availableWeekendDates.map(
                (date) => {
                  const dateString =
                    formatDateForInput(
                      date
                    );

                  const isSelected =
                    selectedDate ===
                    dateString;

                  return (
                    <motion.button
                      key={dateString}
                      type="button"
                      className={`weekend-date-card ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleDateSelect(
                          dateString
                        )
                      }
                      whileHover={{
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                    >
                      <span className="weekend-date-day">
                        {date.toLocaleDateString(
                          "en-US",
                          {
                            weekday:
                              "short",
                          }
                        )}
                      </span>

                      <strong>
                        {date.toLocaleDateString(
                          "en-US",
                          {
                            month:
                              "short",
                            day: "numeric",
                          }
                        )}
                      </strong>

                      {isSelected && (
                        <span className="weekend-date-check">
                          <Check
                            size={12}
                            strokeWidth={2.5}
                          />
                        </span>
                      )}
                    </motion.button>
                  );
                }
              )}
            </div>

            <div className="event-date-picker-row">
              <label htmlFor="event-booking-date">
                Or choose a weekend date
              </label>

              <input
                id="event-booking-date"
                type="date"
                value={selectedDate}
                min={minimumDateString}
                onChange={(event) =>
                  handleDateSelect(
                    event.target.value
                  )
                }
              />
            </div>

            {selectedDate &&
              selectedDateObject && (
                <div className="selected-date-confirmation">
                  <CheckCircle2
                    size={16}
                    strokeWidth={2}
                  />

                  <span>
                    Food date:{" "}
                    <strong>
                      {formatDisplayDate(
                        selectedDate
                      )}
                    </strong>
                  </span>
                </div>
              )}
          </div>

          {/* =======================================
              SERVICE TYPE
          ======================================= */}

          <div className="event-booking-panel service-panel">
            <div className="event-booking-heading">
              <div>
                <span>
                  02 — CHOOSE YOUR SERVICE
                </span>

                <h3>
                  How would you like
                  to receive your food?
                </h3>
              </div>

              <Truck
                size={21}
                strokeWidth={1.7}
              />
            </div>

            <div className="service-options">
              {deliveryOptions.map(
                (option) => {
                  const Icon =
                    option.icon;

                  const isSelected =
                    selectedService ===
                    option.id;

                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={`service-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleServiceSelect(
                          option.id
                        )
                      }
                    >
                      <span className="service-option-icon">
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                        />
                      </span>

                      <span className="service-option-copy">
                        <strong>
                          {option.title}
                        </strong>

                        <small>
                          {
                            option.description
                          }
                        </small>
                      </span>

                      <span className="service-option-check">
                        {isSelected ? (
                          <Check
                            size={13}
                            strokeWidth={2.5}
                          />
                        ) : null}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {selectedService ===
              "late" && (
              <div className="late-order-notice">
                <Zap
                  size={16}
                  strokeWidth={2}
                />

                <div>
                  <strong>
                    Express / Late Order
                  </strong>

                  <span>
                    Additional charges apply
                    for orders requested
                    outside the standard
                    weekend booking window.
                    Final charges will be
                    confirmed with your quote.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* =======================================
              BOOKING POLICY
          ======================================= */}

          <div className="booking-policy">
            <Clock3
              size={16}
              strokeWidth={1.8}
            />

            <div>
              <strong>
                Please book ahead
              </strong>

              <span>
                Standard orders should be
                booked at least{" "}
                {MIN_BOOKING_DAYS_AHEAD} days
                before your selected
                Saturday or Sunday.
                Express or late requests
                may attract an additional
                charge.
              </span>
            </div>
          </div>

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
                {selectedDate
                  ? "Your weekend date is selected."
                  : "Choose a weekend date to continue."}
              </span>
            </div>

            <motion.button
              type="button"
              className={`button event-button ${
                !selectedDate
                  ? "disabled"
                  : ""
              }`}
              onClick={
                handleRequestQuote
              }
              whileHover={
                selectedDate
                  ? {
                      y: -3,
                    }
                  : undefined
              }
              whileTap={
                selectedDate
                  ? {
                      scale: 0.97,
                    }
                  : undefined
              }
            >
              <CalendarDays
                size={18}
                strokeWidth={2}
              />

              <span>
                Request a Quote
              </span>
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
              <strong>
                Great Moments ♡
              </strong>
            </motion.div>
          </div>

          <div className="event-image-frame-decoration right-decoration" />
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;