import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRouting from './compoenents/PrivateRouting';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Private (protected) routes */}
          <Route path="/*" element={<PrivateRouting />} />
         
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
