import React, { useEffect, useState } from 'react';
import { User, ShoppingCart, Heart, Package, MapPin, CreditCard, Bell, Settings, HelpCircle, LogOut, Search, Star, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ShopKeeper from './ShopKeeper';
const base_url_products = import.meta.env.VITE_BASE_URL_PRODUCTS;
const base_url_users=import.meta.env.VITE_BASE_URL_USERS

const Home = () => {
    const navigat = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [sidebarActive, setSidebarActive] = useState('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState(null)
    const [registerModalState, setRegisterModalState] = useState(false)
    const [loginModalState, setLoginModalState] = useState(false)
    const [sellerModalState, setSellerModalState] = useState(false)
    const [registerFormData, setRegisterFormData] = useState({ name: "", email: "", password: "", phone: "", role: "" })
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', shop_name: '', shop_address: '', category: '', role: '' });
    const [loginData, setLoginData] = useState({ email: "", password: "" })
    // fetch products 
    const fetchProducts = async () => {
      const resp=await axios.get(`${base_url_products}/getAllProducts`)
        console.log("resp of api ", resp.data.data);
        setProducts(resp?.data.data);
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
        const resp=await axios.post(`${base_url_users}/registerUser`, registerFormData)

        const result = resp.data.success
        if (result) {
            // navigat("/login")
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

console.log("i am home page");


    // handle login 
    const handleLogin = () => {
        setLoginModalState(true)

    }

    const hendleLogin = async (e) => {
        e.preventDefault()
        // console.log("login data",loginData);
       try {
  // const resp = await axios.post("http://localhost:8000/api/v1/users/loginUser", loginData);
  const resp = await axios.post(`${base_url_users}/loginUser`,loginData)
  console.log("resp", resp);

  if (resp.data.success) {
    console.log("Login success:", resp.data.message);
    console.log("User Data:", resp.data.data);


    const user = resp.data.data
   const loginUser=user
    // ✅ Check role
    if (user.role === "user") {
      setLoginModalState(false);
      navigat("/userpage",{state:{loginUser}});
    } else {
      console.log("Access denied: only users can enter this page");
      navigat("/shopkeeper",{state:{loginUser}})
    }

  } else {
    console.log("Login failed:", resp.data.message);
  }
} catch (error) {
  alert(error)
  console.log("Status:", error);
}


    }

    // Sample user data
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 9876543210",
        address: "123 Main Street, Delhi"
    };
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
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

   

    return (
        <div className="min-h-screen bg-gray-50  z-1">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-green-600">Blinkit</h1>
                        </div>

                        {/* User Info and Actions */}
                        <div className="flex items-center space-x-4">
                           
                                <>
                                    <div className="hidden md:flex items-center space-x-3">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <button className="relative p-2 text-gray-600 hover:text-gray-800">
                                            <ShoppingCart className="h-6 w-6" />
                                            {getTotalCartItems() > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                    {getTotalCartItems()}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleLogin}
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
  <aside className="w-64 bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
    <div className="space-y-2">
      {sidebarItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setSidebarActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              sidebarActive === item.id
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
        <p className="font-medium text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-500">{user.phone}</p>
        <p className="text-xs text-gray-400 mt-1">{user.address}</p>
      </div>
    </div>
  </aside>

  {/* Main Content */}
  <div className="flex-1 space-y-6">
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
          <span className="inline-block bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Info */}
        <div className="px-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{product.unit}</p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline mb-4">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{product.originalPrice}
              </span>
            )}
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
          <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-sm">
            Buy
          </button>
        </div>
      </div>
    );
  })}
</div>

  </div>
</div>

{/* Cart Summary */}
{isLoggedIn && cartItems.length > 0 && (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
    <div className="flex items-center gap-4">
      <div>
        <p className="font-semibold">{getTotalCartItems()} items in cart</p>
        <p className="text-sm">Total: ₹{getTotalPrice()}</p>
      </div>
      <button className="bg-white text-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        View Cart
      </button>
    </div>
  </div>
)}
 


            {/* return() */}

            {/* Register modal  */}
            {registerModalState &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    {/* Modal Box */}
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Register As A Costumer</h2>
                            <button
                                onClick={() => setRegisterModalState(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Your Full Name"
                                value={registerFormData.name}
                                onChange={(e) => { setRegisterFormData({ ...registerFormData, name: e.target.value }) }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={registerFormData.email}
                                onChange={(e) => { setRegisterFormData({ ...registerFormData, email: e.target.value }) }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerFormData.password}
                                onChange={(e) => { setRegisterFormData({ ...registerFormData, password: e.target.value }) }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                name="number"
                                placeholder="Enter Mob. No"
                                value={registerFormData.phone}
                                onChange={(e) => { setRegisterFormData({ ...registerFormData, phone: e.target.value }) }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />

                            <button onClick={(e) => { handleSubmitRegisterData(e) }}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            }

            {/* become A seller Moda  */}
            {
                sellerModalState &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Register as Shopkeeper</h2>
                            <button
                                onClick={() => setSellerModalState(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                                <input
                                    type="text"
                                    value={formData.shop_name}
                                    onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter your shop name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    value={formData.shop_address}
                                    onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    rows="2"
                                    placeholder="Enter your shop address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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

                            <button
                                onClick={(e) => { handleSubmit(e) }}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            }


            {/* Register modal  */}
            {loginModalState &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    {/* Modal Box */}
                    {/* <h1>login modal</h1> */}
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">login modal</h2>
                            <button
                                onClick={() => setLoginModalState(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form className="space-y-4">

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={loginData.email}
                                onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />


                            <button onClick={hendleLogin}
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            }
             

        </div>
        
    );
};

export default Home;












// import React, { useEffect, useState } from 'react';
// import { User, ShoppingCart, Heart, Package, MapPin, CreditCard, Bell, Settings, HelpCircle, LogOut, Search, Star, Plus, Minus, Home as HomeIcon, Grid } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//     const navigate = useNavigate();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [cartItems, setCartItems] = useState([]);
//     const [sidebarActive, setSidebarActive] = useState('products');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [products, setProducts] = useState([]);
//     const [registerModalState, setRegisterModalState] = useState(false);
//     const [loginModalState, setLoginModalState] = useState(false);
//     const [sellerModalState, setSellerModalState] = useState(false);
//     const [registerFormData, setRegisterFormData] = useState({ name: "", email: "", password: "", phone: "", role: "" });
//     const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', shop_name: '', shop_address: '', category: '', role: '' });
//     const [loginData, setLoginData] = useState({ email: "", password: "" });

//     // Sample products data for demo
//     const sampleProducts = [
//         // Your sample products data...
//     ];

//     const fetchProducts = async () => {
//         try {
//             const resp = await axios.get("http://localhost:8000/api/v1/products/getAllProducts");
//             console.log("resp of api ", resp.data.data);
//             setProducts(resp?.data.data);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//             // Fallback to sample data if API fails
//             setProducts(sampleProducts);
//         }
//     }

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     // Handle register user
//     const handleSubmitRegisterData = async (e) => {
//         e.preventDefault();
//         console.log("Register form data:", registerFormData);
//         // ... (your registration logic)
//         setRegisterModalState(false);
//         alert("Registration successful! (Demo mode)");
//     };

//     const handleRegister = () => {
//         setRegisterModalState(true);
//         setFormData({ ...formData, role: "user" });
//         setRegisterFormData({ ...registerFormData, role: "user" });
//     };

//     const handleSeller = () => {
//         setFormData({ ...formData, role: "seller" });
//         setSellerModalState(true);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Seller form data:", formData);
//         // ... (your seller registration logic)
//         setSellerModalState(false);
//         alert("Seller registration submitted! (Demo mode)");
//     };

//     const handleLogin = () => {
//         setLoginModalState(true);
//     };

//     const handleLoginSubmit = async (e) => {
//         e.preventDefault();
//         console.log("Login data:", loginData);
//         try {
//             // Uncomment for actual API call
//             // const resp = await axios.post("http://localhost:8000/api/v1/users/loginUser", loginData);
//             // console.log("resp of api", resp.data.success);
            
//             // For demonstration, we'll simulate a successful login
//             const resp = { data: { success: true } }; // FAKE SUCCESSFUL RESPONSE

//             if (resp.data.success) {
//                 setLoginModalState(false);
//                 setIsLoggedIn(true);
//                 // The most important part: navigate to the new page!
//                 navigate("/userpage");
//             }
//         } catch (error) {
//             console.log(error.response?.data.message || "Login failed");
//         }
//     };

//     // Sample user data
//     const user = {
//         name: "John Doe",
//         email: "john.doe@example.com",
//         phone: "+91 9876543210",
//         address: "123 Main Street, Delhi"
//     };

//     const sidebarItems = [
//         { id: 'products', icon: Package, label: 'All Products' },
//         { id: 'categories', icon: Grid, label: 'Categories' },
//         { id: 'settings', icon: Settings, label: 'Settings' },
//         { id: 'help', icon: HelpCircle, label: 'Help & Support' }
//     ];

//     // ... (Your other functions: addToCart, removeFromCart, etc. remain the same)
//     const addToCart = (product) => {
//       const existingItem = cartItems.find(item => item.id === product.id);
//       if (existingItem) {
//           setCartItems(cartItems.map(item =>
//               item.id === product.id
//                   ? { ...item, quantity: item.quantity + 1 }
//                   : item
//           ));
//       } else {
//           setCartItems([...cartItems, { ...product, quantity: 1 }]);
//       }
//     };

//     const removeFromCart = (productId) => {
//         const existingItem = cartItems.find(item => item.id === productId);
//         if (existingItem && existingItem.quantity > 1) {
//             setCartItems(cartItems.map(item =>
//                 item.id === productId
//                     ? { ...item, quantity: item.quantity - 1 }
//                     : item
//             ));
//         } else {
//             setCartItems(cartItems.filter(item => item.id !== productId));
//         }
//     };

//     const getCartItemQuantity = (productId) => {
//         const item = cartItems.find(item => item.id === productId);
//         return item ? item.quantity : 0;
//     };

//     const getTotalCartItems = () => {
//         return cartItems.reduce((total, item) => total + item.quantity, 0);
//     };

//     const getTotalPrice = () => {
//         return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//     };

//     const filteredProducts = products?.filter(product =>
//         (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//         (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             {/* Header */}
//             <header className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center h-16">
//                         {/* Logo */}
//                         <div className="flex items-center">
//                             <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg mr-3">
//                                 <ShoppingCart className="h-6 w-6 text-white" />
//                             </div>
//                             <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
//                                 Blinkit
//                             </h1>
//                         </div>

//                         {/* User Info and Actions */}
//                         <div className="flex items-center space-x-4">
//                             {isLoggedIn ? (
//                                 <>
//                                     {/* User Profile */}
//                                     <div className="hidden md:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full">
//                                         <div className="text-right">
//                                             <p className="text-sm font-medium text-gray-800">{user.name}</p>
//                                             <p className="text-xs text-gray-500">{user.email}</p>
//                                         </div>
//                                         <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
//                                             <User className="h-5 w-5 text-white" />
//                                         </div>
//                                     </div>

//                                     {/* Cart */}
//                                     <div className="relative">
//                                         <button className="relative p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200">
//                                             <ShoppingCart className="h-6 w-6" />
//                                             {getTotalCartItems() > 0 && (
//                                                 <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-md">
//                                                     {getTotalCartItems()}
//                                                 </span>
//                                             )}
//                                         </button>
//                                     </div>

//                                     {/* Logout */}
//                                     <button
//                                         onClick={() => setIsLoggedIn(false)}
//                                         className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                     >
//                                         <LogOut className="h-4 w-4" />
//                                         <span className="hidden sm:inline">Logout</span>
//                                     </button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <button
//                                         onClick={handleLogin}
//                                         className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
//                                     >
//                                         Login
//                                     </button>
//                                     <button
//                                         onClick={handleRegister}
//                                         className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                     >
//                                         <span className="hidden sm:inline">Register</span>
//                                     </button>
//                                     <button
//                                         onClick={handleSeller}
//                                         className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
//                                     >
//                                         <span className="hidden sm:inline">Become a Seller</span>
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 <div className="flex gap-6">
//                     {/* Sidebar */}
//                     <aside className="w-64 bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24 border border-gray-100">
//                         <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu</h2>
//                         <div className="space-y-2">
//                             {sidebarItems.map((item) => {
//                                 const IconComponent = item.icon;
//                                 return (
//                                     <button
//                                         key={item.id}
//                                         onClick={() => setSidebarActive(item.id)}
//                                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
//                                             sidebarActive === item.id
//                                                 ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-md transform scale-105"
//                                                 : "text-gray-600 hover:bg-gray-50 hover:scale-102"
//                                         }`}
//                                     >
//                                         <IconComponent className="h-5 w-5" />
//                                         <span className="font-medium">{item.label}</span>
//                                     </button>
//                                 );
//                             })}
//                         </div>

//                         {/* User Info in Sidebar - CONDITION REMOVED */}
//                         <div className="mt-6 pt-6 border-t border-gray-200">
//                             <div className="text-center">
//                                 <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//                                     <User className="h-8 w-8 text-white" />
//                                 </div>
//                                 <p className="font-semibold text-gray-800">{isLoggedIn ? user.name : "Guest User"}</p>
//                                 <p className="text-sm text-gray-500">{isLoggedIn ? user.phone : "Please log in"}</p>
//                                 <p className="text-xs text-gray-400 mt-1 truncate">{isLoggedIn ? user.address : "N/A"}</p>
//                             </div>
//                         </div>
//                     </aside>

//                     {/* Main Content */}
//                     <main className="flex-1">
//                         {/* Search Bar */}
//                         <div className="relative mb-8">
//                             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                             <input
//                                 type="text"
//                                 placeholder="Search for products, categories..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg bg-white text-gray-800 placeholder-gray-400"
//                             />
//                         </div>

//                         {/* Products Grid */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             {filteredProducts?.map((product) => {
//                                 const cartQuantity = getCartItemQuantity(product.id);
//                                 return (
//                                     <div
//                                         key={product.id || product.name}
//                                         className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-105"
//                                     >
//                                         <div className="p-6">
//                                             <div className="text-center mb-4">
//                                                 <div className="bg-gray-50 rounded-xl p-4 mb-3 group-hover:bg-gray-100 transition-colors">
//                                                     <img
//                                                         src={`http://localhost:8000${product?.image_url}`}
//                                                         alt={product.name || "Product image"}
//                                                         className="w-24 h-24 object-contain mx-auto group-hover:scale-110 transition-transform duration-300"
//                                                     />
//                                                 </div>
//                                                 <span className="inline-block bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
//                                                     {product.category}
//                                                 </span>
//                                             </div>
//                                             <h3 className="font-bold text-gray-800 mb-2 text-lg">{product.name}</h3>
//                                             <p className="text-sm text-gray-500 mb-3">{product.unit}</p>
//                                             <div className="flex items-center mb-3">
//                                                 <Star className="h-4 w-4 text-yellow-400 fill-current" />
//                                                 <span className="text-sm text-gray-600 ml-1 font-medium">{product.rating}</span>
//                                             </div>
//                                             <div className="flex items-center justify-between mb-6">
//                                                 <div>
//                                                     <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
//                                                     <span className="text-sm text-gray-500 line-through ml-2">
//                                                         ₹{product.originalPrice}
//                                                     </span>
//                                                 </div>
//                                                 <div className="text-green-600 text-sm font-medium">
//                                                     {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
//                                                 </div>
//                                             </div>
//                                             <div className="flex gap-3">
//                                                 {cartQuantity > 0 ? (
//                                                     <div className="flex items-center border-2 border-green-500 rounded-xl bg-green-50 flex-1">
//                                                         <button
//                                                             onClick={() => removeFromCart(product.id)}
//                                                             className="p-3 text-green-600 hover:bg-green-100 rounded-l-xl transition-colors"
//                                                         >
//                                                             <Minus className="h-4 w-4" />
//                                                         </button>
//                                                         <span className="px-4 py-3 text-green-700 font-bold flex-1 text-center">
//                                                             {cartQuantity}
//                                                         </span>
//                                                         <button
//                                                             onClick={() => addToCart(product)}
//                                                             className="p-3 text-green-600 hover:bg-green-100 rounded-r-xl transition-colors"
//                                                         >
//                                                             <Plus className="h-4 w-4" />
//                                                         </button>
//                                                     </div>
//                                                 ) : (
//                                                     <button
//                                                         onClick={() => addToCart(product)}
//                                                         className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg font-medium"
//                                                     >
//                                                         <ShoppingCart className="h-4 w-4" />
//                                                         Add to Cart
//                                                     </button>
//                                                 )}
//                                                 <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg font-medium">
//                                                     Buy Now
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </main>
//                 </div>
//             </div>

//             {/* Cart Summary - CONDITION REMOVED */}
//             {cartItems.length > 0 && (
//                 <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-2xl border-2 border-white z-40">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <p className="font-bold text-lg">{getTotalCartItems()} items in cart</p>
//                             <p className="text-green-100">Total: ₹{getTotalPrice()}</p>
//                         </div>
//                         <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg">
//                             View Cart
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* MODALS (Register, Seller, Login) remain the same */}
//             {registerModalState && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     {/* ... Your Register Modal JSX */}
//                 </div>
//             )}
//             {sellerModalState && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     {/* ... Your Seller Modal JSX */}
//                 </div>
//             )}
//             {loginModalState && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4">
//                         <div className="flex justify-between items-center mb-6">
//                             <h2 className="text-2xl font-bold text-gray-800">Login</h2>
//                             <button
//                                 onClick={() => setLoginModalState(false)}
//                                 className="text-gray-500 hover:text-gray-700 text-xl"
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                         <form onSubmit={handleLoginSubmit} className="space-y-4">
//                             <input
//                                 type="email"
//                                 placeholder="Email Address"
//                                 value={loginData.email}
//                                 onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
//                                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 required
//                             />
//                             <input
//                                 type="password"
//                                 placeholder="Password"
//                                 value={loginData.password}
//                                 onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//                                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 required
//                             />
//                             <button
//                                 type="submit"
//                                 className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg"
//                             >
//                                 Login
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default Home;