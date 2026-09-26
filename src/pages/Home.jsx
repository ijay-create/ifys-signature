import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import OrderSection from "../components/OrderSection";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

import "../App.css";

const Home = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const addToCart = (item) => {
    setCartItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (cartItem) =>
          cartItem.panId === item.panId &&
          cartItem.spice === item.spice &&
          JSON.stringify(cartItem.protein) ===
            JSON.stringify(item.protein)
      );

      if (existingItemIndex !== -1) {
        return currentItems.map((cartItem, index) => {
          if (index !== existingItemIndex) return cartItem;

          const newQuantity = cartItem.quantity + item.quantity;

          return {
            ...cartItem,
            quantity: Math.min(newQuantity, 10),
            total: cartItem.price * Math.min(newQuantity, 10),
          };
        });
      }

      return [
        ...currentItems,
        {
          ...item,
          id: `${item.panId}-${Date.now()}`,
          quantity: item.quantity || 1,
          total: item.price * (item.quantity || 1),
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (id, change) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;

        const newQuantity = Math.min(
          Math.max(item.quantity + change, 1),
          10
        );

        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity,
        };
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleEventSelect = (eventTitle) => {
    setSelectedEvent(eventTitle);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.total,
    0
  );

  return (
    <>
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <Hero />

        <Features />

        <OrderSection onAddToCart={addToCart} />

        <EventsSection onEventSelect={handleEventSelect} />

        <AboutSection />

        <ContactSection selectedEvent={selectedEvent} />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        cartItems={cartItems}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onContinueShopping={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Home;