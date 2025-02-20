import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import BillDetailsCard from "./BillDetailsCard";
import { FaArrowLeft } from "react-icons/fa"; // Import the back arrow icon
import { useNavigate } from "react-router-dom";
import CheckoutForm from "./StripePaymentForm";


const stripePromise = loadStripe("pk_test_51MJri9L8uTzULmwrWzyJhT5fTrl7I8yaza0FW8nVg4uk3g0AlBMPWAYWyfChyJsWnRwdCCZeKosWepcRO8uFhzUc00VDEXpK4y");

const Checkout = ({ totalamount }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartDataFetched, setIsCartDataFetched] = useState(false);
  const cartRef = useRef([]);
  const navigate = useNavigate();
  
  // const handleCheckout = async () => {                                           //stripe official payment gateaway 
  //   const stripe = await stripePromise; // Make sure stripe is loaded
  //   const totalAmount = products.reduce(
  //     (acc, product) => acc + (parseFloat(product.prod_price) || 0) * product.quantity,
  //     0
  //   );

  //   if (totalAmount <= 0) {
  //     alert("Cart is empty or contains invalid prices.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post("http://localhost:8080/api/payment/create-session", {
  //       amount: totalAmount,
  //     });

  //     if (response.data.sessionId) {
  //       // Make sure to redirect to Stripe's checkout
  //       const { sessionId } = response.data;
  //       const result = await stripe.redirectToCheckout({ sessionId });
  //       if(result.error){
  //         alert(result.error.message);
  //       }
  //       else{
  //         navigate('/success');
  //       }
  //     } else {
  //       alert("Failed to create session");
  //     }
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //     alert("Checkout failed");
  //   }
  // };

  const fetchProductdata = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:8080/api/product/getProductById/${userId}`);
      return response.data.product;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  };

  const updateCartInBackend = async (productId, quantity) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await axios.put("http://localhost:8080/api/product/update", {
        userId,
        productId,
        quantity,
      });
      if (response.status !== 200) throw new Error("Failed to update product quantity in the backend");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const fetchCartData = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      let fetchedCart = [];

      if (userId) {
        const response = await axios.get(`http://localhost:8080/api/product/getProductById/${userId}`);
        fetchedCart = response.data.cart.products || [];
      } else {
        const savedCart = localStorage.getItem("cart");
        fetchedCart = savedCart ? JSON.parse(savedCart) : [];
      }

      setCart(fetchedCart);
      const productDetails = await Promise.all(
        fetchedCart.map(async (item) => {
          const productData = await fetchProductdata(item.productId);
          return productData ? { ...item, ...productData } : item;
        })
      );
      setProducts(productDetails);

      const cartCount = fetchedCart.reduce((count, item) => count + item.quantity, 0);
      setCartCount(cartCount);

    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  }, []);


  const handleToCart = useCallback(
    async (product, action) => {
      const updatedCart = [...cartRef.current];
      const existingProductIndex = updatedCart.findIndex((item) => item.productId === product.productId);

      if (existingProductIndex >= 0) {
        // Update quantity if product exists
        updatedCart[existingProductIndex].quantity += action === "increment" ? 1 : -1;
        if (updatedCart[existingProductIndex].quantity < 1) updatedCart[existingProductIndex].quantity = 1;
      } else if (action === "increment") {
        // Add new product if not exists
        updatedCart.push({ ...product, quantity: 1 });
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      cartRef.current = updatedCart; // Sync with useRef

      await updateCartInBackend(product.productId, updatedCart[existingProductIndex]?.quantity);
    },
    [cart]
  );

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const response = await axios.post("http://localhost:8080/api/product/delete", { userId, productId });
      if (response.status === 200) {
        fetchCartData();
      }
      
      const deleteResponse = await axios.post("http://localhost:8080/api/order/deleteOrder", {
        userId,
        productId: productId, // Use the fetched productId
      });

      if (deleteResponse.status === 200) {
        fetchCartData(); // Refresh the cart data after deletion
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + product.prod_price * product.quantity, 0);
  };

  const calculateGST = (amount) => {
    const gstRate = 0.18;
    return amount * gstRate;
  };

  useEffect(() => {
    if (!isCartDataFetched) {
      fetchCartData();
      setIsCartDataFetched(true);
    }
  }, [isCartDataFetched, fetchCartData]);

  useEffect(() => {
    if (cart.length) {
      setCartCount(cart.reduce((count, item) => count + item.quantity, 0));
      localStorage.setItem("cart", JSON.stringify(cart));
      cartRef.current = cart; // Sync cart with useRef
    }
  }, [cart]);

  // Calculate total and GST for BillDetailsCard
  const totalAmount = calculateTotalPrice();
  
  const gstAmount = calculateGST(totalAmount);
  const totalWithGST = totalAmount + gstAmount;

  const redirectToCheckoutForm = () => {
    navigate('/payment', { state: { totalWithGST: totalWithGST } });
  };

  const handleCheckOutClick = () => {
    if(cart.length === 0){
      alert("Your cart is empty, you cannot inititate a payment");
    }
    else{
      redirectToCheckoutForm();
    }
  }
  const handleGoBack = () => {
    window.history.back();
  }


  return (
    <div className="max-h-screen  bg-white p-6 flex flex-col md:flex-row gap-6 md:gap-8">
        <button
        onClick={handleGoBack}
        className="flex items-center text-gray-700 hover:text-gray-900 transition-all mb-6 md:mb-0"
      >
        <FaArrowLeft className="w-6 h-6 mr-2" />
        <span className="text-lg font-semibold">Back</span>
      </button>
      {/* Product List */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-5 flex-1 md:mr-4">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Your Cart
        </motion.h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">Your cart is empty!</p>
        ) : (
          products.map((product, index) => (
            <div
              key={product.productId || index}
              className="flex items-center justify-between py-4 border-b border-gray-300"
            >
              <a href={product.prod_image} target="_blank" rel="noopener noreferrer">
                <img
                  src={product.prod_image}
                  alt={product.prod_name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md"
                />
              </a>
              <div className="flex-1 ml-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{product.prod_title}</h2>
                <p className="text-sm text-gray-500">{product.prod_shortDesc}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800 mt-2">₹{(product.prod_price || 0).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={() => handleToCart(product, "decrement")}
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                <span className="text-lg sm:text-xl font-semibold text-gray-800">{product.quantity}</span>
                <button
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  onClick={() => handleToCart(product, "increment")}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition ml-1.5"
                onClick={() => removeFromCart(product.productId)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bill Details Card */}
      <div className="mt-6">
        <BillDetailsCard totalAmount={totalAmount} />
        {/* Checkout Form */}
        {/* <CheckoutForm amount={totalAmount} /> */}
        <button
          // onClick={handleCheckout}
          onClick={handleCheckOutClick}
          className="w-[150px] h-[100px] py-4 px-6 p-10 bg-green-600 ml-10 text-white text-lg rounded-md mt-6 hover:bg-green-700"
        >
          Proceed to Checkout
        </button>

      </div>

      {/* Stripe Checkout Button */}

    </div>
  );
};

export default Checkout;
