import axios from 'axios'
import { Calendar, CreditCard, MapPin, Package, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
const base_url_address = import.meta.env.VITE_BASE_URL
const base_url_img = import.meta.env.VITE_BASE_URL;

const UserOrders = ({loginUser}) => {
    const [orders,setOrders]=useState(null)

    const fetchorder=async()=>{
        const resp=await axios.get(`${base_url_address}/api/v1/orders/getOrdersByUser/${loginUser.id}`)
        console.log("resp of get orders",resp.data.data);
        setOrders(resp.data.data)
        if (resp.data.success) {
        const parsedOrders = resp.data.data.map((order) => ({
          ...order,
          delivered_address: JSON.parse(order.delivered_address), // ✅ parse here
        }));
        setOrders(parsedOrders);
      }
    
        
    }

    useEffect(()=>{
fetchorder()        
    },[])



    const getStatusColor = (status) => {
    const colors = {
      "Ordered": "bg-red-50 text-red-700 border-red-200",
      "Shipped": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "Out for Delivery": "bg-blue-50 text-blue-700 border-blue-200",
      "Delivered": "bg-green-50 text-green-700 border-green-200"
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

    const getProgressWidth = (status) => {
    const widths = {
      "Ordered": "25%",
      "Shipped": "50%",
      "Out for Delivery": "75%",
      "Delivered": "100%"
    };
    return widths[status] || "0%";
  };

   const getProgressColor = (status) => {
    if (status === "Delivered") return "bg-gradient-to-r from-green-400 to-green-600";
    if (status === "Out for Delivery") return "bg-gradient-to-r from-green-400 to-yellow-500";
    if (status === "Shipped") return "bg-gradient-to-r from-red-400 to-yellow-500";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

console.log("orders",orders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-2">
              My Orders
            </h2>
            <p className="text-gray-600">Track and manage your purchases</p>
          </div>

          {orders?.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-red-100 to-green-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-2">No orders found</p>
              <p className="text-gray-500">Your order history will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders?.map((order) => {
                const product = order.orderedProductsInfo || {};
                const address =
                  typeof order.delivered_address === "string"
                    ? JSON.parse(order.delivered_address)
                    : order.delivered_address;

                return (
                  <div
                    key={order.id}
                    className="group border-2 border-gray-200 rounded-2xl p-3 hover:shadow-md hover:border-green-300 transition-all duration-300 bg-gradient-to-br from-white via-gray-50 to-white"
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-5">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor("Shipped")}`}>
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>

                    {/* Product Section */}
                    <div className="flex gap-6 mb-4">
                      {/* Image */}
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-red-100 to-green-100 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={`${base_url_img}${product?.image_url}`}
                            alt={product.name || "product"}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">
                          {order.quantity}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                          {product.name || "Product"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Order Info Pills */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Package className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Order #{order.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <CreditCard className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {order.payment_method}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-3 py-1.5 rounded-lg shadow-lg">
                            <TrendingUp className="h-4 w-4 text-white" />
                            <span className="text-sm font-bold text-white">
                              ₹{order.buy_price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2 bg-gradient-to-r from-red-50 to-green-50 p-3 rounded-lg border border-gray-200">
                          <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            {address?.landmark}, {address?.district}, {address?.state}, {address?.country} - <span className="font-semibold">{address?.pincode}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mt-6 pt-6 border-t-2 border-gray-100">
                      <div className="flex justify-between text-xs font-semibold mb-3">
                        <span className={order.status === "Ordered" || order.status === "Shipped" || order.status === "Out for Delivery" || order.status === "Delivered" ? "text-green-600" : "text-gray-400"}>
                          Ordered
                        </span>
                        <span className={order.status === "Shipped" || order.status === "Out for Delivery" || order.status === "Delivered" ? "text-green-600" : "text-gray-400"}>
                          Shipped
                        </span>
                        <span className={order.status === "Out for Delivery" || order.status === "Delivered" ? "text-green-600" : "text-gray-400"}>
                          Out for Delivery
                        </span>
                        <span className={order.status === "Delivered" ? "text-green-600" : "text-gray-400"}>
                          Delivered
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full ${getProgressColor("Delivered")} transition-all duration-700 ease-out shadow-lg`}
                          style={{ width: getProgressWidth("Delivered") }}
                        >
                          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                        </div>
                      </div>

                      {/* Dots on progress bar */}
                      <div className="relative flex justify-between -mt-1.5">
                        {['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                          const currentSteps = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
                          const currentIndex = currentSteps.indexOf(order.status);
                          const isActive = idx <= currentIndex;
                          
                          return (
                            <div
                              key={step}
                              className={`w-4 h-4 rounded-full border-2 ${
                                isActive
                                  ? 'bg-green-500 border-white shadow-lg'
                                  : 'bg-gray-300 border-white'
                              } transition-all duration-500`}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default UserOrders
