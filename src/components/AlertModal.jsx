import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import "../styles/AlertModal.css";

const AlertModal = ({
  open,
  type = "error",
  message,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="alert-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`alert-modal ${
              type === "success"
                ? "alert-modal-success"
                : "alert-modal-error"
            }`}
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 24,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 24,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-modal-title"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              type="button"
              className="alert-modal-close"
              onClick={onClose}
              aria-label="Close alert"
            >
              <X size={18} />
            </button>

            <div className="alert-modal-icon">
              {type === "success" ? (
                <CheckCircle2 size={30} />
              ) : (
                <AlertCircle size={30} />
              )}
            </div>

            <span className="alert-modal-eyebrow">
              {type === "success"
                ? "Request Sent"
                : "Please Check Your Order"}
            </span>

            <h3 id="alert-modal-title">
              {type === "success"
                ? "Quote Request Received"
                : "Something Needs Your Attention"}
            </h3>

            <p>{message}</p>

            <button
              type="button"
              className="alert-modal-button"
              onClick={onClose}
            >
              Okay
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;