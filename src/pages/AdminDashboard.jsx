import axios from 'axios';
import { Eye, Minus, Plus, ShoppingCart } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const base_url_shopkeeper = import.meta.env.VITE_BASE_URL
const base_url_address = import.meta.env.VITE_BASE_URL
const base_url_products = import.meta.env.VITE_BASE_URL_PRODUCTS;
const base_url_img = import.meta.env.VITE_BASE_URL;




const AdminDashboard = () => {
  const location = useLocation();
  const loginUser = location.state?.loginUser;
  const navigate = useNavigate();
  const [shopkeepers, setShopkeepers] = useState([]);
  const [filteredShopkeepers, setFilteredShopkeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('shopkeepers');
  const [profileCard, setProfileCard] = useState(false)
  const [userSavedAddress, setUserSavedAddress] = useState(null)
  const [isShopkleeperModal, setIsShopkeeperModal] = useState(false)
  const [selectedShopkeeper, setSelectedShopkeeper] = useState(null)
    const [products, setProducts] = useState(null);
   



  // Simulate API call
  useEffect(() => {
    const fetchShopkeepers = async () => {
      setLoading(true);
      try {
        // const response = await axios.get('http://localhost:8000/api/v1/shopKeeper/getShopKeeper');
        const response = await axios.get(`${base_url_shopkeeper}/api/v1/shopKeeper/getShopKeeper`);
        const data = await response.data.data
        console.log("data", data);


        // Using mock data for demonstration
        setTimeout(() => {
          setShopkeepers(data);
          setFilteredShopkeepers(data);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching shopkeepers:', error);
        setLoading(false);
      }
    };

    fetchShopkeepers();
  }, []);

  // Filter shopkeepers based on search and status
  useEffect(() => {
    let filtered = shopkeepers;

    // Filter by search term
    if (searchTerm) {
      console.log("searchTerm", searchTerm);

      filtered = filtered?.filter(shop =>
        shop?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        shop?.shopName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        shop?.email?.toLowerCase().includes(searchTerm?.toLowerCase())
      );

      console.log("filtered", filtered);
      setFilteredShopkeepers(filtered);


    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shop => shop.status === statusFilter);
    }

    // setFilteredShopkeepers(filtered);
  }, [searchTerm, statusFilter, shopkeepers]);

  const handleStatusUpdate = async (id, newStatus) => {
    console.log("id", id);
    newStatus = 1

    // const resp=await axios.put(`http://localhost:8000/api/v1/shopKeeper/updateShopKeeperStatus/${id}`,{status:newStatus})
    const resp = await axios.put(`${base_url_shopkeeper}/updateShopKeeperStatus/${id}`, { status: newStatus })

    console.log("respons for update status fo rsho keeper", resp.success);


    setShopkeepers();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const handleLogout = () => {
    navigate("/");
    toast.success("Logout Successfully")
  };

  const fetchAddress = async () => {
    const resp = await axios.get(`${base_url_address}/api/v1/address/getAddresById/${loginUser?.id}`)
    console.log("resp of addre api", resp);

    if (resp.data.success === true) {
      setUserSavedAddress(resp.data.data[0])
    }
  }

  const fetchProducts = async () => {
    // setIsLoading(true);
    try {
      const resp = await axios.get(`${base_url_products}/getAllProducts`);
      setProducts(resp?.data.data);
      // setAllProduct(resp?.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      // setIsLoading(false);
    }
  };

  const getCartItemQuantity = (productId) => {
    // const item = cartItems.find(item => item.product_id === productId);
    // return item ? item.quantity : 0;
  };


  useEffect(() => {
    fetchAddress()
    fetchProducts()
  }, [])


  // console.log("login user", loginUser);
  console.log("selectedShopkeeper", selectedShopkeeper);




  const sidebarItems = [
    { id: 'allProducts', label: 'All Products', icon: '🏠' },
    { id: 'shopkeepers', label: 'Shopkeepers', icon: '👥' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];




  return (
    <div className="min-h-screen bg-gray-50 ">
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

          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="flex items-center gap-3 bg-white shadow rounded-lg px-4 py-2"
              onClick={() => setProfileCard(true)}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white font-bold">
                {loginUser?.name?.[0].toUpperCase()}
              </div>
              <h2 className="text-gray-800 font-medium">
                Welcome, <span className="font-semibold">
                  {loginUser?.name}
                </span>
              </h2>
              <button className="ml-auto text-sm text-red-500 hover:text-gray-800">
                <FaRegUser />
              </button>
            </div>



            <div className="relative">


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

      {/* show profile cart  */}
      {profileCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 border-t-4 border-green-600">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-green-700">Your Profile</h2>
              <button onClick={() => setProfileCard(false)} className="text-red-500 hover:text-red-700 transition text-xl" > ✕ </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Profile Image / Icon */}
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-md">
                {loginUser?.profilePic ? (
                  <img src={loginUser?.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
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
                {/* <p className="text-sm text-gray-700">Orders: {userOrders.length}</p> */}
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


      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${activeTab === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-700'
                  }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {activeTab === 'shopkeepers' && (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    🛍️ Shopkeeper Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage and verify shopkeeper registration requests efficiently.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-800 px-4 py-1.5 rounded-lg shadow-sm text-sm font-medium">
                  Total: {filteredShopkeepers?.length}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Search */}
                  <div className="flex-1 min-w-64">
                    <input
                      type="text"
                      placeholder="🔍 Search by name, shop name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-700"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Requests */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition">
                  <div className="text-3xl font-bold text-green-700">{shopkeepers?.length}</div>
                  <div className="text-sm text-green-700 font-medium mt-1">Total Requests</div>
                </div>

                {/* Pending */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition">
                  <div className="text-3xl font-bold text-yellow-700">
                    {shopkeepers?.filter(s => s.status === 0).length}
                  </div>
                  <div className="text-sm text-yellow-700 font-medium mt-1">Pending</div>
                </div>

                {/* Accepted */}
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-5 rounded-xl shadow-sm border border-green-300 hover:shadow-md transition">
                  <div className="text-3xl font-bold text-green-800">
                    {shopkeepers?.filter(s => s.status === 1).length}
                  </div>
                  <div className="text-sm text-green-800 font-medium mt-1">Accepted</div>
                </div>

                {/* Rejected */}
                <div className="bg-gradient-to-r from-red-100 to-red-200 p-5 rounded-xl shadow-sm border border-red-300 hover:shadow-md transition">
                  <div className="text-3xl font-bold text-red-700">
                    {shopkeepers?.filter(s => s.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-700 font-medium mt-1">Rejected</div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-gray-600">Loading shopkeepers...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-green-50 border-b border-gray-200">
                        <tr>
                          {["Shopkeeper Info", "Shop Details", "Contact", "Status", "Request Date", "Actions"].map((h) => (
                            <th
                              key={h}
                              className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredShopkeepers?.map((shopkeeper) => (
                          <tr key={shopkeeper.id} className="hover:bg-green-50 transition">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{shopkeeper.name}</div>
                                <div className="text-sm text-gray-500">{shopkeeper.email}</div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{shopkeeper.shop_name}</div>
                                <div className="text-sm text-gray-500">{shopkeeper.shop_address}</div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-900">{shopkeeper.phone}</td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${shopkeeper.status === 1
                                  ? "bg-green-100 text-green-700"
                                  : shopkeeper.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                  }`}
                              >
                                {shopkeeper.status == 0
                                  ? "Pending"
                                  : shopkeeper.status == 1
                                    ? "Accepted"
                                    : "Rejected"}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {shopkeeper.created_at.slice(0, 10)}
                            </td>

                            <td className="px-6 py-4 text-sm font-medium">
                              {shopkeeper.status === 0 ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleStatusUpdate(shopkeeper.id, 'accepted')}
                                    className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-xs font-medium transition"
                                  >
                                    ✅ Accept
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(shopkeeper.id, 'rejected')}
                                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-xs font-medium transition"
                                  >
                                    ❌ Reject
                                  </button>
                                </div>
                              ) : (
                                <button className="text-green-600 hover:text-green-800 text-xs font-medium"
                                  onClick={() => { setIsShopkeeperModal(true); setSelectedShopkeeper(shopkeeper) }}
                                >
                                  View Details
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!loading && filteredShopkeepers?.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-gray-500">No shopkeepers found matching your criteria.</span>
                  </div>
                )}
              </div>
            </div>
          )
          }

       {activeTab === "allProducts" && (
  <div className="space-y-8">
    {/* Header & Filters */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
        <p className="text-gray-600 mt-1">Browse available products from various sellers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search Products..."
            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Category Filter */}
        <select
          // value={selectedCategory}
          // onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {/* {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))} */}
        </select>

        {/* Sorting */}
        <select
          // value={sortOption}
          // onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>

    {/* Products Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products?.map((product) => {
        const cartQuantity = getCartItemQuantity(product.id);

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

              {/* Product Info */}
              <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-green-600 transition-colors duration-200">
                {product.name}
              </h3>

              {product.stock < 1 ? (
                <p className="text-red-600 text-sm">Currently Unavailable (Out of Stock)</p>
              ) : (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Price & Category */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-green-600">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                  {product.category}
                </span>
              </div>

              {/* Seller */}
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

              {/* Cart Buttons */}
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
  </div>
)}


        </main>

        {/* View Shopkeeper Modal */}
        {isShopkleeperModal && selectedShopkeeper && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl p-6 relative animate-fadeIn">
              <button onClick={() => setSelectedShopkeeper(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition" > ✖ </button>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-lg"> {selectedShopkeeper.name?.charAt(0).toUpperCase()} </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900 capitalize"> {selectedShopkeeper.name} </h2>
                  <p className="text-sm text-gray-500">Shopkeeper Details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-700 font-semibold mb-2 flex items-center gap-2"> 🏪 Shop Information </h3>
                  <p><span className="font-medium text-gray-700">Shop Name:</span> {selectedShopkeeper.shop_name}</p>
                  <p><span className="font-medium text-gray-700">Category:</span> {selectedShopkeeper.category}</p>
                  <p><span className="font-medium text-gray-700">Address:</span> {selectedShopkeeper.shop_address}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-700 font-semibold mb-2 flex items-center gap-2"> 📞 Contact Information </h3>
                  <p><span className="font-medium text-gray-700">Phone:</span> {selectedShopkeeper.phone}</p>
                  <p><span className="font-medium text-gray-700">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedShopkeeper.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`} > {selectedShopkeeper.status === 1 ? "Approved" : "Pending"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Created At:</span>{" "}
                    {selectedShopkeeper.created_at?.slice(0, 10)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedShopkeeper(false)} className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition" > Close </button>
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default AdminDashboard;