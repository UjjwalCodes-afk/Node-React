import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";


const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateOrderStatus = async () => {
      try {
        const orderId = localStorage.getItem('orderId');
        if (orderId) {
          const response = await axios.post('http://localhost:8080/api/order/updateStatus', {
            orderId: orderId,
            status: "Shipped",
          });
          console.log('Order updated', response.data);
        } else {
          console.log("No orderId found in localStorage");
        }
      } catch (error) {
        console.log('Error updating order:', error);
      }
    };

    updateOrderStatus(); // Call the function to update the order status
    
    const timer = setTimeout(() => {
      navigate("/product");
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div
        className="bg-white p-10 rounded-lg shadow-lg max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl font-extrabold text-gray-800"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Thank You!
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Your payment was successful. You Order will be delievered to your respected address
        </motion.p>

        <motion.div
          className="mt-6 bg-indigo-500 text-white py-2 px-6 rounded-lg font-semibold text-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.p
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Redirecting to Products...
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
