import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import './Layout.css';
import auth from './Firebase/Auth';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [currentUser,setCurrentUser] = useState('');

  const logOutSuc =()=>{
    setCurrentUser(null)
    navigate("/")
  }

  const logout=(e)=>{
    e.preventDefault()
    auth.signOut(logOutSuc)
  }

  return (
    <div className="layout">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
        {/* <button className="toggle-button" onClick={toggleSidebar}>
            {sidebarOpen ? '☰' : '☰'}
          </button>
           */}
        <div className='head-sidebar'>
            <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={80} height={80} style={{marginRight:20}} alt="Logo" />
            <h4>Personnel Assistance Manager</h4>
          </div>
          <nav>
          <ul>
            <li><Link to="/home">หน้าหลัก</Link></li>
            <li><Link to="/profile">จัดการประวัติพนักงาน</Link></li>
            <li><Link to="/checkin_history">ประวัติการเข้า-ออกงาน</Link></li>
            <li><Link to="/leave_request">คำขอลางาน</Link></li>
            <li><Link to="/ot_request">คำขอทำ OT</Link></li>
            <li><Link to="/welthfare">จัดการสิทธิ์และวันหยุด</Link></li>
            <li><Link to="/salary_manage">ทำเรื่องเงินเดือน</Link></li>
            <li><Link to="/annouce">ลงประกาศ</Link></li>
            <li><Link to="/manage_account">จัดการผู้ใช้</Link></li>
            {/* Add other navigation links here */}
          </ul>
          </nav>
          <div className='logout-button'> 
            <button style={{fontSize:22}} onClick={logout}>Sign Out</button>
          </div>
        </div>
      </div>
      
        
          <button className="toggle-button" onClick={toggleSidebar}>
            {sidebarOpen ? '☰' : '☰'}
          </button>
          
       
        <div className="content">
          {children}
        </div>
      </div>
    
  );
};

export default Layout;
