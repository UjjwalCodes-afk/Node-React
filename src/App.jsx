import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ProductPage from './components/ProductPage';
import Checkout from './components/CheckOut';
import LoginPage from './components/Login';
import { CartProvider } from './components/CartContext';
import Success from './components/SuccessPage';
import Cancel from './components/Cancel';
import CheckoutForm from './components/StripePaymentForm';
import StripeCheckout from './components/StripeCheckout';
import ThankYouPage from './components/ThankYou';
import LoadingPage from './components/LoadingPage';

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "true") {
      navigate("/product"); // Redirect to product page if logged in
    }
  }, [navigate]);

  return element;
};

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<LoginPage />} />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/cart" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/payment" element={<CheckoutForm />} />
          <Route path="/checkout" element={<StripeCheckout />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
