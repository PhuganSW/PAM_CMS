import React, { useState } from 'react';
import './Home.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <h1>PAM</h1>
          <p>Personnel Assistance Manager</p>
          <nav>
            <ul>
              <li><a href="#">หน้าหลัก</a></li>
              <li><a href="#">จัดการประวัติพนักงาน</a></li>
              <li><a href="#">ประวัติการเข้า-ออกงาน</a></li>
              <li><a href="#">คำขอลางาน</a></li>
              <li><a href="#">คำขอทำ OT</a></li>
              <li><a href="#">จัดการสิทธิ์และวันหยุด</a></li>
              <li><a href="#">ทำเรื่องเงินเดือน</a></li>
              <li><a href="#">ลงประกาศ</a></li>
              <li><a href="#">จัดการผู้ใช้</a></li>
            </ul>
          </nav>
          <button className="sign-out">Sign Out</button>
        </div>
      </div>
      <div className="main-content">
        <header className="header">
          <button className="toggle-button" onClick={toggleSidebar}>
            {sidebarOpen ? '☰' : '☰'}
          </button>
          <h2>คำขอลางาน</h2>
        </header>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
