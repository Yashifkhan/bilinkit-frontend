import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserPage from './UserPage';
import { Home } from 'lucide-react';
const base_url_products=import.meta.env.VITE_BASE_URL_PRODUCTS
const base_url_shopkeeper=import.meta.env.REACT_APP_base_url_shopkeeper

// import { useNavigate } from "react-router-dom";

const ShopKeeper = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { loginUser } = location.state || {}
  // State management
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState(1);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productEditModal, setProductEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [allProduct, setAllProduct] = useState(null);
  const [showMyProducts, setShowMyProducts] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("name");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [showSection, setShowSection] = useState({ id: "products" })

  // Status update function
  const handleToggle = async (product) => {
    try {
      setLoading(true);

      const newStatus = product.status === 1 ? 0 : 1;
      // await axios.put(`http://localhost:8000/api/v1/products/updateProductStatus/${product.id}`,{ status: newStatus,});
      await axios.put(`${base_url_products}/updateProductStatus/${product.id}`,{ status: newStatus,});


      // Update local state
      setMyProducts(myProducts.map(p =>
        p.id === product.id ? { ...p, status: newStatus } : p
      ));

      toast.success(`Product ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // Search and filter logic
  useEffect(() => {
    let result = allProduct || [];

    // Apply search filter
    if (searchValue.trim().length > 0) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
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
  }, [searchValue, selectedCategory, sortOption, allProduct]);

  // Mock data for products
  const mockProducts = [
    {
      id: 1,
      name: "Fresh Apples",
      price: 150,
      category: "Fruits",
      image: "🍎",
      description: "Fresh red apples from Kashmir",
      seller: "Kumar Fruits"
    },
    {
      id: 2,
      name: "Organic Rice",
      price: 80,
      category: "Grains",
      image: "🍚",
      description: "Premium basmati rice",
      seller: "Grain Store"
    },
    {
      id: 3,
      name: "Fresh Milk",
      price: 60,
      category: "Dairy",
      image: "🥛",
      description: "Pure cow milk",
      seller: "Dairy Farm"
    },
    {
      id: 4,
      name: "Tomatoes",
      price: 40,
      category: "Vegetables",
      image: "🍅",
      description: "Fresh organic tomatoes",
      seller: "Veggie Store"
    },
    {
      id: 5,
      name: "Bananas",
      price: 50,
      category: "Fruits",
      image: "🍌",
      description: "Ripe yellow bananas",
      seller: "Fresh Fruits Co"
    },
    {
      id: 6,
      name: "Wheat Flour",
      price: 45,
      category: "Grains",
      image: "🌾",
      description: "Pure wheat flour",
      seller: "Mill Store"
    }
  ];

  const mockMyProducts = [
    {
      id: 1,
      name: "Premium Cookies",
      price: 120,
      category: "Snacks",
      stock: 50,
      status: 1,
      sales: 25,
      discount: 0
    },
    {
      id: 2,
      name: "Herbal Tea",
      price: 200,
      category: "Beverages",
      stock: 30,
      status: 1,
      sales: 15,
      discount: 5
    },
    {
      id: 3,
      name: "Organic Honey",
      price: 350,
      category: "Natural Products",
      stock: 20,
      status: 1,
      sales: 8,
      discount: 10
    }
  ];

  const mockOrders = [
    {
      id: "#ORD001",
      customer: "Rahul Sharma",
      product: "Premium Cookies",
      quantity: 2,
      amount: 240,
      status: "pending",
      date: "2024-09-06"
    },
    {
      id: "#ORD002",
      customer: "Priya Singh",
      product: "Herbal Tea",
      quantity: 1,
      amount: 200,
      status: "delivered",
      date: "2024-09-05"
    },
    {
      id: "#ORD003",
      customer: "Amit Kumar",
      product: "Organic Honey",
      quantity: 1,
      amount: 350,
      status: "processing",
      date: "2024-09-06"
    }
  ];

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductEditModal(true);
  };

  // Open product details modal
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  // Initialize data
  useEffect(() => {
    const checkUserStatus = async () => {
      const mockUser = null;
      setUser(mockUser);

      try {
        setApiLoading(true);
        const resp = await axios.get(`${base_url_products}/getAllProducts`);
        console.log("resp of api ", resp.data.data);
        setProducts(resp?.data.data);
        setAllProduct(resp?.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setProducts(mockProducts);
        setAllProduct(mockProducts);
      } finally {
        setApiLoading(false);
      }

      setOrders(mockOrders);
    };

    checkUserStatus();
  }, []);

  // Fetch shopkeeper products
  async function fetchProducts() {
    console.log("login user", loginUser.id);

    try {
      // const resp = await axios.get(`http://localhost:8000/api/v1/products/getProducts/${loginUser?.id}`);
      const resp = await axios.get(`${base_url_products}/getProducts/${loginUser?.id}`);

      setMyProducts(resp.data.data);
      console.log("get products only shopkeeper by id", resp.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle registration
  const handleRegister = (formData) => {
    console.log('Registration data:', formData);
    setShowRegisterModal(false);
    setUser({
      name: formData.name,
      email: formData.email,
      shopName: formData.shop_name,
      phone: formData.phone,
      address: formData.shop_address,
      category: formData.category
    });
    // setUserStatus(0);
  };

  // Handle login
  // const handleLogin = () => {
  //   setUser({ name: "John Doe", email: "john@example.com", shopName: "John's Store", phone: "+91 9876543210" });
  //   setUserStatus(1);
  // };

  //   const handleLogin = () => {
  //   setUser({ name: "John Doe", email: "john@example.com", shopName: "John's Store", phone: "+91 9876543210" });
  //   setUserStatus(1);
  // };

  // Handle logout
  const handleLogout = () => {
    navigate("/")

  };
  useEffect(() => {

    if (userStatus === 2) {
      navigate("/AdminDashboard")
    }
  }, [])

  // Handle add product
  const handleAddProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      price: parseInt(productData.price),
      stock: parseInt(productData.stock),
      status: 1,
      sales: 0
    };
    setMyProducts([...myProducts, newProduct]);
    setShowAddProductModal(false);
    toast.success("Product added successfully");
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setMyProducts(myProducts.filter(product => product.id !== productId));
      toast.success("Product deleted successfully");
    }
  };

  // Handle update product
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedProduct.name);
      formData.append('price', updatedProduct.price);
      formData.append('category', updatedProduct.category);
      formData.append('description', updatedProduct.description || '');
      formData.append('stock', updatedProduct.stock);
      formData.append('discount', updatedProduct.discount || 0);
      if (updatedProduct.image_url instanceof File) {
        formData.append('image', updatedProduct.image_url);
      }

      const resp = await axios.put(
        `${base_url_products}/updateProduct/${updatedProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (resp.data.success) {
        toast.success("Product updated successfully");
        setMyProducts(myProducts.map(p => p.id === updatedProduct.id ? resp.data.data : p));
        setProductEditModal(false);
        setEditingProduct(null);
      } else {
        toast.error(resp.data.message || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while updating product");
    }
  };

  // Register Modal Component
  const RegisterModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      password_hash: '',
      shop_name: '',
      shop_address: '',
      category: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.name && formData.email && formData.phone && formData.shop_name && formData.shop_address && formData.password_hash && formData.category) {
        try {
          // const resp = await axios.post(`http://localhost:8000/api/v1/shopKeeper/addShopKeeper`, formData);
          const resp = await axios.post(`${base_url_shopkeeper}/addShopKeeper`, formData);

          console.log("result of add shop keeper", resp.data);
          if (resp.data.success) {
            toast.success("Shop Keeper Approval sent to Admin successfully");
            handleRegister(formData);
          } else {
            toast.error(resp.data.message || "Registration failed");
          }
        } catch (err) {
          console.error(err);
          toast.error("Server error during registration");
        }
      } else {
        toast.error('Please fill all fields');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Register as Shopkeeper</h2>
            <button
              onClick={() => setShowRegisterModal(false)}
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
                value={formData.password_hash}
                onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
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
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add Product Modal Component
  const AddProductModal = ({ loginUser }) => {



    const [productData, setProductData] = useState({
      shopkeeper_id: loginUser?.id,
      name: '',
      price: '',
      category: '',
      description: '',
      stock: '',
      discount: '',
      image_url: null
    });

    console.log("login user id", loginUser.id);

    const handleSubmit = async (e) => {
      console.log("product data ", productData);

      e.preventDefault();
      const { shopkeeper_id, name, price, category, description, stock, discount, image_url } = productData;
      if (name && price && category && stock) {
        try {
          const formData = new FormData();
          formData.append('shopkeeper_id', shopkeeper_id)
          formData.append('name', name);
          formData.append('price', price);
          formData.append('category', category);
          formData.append('description', description || '');
          formData.append('stock', stock);
          formData.append('discount', discount || 0);
          if (image_url) {
            formData.append('image', image_url);
          }

          const resp = await axios.post(
            // "http://localhost:8000/api/v1/products/addProduct",
            `${base_url_products}/addProduct`,

            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("resp of edit product", resp.data);


          if (resp.data.success) {
            toast.success("Product added successfully");
            console.log("Add product response", resp.data);
            setMyProducts([...myProducts, resp.data.data]);
            setShowAddProductModal(false);
          } else {
            toast.error(resp.data.message || "Failed to add product");
          }
        } catch (err) {
          console.error(err);
          toast.error("Server error while adding product");
        }
      } else {
        toast.error("Please fill all required fields");
      }
    };


    console.log("p", myProducts);




    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
            <button
              onClick={() => { setShowAddProductModal(false); setShowSection({ id: "products" }) }}
              className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                rows="2"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              >
                <option value="">Select Category</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Dairy">Dairy</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Electronics">Electronics</option>
                <option value="Natural Products">Natural Products</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Enter stock quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                min="0"
                value={productData.discount}
                onChange={(e) => setProductData({ ...productData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="Enter product discount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    image_url: e.target.files[0],
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Product Modal Component
  const EditProductModal = () => {
    if (!editingProduct) return null;

    const [productData, setProductData] = useState({
      id: editingProduct.id,
      name: editingProduct.name,
      price: editingProduct.price,
      category: editingProduct.category,
      description: editingProduct.description || '',
      stock: editingProduct.stock,
      discount: editingProduct.discount || 0,
      image_url: null
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleUpdateProduct(productData);
      fetchProducts()

    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
            <button
              onClick={() => {
                setProductEditModal(false);
                setEditingProduct(null);
              }}
              className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                rows="2"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                min="0"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select Category</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Dairy">Dairy</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Electronics">Electronics</option>
                <option value="Natural Products">Natural Products</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter stock quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                min="0"
                value={productData.discount}
                onChange={(e) => setProductData({ ...productData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter product discount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    image_url: e.target.files[0],
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Product Details Modal Component
  const ProductDetailsModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
            <button
              onClick={() => setShowProductDetails(false)}
              className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 w-48 h-48 flex items-center justify-center overflow-hidden">
                <img
                  src={`http://localhost:8000${selectedProduct?.image_url}`}
                  alt={selectedProduct.name || "Product image"}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500">{selectedProduct.category}</p>
            </div>

            <div>
              <p className="text-gray-700">{selectedProduct.description}</p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-emerald-600">₹{selectedProduct.price}</span>
                {selectedProduct.discount > 0 && (
                  <span className="ml-2 text-sm text-red-500 line-through">₹{Math.round(selectedProduct.price * (1 + selectedProduct.discount / 100))}</span>
                )}
              </div>
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                {selectedProduct.category}
              </span>
            </div>

            <div className="text-sm text-gray-500">
              Sold by: <span className="font-medium text-gray-700">{selectedProduct.shopkeeper_name}</span>
            </div>

            <button
              onClick={() => setShowProductDetails(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Sidebar items based on user status
  const sidebarItems = [
    { id: 'products', label: 'All Products', icon: '🛍️' },
    { id: 'myProducts', label: 'My Products', icon: '📦' },
    { id: 'addProduct', label: 'Add Product', icon: '➕' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    // { id: 'products', label: 'All Products', icon: '🛍️' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  // Get unique categories for filter
  const categories = ["All", ...new Set(allProduct?.map(p => p.category) || [])];


  // useEffect(() => {
  //   if (user && userStatus === 0) {
  //     navigate("/userpage"); // apna User Page route yahan likho
  //   }
  // }, [user, userStatus, navigate]);


  // console.log("user status", userStatus);
  // console.log("select value",showSection.id);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
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
            <h2>WelCome :-  {loginUser.name}</h2>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {user && userStatus === 0 && (
          // <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          //   <div className="flex">
          //     <div className="flex-shrink-0">
          //       <span className="text-yellow-400 text-xl">⚠️</span>
          //     </div>
          //     <div className="ml-3">
          //       <p className="text-sm text-yellow-700">
          //         Your shopkeeper application is pending approval. You'll receive full access once approved by admin.
          //       </p>
          //     </div>
          //   </div>
          // </div>

          <UserPage products={products}></UserPage>

        )}

        {
          user && (
            <ShopKeeper></ShopKeeper>
          )
        }
      </header>

      {
        userStatus === 1 &&
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200 sticky top-16">
            <nav className="mt-6">
              {sidebarItems?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setShowSection(item)
                    if (item.id === 'addProduct') {
                      setShowAddProductModal(true);
                    }
                    // else {
                    //   setActiveTab(item.id);
                    // }
                  }}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${activeTab === item.id ? 'bg-green-50 border-r-2 border-green-500 text-green-600' : 'text-gray-700'}`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          {showSection.id === "products" && <main className="flex-1 p-6">
            {activeTab === 'products' && (
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
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
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

                {apiLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-gray-50 min-h-screen">
                    {products.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                        <p className="text-gray-600 max-w-md">Try adjusting your search or filter to find what you're looking for.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products?.map((product) => (
                          <div
                            key={product.id}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 ease-out"
                          >
                            <div className="p-4">
                              {/* Image Container */}
                              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 h-32 flex items-center justify-center overflow-hidden">
                                <img
                                  src={`http://localhost:8000${product?.image_url}`}
                                  alt={product.name || "Product image"}
                                  className="max-w-24 max-h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                              </div>

                              {/* Product Name */}
                              <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                                {product.name}
                              </h3>

                              {/* Description */}
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>

                              {/* Price and Category */}
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                  <span className="text-2xl font-bold text-emerald-600">₹{product.price.toLocaleString()}</span>
                                </div>
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                                  {product.category}
                                </span>
                              </div>

                              {/* Seller Info */}
                              <div className="text-xs text-gray-500 mb-4 flex items-center">
                                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Sold by: <span className="font-medium text-gray-700 ml-1">{product.shopkeeper_name}</span>
                              </div>

                              {/* Action Button */}
                              <button
                                onClick={() => openProductDetails(product)}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}









            {!['products', 'myProducts', 'orders', 'analytics', 'profile', 'about'].includes(activeTab) && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">{sidebarItems.find(item => item.id === activeTab)?.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {sidebarItems.find(item => item.id === activeTab)?.label}
                  </h3>
                  <p className="text-gray-600">This section is under development.</p>
                </div>
              </div>
            )}
          </main>
          }

          {/* my products  */}
          {
            showSection.id === "myProducts" &&
            <div className="space-y-6 p-4 w-full" >
              {/* Header Section */}
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
                  <p className="text-gray-600 mt-1">Manage your product inventory</p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:from-green-600 hover:to-green-700 transition-all font-medium"
                >
                  + Add Product
                </button>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["Image", "Product", "Price", "Stock", "Discount", "Status", "Actions"].map((heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myProducts?.map((product) => (
                        <tr key={product?.id} className="hover:bg-gray-50 transition-colors">
                          {/* Image */}
                          <td className="px-6 py-2">
                            <div className="flex justify-center items-center">
                              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 w-[80px] h-[80px] flex items-center justify-center overflow-hidden group">
                                <img
                                  src={`http://localhost:8000${product?.image_url}`}
                                  alt={product?.name || "Product image"}
                                  className="max-w-[80px] max-h-[80px] object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            </div>
                          </td>

                          {/* Product Name + Category */}
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product?.name}</div>
                              <div className="text-xs text-gray-500">{product?.category}</div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                            ₹{product?.price}
                          </td>

                          {/* Stock */}
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {product?.stock}
                          </td>

                          {/* Discount */}
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {product?.discount}%
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 p-2">
                              <button
                                onClick={() => handleToggle(product)}
                                disabled={loading}
                                className={`px-3 py-1 rounded text-white text-sm font-medium ${product?.status === 1 ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"} transition-colors`}
                              >
                                {loading ? "Updating..." : product?.status === 1 ? "Active" : "Inactive"}
                              </button>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              onClick={() => openEditModal(product)}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {myProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-5xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-500 mb-4">
                      Start by adding your first product to your inventory.
                    </p>
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium"
                    >
                      Add Your First Product
                    </button>
                  </div>
                )}
              </div>
            </div>
          }

          {/* orders  */}
          {showSection.id === "orders" &&
            <div className="space-y-6 p-4 w-full">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                <p className="text-gray-600 mt-1">Track and manage your product orders</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 min-w-[200px]">
                  <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 min-w-[200px]">
                  <div className="text-2xl font-bold text-yellow-600">
                    {orders.filter(order => order.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 min-w-[200px]">
                  <div className="text-2xl font-bold text-orange-600">
                    {orders.filter(order => order.status === 'processing').length}
                  </div>
                  <div className="text-sm text-gray-600">Processing</div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 min-w-[200px]">
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter(order => order.status === 'delivered').length}
                  </div>
                  <div className="text-sm text-gray-600">Delivered</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-lg font-medium text-gray-800">Order List</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Filter by status:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders
                        .filter(order => orderStatusFilter === 'all' || order.status === orderStatusFilter)
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-5xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Orders will appear here once customers start purchasing your products.</p>
                  </div>
                )}
              </div>
            </div>
          }

          {/* analytics  */}
          {showSection.id === "analytics" &&
            <div className="space-y-6 p-4 w-full">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
                <p className="text-gray-600 mt-1">Track your business performance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-3xl text-blue-500 mr-4">💰</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">₹{
                        myProducts.reduce((total, product) => total + (product.price * product.sales), 0)
                      }</div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-3xl text-green-500 mr-4">📦</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{myProducts.length}</div>
                      <div className="text-sm text-gray-600">Total Products</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-3xl text-purple-500 mr-4">🛒</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{
                        myProducts.reduce((total, product) => total + product.sales, 0)
                      }</div>
                      <div className="text-sm text-gray-600">Total Sales</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="text-3xl text-orange-500 mr-4">📊</div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{
                        myProducts.length > 0 ? Math.round(myProducts.reduce((total, product) => total + product.sales, 0) / myProducts.length) : 0
                      }</div>
                      <div className="text-sm text-gray-600">Avg Sales/Product</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
                  <div className="space-y-3">
                    {myProducts.sort((a, b) => b.sales - a.sales).slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{product.sales} sold</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status</h3>
                  <div className="space-y-3">
                    {myProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                        <div className="flex items-center">
                          <div className={`text-sm font-medium ${product.stock > 20 ? 'text-green-600' :
                            product.stock > 5 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                            {product.stock} in stock
                          </div>
                          <div className={`w-2 h-2 rounded-full ml-2 ${product.stock > 20 ? 'bg-green-500' :
                            product.stock > 5 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }

          {/* profile  */}
          {showSection.id === "profile" &&
            <div className="space-y-6 p-4 w-full">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <p className="text-gray-600 mt-1">Manage your shop information and preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                      <input
                        type="text"
                        value={user?.shopName || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={user?.phone || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Account Status</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Member Since</span>
                      <span className="text-sm text-gray-900">September 2024</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Products</span>
                      <span className="text-sm text-gray-900">{myProducts.length}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Sales</span>
                      <span className="text-sm text-gray-900">{myProducts.reduce((total, product) => total + product.sales, 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* about  */}
          {
            showSection.id === "about" &&
            <div className="space-y-6 p-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">About BilinKit</h2>
                <p className="text-gray-600 mt-1">Your trusted marketplace for local businesses</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Welcome to BilinKit</h3>
                    <p className="text-gray-600 leading-relaxed">
                      BilinKit is a comprehensive marketplace platform that connects local shopkeepers with customers.
                      Our mission is to digitize and empower small businesses by providing them with modern e-commerce tools
                      and helping them reach a wider customer base.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">For Shopkeepers</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Register as a shopkeeper to start selling your products online. Once approved by our admin team,
                      you'll get access to powerful tools to manage your inventory, track orders, and grow your business
                      with detailed analytics and insights.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="text-3xl mb-3">🛍️</div>
                        <h4 className="font-semibold text-gray-800 mb-2">Easy Product Management</h4>
                        <p className="text-sm text-gray-600">Add, edit, and manage your products effortlessly with our intuitive interface</p>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="text-3xl mb-3">📊</div>
                        <h4 className="font-semibold text-gray-800 mb-2">Sales Analytics</h4>
                        <p className="text-sm text-gray-600">Track your sales performance and business growth with detailed analytics</p>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="text-3xl mb-3">🚀</div>
                        <h4 className="font-semibold text-gray-800 mb-2">Grow Your Business</h4>
                        <p className="text-sm text-gray-600">Reach more customers and increase your sales through our platform</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">1</div>
                        <h4 className="font-medium text-gray-800 mb-1">Register</h4>
                        <p className="text-sm text-gray-600">Create your shopkeeper account with basic information</p>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">2</div>
                        <h4 className="font-medium text-gray-800 mb-1">Get Approved</h4>
                        <p className="text-sm text-gray-600">Wait for admin approval to access all features</p>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">3</div>
                        <h4 className="font-medium text-gray-800 mb-1">Add Products</h4>
                        <p className="text-sm text-gray-600">Upload your products with details and pricing</p>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-2">4</div>
                        <h4 className="font-medium text-gray-800 mb-1">Start Selling</h4>
                        <p className="text-sm text-gray-600">Manage orders and grow your business online</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Get Started?</h3>
                    <p className="text-gray-600 mb-4">
                      Join thousands of shopkeepers who are already growing their business with BilinKit.
                      Register now and take your business online!
                    </p>
                    {!user && (
                      <button
                        onClick={() => setShowRegisterModal(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                      >
                        Register as Shopkeeper
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          }




        </div>
      }

      {/* Modals */}
      {showRegisterModal && <RegisterModal />}
      {showAddProductModal && <AddProductModal loginUser={loginUser} />}
      {productEditModal && <EditProductModal />}
      {showProductDetails && <ProductDetailsModal />}


    </div>
  );
};

export default ShopKeeper;