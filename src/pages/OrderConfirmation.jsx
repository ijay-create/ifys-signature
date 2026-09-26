import React, { useEffect, useState } from "react";
import { Check, Home, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/OrderConfirmation.css";

const confettiPieces = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  x: (index % 7) * 16 - 48,
  rotation: index % 2 === 0 ? 1 : -1,
  delay: (index % 8) * 0.035,
  duration: 1.8 + (index % 5) * 0.2,
  size: 6 + (index % 4) * 2,
}));

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showConfetti, setShowConfetti] = useState(true);

  const {
    cartItems = [],
    cartTotal = 0,
    cartCount = 0,
    orderNumber = "IFY-000000",
  } = location.state || {};

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowConfetti(false);
    }, 3200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <main className="confirmation-page">
      {showConfetti && (
        <div
          className="confirmation-confetti"
          aria-hidden="true"
        >
          {confettiPieces.map((piece) => (
            <motion.span
              key={piece.id}
              className="confetti-piece"
              style={{
                width: piece.size,
                height: piece.size * 1.7,
              }}
              initial={{
                opacity: 0,
                x: 0,
                y: 10,
                rotate: 0,
                scale: 0.4,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: piece.x,
                y: [
                  10,
                  -80 - (piece.id % 5) * 22,
                  80 + (piece.id % 4) * 35,
                ],
                rotate:
                  piece.rotation *
                  (360 + piece.id * 40),
                scale: [0.4, 1, 0.85],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="confirmation-container">
        <motion.div
          className="confirmation-icon"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 14,
            delay: 0.1,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.35,
              duration: 0.3,
            }}
          >
            <Check
              size={34}
              strokeWidth={2.2}
            />
          </motion.div>
        </motion.div>

        <motion.span
          className="confirmation-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.35,
          }}
        >
          ORDER RECEIVED
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.45,
          }}
        >
          Thank You for Your Order!
        </motion.h1>

        <motion.p
          className="confirmation-intro"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.55,
          }}
        >
          Your fried rice order has been received and is
          being prepared with care.
        </motion.p>

        <motion.div
          className="confirmation-order-number"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.65,
          }}
        >
          <span>ORDER NUMBER</span>
          <strong>{orderNumber}</strong>
        </motion.div>

        <motion.div
          className="confirmation-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.75,
          }}
        >
          <div className="confirmation-card-heading">
            <div>
              <span>YOUR ORDER</span>
              <h2>Order Summary</h2>
            </div>

            <ShoppingBag
              size={21}
              strokeWidth={1.7}
            />
          </div>

          <div className="confirmation-items">
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                const proteins = Array.isArray(item.protein)
                  ? item.protein
                  : [item.protein];

                return (
                  <div
                    className="confirmation-item"
                    key={item.id}
                  >
                    <div>
                      <strong>{item.pan}</strong>

                      <span>
                        {proteins.join(" + ")} ·{" "}
                        {item.spice}
                      </span>

                      <small>
                        Quantity: {item.quantity}
                      </small>
                    </div>

                    <strong>
                      ${item.total}
                    </strong>
                  </div>
                );
              })
            ) : (
              <p className="confirmation-no-items">
                Order details are not available.
              </p>
            )}
          </div>

          <div className="confirmation-total">
            <span>
              {cartCount}{" "}
              {cartCount === 1 ? "pan" : "pans"}
            </span>

            <strong>${cartTotal}</strong>
          </div>
        </motion.div>

        <motion.div
          className="confirmation-actions"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.95,
          }}
        >
          <button
            type="button"
            className="confirmation-home-button"
            onClick={handleBackHome}
          >
            <Home size={17} />
            <span>Back to Home</span>
          </button>
        </motion.div>

        <motion.p
          className="confirmation-footer-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 1.1,
          }}
        >
          Thank you for choosing Ify's Signature Fried Rice.
        </motion.p>
      </div>
    </main>
  );
};

export default OrderConfirmation;