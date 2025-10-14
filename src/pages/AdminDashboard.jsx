import axios from 'axios';
import React, { useState, useEffect } from 'react';
const base_url_shopkeeper=import.meta.env.VITE_BASE_URL

const AdminDashboard = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [filteredShopkeepers, setFilteredShopkeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('shopkeepers');

  // Simulate API call
  useEffect(() => {
    const fetchShopkeepers = async () => {
      setLoading(true);
      try {
        // const response = await axios.get('http://localhost:8000/api/v1/shopKeeper/getShopKeeper');
        const response = await axios.get(`${base_url_shopkeeper}/api/v1/shopKeeper/getShopKeeper`);
        const data = await response.data.data
        console.log("data",data);
        
        
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
      console.log("searchTerm",searchTerm);
      
      filtered = filtered?.filter(shop => 
        shop?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        shop?.shopName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        shop?.email?.toLowerCase().includes(searchTerm?.toLowerCase())
      );

      console.log("filtered",filtered);
      setFilteredShopkeepers(filtered);

      
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shop => shop.status === statusFilter);
    }

    // setFilteredShopkeepers(filtered);
  }, [searchTerm, statusFilter, shopkeepers]);

  const handleStatusUpdate = async(id, newStatus) => {
    console.log("id",id);
    newStatus=1

    // const resp=await axios.put(`http://localhost:8000/api/v1/shopKeeper/updateShopKeeperStatus/${id}`,{status:newStatus})
    const resp=await axios.put(`${base_url_shopkeeper}/updateShopKeeperStatus/${id}`,{status:newStatus})

    console.log("respons for update status fo rsho keeper",resp.success);
    
   
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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'shopkeepers', label: 'Shopkeepers', icon: '👥' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  
  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">BilinKit Admin</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">👤</span>
              </div>
              <span className="text-gray-700 font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <nav className="mt-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'shopkeepers' ? (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Shopkeeper Management</h2>
                  <p className="text-gray-600 mt-1">Manage shopkeeper registration requests</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Total: {filteredShopkeepers?.length}</span>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-64">
                    <input
                      type="text"
                      placeholder="Search by name, shop name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

                {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-gray-800">
                    {shopkeepers?.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {shopkeepers?.filter(s => s.status === 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {shopkeepers?.filter(s => s.status === 1).length}
                  </div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="text-2xl font-bold text-red-600">
                    {shopkeepers?.filter(s => s.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading shopkeepers...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Shopkeeper Info
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Shop Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Request Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredShopkeepers?.map((shopkeeper) => (
                          <tr key={shopkeeper.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{shopkeeper.name}</div>
                                <div className="text-sm text-gray-500">{shopkeeper.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{shopkeeper.shop_name}</div>
                                {/* <div className="text-sm text-gray-500">{shopkeeper.category}</div> */}
                                <div className="text-sm text-gray-500">{shopkeeper.shop_address}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{shopkeeper.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shopkeeper.status)}`}>
                                {/* {shopkeeper.status.charAt(0).toUpperCase() + shopkeeper.status.slice(1)} */}
                              <div className="text-sm text-gray-900">{shopkeeper.status == 0 ? "Panding" :"Approved"} </div>

                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {shopkeeper.created_at.slice(0,10)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {shopkeeper.status === 0 && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleStatusUpdate(shopkeeper.id, 'accepted')}
                                    className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(shopkeeper.id, 'rejected')}
                                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                                  >
                                    Reject 
                                  </button>
                                </div>
                              )}
                               {shopkeeper.status !== 'pending' && ( 
                                 <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
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
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <span className="text-4xl mb-4 block">{sidebarItems.find(item => item.id === activeTab)?.icon}</span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {sidebarItems.find(item => item.id === activeTab)?.label}
                </h3>
                <p className="text-gray-600">This section is under development.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;