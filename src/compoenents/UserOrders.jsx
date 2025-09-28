import axios from 'axios'
import { Package } from 'lucide-react'
import React, { useEffect, useState } from 'react'
const base_url_address = import.meta.env.VITE_BASE_URL

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

console.log("orders",orders);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>

      {orders?.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>No orders found</p>
          <p className="text-sm">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 flex justify-between items-start hover:shadow-md transition"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Product ID: {order.product_id}
                </p>
                <p className="text-sm text-gray-600">
                  Payment: {order.payment_method}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {order.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ₹{order.buy_price}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Address: {order.delivered_address.landmark},{" "}
                  {order.delivered_address.district},{" "}
                  {order.delivered_address.state},{" "}
                  {order.delivered_address.country} -{" "}
                  {order.delivered_address.pincode}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    
  );
};



export default UserOrders
