import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCart } from "./CartContext";
import { Navbar } from "./Navbar";
import Carousel from "./Carousel";
import PaginationOutlined from "./Pagination";
import { motion } from 'framer-motion';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { updateCartCount } = useCart();
  const [priceRange, setPriceRange] = useState([100, 100000]);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // Default sorting option
  const itemsPerPage = 9;

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('searchQuery'); // Clear searchQuery from localStorage on refresh
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/product/add/getCategory');
        console.log(res.data); // Ensure categories are fetched properly
        if (res.data.message === 'Categories found') {
          setCategories(res.data.category); // Set categories to state
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/getProducts");
        console.log(response.data);
        if (response.data?.productInfo) {
          setProducts(response.data.productInfo);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    
    const fetchCartCount = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        updateCartCount(0);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/product/count/${userId}`);
        const totalCount = response.data.totalCount || 0;
        updateCartCount(totalCount);
      } catch (error) {
        console.error("Error fetching cart count:", error);
        updateCartCount(0);
      }
    };

    fetchCartCount();
  }, [updateCartCount]);

  const handleToCart = useCallback(async (product) => {
    if (loading) return;
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in to add products to the cart.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/product/add-to-cart",
        {
          userId,
          productId: product._id,
          action: "increment",
        }
      );

      if (response.data) {
        const newCartCount = response.data.products.reduce(
          (count, item) => count + item.quantity,
          0
        );
        updateCartCount(newCartCount);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, updateCartCount]);

  const parseSearchQuery = (query) => {
    const priceRegex = /(\d+)/; // Regular expression to capture numbers (price)
    const priceMatch = query.match(priceRegex);
    const price = priceMatch ? parseInt(priceMatch[0], 10) : null; // Extract price if available
    const brand = query.replace(priceRegex, "").trim(); // Extract brand name, removing the price part
    return { brand, price };
  };

  const filteredProducts = products.filter((product) => {
    if(priceRange[0] ===0 && priceRange[1]===1000){
      return false;
    }
    const { brand, price } = parseSearchQuery(searchQuery); // Parse search query
    const matchesSearchBrand = brand ? product.prod_name.toLowerCase().includes(brand.toLowerCase()) : true; // Match brand
    const matchesSearchPrice = price ? product.prod_price === price : true; // Match price
    const matchesCategory = selectedCategory ? product.prod_category === selectedCategory : true; // Match category
    const matchesSearch = product.prod_name.toLowerCase().includes(searchQuery.toLowerCase()); // Match product name
    const matchedPrice = priceRange[0] > 0 && priceRange[1] < 1000 ? false : product.prod_price >= priceRange[0] && product.prod_price <= priceRange[1];

    return matchesCategory && matchesSearchBrand && matchedPrice && matchesSearchPrice;
  });

  // Sort products based on the selected sort order
  const sortedProducts = [...filteredProducts];
  if (sortOrder === "lowToHigh") {
    sortedProducts.sort((a, b) => a.prod_price - b.prod_price);
  } else if (sortOrder === "highToLow") {
    sortedProducts.sort((a, b) => b.prod_price - a.prod_price);
  }

  const productsToDisplay = sortedProducts.length === 0 ?  products.slice(0, 0) : sortedProducts;
  const paginatedProducts = productsToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-amber-50 min-h-screen">
      <Navbar setSearchQuery={setSearchQuery} setSelectedCategory={setSelectedCategory} setPriceRange={setPriceRange} priceRange={priceRange} />
      <Carousel />

      <div className="container mx-auto px-4 py-10">
        {paginatedProducts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {paginatedProducts.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white shadow-lg rounded-xl p-4 transition-transform"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                <img
                  src={product.prod_image}
                  alt={product.prod_name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                  {product.prod_name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">₹{product.prod_price}</p>
                <button
                  onClick={() => handleToCart(product)}
                  disabled={loading}
                  className={`w-full mt-3 py-2 font-semibold rounded-lg transition-all ${loading
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                    }`}
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No products found</p>
        )}
      </div>
      {productsToDisplay.length > itemsPerPage && (
        <div className="py-6">
          <PaginationOutlined
            totalItems={productsToDisplay.length}
            itemsPerPage={itemsPerPage}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
