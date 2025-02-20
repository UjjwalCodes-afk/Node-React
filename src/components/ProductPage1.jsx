// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// // import { Navbar } from './Navbar';
// import Carousel from './Carousel';
// import PaginationOutlined from './Pagination';
// import { useNavigate } from 'react-router-dom';

// const ProductCard = () => {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [cartCount, setCartCount] = useState(0); // Cart item count
//   const [searchTerm, setSearchTerm] = useState('');
//   const [navbarActive, setNavbarActive] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1); // Track current page
//   const [productsPerPage] = useState(8); // Number of products per page
//   const [loading, setLoading] = useState(false); // Loading state to prevent multiple requests
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/auth/getProducts');
//         if (response.data && response.data.productInfo) {
//           setProducts(response.data.productInfo);
//         } else {
//           console.error('No product info found in response');
//         }
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []); 

//   useEffect(() => {
//     const loadCartFromStorage = () => {
//       const savedCart = localStorage.getItem('cart');
//       if (savedCart) {
//         try {
//           const parsedCart = JSON.parse(savedCart);
//           setCart(parsedCart);
//           const cartItemCount = parsedCart.reduce((count, item) => count + item.quantity, 0);
//           setCartCount(cartItemCount);
//         } catch (error) {
//           console.error('Error loading cart from storage:', error);
//         }
//       }
//     };
//     loadCartFromStorage();
//   }, []);

//   useEffect(() => {
//     if (cart.length > 0) {
//       try {
//         localStorage.setItem('cart', JSON.stringify(cart));
//       } catch (error) {
//         console.error('Error saving cart to localStorage:', error);
//       }
//     }
//   }, [cart]);

//   const handleToCart = useCallback(
//     async (product) => {
//       if (loading) return;

//       setLoading(true);
//       try {
//         const response = await axios.post('http://localhost:8080/api/product/add-to-cart', {
//           userId: localStorage.getItem('userId') || null,
//           productId: product._id,
//           action: 'increment',
//         });

//         if (response.data) {
//           const updatedCart = response.data.products;
//           setCart(updatedCart);

//           const updatedCartCount = updatedCart.reduce(
//             (count, item) => count + item.quantity,
//             0
//           );
//           setCartCount(updatedCartCount);
//           localStorage.setItem('cart', JSON.stringify(updatedCart));
//         }
//       } catch (error) {
//         console.log('Error adding product to cart:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [loading]
//   );

//   const filteredProducts = products.filter((product) =>
//     product.prod_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div>
//       <Navbar />
//       <Carousel />
//       <div className="container mx-auto p-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
//           {currentProducts.map((product) => (
//             <div
//               key={product._id}
//               className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
//             >
//               <a href={product.prod_image} target="_blank" rel="noopener noreferrer">
//                 <img
//                   src={product.prod_image}
//                   alt={product.prod_name}
//                   className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
//                 />
//               </a>
//               <div className="p-4 flex flex-col flex-grow">
//                 <h3 className="text-xl font-semibold text-gray-800 truncate">{product.prod_name}</h3>
//                 <p className="text-gray-600 text-sm mt-2">{product.prod_des.slice(0, 100)}...</p>
//                 <p className="text-lg font-semibold text-gray-800 mt-4">₹{product.prod_price}</p>
//               </div>
//               <button
//                 onClick={() => handleToCart(product)} 
//                 className="w-full py-2 bg-blue-500 text-white rounded-b-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
//                 disabled={loading} 
//               >
//                 {loading ? 'Adding...' : 'Add to Cart'}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <PaginationOutlined
//         productsPerPage={productsPerPage}
//         totalProducts={filteredProducts.length}
//         paginate={paginate}
//         currentPage={currentPage}
//       />
//     </div>
//   );
// };

// export default ProductCard;
