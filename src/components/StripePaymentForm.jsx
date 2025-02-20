// import axios from 'axios';
// import React, { useState } from 'react';
// import { CardElement } from '@stripe/react-stripe-js';

// import { loadStripe } from '@stripe/stripe-js';
// import { FaCreditCard, FaCalendarAlt, FaLock } from 'react-icons/fa';
// import { useLocation, useNavigate } from 'react-router-dom';
// import stripe from 'stripe';

// const stripePromise = loadStripe('pk_test_51MJri9L8uTzULmwrWzyJhT5fTrl7I8yaza0FW8nVg4uk3g0AlBMPWAYWyfChyJsWnRwdCCZeKosWepcRO8uFhzUc00VDEXpK4y'); 

// const CheckoutForm = () => {
//     const [name, setName] = useState('');
//     const location = useLocation();
//     const { totalWithGST } = location.state || {};  // Extract totalWithGST from location state
//     console.log(location.state);  // Log the full state to check
//     const [email, setEmail] = useState('');
//     const [address, setAddress] = useState('');
//     const [city, setCity] = useState('');
//     const [postalCode, setPostalCode] = useState('');
//     const [phone, setPhone] = useState('');
//     const [cardNumber, setCardNumber] = useState('');
//     const [expiryDate, setExpiryDate] = useState('');
//     const [cvv, setCvv] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();



//     const handleSubmit = async(e) => {
//         e.preventDefault();
//         // Here you would normally trigger the checkout process (e.g., Stripe checkout)
//         if (!stripe || !elements) {
//             console.error('Stripe or Elements is not loaded');
//             return;
//         }

//         try {
//             // Request a payment intent from your server
//             const { data } = await axios.post('http://localhost:8080/api/payment/create-payment', { amount });

//             // Get the client secret from the response
//             const clientSecret = data.clientSecret;

//             // Get the card details
//             const cardElement = elements.getElement(CardElement);
//             if (!cardElement) {
//                 console.error('CardElement not found');
//                 return;
//             }

//             // Confirm the payment
//             const { error } = await stripe.confirmCardPayment(clientSecret, {
//                 payment_method: {
//                     card: cardElement,
//                 },
//             });

//             if (error) {
//                 console.error('Payment failed:', error.message);
//             } else {
//                 console.log('Payment succeeded!');

//                 // After payment, pass the clientSecret to verify payment
//                 navigate(`/success`);
//             }
//         } catch (error) {
//             console.error('Error during checkout:', error);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Checkout</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* Billing Details */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//                     <input
//                         type="text"
//                         className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                         placeholder="Full Name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="email"
//                         className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                         placeholder="Email Address"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="text"
//                         className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                         placeholder="Street Address"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         required
//                     />
//                     <div className="flex gap-4">
//                         <input
//                             type="text"
//                             className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                             placeholder="City"
//                             value={city}
//                             onChange={(e) => setCity(e.target.value)}
//                             required
//                         />
//                         <input
//                             type="text"
//                             className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                             placeholder="Postal Code"
//                             value={postalCode}
//                             onChange={(e) => setPostalCode(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <input
//                         type="text"
//                         className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                         placeholder="Phone Number"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         required
//                     />
//                 </div>


//                 {/* Card Details */}
//                 <div className="mb-6">
//                     <div className="flex items-center mb-4">
//                         <FaCreditCard className="text-gray-500 mr-2" />
//                         <input
//                             type="text"
//                             className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                             placeholder="Card Number"
//                             value={cardNumber}
//                             onChange={(e) => setCardNumber(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="flex gap-4">
//                         <div className="flex-1">
//                             <div className="flex items-center mb-4">
//                                 <FaCalendarAlt className="text-gray-500 mr-2" />
//                                 <input
//                                     type="text"
//                                     className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                                     placeholder="MM/YY"
//                                     value={expiryDate}
//                                     onChange={(e) => setExpiryDate(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex-1">
//                             <div className="flex items-center mb-4">
//                                 <FaLock className="text-gray-500 mr-2" />
//                                 <input
//                                     type="text"
//                                     className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                                     placeholder="CVV"
//                                     value={cvv}
//                                     onChange={(e) => setCvv(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Total Amount and Checkout Button */}
//                 <div className="flex justify-between items-center mb-4">
//                     {totalWithGST && (
//                         <div className="mt-2 text-xl font-semibold text-gray-900">
//                             Total Amount: ${totalWithGST.toFixed(2)}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         className="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     >
//                         Checkout
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CheckoutForm;


// src/CheckoutPage.js

import React, { useState,useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";


// Load Stripe outside of the component to avoid recreating the object on every render
const stripePromise = loadStripe("pk_test_51MJri9L8uTzULmwrWzyJhT5fTrl7I8yaza0FW8nVg4uk3g0AlBMPWAYWyfChyJsWnRwdCCZeKosWepcRO8uFhzUc00VDEXpK4y"); // Replace with your Stripe publishable key

const generateOrderId = () => {
  const timestamp = Date.now();  // Get the current timestamp in milliseconds
  return `Ord-${timestamp}`;  // Combine it with a prefix (e.g., "Ord-")
};


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState('');
  const { totalWithGST } = location.state || {}
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (!stripe || !elements) {
  //     return;
  //   }

  //   const cardElement = elements.getElement(CardElement);

  //   // Create a payment method with the card details
  //   const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: cardElement,
  //     billing_details: {
  //       email: formData.email,
  //       name: formData.name,
  //       address: formData.address,
  //       phone: formData.phone,
  //     },
  //   });

  //   if (paymentError) {
  //     setError(paymentError.message);
  //   } else {
  //     // Send the paymentMethod.id to your server to create a PaymentIntent
  //     try {
  //       const connectedAccount = 'acct_1Mh1k3Q8VttiddZc';  // Example connected account
  //       const defaultPaymentMethod = 'pm_card_visa';  // Example default payment method

  //       // First, create the PaymentIntent on your server
  //       const response = await axios.post("http://localhost:8080/api/payment/create-payment", {
  //         amount: totalWithGST,
  //         payment_method: defaultPaymentMethod,
  //       }, {
  //         headers: {
  //           'Stripe-Account': connectedAccount,  // Use the connected account for this payment
  //         },
  //       });
  //       const paymentMethodDetails = await stripe.paymentMethods.retrieve(paymentMethod.id, {
  //         stripeAccount: connectedAccount,  // Ensure you specify the connected account
  //       });
  //       if(response.data && response.data.clientSecret){
  //         navigate('/loading');
  //       }
  //       else{
  //         setError('error in navigating');
  //       }
  //       console.log(paymentMethodDetails);
        

  //       console.log(response.data);

        
        
  //     } catch (err) {
  //       console.log(err.message);
  //       console.log(err.code);
  //       setError("Error processing payment: " + err.message);
  //     }
  //   }
  // };


  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User id is required');
      return;
    }
  
    const createPaymentIntent = async () => {
      try {
        // Fetch cart items for the user by userId
        const cartResponse = await axios.get(`http://localhost:8080/api/product/getProductById/${userId}`);
        
        // Check if cart data exists and products array is non-empty
        if (!cartResponse.data || cartResponse.data.cart.products.length === 0) {
          setError("No products in cart");
          return;
        }
  
        // Set cart items to state
        setCartItems(cartResponse.data.cart.products);
        console.log(cartResponse.data);
  
        // Create Payment Intent using totalAmount
        const paymentResponse = await axios.post("http://localhost:8080/api/payment/create-payment", {
          amount: totalWithGST, // Convert amount to cents
          payment_method: "pm_card_visa", // Replace with actual payment method
        });
  
        setClientSecret(paymentResponse.data.clientSecret);
        localStorage.setItem("clientSecret",paymentResponse.data.clientSecret);
  
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Error creating payment intent.');
      }
    };
  
    createPaymentIntent();
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      setError("Stripe or Elements not loaded properly");
      return;
    }
  
    // Wait for the cartItems and clientSecret to be available
    if (!cartItems || !clientSecret) {
      setError("Cart items or payment details not ready.");
      return;
    }
  
    setIsLoading(true); // Show loading indicator while payment is being processed
  
    const cardElement = elements.getElement(CardElement);
  
    // Create an array of product details to send with the payment method
    const productDetails = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      status: item.status ? item.status : 'Pending',
    }));
    console.log(productDetails);
  
    // Create a payment method with the card details and product information
    const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: formData.email,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      },
      metadata: {
        products: JSON.stringify(productDetails),
      },
    });
  
    if (paymentError) {
      setIsLoading(false); // Hide loading indicator
      setError(paymentError.message);
      return;
    }
  
    // Step 1: Generate the order ID
    const newOrderId = generateOrderId();
  
    // Prepare order data
    const orderData = {
      userId: localStorage.getItem('userId'),
      products: productDetails,
      status: 'Pending',
      orderId: newOrderId,
    };
  
    try {
      // Step 2: Create the order on the backend with generated orderId
      const orderResponse = await axios.post("http://localhost:8080/api/order/create", orderData);
      if (orderResponse.data && orderResponse.data.message === "Order updated successfully") {
        console.log("Order created successfully:", orderResponse.data.order);
  
        // Step 3: After order creation, verify payment
        const clientSecret = localStorage.getItem('clientSecret');
        const paymentVerificationResponse = await axios.post("http://localhost:8080/api/payment/verify-Custom", {
          clientSecret,
          userId: localStorage.getItem("userId"),
          products: productDetails,
        });
  
        if (paymentVerificationResponse.data) {
          console.log("Payment Successful:", paymentVerificationResponse.data);
          localStorage.setItem('orderId', orderResponse.data.order.orderId);
          navigate("/loading"); // Redirect to success page
        } else {
          setError("Payment verification failed.");
        }
      } else {
        setError("Error creating order.");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Payment processing failed.");
    } finally {
      setIsLoading(false); // Hide loading indicator once payment processing is complete
    }
  };
  

  // const handlePayment = async () => {
  //   const stripe = await stripePromise;

  //   // Confirm the payment using the clientSecret
  //   const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

  //   if (error) {
  //     console.error('Payment failed:', error.message);
  //     setError(error.message);
  //   } else if (paymentIntent.status === 'succeeded') {
  //     // Payment succeeded, redirect to success page
  //     navigate('/success');
  //   } else {
  //     // Handle other payment statuses (e.g., requires_action, etc.)
  //     setError('Payment requires further action.');
  //   }
  // };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col w-full max-w-lg p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Checkout</h2>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 outline-none p-1"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 outline-none p-1"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <input
              type="text"
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleChange}
              className="flex-1 outline-none p-1"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg p-2">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="flex-1 outline-none p-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Details</label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    letterSpacing: "0.025em",
                    fontFamily: '"Roboto", sans-serif',
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          <p className="text-lg font-semibold text-gray-800 text-center">Total: ₹{totalWithGST.toFixed(2)}</p>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>

  );
};

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;  

