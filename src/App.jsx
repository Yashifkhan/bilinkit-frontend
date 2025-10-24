import React, { useEffect, useState } from 'react'
import AdminDashboard from './pages/AdminDashboard'
import ShopKeeper from './pages/ShopKeeper'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import UserPage from './pages/UserPage';
import Home from './pages/Home';
import Login from './pages/Login';
// import Home from './pages/Home';

function App() {
  const [role, setrole] = useState("");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='' element={<Home setrole={setrole}></Home>}></Route>
          {
            role === "user" && <Route path='/userpage' element={<UserPage/>}/> 
          }
          {
            role === "shopkeeper" && <Route path='/shopkeeper' element={<ShopKeeper/>}/>
          }
          {
            role === "admin" && <Route path='/AdminDashboard' element={<AdminDashboard/>}/>

          }
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}

export default App









