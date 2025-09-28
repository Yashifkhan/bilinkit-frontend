import React from 'react'
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
  return (
    <>
      <BrowserRouter>
      {/* <Home></Home> */}
     {/* <AdminDashboard></AdminDashboard> */} 
      <ToastContainer />
      <Routes>
        <Route path='' element={<Home></Home>}></Route>
        <Route path='/userpage' element={<UserPage></UserPage>}/>
        <Route path='/shopkeeper' element={<ShopKeeper></ShopKeeper>}></Route>
        {/* <Route path='/AdminDashboard' element={<AdminDashboard></AdminDashboard>}></Route> */}
        <Route path='/login' element={<Login></Login>}></Route>
      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App









// CREATE TABLE products (
//     id INT PRIMARY KEY AUTO_INCREMENT,     
//     shopkeeper_id INT NOT NULL,           
//     category_id INT NOT NULL,              
//     name VARCHAR(150) NOT NULL,          
//     description TEXT,                    
//     price DECIMAL(10,2) NOT NULL,        
//     discount DECIMAL(5,2) DEFAULT 0.00,    
//     stock INT DEFAULT 1,                
//     unit VARCHAR(50) DEFAULT 'pcs',      
//     image_url VARCHAR(255),             
//     status INT DEFAULT 1,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );
