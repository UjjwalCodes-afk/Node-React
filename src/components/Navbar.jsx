import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useCart } from "./CartContext";
import { IconButton, Drawer, Slider, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Navbar = ({ setSearchQuery, selectedCategory, setSelectedCategory, setPriceRange, priceRange }) => {
  const { cartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/product/add/getCategory");
        if (res.data.message === "Categories found") {
          setCategories(res.data.category);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/getProducts");
        if (res.data.message === "Products found") {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (priceRange[0] === 0 && priceRange[1] === 1000) {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter((product) => {
        return (
          product.price >= priceRange[0] &&
          product.price <= priceRange[1] &&
          (selectedCategory ? product.category === selectedCategory : true)
        );
      });
      setFilteredProducts(filtered);
    }
  }, [priceRange, selectedCategory, products]);

  const toggleSidebar = (open) => {
    setIsSidebarOpen(open);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.trim();
    setSearchQuery(searchTerm);
    localStorage.setItem("searchQuery", searchTerm);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token"); // Remove token or session data
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-red-500 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <IconButton onClick={() => toggleSidebar(true)} className="md:hidden">
          <FaBars className="text-white" />
        </IconButton>
        <div className="text-white text-xl font-bold text-center flex-1">
          <a href="/">Shopify</a>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center flex-1">
          <input
            type="text"
            placeholder="Search products..."
            className="w-40 sm:w-96 p-2 border-0.9 rounded-full text-black bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            onChange={handleSearch}
          />
        </div>

        {/* Cart & Logout Icons */}
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/cart")} className="relative">
            <FaShoppingCart className="text-white w-6 h-6 cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Logout Icon */}
          <button onClick={handleLogout}>
            <FaSignOutAlt className="text-white w-6 h-6 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Sidebar Filters */}
      <Drawer anchor="left" open={isSidebarOpen} onClose={() => toggleSidebar(false)}>
        <div className="w-64 sm:w-80 p-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <div className="mt-4">
            <h3 className="font-semibold">Price Range</h3>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={100}
              max={100000}
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Categories</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border-2 border-blue-400 rounded-md p-3 text-gray-700 font-medium shadow-lg hover:ring-2 hover:ring-blue-500 transition duration-200 ease-in-out"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Products</h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              ) : filteredProducts.length === 0 ? (
                <p>No products match the selected criteria. Please adjust the filters.</p>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product._id} className="flex justify-between items-center">
                    <p>{product.name}</p>
                    <p>${product.price}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </nav>
  );
};
