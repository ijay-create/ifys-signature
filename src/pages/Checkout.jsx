import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, LoaderCircle } from "lucide-react";

import "../styles/Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] = useState("");

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.total || 0),
      0
    );
  }, [cartItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError(
        "Your cart is empty. Please add something before checking out."
      );
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL ||
          "http://localhost:5000"
        }/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems,
            customer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to start payment."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error(
          "Stripe checkout URL was not returned."
        );
      }

      /*
       * Send the customer to Stripe's hosted
       * checkout page.
       */
      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      console.error(
        "CHECKOUT ERROR:",
        checkoutError
      );

      setError(
        checkoutError.message ||
          "Something went wrong. Please try again."
      );

      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>

          <p>
            Add some of Ify's Signature Fried Rice
            before checking out.
          </p>

          <Link
            to="/"
            className="checkout-back-button"
          >
            <ArrowLeft size={17} />
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link
            to="/"
            className="checkout-back-link"
          >
            <ArrowLeft size={17} />
            Back to Menu
          </Link>

          <div>
            <span className="checkout-eyebrow">
              SECURE CHECKOUT
            </span>

            <h1>Complete Your Order</h1>

            <p>
              You're just one step away from enjoying
              Ify's Signature Fried Rice.
            </p>
          </div>
        </div>

        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={handlePayment}
          >
            <div className="checkout-card">
              <div className="checkout-card-heading">
                <span>01</span>

                <div>
                  <h2>Your Details</h2>

                  <p>
                    We'll use these details for your
                    order.
                  </p>
                </div>
              </div>

              <div className="checkout-fields">
                <div className="checkout-field">
                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={customer.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="checkout-card">
              <div className="checkout-card-heading">
                <span>02</span>

                <div>
                  <h2>Payment</h2>

                  <p>
                    You'll be securely redirected to
                    Stripe to complete your payment.
                  </p>
                </div>
              </div>

              <div className="checkout-payment-notice">
                <Lock size={18} />

                <div>
                  <strong>
                    Secure payment powered by Stripe
                  </strong>

                  <span>
                    Your card information is entered
                    securely on Stripe's payment page.
                  </span>
                </div>
              </div>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="checkout-pay-button"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="checkout-spinner"
                    />

                    <span>
                      Preparing Secure Payment...
                    </span>
                  </>
                ) : (
                  <>
                    <Lock size={17} />

                    <span>
                      Pay $
                      {cartTotal.toFixed(2)}
                    </span>
                  </>
                )}
              </button>

              <p className="checkout-secure-text">
                You will be redirected to Stripe to
                securely complete your payment.
              </p>
            </div>
          </form>

          <aside className="checkout-summary">
            <div className="checkout-summary-card">
              <span className="checkout-summary-eyebrow">
                YOUR ORDER
              </span>

              <h2>Order Summary</h2>

              <div className="checkout-summary-items">
                {cartItems.map((item) => (
                  <div
                    className="checkout-summary-item"
                    key={item.id}
                  >
                    <div>
                      <strong>
                        {item.pan}
                      </strong>

                      {Array.isArray(
                        item.protein
                      ) &&
                        item.protein.length > 0 && (
                          <small>
                            {item.protein
                              .map((protein) =>
                                typeof protein ===
                                "string"
                                  ? protein
                                  : protein.name
                              )
                              .join(", ")}
                          </small>
                        )}

                      <small>
                        Qty: {item.quantity}
                      </small>
                    </div>

                    <span>
                      $
                      {Number(
                        item.total || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>

                <strong>
                  ${cartTotal.toFixed(2)}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;