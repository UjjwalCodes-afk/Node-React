import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentVerified, setPaymentVerified] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const clientSecret = localStorage.getItem('clientSecret');
            if (!clientSecret) {
                console.log('clientSecret is missing');
                navigate('/success');
                return;
            }

            try {
                // Send the clientSecret to your API to verify the payment
                const response = await axios.post('http://localhost:8080/api/payment/verify-Custom', { clientSecret });
                console.log(response.data);

                if (response.data.message === 'Payment verified successfully') {
                    console.log('Payment verified successfully');
                    setPaymentVerified(true);
                    await deleteCartItems();
                    navigate('/thankyou');      
                } else {
                    console.log('Payment verification failed');
                    setPaymentVerified(false);
                    navigate('/success');
                }
            } catch (error) {
                console.error("Error during payment verification:", error);
                setPaymentVerified(false);
                navigate('/cancel');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [location.search, navigate]);

    const deleteCartItems = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;

            // Call the delete API to remove cart items after payment
            const response = await axios.post('http://localhost:8080/api/product/deleteCart', { userId });
            if (response.status === 200) {
                console.log("Cart items deleted successfully after payment completion");
            } else {
                console.log("Failed to delete cart items");
            }
        } catch (error) {
            console.error("Error deleting cart items:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-xl">
                    <h2 className="text-xl font-semibold text-gray-700">Verifying payment...</h2>
                    <p className="mt-4">Please wait while we verify your payment.</p>
                </div>
            </div>
        );
    }

    if (paymentVerified === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-xl">
                    <h1 className="text-2xl font-bold text-red-600">Payment Failed!</h1>
                    <p className="text-lg text-gray-700 mt-4">
                        Unfortunately, there was an issue with your payment. Please try again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="text-center p-6 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
                <p className="text-lg text-gray-700 mt-4">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>
            </div>
        </div>
    );
};

export default Success;
