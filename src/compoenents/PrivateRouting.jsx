import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserPage from "../pages/UserPage";
import ShopKeeper from "../pages/ShopKeeper";
import AdminDashboard from "../pages/AdminDashboard";

const PrivateRouting = () => {
    const [role] = useState(localStorage.getItem("role"));

    return (
        <Routes>
            {role === "user" && <Route path="/userpage" element={<UserPage />} />}
            {role === "shopkeeper" && <Route path="/shopkeeper" element={<ShopKeeper />} />}
            {role === "admin" && <Route path="/AdminDashboard" element={<AdminDashboard />} />}


            <Route path="*" element={
                    <h1 style={{ color: "red", textAlign: "center", marginTop: "50px", }} >
                        404 - Page Not Found
                    </h1>
                }
            />
    </Routes >
  );
};

export default PrivateRouting;
