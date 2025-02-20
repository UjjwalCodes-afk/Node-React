import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch the cart data from API or local storage
  const fetchCartData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      let fetchedCart = [];
      if (userId) {
        const response = await axios.get(`http://localhost:8080/api/product/getProductById/${userId}`);
        fetchedCart = response.data.cart?.products || [];
      } else {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          fetchedCart = JSON.parse(savedCart);
        }
      }
      setCart(fetchedCart);
      setCartCount(fetchedCart.reduce((count, item) => count + item.quantity, 0));
    } catch (error) {
      console.error("Error fetching cart data", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // Handle increasing product quantity
  const handleIncrease = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle decreasing product quantity
  const handleDecrease = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handle removing a product from the cart with an API call
  const handleDelete = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found");
        return;
      }

      // Send POST request to delete the product
      await axios.post("http://localhost:8080/api/product/delete", {
        userId,
        productId,
      });

      // Remove the product from local state after successful deletion
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  // Calculate the total price of items in the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty!</p>
          ) : (
            cart.map((item) => (
              <div key={item.prodId} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={item.prod_image}
                    alt={item.prod_title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.prod_title}</h3>
                    <p className="text-gray-500">₹{item.prod_price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="bg-gray-200 px-3 py-1 rounded-full"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="bg-gray-200 px-3 py-1 rounded-full"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill Details */}
        <div className="flex-1 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Bill Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-semibold">Subtotal:</p>
              <p className="font-semibold">₹{calculateTotal()}</p>
            </div>
            {/* Add additional details such as taxes, shipping, etc., if required */}
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button className="px-6 py-3 mt-5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CheckoutPage;
