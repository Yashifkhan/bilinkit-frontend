import React, { useEffect, useState } from 'react';
import { User, ShoppingCart, Heart, Package, MapPin, CreditCard, Bell, Settings, HelpCircle, LogOut, Search, Star, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const base_url_products = import.meta.env.VITE_BASE_URL_PRODUCTS;
const base_url_users = import.meta.env.VITE_BASE_URL_USERS

const Home = ({setrole}) => {
  const navigat = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [sidebarActive, setSidebarActive] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(null)
  const [filterProducts, setFilterProducts] = useState(null)
  const [registerModalState, setRegisterModalState] = useState(false)
  const [loginModalState, setLoginModalState] = useState(false)
  const [sellerModalState, setSellerModalState] = useState(false)
  const [registerFormData, setRegisterFormData] = useState({ name: "", email: "", password: "", phone: "", role: "" })
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', shop_name: '', shop_address: '', category: '', role: '' });
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  // fetch products 
  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`${base_url_products}/getAllProducts`)
    console.log("resp of api ", resp.data.data);
    setProducts(resp?.data.data);
    setFilterProducts(resp?.data.data)
    } catch (error) {
      console.log(' show error ==>',error);
      
    }
    
  }
  useEffect(() => {
    fetchProducts()
  }, [])


  // handle resister user 
  const handleSubmitRegisterData = async (e) => {
    console.log("form data ", formData);
    e.preventDefault()
    console.log("handleSubmitRegisterData");
    console.log("data is", registerFormData);
    // const resp = await axios.post("http://localhost:8000/api/v1/users/registerUser", registerFormData)
    const resp = await axios.post(`${base_url_users}/registerUser`, registerFormData)
    const result = resp.data.success
    // succes === true
    if (result) {
      setRegisterModalState(false)
      setLoginModalState(true)
      setRegisterFormData({ name: "", email: "", password: "", phone: "" })
    }
  }
  const handleRegister = () => {
    setRegisterModalState(true)
    setFormData({ ...formData, role: "user" })
    setRegisterFormData({ ...registerFormData, role: "user" })
  };


  const handleSeller = () => {
    setFormData({ ...formData, role: "seller" })
    setSellerModalState(true)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone && formData.shop_name && formData.shop_address && formData.password && formData.category) {
      try {
        // const resp = await axios.post("http://localhost:8000/api/v1/users/registerUser", formData)
        const resp = await axios.post(`${base_url_users}/registerUser`, formData)
        console.log("result of add shop keeper", resp.data);
        if (resp.data.success) {
          toast.success("Shop Keeper Approval sent to Admin successfully");
          handleRegister(formData);
        } else {
          toast.error(resp.data.message || "Registration failed");
        }
      } catch (err) {
        console.error(err);
        //   toast.error("Server error during registration");
      }
    } else {
      // toast.error('Please fill all fields');
    }
  };
  const hendleLogin = async (e) => {
    e.preventDefault()
    // console.log("login data",loginData);
    try {
      // const resp = await axios.post("http://localhost:8000/api/v1/users/loginUser", loginData);
      const resp = await axios.post(`${base_url_users}/loginUser`, loginData)
      console.log("resp", resp);

      if (resp.data.success) {
        console.log("Login success:", resp.data.message);
        console.log("User Data:", resp.data.data);


        const user = resp.data.data
        const loginUser = user
        // ✅ Check role
        if (user.role === "user") {
          localStorage.setItem("role","user")
          setLoginModalState(false);
          navigat("/userpage", { state: { loginUser } });
          toast.success("Login Succesfully")
        }else if(user.role === "admin"){
          navigat("/AdminDashboard",{state :{loginUser}});
          toast.success("Login Succesfully")
          localStorage.setItem("role","admin")


        } 
        else if(user.role === "shopkeeper") {
          
          console.log("Access denied: only users can enter this page");
          toast.success("Login Succesfully")
          navigat("/shopkeeper", { state: { loginUser } })
          localStorage.setItem("role","shopkeeper")
        }

      } else {
        // console.log("Login failed:", resp.data.message);
        toast.warning("Login Failed To Verify !")
      }
    } catch (error) {
      toast.warning("Login Failed To Verify !")
      console.log("Status:", error);
    }


  }

  // Sample user data

  const sidebarItems = [
    { id: 'products', icon: Package, label: 'All Products' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' }
  ];

  const addToCart = (product) => {
    setRegisterModalState(true)


  };

  const removeFromCart = (productId) => {
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCartItems(cartItems.filter(item => item.id !== productId));
    }
  };

  const getCartItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setProducts(filterProducts);
    } else {
      setProducts(filteredProducts);
    }
  }, [searchTerm, filterProducts, filteredProducts]);

  return (
    <div className="min-h-screen bg-gray-50  z-1">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">Blinkit</h1>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              <>
                <button
                  onClick={() => setLoginModalState(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleRegister}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {/* <LogOut className="h-4 w-4" /> */}
                  <span className="hidden sm:inline">Register</span>
                </button>
                <button
                  onClick={handleSeller}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {/* <LogOut className="h-4 w-4" /> */}
                  <span className="hidden sm:inline">Become a Seller</span>
                </button>
              </>
            </div>
          </div>
        </div>
      </header>


      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-xl shadow-md p-6 h-fit sticky top-22">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSidebarActive(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${sidebarActive === item.id
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium text-gray-800">example.Name</p>
              <p className="text-sm text-gray-500">example.phone</p>
              <p className="text-xs text-gray-400 mt-1">example.address</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6 mt-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Products Grid */}
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => {
              const cartQuantity = getCartItemQuantity(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100"
                >
                  {/* Image + Category */}
                  <div className="p-4 flex flex-col items-center">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                      <img
                        src={`http://localhost:8000${product?.image_url}`}
                        alt={product.name || "Product image"}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <span className="inline-block bg-red-500 text-white  text-sm px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl  transition-shadow duration-300 p-4 flex flex-col">
                    {/* Product Description */}
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                    <div className="flex justify-between items-start">
                      {/* Product Info */}
                      <div className="flex-1 mr-4">
                        <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-2">{product.unit}</p>

                        {/* Rating */}
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col items-end justify-center">
                        <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-red-400 line-through mt-1">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>


                  </div>



                  {/* Action Buttons */}
                  <div className="px-4 pb-4 flex gap-2">
                    {cartQuantity > 0 ? (
                      <div className="flex items-center border border-green-500 rounded-lg flex-1 justify-between">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-2 text-green-600 hover:bg-green-50 transition"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-2 text-green-600 font-semibold">
                          {cartQuantity}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="p-2 text-green-600 hover:bg-green-50 transition"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>




      {/* Register modal  */}
      {registerModalState && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-4 border-green-600">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-green-700"> Register as a Customer </h2>
              <button onClick={() => setRegisterModalState(false)} className="text-red-500 hover:text-red-700 transition" > ✕
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <input type="text" name="name" placeholder="Enter Your Full Name" value={registerFormData.name} onChange={(e) => setRegisterFormData({ ...registerFormData, name: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />

              <input type="email" name="email" placeholder="Email Address" value={registerFormData.email} onChange={(e) => setRegisterFormData({ ...registerFormData, email: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />

              <input type="password" name="password" placeholder="Password" value={registerFormData.password} onChange={(e) => setRegisterFormData({ ...registerFormData, password: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />

              <input type="number" name="number" placeholder="Enter Mobile No" value={registerFormData.phone} onChange={(e) => setRegisterFormData({ ...registerFormData, phone: e.target.value })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />

              <button onClick={(e) => handleSubmitRegisterData(e)} type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow-md" >  Register </button>

              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <span onClick={() => { setRegisterModalState(false); setLoginModalState(true); }} className="text-red-500 cursor-pointer hover:underline" >  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      )}



      {/* become A seller Moda  */}
      {sellerModalState && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 ">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border-t-4 border-green-600">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">
                Register as Shopkeeper
              </h2>
              <button onClick={() => setSellerModalState(false)} className="text-red-500 hover:text-red-700 text-xl transition" > ✕ </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Enter your full name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Enter your email" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Enter your phone number" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Enter your password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input type="text" value={formData.shop_name} onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" placeholder="Enter your shop name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={formData.shop_address} onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" rows="2" placeholder="Enter your shop address" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="grocery">Grocery</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="food">Food & Beverages</option>
                  <option value="health">Health & Beauty</option>
                  <option value="books">Books & Stationery</option>
                  <option value="home">Home & Garden</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={(e) => handleSubmit(e)}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* login modal  */}
      {loginModalState && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-4 border-green-600">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-green-700">Login</h2>
              <button
                onClick={() => setLoginModalState(false)}
                className="text-red-500 hover:text-red-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4">
              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

              {/* Login Button */}
              <button
                onClick={hendleLogin}
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow-md"
              >
                Login
              </button>

              {/* Extra link */}
              <p className="text-sm text-gray-600 text-center">
                Forgot password?{" "}
                <span className="text-red-500 cursor-pointer hover:underline">
                  Reset
                </span>
              </p>
            </form>
          </div>
        </div>
      )}

    </div>

  );
};

export default Home;










