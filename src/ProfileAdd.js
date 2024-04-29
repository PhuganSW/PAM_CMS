import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function ProfileAdd() {

  return (
    
      <div className="dashboard">
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
            {/* Add other navigation links here */}
          </ul>
        </nav>
        
        <main className="main-content">
          <header>
            <h1>เพิ่มประวัติพนักงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
                <div style={{backgroundColor:'red',margin:10,justifySelf:'center'}}>
                    <img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={100} height={100} alt="Logo" />
                </div>
            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  