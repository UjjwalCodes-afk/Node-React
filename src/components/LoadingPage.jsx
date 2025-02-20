import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoadingPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const navigate = useNavigate();


    useEffect(() => {
        const storedClient = localStorage.getItem('clientSecret');
        if(storedClient){
            setClientSecret(storedClient);
        }
        else{
            setError('client secret not found');
            setLoading(false);
        }
    }, [])
    

  useEffect(() => {
    if(!clientSecret) return;
    const verifyPayment = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/payment/verify-Custom', {
          clientSecret,
        });

        if (response.data.message === 'Payment verified successfully') {
          setMessage('Payment verified successfully!');
          setTimeout(() => {
                navigate('/success');
          }, 3000);
        } else {
          setMessage('Payment verification failed.');
        }
      } catch (err) {
        console.log(err);
        setError('Error verifying payment.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [clientSecret]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-6 bg-white shadow-lg rounded-lg w-96"
      >
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-solid rounded-full border-gray-900 border-t-transparent mb-4"></div>
            <p className="text-lg text-gray-600">Verifying Payment...</p>
          </div>
        ) : error ? (
          <div>
            <p className="text-red-600 text-xl">{error}</p>
          </div>
        ) : (
          <div>
            <p className="text-green-600 text-xl">{message}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingPage;
