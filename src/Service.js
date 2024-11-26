// Service.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Service.css';
import logo from './icon/PAM_logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="PAM Logo" className="navbar-logo-image" />
      </div>
      {/* <div className="navbar-buttons">
      <button className="navbar-button sign-up" onClick={() => navigate('/register')}>Sign Up</button>
      <button className="navbar-button sign-in" onClick={() => navigate('/login_company')}>Sign In</button>
      </div> */}
    </div>
  );
};

const Service = () => {
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
        <p style={{fontSize:56}}>Coming Soon...</p>
      </div>
      
      {/* </div> */}
    </div>
  );
};

export default Service;
