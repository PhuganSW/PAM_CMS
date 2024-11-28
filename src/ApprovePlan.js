// ApprovePlan.js
import React,{ useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Service.css';
import logo from './icon/PAM_logo.png';
import { AdminProvider, AdminContext } from './AdminContext';
import adminAuth from './Firebase/AdminAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentAdmin, setCurrentAdmin ,loadingAdmin, setLoadingAdmin , } = useContext(AdminContext);

  const logOutSuccess = () => {
    setCurrentAdmin(null);
    setLoadingAdmin(false)
    localStorage.removeItem('adminData');
    navigate('/login_admin');  // Redirect to login company page
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="PAM Logo" className="navbar-logo-image" />
      </div>
      <div className="navbar-buttons">
      <button className="navbar-button sign-up" onClick={() => navigate('/register')}>Sign Up</button>
      <button className="navbar-button sign-in" onClick={() => adminAuth.signout(logOutSuccess)}>Sign Out</button>
      </div>
    </div>
  );
};

const ApprovePlan = () => {
  return (
    <div className="container">
      <Navbar />
      {/* <div className="background-overlay"> */}
      {/* <div className="key-features">
        <h2>Key Feature</h2>
        <ul>
          <li>Dashboard สรุปข้อมูล</li>
          <li>รูปสัญลักษณ์ใช้งานง่าย</li>
          <li>จัดการเรื่องเงินเดือน</li>
          <li>จัดการสิทธิพนักงาน</li>
        </ul>
      </div> */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
        <p style={{fontSize:56}}>Soon...</p>
      </div>
      
      {/* </div> */}
    </div>
  );
};

export default ApprovePlan;
