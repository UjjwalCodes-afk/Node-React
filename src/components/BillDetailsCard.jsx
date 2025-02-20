import React from "react";

// Function to calculate GST (assuming GST is 18%)
const calculateGST = (amount) => {
  const gstRate = 0.18;
  return amount * gstRate;
};

const BillDetailsCard = ({ totalAmount }) => {
  // Ensure totalAmount is a valid number
  if (isNaN(totalAmount) || totalAmount < 0) {
    return (
      <div className="max-w-sm mx-auto bg-white shadow-xl rounded-lg p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h3>
        <p className="text-red-500">Invalid total amount provided.</p>
      </div>
    );
  }

  const gstAmount = calculateGST(totalAmount);
  const totalWithGST = totalAmount + gstAmount;

  return (
    <div className="max-w-sm mx-auto bg-white shadow-xl rounded-lg p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Bill Details</h3>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Subtotal:</span>
        <span className="font-semibold text-gray-800">₹{totalAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">GST (18%):</span>
        <span className="font-semibold text-gray-800">₹{gstAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Total (with GST):</span>
        <span className="font-semibold text-gray-800">₹{totalWithGST.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BillDetailsCard;
