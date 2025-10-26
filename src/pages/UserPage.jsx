import React, { useEffect, useState } from 'react';
import { User, ShoppingCart, Heart, Package, MapPin, CreditCard, Bell, Settings, HelpCircle, LogOut, Search, Star, Plus, Minus, Trash2, Eye, Tag, ChevronLeft, Calendar, ChevronRight, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaGooglePay } from "react-icons/fa";
import { SiPaytm } from "react-icons/si";
import { SiContactlesspayment } from "react-icons/si";
import UserAddress from '../compoenents/UserAddress';
import UserOrders from '../compoenents/UserOrders';
import { FaRegUser } from "react-icons/fa";


const base_url_address = import.meta.env.VITE_BASE_URL
const base_url_products = import.meta.env.VITE_BASE_URL_PRODUCTS;
const base_url_img = import.meta.env.VITE_BASE_URL;


console.log("base url",base_url_products);


const UserPage = () => {
  const location = useLocation();
  const loginUser = location.state?.loginUser;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [buyItems, setBuyItems] = useState([]);
  const [showSection, setShowSection] = useState({ id: 'products' });
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(null);
  const [viewAddTocartItemModal, setViewAddTocartItemModal] = useState(false);
  const [viewBuyItemModal, setViewBuyItemModal] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("name");
  const [allProduct, setAllProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qr, setQr] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("phonepe")
  const [userSavedAddress, setUserSavedAddress] = useState(null)
  const [profileCard, setProfileCard] = useState(false)
  const [userOrders, setUserOrders] = useState(null)
  const [offersProducts, setOffersProducts] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectOfferProducts, setSelectOfferProducts] = useState([])
  const [offersBuyModal, setOffersBuyModal] = useState(false)
  const [selectedOfferProduct, setSelectedOfferProduct] = useState(null)
  const [quantity, setQuantity] = useState(1);
  const [viewOffersProductModal, setViewOffersProductModal] = useState(false)
  const [deletItemInCart, setDeletItemInCart] = useState(false)

  const itemsPerPage = 4;


  // console.log("yashif ");



  // ✅ base price & discount
  const price = Number(selectedOfferProduct?.productsInfo?.price || 0);
  const discount = Number(selectedOfferProduct?.discount || 0);
  const discountedPrice = price - (price * discount) / 100;

  // ✅ total after quantity
  const total = (discountedPrice * quantity).toFixed(2);

  // ✅ increment quantity
  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // ✅ decrement quantity (minimum 1)
  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // ✅ remove item
  const handleRemove = () => {
    setQuantity(1);
    console.log("Product removed");
  };







  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`${base_url_products}/getAllProducts`);
      setProducts(resp?.data.data);
      setAllProduct(resp?.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user cart items
  const fetchUserCart = async () => {
    try {
      // const resp = await axios.get(`http://localhost:8000/api/v1/cart/getCartItems/${loginUser.id}`);
      const resp = await axios.get(`${base_url_address}/api/v1/cart/getCartItems/${loginUser.id}`);


      if (resp.data.success) {
        setCartItems(resp.data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // fetch user address 
  const fetchAddress = async () => {
    const resp = await axios.get(`${base_url_address}/api/v1/address/getAddresById/${loginUser?.id}`)
    if (resp.data.success === true) {
      setUserSavedAddress(resp.data.data[0])
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchAddress()
    if (loginUser) {
      fetchUserCart();
    }
  }, [loginUser]);

  // fetch products orderded 
  const fetchorder = async () => {
    const resp = await axios.get(`${base_url_address}/api/v1/orders/getOrdersByUser/${loginUser?.id}`)
    console.log("resp of get orders", resp.data.data);
    setUserOrders(resp.data.data)
    if (resp.data.success) {
      const parsedOrders = resp.data.data.map((order) => ({
        ...order,
        delivered_address: JSON.parse(order.delivered_address), // ✅ parse here
      }));
      setUserOrders(parsedOrders);
    }


  }

  useEffect(() => {
    fetchorder()
  }, [])

  // fetch product for have offer  offer

  const fetchOffersProducts = async () => {
    const resp = await axios.get(`${base_url_products}/getOffersProducts`)
    console.log("resp of offers api", resp.data);
    if (resp?.data?.success){
      setOffersProducts(resp?.data?.data)

    }else{
      setOffersProducts([])
    }
  }
  useEffect(() => {
    fetchOffersProducts()
  }, [])


  // Filter and sort products
  useEffect(() => {
    let result = allProduct || [];
    if (searchTerm.trim().length > 0) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }
    result = [...result].sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "price-low") {
        return a.price - b.price;
      } else if (sortOption === "price-high") {
        return b.price - a.price;
      }
      return 0;
    });

    setProducts(result);
  }, [searchTerm, selectedCategory, sortOption, allProduct]);






  const categories = ["All", ...new Set(allProduct?.map(p => p.category) || [])];

  const sidebarItems = [
    { id: 'products', label: 'All Products', icon: Package },
    { id: 'orders', label: 'My Orders', icon: ShoppingCart },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    navigate("/");
    toast.success("Logout Successfully")
    localStorage.removeItem("role")

  };

  // Add To Cart functions
  const addToCart = async (product) => {
    const quantity = product.quantity || 1;
    const cartItem = {
      user_id: loginUser.id,
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.image_url
    };

    try {
      const resp = await axios.post(
        // `http://localhost:8000/api/v1/cart/addToCart/${cartItem.user_id}`,
        `${base_url_address}/api/v1/cart/addToCart/${cartItem.user_id}`,

        cartItem
      );
      console.log("Resp of add to cart:", resp.data);
      toast.success("Product Added to your Cart");
      fetchUserCart(); // Refresh cart items
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart");
    }
  };

  // Buy Now Function 
  const buyNow = (product, discountedPrice) => {
    const updatedProduct = {
      ...product, price: discountedPrice ? discountedPrice : product.price,
    };

    console.log("updated product", updatedProduct);

    setSelectedProduct(product)
    setBuyItems([{ ...product, quantity: 1 }])
    setViewBuyItemModal(true);
  };

  const removeFromCart = async (productId) => {
    console.log("products id", productId);
    console.log("delect products item", deletItemInCart);

    try {
      const resp = await axios.delete(
        // `http://localhost:8000/api/v1/cart/removeFromCart/${loginUser.id}/${productId}`
        `${base_url_address}/api/v1/cart/deletItemFromCart/${productId}/${loginUser.id}/${deletItemInCart}`
      );
      if (resp.data.success) {
        fetchUserCart();
        toast.success("Product removed from cart");
      }
      fetchUserCart()
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove product from cart");
    }
  };

  const deleteFromCart = async (productId) => {
    console.log("product id is", productId);

    try {
      const resp = await axios.delete(
        // `http://localhost:8000/api/v1/cart/deletItemFromCart/${productId}/${loginUser.id}`
        `${base_url_address}/api/v1/cart/deletItemFromCart/${productId}/${loginUser.id}`

      );
      console.log("resp of api :", resp);

      if (resp.data.success) {
        fetchUserCart();
        toast.success("Product removed from cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product from cart");
    }
  };

  const getCartItemQuantity = (productId) => {
    // const item = cartItems.find(item => item.product_id === productId);
    // return item ? item.quantity : 0;
  };

  const getTotalCartItems = () => {
    // return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
  };

  const getBuyTotalPrice = () => {
    return buyItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);
  };

  // Product Details Modal Component
  const ProductDetailsModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-4 border-green-600">

          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-green-700">Product Details</h2>
            <button
              onClick={() => setShowProductDetails(false)}
              className="text-red-500 hover:text-red-700 transition text-xl"
            >
              ✕
            </button>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 w-48 h-48 flex items-center justify-center overflow-hidden">
                <img
                  src={`${base_url_img}${selectedProduct?.image_url}`}
                  alt={selectedProduct?.name || "Product image"}
                  className="max-h-full object-contain"
                />
              </div>
            </div>

            {/* Title + Category */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">{selectedProduct?.name}</h3>
              <p className="text-sm text-gray-500">{selectedProduct?.category}</p>
            </div>

            {/* Description */}
            {
              selectedProduct.stock < 1 ? <p className='text-red-600 text-sm'>Currently Unavilable (out of stock)</p> :
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {selectedProduct.description}
                </p>
            }
            {/* Price + Category Badge */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  ₹{selectedProduct?.price}
                </span>
                {selectedProduct?.discount > 0 && (
                  <span className="ml-2 text-sm text-red-500 line-through">
                    ₹{Math.round(selectedProduct.price * (1 + selectedProduct.discount / 100))}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                {selectedProduct?.category}
              </span>
            </div>

            {/* Shopkeeper */}
            <div className="text-sm text-gray-500">
              Sold by:{" "}
              <span className="font-medium text-gray-700">
                {selectedProduct?.shopkeeper_name}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {getCartItemQuantity(selectedProduct?.id) > 0 ? (
                <div className="flex items-center border border-green-500 rounded-lg flex-1">
                  <button
                    onClick={() => removeFromCart(selectedProduct?.id)}
                    className="p-2 text-green-600 hover:bg-green-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-2 text-green-600 font-semibold">
                    {getCartItemQuantity(selectedProduct?.id)}
                  </span>
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="p-2 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md"
                >
                  Add to Cart
                </button>
              )}
              <button
                disabled={selectedProduct.stock < 1}
                onClick={() => buyNow(selectedProduct)}
                className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 
    ${selectedProduct.stock < 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {selectedProduct.stock < 1 ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

    );
  };

  // scroll right or left 
  const handleSlide = (direction) => {
    if (direction === "right") {
      if (currentIndex + itemsPerPage < offersProducts.length) {
        setCurrentIndex(currentIndex + itemsPerPage);
      }
    } else {
      if (currentIndex - itemsPerPage >= 0) {
        setCurrentIndex(currentIndex - itemsPerPage);
      }
    }
  };

  // Get only 4 items for current view
  const visibleProducts = offersProducts?.slice(currentIndex, currentIndex + itemsPerPage);



  const offerProductdBuy = (p, discountedPrice) => {
    setOffersBuyModal(true)
    console.log("p--->>>", p, discountedPrice);
    setSelectedOfferProduct(p)

    console.log("am enter in buy offerducts ection ");

  }

  // Render content based on active section
  const renderContent = () => {
    switch (showSection.id) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
                <p className="text-gray-600 mt-1">Browse available products from various sellers</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <input
                    type="search"
                    placeholder='Search Products...'
                    className='w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            {/* Slider Offers Products */}
            <div className="p-2 bg-gradient-to-br from-green-50 via-white to-red-50">
              {/* Header Section */}


              {offersProducts && offersProducts.length > 0 ? (
                <div className="relative w-full max-w-6xl mx-auto">
                  {/* Left Button */}
                  <button
                    onClick={() => handleSlide("left")}
                    disabled={currentIndex === 0}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-2 shadow-xl transition-all duration-300 group ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:shadow-2xl hover:scale-110"
                      }`}
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>

                  {/* Slider Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-6 py-4 transition-all duration-500">
                    {visibleProducts.map((p) => {
                      const discountedPrice = (
                        p.productsInfo.price -
                        (p.productsInfo.price * p.discount) / 100
                      ).toFixed(2);

                      return (
                        <div
                          key={p.id}
                          className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-green-300 transform hover:-translate-y-1"
                        >
                          {/* Image */}
                          <div className="relative bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center overflow-hidden h-36">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <img
                              src={`http://localhost:8000${p.productsInfo?.image_url}`}
                              alt={p.productsInfo?.name || "Product"}
                              className="object-contain w-28 h-28 drop-shadow-lg group-hover:scale-105 transition-all duration-500"
                            />

                            {/* Discount Badge */}
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                              <Tag className="w-3 h-3" />
                              {p.discount}% OFF
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {p.productsInfo.category}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-2">
                            <h3 className="text-base font-bold text-gray-800 truncate mb-1 group-hover:text-green-600 transition-colors">
                              {p.productsInfo.name}
                            </h3>
                            <p className="text-gray-600 text-[11px] leading-snug line-clamp-2 mb-2">
                              {p.productsInfo.description}
                            </p>

                            {/* Price */}
                            <div className="flex items-end gap-2 mb-1">
                              <div className="flex flex-col">
                                <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                  ₹{discountedPrice}
                                </span>
                                <span className="text-[10px] text-gray-400 line-through">
                                  ₹{p.productsInfo.price}
                                </span>
                              </div>
                              <div className="ml-auto bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-2 py-[2px] rounded-lg text-[10px] font-bold border border-green-200">
                                Save ₹{(p.productsInfo.price - discountedPrice).toFixed(2)}
                              </div>
                            </div>

                            {/* Validity */}
                            <div className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-red-50 to-pink-50 px-2 py-[2px] rounded-lg border border-red-100 mb-2">
                              <Calendar className="w-3 h-3 text-red-500" />
                              <span className="text-gray-700">Valid till</span>
                              <span className="font-semibold text-red-600">
                                {new Date(p.end_date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            {/* Button */}
                            <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700
     hover:to-green-600 text-white text-xs font-semibold py-1.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-2"
                              onClick={() => offerProductdBuy(p, discountedPrice)}
                            >
                              Buy Now
                            </button>
                            <button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700
     hover:to-red-600 text-white text-xs font-semibold py-1.5 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              onClick={() => {
                                setViewOffersProductModal(true); setSelectedOfferProduct(p);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Button */}
                  <button
                    onClick={() => handleSlide("right")}
                    disabled={currentIndex + itemsPerPage >= offersProducts.length}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 shadow-xl transition-all duration-300 group ${currentIndex + itemsPerPage >= offersProducts.length
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:shadow-2xl hover:scale-110"
                      }`}
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  {/* <div className="inline-block bg-gradient-to-br from-red-100 to-pink-100 rounded-full p-4 mb-2">
                    <Package className="w-12 h-12 text-red-500" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mb-1">
                    No Products Available
                  </p>
                  <p className="text-gray-500 text-sm">Check back soon for exciting offers! 🎉</p> */}
                </div>
              )}
            </div>

            <div className="p-2 bg-gray-50 min-h-screen">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : products?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600 max-w-md">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products?.map((product) => {
                    const cartQuantity = getCartItemQuantity(product.id);
                    // console.log("products stock",product.stock);


                    return (
                      <div
                        key={product.id}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-green-200/50 hover:-translate-y-1 transition-all duration-300 ease-out"
                      >
                        <div className="p-4">
                          {/* Product Image */}
                          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 h-32 flex items-center justify-center overflow-hidden">
                            <img
                              src={`${base_url_img}${product?.image_url}`}
                              alt={product.name || "Product image"}
                              className="max-h-28 object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                            {/* Quick View Button */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={() => openProductDetails(product)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-red hover:text-white bg-red-500 hover:bg-red-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Product Title */}
                          <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-green-600 transition-colors duration-200">
                            {product.name}
                          </h3>

                          {/* Product Description */}
                          {
                            product.stock < 1 ? <p className='text-red-600 text-sm'>Currently Unavilable (out of stock)</p> :
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>
                          }

                          {/* Price + Category */}
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-green-600">
                                ₹{product.price.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                              {product.category}
                            </span>
                          </div>

                          {/* Seller Info */}
                          <div className="text-xs text-gray-500 mb-4 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Sold by:{" "}
                            <span className="font-medium text-gray-700 ml-1">
                              {product.shopkeeper_name}
                            </span>
                          </div>

                          {/* Cart / Buy Buttons */}
                          <div className="flex gap-2">
                            {cartQuantity > 0 ? (
                              <div className="flex items-center border border-green-500 rounded-lg flex-1">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="p-2 text-green-600 hover:bg-green-50"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-3 py-2 text-green-600 font-semibold">
                                  {cartQuantity}
                                </span>
                                <button
                                  onClick={() => addToCart(product)}
                                  className="p-2 text-green-600 hover:bg-green-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(product)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-600/25 hover:shadow-green-600/40"
                              >
                                Add to Cart
                              </button>
                            )}
                            <button
                              disabled={product.stock < 1}
                              onClick={() => buyNow(product)}
                              className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 
    ${product.stock < 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {product.stock < 1 ? "Out of Stock" : "Buy Now"}
                            </button>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              )}
            </div>
          </div>
        );

      case 'orders':
        return (

          <UserOrders loginUser={loginUser}></UserOrders>
          // <div className="bg-white rounded-xl shadow-md p-6">
          //   <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>
          //   <div className="text-center text-gray-500 py-8">
          //     <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          //     <p>No orders found</p>
          //     <p className="text-sm">Your order history will appear here</p>
          //   </div>
          // </div>
        );

      case 'addresses':
        return (
          <UserAddress sidebarItems={sidebarItems} showSection={showSection} loginUser={loginUser} />
        )

      default:
        return (
          <h1>Feature is Comming soon .........</h1>
        );
    }
  };

  const paymentFunction = () => {
    setQr(true)
  }

  // Fixed payment confirmation function
  const paymentConfirm = async () => {
    try {
      // Validate required data
      if (!buyItems || buyItems.length === 0) {
        toast.error("No items selected for purchase");
        return;
      }

      if (!userSavedAddress) {
        toast.error("Please add a delivery address first");
        return;
      }

      const orderData = {
        payment_method: paymentMethod,
        delivered_address: {
          landmark: userSavedAddress.landmark,
          district: userSavedAddress.district,
          state: userSavedAddress.state,
          country: userSavedAddress.country,
          pincode: userSavedAddress.pincode
        },
        product_id: buyItems[0].id,
        buy_price: buyItems[0].price,
        quantity: buyItems[0].quantity
      };

      // Submit order to API
      const resp = await axios.post(
        `${base_url_address}/api/v1/orders/addOrders/${loginUser.id}`,
        orderData
      );

      console.log("Order response:", resp);

      if (resp.data.success) {
        toast.success("Order placed successfully!");

        // Close all modals and reset state
        setQr(false);
        setViewBuyItemModal(false);
        setBuyItems([]);
        setSelectedProduct(null);
      } else {
        toast.error("Failed to place order. Please try again.");
      }

    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };



  // console.log(userSavedAddress);


  // console.log("userOrders",userOrders);


  console.log("viewOffersProductModal", viewOffersProductModal);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">BilinKit Shop</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3 bg-white shadow rounded-lg px-4 py-2" onClick={() => setProfileCard(true)}>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white font-bold">
                {loginUser?.name?.[0].toUpperCase()}
              </div>
              <h2 className="text-gray-800 font-medium">
                Welcome, <span className="font-semibold">{loginUser?.name}</span>
              </h2>
              <button className="ml-auto text-sm text-red-500 hover:text-gray-800">
                <FaRegUser />
              </button>
            </div>



            <div className="relative">

              <button onClick={() => setViewAddTocartItemModal(true)} className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors" >
                <div className="relative">
                  <ShoppingCart className={`h-7.5 w-7.5 ${cartItems?.length > 0 ? "" : ""}`} />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                {getTotalCartItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalCartItems()}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {isLoggedIn && (
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200 sticky top-16">
            <nav className="mt-6">
              {sidebarItems?.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setShowSection(item)}
                    className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${showSection.id === item.id ? 'bg-green-50 border-r-2 border-green-500 text-green-600' : 'text-gray-700'}`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Info in Sidebar */}
            <div className="mt-6 pt-6 border-t border-gray-200 px-6">
              <div className="text-center">
                <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-gray-800">{loginUser?.name}</p>
                <p className="text-sm text-gray-500">{loginUser?.email}</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      )}

      {!isLoggedIn && (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Blinkit</h2>
            <p className="text-gray-600 mb-6">Please login to access your account and start shopping</p>
            <button
              onClick={handleLogin}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
            >
              Login to Continue
            </button>
          </div>
        </div>
      )}

      {/* show profile cart  */}
      {profileCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border-t-4 border-green-600">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-green-700">Your Profile</h2>
              <button
                onClick={() => setProfileCard(false)}
                className="text-red-500 hover:text-red-700 transition text-xl"
              >
                ✕
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Profile Image / Icon */}
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-md">
                {loginUser?.profilePic ? (
                  <img
                    src={loginUser?.profilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-green-700">
                    {loginUser?.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name + Email */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {loginUser?.name}
                </h3>
                <p className="text-gray-500 text-sm">{loginUser?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 rounded-xl p-5 shadow-md border border-gray-200 
                hover:shadow-lg hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1">

                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    Address
                  </h4>
                </div>

                {/* Address Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Landmark:</span>
                    <span>{userSavedAddress?.landmark}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">District:</span>
                    <span>{userSavedAddress?.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">State:</span>
                    <span>{userSavedAddress?.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Pincode:</span>
                    <span>{userSavedAddress?.pincode}</span>
                  </div>
                </div>
              </div>


              {/* Right - Other Info */}
              <div className="bg-gray-50 rounded-xl p-5 shadow-md border border-gray-200 
                hover:shadow-lg hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-semibold text-green-700 mb-3">Other Info</h4>
                <p className="text-sm text-gray-700">Phone: +91-9876543210</p>
                <p className="text-sm text-gray-700">Member since: Jan 2025</p>
                <p className="text-sm text-gray-700">Orders: {userOrders.length}</p>
                {/* You can replace with dynamic fields */}
              </div>
            </div>


            {/* Actions */}
            <div className="mt-6 space-y-3">
              {/* <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md">
          Edit Profile
        </button> */}

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all font-semibold shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}


      {/* View Cart Modal */}
      {viewAddTocartItemModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-4 border-green-600">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-green-700">Your Cart Items</h2>
              <button
                onClick={() => setViewAddTocartItemModal(false)}
                className="text-red-500 hover:text-red-700 transition text-xl"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems?.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cartItems?.map(item => (
                    // console.log("item id",item.id),
                    
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border-b border-gray-200"
                    >
                      {/* Product Image + Info */}
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          <img
                            src={`${base_url_img}${item?.image_url}`}
                            alt={item.name || "Product image"}
                            className="max-h-12 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">₹{item.price}</p>
                        </div>
                      </div>

                      {/* Quantity Controls + Price */}
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-1 text-green-500 hover:bg-green-50 rounded-full"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">₹{item.price * item.quantity}</p>
                        </div>
                        <button
                          onClick={() => { removeFromCart(item.id); setDeletItemInCart(true) }}
                          className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total Section */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{getTotalPrice()}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md mt-4"
                    onClick={paymentFunction}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Buy Now Modal */}
      {viewBuyItemModal && (


        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-4 border-green-600">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-green-700">Buy Now </h2>
              <button
                onClick={() => setViewBuyItemModal(false)}
                className="text-red-500 hover:text-red-700 transition text-xl"
              >
                ✕
              </button>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              {buyItems?.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No items selected</p>
                </div>
              ) : (
                <>
                  {buyItems?.map(item => (


                    console.log("buy item ", item),

                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border-b border-gray-200"
                    >
                      {/* Product Image + Info */}
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          <img
                            src={`${base_url_img}${item?.image_url}`}
                            alt={item.name || "Product image"}
                            className="max-h-12 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">₹ {item.price} × {item.quantity}</p>
                        </div>
                      </div>

                      {/* Quantity Controls + Price */}
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                setBuyItems(buyItems.map(i =>
                                  i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                                ));
                              }
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => {
                              setBuyItems(buyItems.map(i =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                              ));
                            }}
                            className="p-1 text-green-500 hover:bg-green-50 rounded-full"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right mr-2">
                          <p className="font-medium text-green-600">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>

                        {/* Delete single item */}
                        <button
                          onClick={() => setBuyItems(buyItems.filter(i => i.id !== item.id))}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Total Section */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{getBuyTotalPrice()}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-4">
                    {/* Clear All */}
                    <button
                      onClick={() => setBuyItems([])}
                      className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all font-semibold shadow-md"
                    >
                      Clear All
                    </button>

                    {/* Pay Now */}
                    <button
                      onClick={() => {
                        setViewBuyItemModal(false);
                        paymentFunction();
                      }}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md"
                    >
                      Pay Now
                    </button>
                  </div>
                </>
              )}
            </div>




          </div>
        </div>
      )}


      {/* ✅ Buy Offers Products Modal */}
      {offersBuyModal && selectedOfferProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-4 border-green-600 overflow-y-auto max-h-[80vh]">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-semibold text-green-700">Buy Now Offers Products</h2>
              <button
                onClick={() => setOffersBuyModal(false)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              {/* Image + Details */}
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:8000${selectedOfferProduct.productsInfo.image_url}`}
                  alt={selectedOfferProduct.productsInfo.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-gray-800 font-semibold capitalize">
                    {selectedOfferProduct.productsInfo.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    ₹{price} × {quantity}{" "}
                    {discount > 0 && (
                      <span className="ml-1 text-green-600 font-medium">
                        (-{discount}%)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="flex items-center space-x-3">
                {/* Decrease Quantity */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={handleDecrease}
                >
                  <Minus size={18} />
                </button>

                {/* Quantity Display */}
                <span className="font-semibold text-gray-800">{quantity}</span>

                {/* Increase Quantity */}
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={handleIncrease}
                >
                  <Plus size={18} />
                </button>

                {/* Price after discount */}
                <p className="text-green-600 font-semibold">₹{total}</p>

                {/* Remove Product */}
                <button className="text-red-500 hover:text-red-700" onClick={handleRemove}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Total Section */}
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-gray-800">Total:</p>
              <p className="text-2xl font-bold text-green-700">₹{total}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setQuantity(1)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Clear All
              </button>
              <button
                onClick={() => console.log("Pay Now", { product: selectedOfferProduct, quantity, total })}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}


      {/* offers products view  modal  */}


      {viewOffersProductModal && selectedOfferProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-4 border-green-600 overflow-y-auto max-h-[80vh] transition-all duration-300">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-semibold text-green-700">
                Offer Product Details
              </h2>
              <button
                onClick={() => setViewOffersProductModal(false)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Product Section */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={`http://localhost:8000${selectedOfferProduct.productsInfo.image_url}`}
                alt={selectedOfferProduct.productsInfo.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {selectedOfferProduct.productsInfo.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Category:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedOfferProduct.productsInfo.category}
                  </span>
                </p>
                <p className="text-gray-500 text-sm">
                  Price:{" "}
                  <span className="font-semibold text-gray-800">
                    ₹{Number(selectedOfferProduct.productsInfo.price)}
                  </span>
                </p>
              </div>
            </div>

            {/* Discount Section */}
            <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
              <p className="text-green-700 font-medium">
                Discount:{" "}
                <span className="font-semibold text-green-800">
                  {Number(selectedOfferProduct.discount)}%
                </span>
              </p>

              {/* Calculate discounted price */}
              <p className="text-gray-700 mt-1">
                Discounted Price:{" "}
                <span className="text-green-700 font-bold">
                  ₹
                  {(
                    Number(selectedOfferProduct.productsInfo.price) -
                    (Number(selectedOfferProduct.productsInfo.price) *
                      Number(selectedOfferProduct.discount)) /
                    100
                  ).toFixed(2)}
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-gray-800 font-semibold mb-2">Description:</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedOfferProduct.productsInfo.description ||
                  "No description available."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setViewOffersProductModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setViewOffersProductModal(false);
                  setOffersBuyModal(true); // Open Buy Modal directly from here
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Payment Modal */}
      {qr && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border-t-4 border-green-600 transition-transform transform hover:scale-[1.01] duration-300">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                💳 Choose Payment Method
              </h2>
              <button
                onClick={() => setQr(false)}
                className="text-red-500 hover:text-red-600 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Google Pay */}
              <button
                onClick={() => setPaymentMethod("googlepay")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${paymentMethod === "googlepay"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:bg-green-50/50 hover:text-green-600"
                  }`}
              >
                <FaGooglePay size={28} />
                <span className="text-xs font-medium mt-1">Google Pay</span>
              </button>

              {/* PhonePe */}
              <button
                onClick={() => setPaymentMethod("phonepe")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${paymentMethod === "phonepe"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:bg-green-50/50 hover:text-green-600"
                  }`}
              >
                <SiPaytm size={28} />
                <span className="text-xs font-medium mt-1">PhonePe</span>
              </button>

              {/* Card */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${paymentMethod === "card"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:bg-green-50/50 hover:text-green-600"
                  }`}
              >
                <SiContactlesspayment size={28} />
                <span className="text-xs font-medium mt-1">Card</span>
              </button>
            </div>

            {/* QR Code for UPI */}
            {(paymentMethod === "googlepay" || paymentMethod === "phonepe") && (
              <div className="mt-6 text-center">
                <p className="mb-3 text-gray-700 font-medium">📱 Scan QR to Pay</p>
                <div className="inline-block p-3 bg-white border-2 border-green-200 rounded-2xl shadow-md">
                  <img
                    src="qr.jpg"
                    alt="QR Code"
                    className="w-48 h-48 rounded-lg border border-green-100"
                  />
                </div>
              </div>
            )}

            {/* Card Payment Input */}
            {paymentMethod === "card" && (
              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-1/2 border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-1/2 border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={paymentConfirm}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-md hover:shadow-green-400/40 mt-6"
            >
              ✅ Confirm Payment
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => setQr(false)}
              className="w-full mt-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-md hover:shadow-red-400/40"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}





      {/* Product Details Modal */}
      {showProductDetails && <ProductDetailsModal />}



    </div>
  );
};

export default UserPage;