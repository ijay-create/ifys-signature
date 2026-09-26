import React from "react";
import { MessageCircle } from "lucide-react";

import "../styles/WhatsAppFloat.css";

const WhatsAppFloat = () => {
  const phoneNumber = "16176500061";

  const message =
    "Hi Ify! I'd like to place an order or ask about your fried rice services.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat with Ify's Signature Fried Rice on WhatsApp"
    >
      <span className="whatsapp-float-pulse" />

      <span className="whatsapp-float-icon">
        <MessageCircle
          size={25}
          strokeWidth={2}
        />
      </span>

      <span className="whatsapp-float-text">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppFloat;