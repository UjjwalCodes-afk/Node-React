import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>
        <p className="text-lg text-gray-700 mt-4">
          Your payment has been cancelled. Please try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Cancel;
