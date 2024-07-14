import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';
import auth from './Firebase/Auth';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

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
              <li className={isActive("/home") ? "active" : ""}><Link to="/home">Dashboard</Link></li>
              <li className={isActive("/manageIndex") ? "active" : ""}><Link to="/manageIndex">จัดการ Index</Link></li>
              <li className={isActive("/profile") ? "active" : ""}><Link to="/profile">จัดการประวัติพนักงาน</Link></li>
              <li className={isActive("/checkin_history") ? "active" : ""}><Link to="/checkin_history">ประวัติการเข้า-ออกงาน</Link></li>
              <li className={isActive("/managment") ? "active" : ""}><Link to="/managment">จัดการกำลังคน</Link></li>
              <li className={isActive("/network") ? "active" : ""}><Link to="/network">Network</Link></li>
              <li className={isActive("/leave_request") ? "active" : ""}><Link to="/leave_request">คำขอลางาน</Link></li>
              <li className={isActive("/ot_request") ? "active" : ""}><Link to="/ot_request">คำขอทำ OT</Link></li>
              <li className={isActive("/welthfare") ? "active" : ""}><Link to="/welthfare">จัดการสิทธิ์และวันหยุด</Link></li>
              <li className={isActive("/salary") ? "active" : ""}><Link to="/salary">ทำเรื่องเงินเดือน</Link></li>
              <li className={isActive("/annouce") ? "active" : ""}><Link to="/annouce">ลงประกาศ</Link></li>
              <li className={isActive("/manage_account") ? "active" : ""}><Link to="/manage_account">จัดการผู้ใช้</Link></li>
              <li className={isActive("/contact") ? "active" : ""}><Link to="/contact">ติดต่อผู้พัฒนา</Link></li>
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
