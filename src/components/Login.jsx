import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ }) => {  // Only destructure setIsLogin from props
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // For loading feedback
  const navigate = useNavigate();  // Initialize useNavigate for page redirection



  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");  // Clear previous error

    try {
      setLoading(true);  // Set loading to true during request

      // Simulate an API call to login (replace with your actual API logic)
      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });

      // On successful login, save token and set login state
      if (response.status === 200) {
        // Save the JWT token in localStorage
        localStorage.setItem('jwt_token', response.data.token);
        console.log(response.data);
        localStorage.setItem('isLogin', 'true');  // Set login status to true
        localStorage.setItem("userId", response.data.userId);
        // Set the token in axios headers for subsequent requests
        axios.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;

        // Set isLogin state in parent (App component)
        setIsLogin(true);  // Use setIsLogin from props

        // Redirect to product page or home page
        navigate('/product');

      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);  // Reset loading after request is complete
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
