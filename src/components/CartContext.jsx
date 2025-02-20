import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);  // For loading state
  const [error, setError] = useState(null);  // To handle errors

  // Fetch the cart data from an API using axios
  const fetchCartData = async (userId) => {
    setLoading(true);  // Start loading
    try {
      const response = await axios.get(`http://localhost:8080/api/product/getProductById/${userId}`);
      const data = response.data;

      // Check if 'items' exists and is an array
      if (data && Array.isArray(data.items)) {
        const initialCartCount = data.items.reduce((count, item) => count + item.quantity, 0);
        setCartCount(initialCartCount);
        setCartItems(data.items);
      } else {
        setError('Cart items are not available in the response.');
      }
    } catch (error) {
      setError('Failed to fetch cart data');  // Handle errors
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);  // End loading
    }
  };

  // Update cart count when cart changes
  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  // Initialize cart count from the API on initial load
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Replace with dynamic userId
    fetchCartData(userId);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, cartItems, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};
