import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Clock3,
  Minus,
  Plus,
  ShoppingCart,
  Users,
} from "lucide-react";

import smallPan from "../assets/images/small-pan.jpg";
import mediumPan from "../assets/images/medium-pan.jpg";
import largePan from "../assets/images/large-pan.jpg";

import "../styles/OrderSection.css";

const pans = [
  {
    id: "small",
    image: smallPan,
    name: "Small Foil Pan",
    shortName: "Small",
    serves: "2–4 people",
    price: 35,
    description:
      "Perfect for a cozy meal or a small gathering.",
    popular: false,
  },
  {
    id: "medium",
    image: mediumPan,
    name: "Medium Foil Pan",
    shortName: "Medium",
    serves: "5–8 people",
    price: 55,
    description:
      "Our go-to size for families and small celebrations.",
    popular: true,
  },
  {
    id: "large",
    image: largePan,
    name: "Large Foil Pan",
    shortName: "Large",
    serves: "9–12 people",
    price: 100,
    description:
      "Made for bigger gatherings, parties and special events.",
    popular: false,
  },
];

const proteins = [
  {
    name: "Chicken",
    description: "Tender seasoned chicken pieces",
    price: 8,
  },
  {
    name: "Shrimp",
    description: "Juicy seasoned shrimp",
    price: 12,
  },
  {
    name: "Beef",
    description: "Savory seasoned beef",
    price: 10,
  },
  {
    name: "Mixed (Chicken + Shrimp + Beef)",
    description: "A little bit of everything",
    price: 18,
  },
  {
    name: "Vegetable Only",
    description: "Fresh vegetables, no meat",
    price: 3,
  },
];

const spiceLevels = [
  {
    name: "Mild",
    description: "Gentle & flavorful",
  },
  {
    name: "Medium",
    description: "A balanced kick",
  },
  {
    name: "Spicy",
    description: "For spice lovers 🌶️",
  },
];

const OrderSection = ({ onAddToCart }) => {
  const [selectedPans, setSelectedPans] = useState([
    "medium",
  ]);

  const [selectedProteins, setSelectedProteins] = useState([
    "Chicken",
  ]);

  const [spice, setSpice] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedPanData = pans.filter((pan) =>
    selectedPans.includes(pan.id)
  );

  const selectedProteinData = proteins.filter((item) =>
    selectedProteins.includes(item.name)
  );

  const selectedSpice =
    spiceLevels.find((item) => item.name === spice) ||
    spiceLevels[1];

  /*
   * Total price of all selected pan sizes.
   *
   * Example:
   * Small + Medium
   * $35 + $55 = $90
   */
  const selectedPansTotal = selectedPanData.reduce(
    (total, pan) => total + pan.price,
    0
  );

  /*
   * Total price of all selected proteins.
   *
   * Example:
   * Chicken + Shrimp
   * $8 + $12 = $20
   */
  const selectedProteinsTotal =
    selectedProteinData.reduce(
      (total, protein) => total + protein.price,
      0
    );

  /*
   * Base price before quantity.
   *
   * Example:
   * Small + Medium + Chicken + Shrimp
   *
   * $35 + $55 + $8 + $12 = $110
   */
  const pricePerSet =
    selectedPansTotal + selectedProteinsTotal;

  /*
   * Final order total.
   */
  const totalPrice = pricePerSet * quantity;

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  const togglePan = (panId) => {
    setSelectedPans((currentPans) => {
      const alreadySelected =
        currentPans.includes(panId);

      if (
        alreadySelected &&
        currentPans.length === 1
      ) {
        return currentPans;
      }

      if (alreadySelected) {
        return currentPans.filter(
          (item) => item !== panId
        );
      }

      return [...currentPans, panId];
    });
  };

  const toggleProtein = (proteinName) => {
    setSelectedProteins((currentProteins) => {
      const alreadySelected =
        currentProteins.includes(proteinName);

      if (
        alreadySelected &&
        currentProteins.length === 1
      ) {
        return currentProteins;
      }

      if (alreadySelected) {
        return currentProteins.filter(
          (item) => item !== proteinName
        );
      }

      return [...currentProteins, proteinName];
    });
  };

  const handleAddToCart = () => {
    /*
     * Each selected pan becomes its own cart item.
     *
     * The protein pricing is included in every pan's
     * individual total.
     */
    selectedPanData.forEach((pan) => {
      const itemPrice =
        pan.price + selectedProteinsTotal;

      const order = {
        pan: pan.name,
        panId: pan.id,
        price: itemPrice,
        basePanPrice: pan.price,
        protein: selectedProteins,
        proteinPrice: selectedProteinsTotal,
        spice,
        quantity,
        total: itemPrice * quantity,
      };

      if (onAddToCart) {
        onAddToCart(order);
      }
    });

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const proteinSummary =
    selectedProteins.length > 0
      ? selectedProteins.join(" + ")
      : "No protein selected";

  const panSummary =
    selectedPanData.length > 0
      ? selectedPanData
          .map((pan) => pan.shortName)
          .join(" + ")
      : "No pan selected";

  return (
    <section id="order" className="order-section">
      <div className="order-container">
        {/* =========================================
            SECTION INTRO
        ========================================= */}

        <motion.div
          className="section-heading order-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <span className="order-eyebrow">
            ORDER FROM IFY'S KITCHEN
          </span>

          <h2>Good Food, Made Your Way.</h2>

          <p>
            Choose one or more pan sizes, pick your
            favorite protein, and set your spice level.
            Every order is freshly prepared with quality
            ingredients and plenty of flavor.
          </p>
        </motion.div>

        <div className="order-layout">
          {/* =======================================
              PAN SELECTION
          ======================================= */}

          <div className="pan-area">
            <div className="pan-area-heading">
              <div>
                <span className="step-number">01</span>

                <div>
                  <h3>Choose Your Pan Size</h3>

                  <p>
                    Select one or more portions that work
                    for your table.
                  </p>
                </div>
              </div>

              <span className="required-label">
                Required
              </span>
            </div>

            <div className="pan-grid">
              {pans.map((pan, index) => {
                const isSelected =
                  selectedPans.includes(pan.id);

                return (
                  <motion.article
                    key={pan.id}
                    className={`pan-card ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => togglePan(pan.id)}
                    initial={{
                      opacity: 0,
                      y: 50,
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
                      duration: 0.55,
                      delay: index * 0.12,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -6,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                  >
                    {pan.popular && (
                      <span className="popular-badge">
                        MOST POPULAR
                      </span>
                    )}

                    <div className="pan-image-wrap">
                      <img
                        src={pan.image}
                        alt={`${pan.name} fried rice pan`}
                      />

                      {isSelected && (
                        <motion.span
                          className="selected-check"
                          initial={{
                            scale: 0,
                          }}
                          animate={{
                            scale: 1,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 18,
                          }}
                        >
                          <Check
                            size={15}
                            strokeWidth={3}
                          />
                        </motion.span>
                      )}
                    </div>

                    <div className="pan-details">
                      <div className="pan-topline">
                        <span className="pan-label">
                          {pan.name}
                        </span>

                        <strong>${pan.price}</strong>
                      </div>

                      <div className="pan-serves">
                        <Users
                          size={13}
                          strokeWidth={2}
                        />

                        <span>
                          Serves {pan.serves}
                        </span>
                      </div>

                      <p>{pan.description}</p>

                      <button
                        type="button"
                        className={
                          isSelected
                            ? "pan-select-button selected-button"
                            : "pan-select-button"
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          togglePan(pan.id);
                        }}
                      >
                        {isSelected
                          ? "Selected"
                          : "Select This Pan"}

                        <ChevronRight
                          size={15}
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="order-note">
              <Clock3
                size={15}
                strokeWidth={1.8}
              />

              <p>
                <strong>Freshly prepared:</strong> Orders
                are made fresh for you. Please allow time
                for preparation before pickup or delivery.
              </p>
            </div>
          </div>

          {/* =======================================
              CUSTOMIZATION CARD
          ======================================= */}

          <motion.aside
            className="custom-card"
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
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <div className="custom-card-header">
              <div>
                <span className="custom-eyebrow">
                  MAKE IT YOURS
                </span>

                <h3>Customize Your Fried Rice</h3>
              </div>

              <span className="step-badge">02</span>
            </div>

            {/* =====================================
                PROTEIN
            ===================================== */}

            <fieldset>
              <legend>
                <span>Choose Your Protein</span>

                <small>Select one or more</small>
              </legend>

              <div className="protein-options">
                {proteins.map((item) => {
                  const isSelected =
                    selectedProteins.includes(item.name);

                  return (
                    <label
                      className={`protein-option ${
                        isSelected ? "checked" : ""
                      }`}
                      key={item.name}
                    >
                      <input
                        type="checkbox"
                        name="protein"
                        value={item.name}
                        checked={isSelected}
                        onChange={() =>
                          toggleProtein(item.name)
                        }
                      />

                      <span className="custom-checkbox">
                        {isSelected && (
                          <Check
                            size={11}
                            strokeWidth={3}
                          />
                        )}
                      </span>

                      <span className="protein-copy">
                        <strong>{item.name}</strong>

                        <small>
                          {item.description}
                        </small>
                      </span>

                      <span className="protein-price">
                        +${item.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* =====================================
                SPICE
            ===================================== */}

            <fieldset className="spice-fieldset">
              <legend>
                <span>Choose Your Spice Level</span>

                <small>Required</small>
              </legend>

              <div className="spice-row">
                {spiceLevels.map((item) => (
                  <label
                    className={`spice-option ${
                      spice === item.name
                        ? "checked"
                        : ""
                    }`}
                    key={item.name}
                  >
                    <input
                      type="radio"
                      name="spice"
                      value={item.name}
                      checked={spice === item.name}
                      onChange={(event) =>
                        setSpice(event.target.value)
                      }
                    />

                    <span className="spice-name">
                      {item.name}

                      {item.name === "Spicy" && (
                        <span aria-hidden="true">
                          {" "}
                          🌶️
                        </span>
                      )}
                    </span>

                    <small>{item.description}</small>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* =====================================
                QUANTITY
            ===================================== */}

            <div className="quantity-section">
              <div>
                <span className="quantity-title">
                  Quantity
                </span>

                <small>
                  Number of each selected pan
                </small>
              </div>

              <div className="quantity-control">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  <Minus size={15} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={increaseQuantity}
                  disabled={quantity === 10}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* =====================================
                ORDER PREVIEW
            ===================================== */}

            <div className="order-preview">
              <div className="preview-heading">
                <span>Your Order</span>

                <span className="preview-count">
                  {selectedPans.length}{" "}
                  {selectedPans.length === 1
                    ? "size"
                    : "sizes"}
                </span>
              </div>

              {selectedPanData.map((pan) => (
                <div
                  className="preview-item"
                  key={pan.id}
                >
                  <div>
                    <strong>{pan.name}</strong>

                    <span>
                      ${pan.price} · Qty {quantity}
                    </span>
                  </div>

                  <strong>
                    ${pan.price * quantity}
                  </strong>
                </div>
              ))}

              <div className="preview-item">
                <div>
                  <strong>Protein</strong>

                  <span>{proteinSummary}</span>
                </div>

                <strong>
                  +${selectedProteinsTotal}
                </strong>
              </div>

              <div className="preview-item">
                <div>
                  <strong>Spice</strong>

                  <span>{selectedSpice.name}</span>
                </div>

                <span>Included</span>
              </div>

              <div className="preview-total">
                <span>Estimated Total</span>

                <strong>${totalPrice}</strong>
              </div>
            </div>

            {/* =====================================
                ADD TO CART
            ===================================== */}

            <motion.button
              type="button"
              className={`add-cart ${
                added ? "added" : ""
              }`}
              onClick={handleAddToCart}
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              {added ? (
                <>
                  <Check
                    size={19}
                    strokeWidth={2.5}
                  />

                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={19}
                    strokeWidth={2}
                  />

                  <span>Add to Cart</span>

                  <strong>${totalPrice}</strong>
                </>
              )}
            </motion.button>

            <p className="order-summary">
              {panSummary} · {proteinSummary} · {spice}
              {quantity > 1 &&
                ` · Qty ${quantity}`}
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;