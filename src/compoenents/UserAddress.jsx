import React, { useEffect, useState } from "react";
import { MapPin, Home } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
const base_url_address = import.meta.env.VITE_BASE_URL

const UserAddress = ({ sidebarItems, showSection, loginUser }) => {
    const [openMapModal, setOpenMapModal] = useState(false);
    const [addressType, setAddressType] = useState("manual"); // "manual" | "map"
    const [formData, setFormData] = useState({
        landmark: "",
        state: "",
        country: "",
        district: "",
        pincode: "",
        sector: "",
    });
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [savedAddress, setSavedAddress] = useState(null); // final saved address
    const [showForm, setShowForm] = useState(false); // controls form display
    const [userSavedAddress, setUserSavedAddress] = useState(null)

    const fetchAddress = async () => {
        console.log("hiiiii");
        
        const resp = await axios.get(`${base_url_address}/api/v1/address/getAddresById/${loginUser.id}`)
        console.log(resp.data);
        setUserSavedAddress(resp.data.data[0])
        

        if (resp?.data?.success === "true") {
            console.log("true function");
            setSavedAddress(resp.data.data[0])
        }
    }

    useEffect(() => {
        fetchAddress()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMapSelect = () => {
        // fake location for demo (replace with real map later)
        setSelectedLocation({ lat: 28.6139, lng: 77.209 });
        setOpenMapModal(false);
        setAddressType("map");
        setShowForm(true);
    };

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        const resp = await axios.post(`${base_url_address}/api/v1/address/addAddress/${loginUser.id}`, formData)
        console.log("****************>>>>", resp.data);
        
        if (resp.data.success === "true") {
            toast.success("Address Saved Successfully")
            // Refresh the address data after saving
            fetchAddress();
        }
        setShowForm(false);
    };

    const handleChangeAddress = () => {
        setAddressType("manual");
        setFormData({
            landmark: "",
            state: "",
            country: "",
            district: "",
            pincode: "",
            sector: "",
        });
        setSelectedLocation(null);
        setShowForm(true); // 👈 open manual form directly
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setFormData({
            landmark: "",
            state: "",
            country: "",
            district: "",
            pincode: "",
            sector: "",
        });
    };

    console.log("address is", userSavedAddress);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {sidebarItems.find((item) => item.id === showSection.id)?.label}
            </h2>
            
            {/* Saved Address Card - Show if userSavedAddress exists and has data */}
            {userSavedAddress && (
                <div className="mb-6 border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-2">
                        <Home size={20} className="text-blue-600" />
                        Saved Address
                    </h3>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 mb-2">
                        <p>
                            <span className="font-medium">Landmark:</span> {userSavedAddress.landmark || 'N/A'}
                        </p>
                        <p>
                            <span className="font-medium">State:</span> {userSavedAddress.state || 'N/A'}
                        </p>
                        <p>
                            <span className="font-medium">Country:</span> {userSavedAddress.country || 'N/A'}
                        </p>
                        <p>
                            <span className="font-medium">District:</span> {userSavedAddress.district || 'N/A'}
                        </p>
                        <p>
                            <span className="font-medium">Pincode:</span> {userSavedAddress.pincode || 'N/A'}
                        </p>
                        <p>
                            <span className="font-medium">Sector:</span> {userSavedAddress.sector || 'N/A'}
                        </p>
                    </div>

                    <button
                        onClick={handleChangeAddress}
                        className="px-4 py-2 mt-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                        Change Address
                    </button>
                </div>
            )}

            {/* Add Address Section (if no saved address OR editing) */}
            {(!userSavedAddress || showForm) && (
                <>
                    {/* Back button when editing existing address */}
                    {userSavedAddress && showForm && (
                        <button
                            onClick={handleCancelEdit}
                            className="mb-4 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        >
                            ← Back
                        </button>
                    )}

                    {/* Map Button - show for both new address and editing */}
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => setOpenMapModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <MapPin size={20} /> Select Location on Map
                        </button>
                    </div>

                    {/* Add Address Button - only show if no saved address and form not shown */}
                    {!showForm && !userSavedAddress && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            ➕ Add Address
                        </button>
                    )}

                    {/* Manual Form */}
                    {showForm && (
                        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmitAddress}>
                            <input
                                type="text"
                                name="landmark"
                                placeholder="Landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="border rounded-lg p-2"
                                required
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className="border rounded-lg p-2"
                                required
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                className="border rounded-lg p-2"
                                required
                            />
                            <input
                                type="text"
                                name="district"
                                placeholder="District"
                                value={formData.district}
                                onChange={handleChange}
                                className="border rounded-lg p-2"
                                required
                            />
                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="border rounded-lg p-2"
                                required
                            />
                            <input
                                type="text"
                                name="sector"
                                placeholder="Sector"
                                value={formData.sector}
                                onChange={handleChange}
                                className="border rounded-lg p-2"
                                required
                            />

                            <button
                                type="submit"
                                className="col-span-2 mt-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            >
                                Save Address
                            </button>
                        </form>
                    )}
                </>
            )}

            {/* Map Modal */}
            {openMapModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Pick your Location</h3>
                        <div className="h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                            <p className="text-gray-600">🗺️ Map will be here</p>
                        </div>
                        <div className="flex justify-end mt-4 gap-3">
                            <button
                                onClick={() => setOpenMapModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMapSelect}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAddress;