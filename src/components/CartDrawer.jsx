import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import smallPan from "../assets/images/small-pan.jpg";
import mediumPan from "../assets/images/medium-pan.jpg";
import largePan from "../assets/images/large-pan.jpg";

import "../styles/CartDrawer.css";

const panImages = {
  small: smallPan,
  medium: mediumPan,
  large: largePan,
};

const CartDrawer = ({
  isOpen,
  cartItems,
  cartCount,
  cartTotal,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    if (!cartItems.length) {
      return;
    }

    onClose();

    navigate("/checkout", {
      state: {
        cartItems,
        cartTotal,
        cartCount,
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
            aria-label="Shopping cart"
          >
            <div className="cart-header">
              <div>
                <span className="cart-eyebrow">
                  YOUR ORDER
                </span>

                <h2>Your Cart</h2>

                <p>
                  {cartCount === 0
                    ? "Your cart is waiting for something delicious."
                    : `${cartCount} ${
                        cartCount === 1
                          ? "pan"
                          : "pans"
                      } in your cart`}
                </p>
              </div>

              <button
                type="button"
                className="cart-close"
                aria-label="Close cart"
                onClick={onClose}
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            <div className="cart-body">
              {cartItems.length === 0 ? (
                <motion.div
                  className="cart-empty"
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <div className="empty-cart-icon">
                    <ShoppingBag
                      size={34}
                      strokeWidth={1.4}
                    />
                  </div>

                  <h3>Your cart is empty</h3>

                  <p>
                    Choose your favorite pan, protein and
                    spice level from our menu to get started.
                  </p>

                  <button
                    type="button"
                    className="empty-cart-button"
                    onClick={onContinueShopping}
                  >
                    Browse Fried Rice
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="cart-success">
                    <div className="cart-success-icon">
                      <Check
                        size={13}
                        strokeWidth={3}
                      />
                    </div>

                    <span>
                      Your item has been added to your cart
                    </span>
                  </div>

                  <div className="cart-items">
                    {cartItems.map((item, index) => {
                      const image =
                        panImages[item.panId];

                      const proteins = Array.isArray(
                        item.protein
                      )
                        ? item.protein
                        : [item.protein];

                      return (
                        <motion.article
                          className="cart-item"
                          key={item.id}
                          initial={{
                            opacity: 0,
                            x: 20,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.04,
                          }}
                          layout
                        >
                          <div className="cart-item-image">
                            {image && (
                              <img
                                src={image}
                                alt={`${item.pan} fried rice`}
                              />
                            )}
                          </div>

                          <div className="cart-item-content">
                            <div className="cart-item-top">
                              <div>
                                <span className="cart-item-label">
                                  FRIED RICE
                                </span>

                                <h3>{item.pan}</h3>
                              </div>

                              <button
                                type="button"
                                className="cart-remove"
                                aria-label={`Remove ${item.pan}`}
                                onClick={() =>
                                  onRemoveItem(item.id)
                                }
                              >
                                <Trash2
                                  size={15}
                                  strokeWidth={1.8}
                                />
                              </button>
                            </div>

                            <div className="cart-item-details">
                              <div>
                                <span>Protein</span>

                                <strong>
                                  {proteins.join(" + ")}
                                </strong>
                              </div>

                              <div>
                                <span>Spice</span>

                                <strong>
                                  {item.spice}
                                </strong>
                              </div>
                            </div>

                            <div className="cart-item-bottom">
                              <div className="cart-quantity">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  disabled={
                                    item.quantity === 1
                                  }
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.id,
                                      -1
                                    )
                                  }
                                >
                                  <Minus size={13} />
                                </button>

                                <span>
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  disabled={
                                    item.quantity === 10
                                  }
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.id,
                                      1
                                    )
                                  }
                                >
                                  <Plus size={13} />
                                </button>
                              </div>

                              <strong className="cart-item-price">
                                ${item.total}
                              </strong>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>

                  <div className="cart-actions">
                    <button
                      type="button"
                      className="continue-shopping"
                      onClick={onContinueShopping}
                    >
                      Continue Shopping
                    </button>

                    <button
                      type="button"
                      className="clear-cart"
                      onClick={onClearCart}
                    >
                      Clear cart
                    </button>
                  </div>
                </>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>

                    <strong>${cartTotal}</strong>
                  </div>

                  <p>
                    Delivery and final charges will be
                    confirmed at checkout.
                  </p>
                </div>

                <button
                  type="button"
                  className="checkout-button"
                  onClick={handleCheckout}
                >
                  <span>Proceed to Checkout</span>

                  <strong>${cartTotal}</strong>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;