import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css'; // Your custom CSS file
//import { auth } from './Firebase/Config';
import { useNavigate } from 'react-router-dom'
import auth from './Firebase/Auth';

function Sidebar(){
  const navigate = useNavigate();
  const [currentUser,setCurrentUser] = useState('');

  const logOutSuc =()=>{
    setCurrentUser(null)
    navigate("/")
  }

  const logout=(e)=>{
    e.preventDefault()
    auth.signOut(logOutSuc)
  }

    return(
        <nav className="sidebar">
          <div className='head-sidebar'>
            <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={80} height={80} style={{marginRight:20}} alt="Logo" />
            <h4>Personnel Assistance Manager</h4>
          </div>
          <ul>
          <li>
          <Link to="/home">
            <i className="fas fa-home"></i> {/* Home Icon */}
            <span>หน้าหลัก</span>
          </Link>
        </li>
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
          <div className='logout-button'> 
            <button onClick={logout}>Sign Out</button>
          </div>
        </nav>
    );
}
export default Sidebar