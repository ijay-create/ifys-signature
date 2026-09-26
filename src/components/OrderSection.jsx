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
  AlertCircle,
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
    price: 45,
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
    price: 65,
    description:
      "Our go-to size for families and small celebrations.",
    popular: true,
  },
  {
    id: "large",
    image: largePan,
    name: "Big Foil Pan",
    shortName: "Big",
    serves: "9–12 people",
    price: 100,
    description:
      "Made for bigger gatherings, parties and special events.",
    popular: false,
  },
];

const proteins = [
  {
    id: "chicken",
    name: "Chicken",
    description: "Tender seasoned chicken pieces",
    sizes: [
      { id: "small", name: "Small", price: 8 },
      { id: "medium", name: "Medium", price: 14 },
      { id: "large", name: "Large", price: 20 },
    ],
  },
  {
    id: "shrimp",
    name: "Shrimp",
    description: "Juicy seasoned shrimp",
    sizes: [
      { id: "small", name: "Small", price: 12 },
      { id: "medium", name: "Medium", price: 20 },
      { id: "large", name: "Large", price: 30 },
    ],
  },
  {
    id: "beef",
    name: "Beef",
    description: "Savory seasoned beef",
    sizes: [
      { id: "small", name: "Small", price: 10 },
      { id: "medium", name: "Medium", price: 17 },
      { id: "large", name: "Large", price: 24 },
    ],
  },
  {
    id: "mixed",
    name: "Mixed",
    description: "Chicken + shrimp + beef",
    sizes: [
      { id: "small", name: "Small", price: 18 },
      { id: "medium", name: "Medium", price: 30 },
      { id: "large", name: "Large", price: 42 },
    ],
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
  const [selectedPans, setSelectedPans] = useState(["medium"]);

  const [selectedProteins, setSelectedProteins] = useState([
    {
      name: "Chicken",
      proteinId: "chicken",
      sizeId: "small",
      sizeName: "Small",
      price: 8,
    },
  ]);

  const [spice, setSpice] = useState("Medium");
  const [quantity, setQuantity] = useState(1);

  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [excludedIngredients, setExcludedIngredients] =
    useState("");

  const [added, setAdded] = useState(false);

  const selectedPanData = pans.filter((pan) =>
    selectedPans.includes(pan.id)
  );

  const selectedProteinData = selectedProteins;

  const selectedSpice =
    spiceLevels.find((item) => item.name === spice) ||
    spiceLevels[1];

  const selectedPansTotal = selectedPanData.reduce(
    (total, pan) => total + pan.price,
    0
  );

  const selectedProteinsTotal =
    selectedProteinData.reduce(
      (total, protein) => total + protein.price,
      0
    );

  /*
   * Each selected pan receives the selected protein.
   * Therefore the protein cost applies to every selected pan.
   */
  const pricePerSet =
    selectedPansTotal +
    selectedProteinsTotal * selectedPans.length;

  const totalPrice = pricePerSet * quantity;

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
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

  const toggleProtein = (protein) => {
    setSelectedProteins((currentProteins) => {
      const existingProtein = currentProteins.find(
        (item) => item.proteinId === protein.id
      );

      if (existingProtein) {
        return currentProteins.filter(
          (item) => item.proteinId !== protein.id
        );
      }

      const defaultSize = protein.sizes[0];

      return [
        ...currentProteins,
        {
          name: protein.name,
          proteinId: protein.id,
          sizeId: defaultSize.id,
          sizeName: defaultSize.name,
          price: defaultSize.price,
        },
      ];
    });
  };

  const selectProteinSize = (
    event,
    protein,
    size
  ) => {
    event.stopPropagation();

    setSelectedProteins((currentProteins) => {
      const existingProtein = currentProteins.find(
        (item) => item.proteinId === protein.id
      );

      if (!existingProtein) {
        return [
          ...currentProteins,
          {
            name: protein.name,
            proteinId: protein.id,
            sizeId: size.id,
            sizeName: size.name,
            price: size.price,
          },
        ];
      }

      return currentProteins.map((item) =>
        item.proteinId === protein.id
          ? {
              ...item,
              sizeId: size.id,
              sizeName: size.name,
              price: size.price,
            }
          : item
      );
    });
  };

  const handleAddToCart = () => {
    if (selectedPans.length === 0) {
      return;
    }

    selectedPanData.forEach((pan) => {
      const order = {
        pan: pan.name,
        panId: pan.id,
        price:
          pan.price + selectedProteinsTotal,
        basePanPrice: pan.price,

        protein: selectedProteinData.map(
          (protein) => ({
            name: protein.name,
            proteinId: protein.proteinId,
            sizeName: protein.sizeName,
            sizeId: protein.sizeId,
            price: protein.price,
          })
        ),

        proteinPrice: selectedProteinsTotal,

        spice,

        quantity,

        allergy: hasAllergy
          ? allergies.trim() ||
            "Allergy reported — details not provided"
          : "None reported",

        excludedIngredients:
          excludedIngredients.trim() ||
          "None specified",

        total:
          (pan.price + selectedProteinsTotal) *
          quantity,
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
      ? selectedProteins
          .map(
            (protein) =>
              `${protein.name} (${protein.sizeName})`
          )
          .join(" + ")
      : "No protein selected";

  const panSummary =
    selectedPanData.length > 0
      ? selectedPanData
          .map((pan) => pan.shortName)
          .join(" + ")
      : "No pan selected";

  return (
    <section
      className="order-section"
      id="order"
    >
      <div className="order-container">
        <motion.div
          className="section-heading order-heading"
          initial={{ opacity: 0, y: 35 }}
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
          <span className="order-eyebrow">
            ORDER FROM IFY'S KITCHEN
          </span>

          <h2>Good Food, Made Your Way.</h2>

          <p>
            Choose your pan size, select your
            protein and protein size, set your
            spice level, and tell us about any
            allergies or ingredients you need
            excluded from your food.
          </p>
        </motion.div>

        <div className="order-layout">
          <div className="pan-area">
            <div className="pan-area-heading">
              <div>
                <span className="step-number">
                  01
                </span>

                <div>
                  <h3>Choose Your Pan Size</h3>

                  <p>
                    Select one or more portions
                    that work for your table.
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
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      togglePan(pan.id)
                    }
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

                        <strong>
                          ${pan.price}
                        </strong>
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

                      <p>
                        {pan.description}
                      </p>

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
                <strong>
                  Freshly prepared:
                </strong>{" "}
                Orders are made fresh for you.
                Please allow time for preparation
                before pickup or delivery.
              </p>
            </div>
          </div>

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

                <h3>
                  Customize Your Fried Rice
                </h3>
              </div>

              <span className="step-badge">
                02
              </span>
            </div>

            <fieldset>
              <legend>
                <span>
                  Choose Your Protein
                </span>

                <small>
                  Select one or more
                </small>
              </legend>

              <div className="protein-options">
                {proteins.map((item) => {
                  const selectedProtein =
                    selectedProteins.find(
                      (protein) =>
                        protein.proteinId ===
                        item.id
                    );

                  const isSelected =
                    Boolean(selectedProtein);

                  return (
                    <div
                      className={`protein-option ${
                        isSelected
                          ? "checked"
                          : ""
                      }`}
                      key={item.id}
                      onClick={() =>
                        toggleProtein(item)
                      }
                    >
                      <span className="custom-checkbox">
                        {isSelected && (
                          <Check
                            size={11}
                            strokeWidth={3}
                          />
                        )}
                      </span>

                      <span className="protein-copy">
                        <strong>
                          {item.name}
                        </strong>

                        <small>
                          {item.description}
                        </small>
                      </span>

                      <div
                        className="protein-sizes"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >
                        {item.sizes.map((size) => {
                          const isSizeSelected =
                            selectedProtein?.sizeId ===
                            size.id;

                          return (
                            <button
                              type="button"
                              key={size.id}
                              className={`protein-size-button ${
                                isSizeSelected
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={(event) =>
                                selectProteinSize(
                                  event,
                                  item,
                                  size
                                )
                              }
                            >
                              <span>
                                {size.name}
                              </span>

                              <strong>
                                +${size.price}
                              </strong>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="spice-fieldset">
              <legend>
                <span>
                  Choose Your Spice Level
                </span>

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
                      checked={
                        spice === item.name
                      }
                      onChange={(event) =>
                        setSpice(
                          event.target.value
                        )
                      }
                    />

                    <span className="spice-name">
                      {item.name}

                      {item.name ===
                        "Spicy" && (
                        <span aria-hidden="true">
                          {" "}
                          🌶️
                        </span>
                      )}
                    </span>

                    <small>
                      {item.description}
                    </small>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="allergy-fieldset">
              <legend>
                <span>
                  Allergies & Ingredients to Avoid
                </span>

                <small>
                  Important
                </small>
              </legend>

              <div className="allergy-notice">
                <AlertCircle
                  size={15}
                  strokeWidth={2}
                />

                <p>
                  Please tell us about any food
                  allergies or ingredients that
                  must not be included in your
                  order.
                </p>
              </div>

              <label className="allergy-toggle">
                <input
                  type="checkbox"
                  checked={hasAllergy}
                  onChange={(event) =>
                    setHasAllergy(
                      event.target.checked
                    )
                  }
                />

                <span className="custom-checkbox">
                  {hasAllergy && (
                    <Check
                      size={11}
                      strokeWidth={3}
                    />
                  )}
                </span>

                <span>
                  I have a food allergy
                </span>
              </label>

              <div className="allergy-fields">
                <label>
                  <span>
                    What allergies do you have?
                  </span>

                  <textarea
                    value={allergies}
                    onChange={(event) =>
                      setAllergies(
                        event.target.value
                      )
                    }
                    placeholder="e.g. shrimp, peanuts, shellfish, dairy..."
                    rows={3}
                    disabled={!hasAllergy}
                  />
                </label>

                <label>
                  <span>
                    Ingredients you do not want
                  </span>

                  <textarea
                    value={
                      excludedIngredients
                    }
                    onChange={(event) =>
                      setExcludedIngredients(
                        event.target.value
                      )
                    }
                    placeholder="e.g. onions, bell peppers, carrots..."
                    rows={3}
                  />
                </label>
              </div>
            </fieldset>

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
                  onClick={
                    decreaseQuantity
                  }
                  disabled={quantity === 1}
                >
                  <Minus size={15} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={
                    increaseQuantity
                  }
                  disabled={quantity === 10}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

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
                    <strong>
                      {pan.name}
                    </strong>

                    <span>
                      ${pan.price} · Qty{" "}
                      {quantity}
                    </span>
                  </div>

                  <strong>
                    ${pan.price * quantity}
                  </strong>
                </div>
              ))}

              <div className="preview-item">
                <div>
                  <strong>
                    Protein
                  </strong>

                  <span>
                    {proteinSummary}
                  </span>
                </div>

                <strong>
                  +$
                  {selectedProteinsTotal *
                    selectedPans.length}
                </strong>
              </div>

              <div className="preview-item">
                <div>
                  <strong>
                    Spice
                  </strong>

                  <span>
                    {selectedSpice.name}
                  </span>
                </div>

                <span>Included</span>
              </div>

              <div className="preview-item">
                <div>
                  <strong>
                    Allergies
                  </strong>

                  <span>
                    {hasAllergy
                      ? allergies ||
                        "Allergy reported"
                      : "None reported"}
                  </span>
                </div>
              </div>

              <div className="preview-item">
                <div>
                  <strong>
                    Ingredients to Avoid
                  </strong>

                  <span>
                    {excludedIngredients ||
                      "None specified"}
                  </span>
                </div>
              </div>

              <div className="preview-total">
                <span>
                  Estimated Total
                </span>

                <strong>
                  ${totalPrice}
                </strong>
              </div>
            </div>

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

                  <span>
                    Added to Cart
                  </span>
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={19}
                    strokeWidth={2}
                  />

                  <span>
                    Add to Cart
                  </span>

                  <strong>
                    ${totalPrice}
                  </strong>
                </>
              )}
            </motion.button>

            <p className="order-summary">
              {panSummary} ·{" "}
              {proteinSummary} · {spice}
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