import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import WhatsAppFloat from "./components/WhatsAppFloat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />
      </Routes>

      <WhatsAppFloat />
    </BrowserRouter>
  );
};

export default App;