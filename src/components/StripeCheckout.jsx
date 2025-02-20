import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Load Stripe.js
const stripePromise = loadStripe('pk_test_51MJri9L8uTzULmwrWzyJhT5fTrl7I8yaza0FW8nVg4uk3g0AlBMPWAYWyfChyJsWnRwdCCZeKosWepcRO8uFhzUc00VDEXpK4y');

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleCheckout = async () => {
        if (!stripe || !elements) {
            console.error('Stripe or Elements is not loaded');
            return;
        }

        try {
            // Request a payment intent from your server
            const { data } = await axios.post('http://localhost:8080/api/payment/create-payment', { amount });

            // Get the client secret from the response
            const clientSecret = data.clientSecret;

            // Get the card details
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                console.error('CardElement not found');
                return;
            }

            // Confirm the payment
            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                console.error('Payment failed:', error.message);
            } else {
                console.log('Payment succeeded!');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-20 rounded-xl shadow-xl pl-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Checkout</h2>
            <p className="text-lg text-gray-600 mb-4 text-center">Total: ₹{amount}</p>

            <div className="mb-6">
                <label className="text-sm text-gray-600 mb-2 block">Card Information</label>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                lineHeight : '5rem',
                                padding: '5px',
                                borderRadius: '8px',
                                backgroundColor: '#f8f8f8',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                        },
                    }}
                />
            </div>

            <button
                onClick={handleCheckout}
                className="w-[full] py-3 px-20 rounded-4xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white hover:bg-gradient-to-l hover:from-amber-700 hover:to-amber-600 transition duration-300 focus:outline-none"
            >
                Proceed to Checkout
            </button>

        </div>
    );
};

const StripeCheckout = ({ amount }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} />
        </Elements>
    );
};

export default StripeCheckout;
