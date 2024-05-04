import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css'; // Your custom CSS file

function Sidebar(){
    return(
        <nav className="sidebar">
          <div className='head-sidebar'>
            <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={80} height={80} style={{marginRight:20}} alt="Logo" />
            <h4>Personnel Assistance Manager</h4>
          </div>
          <ul>
            <li><Link to="/home">หน้าหลัก</Link></li>
            <li><Link to="/profile">จัดการประวัติพนักงาน</Link></li>
            <li><Link to="/checkin_history">ประวัติการเข้า-ออกงาน</Link></li>
            <li><Link to="/leave_request">คำขอลางาน</Link></li>
            <li><Link to="/ot_request">คำขอทำ OT</Link></li>
            <li><Link to="/welthfare_manage">จัดการสิทธิ์และวันหยุด</Link></li>
            <li><Link to="/salary_manage">ทำเรื่องเงินเดือน</Link></li>
            <li><Link to="/annouce">ลงประกาศ</Link></li>
            <li><Link to="/manage_account">จัดการผู้ใช้</Link></li>
            {/* Add other navigation links here */}
          </ul>
        </nav>
    );
}
export default Sidebar