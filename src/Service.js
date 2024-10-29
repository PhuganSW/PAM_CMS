import React from 'react';
import './Service.css';
import logo from './icon/PAM_logo.png';

const Service = () => {
  return (
    <div className="container">
      <div className="background-overlay"></div> {/* New background layer */}
      
      <div className="key-features">
        <h2>Key Feature</h2>
        <ul>
          <li>Dashboard สรุปข้อมูล</li>
          <li>รูปสัญลักษณ์ใช้งานง่าย</li>
          <li>จัดการเรื่องเงินเดือน</li>
          <li>จัดการสิทธิพนักงาน</li>
        </ul>
      </div>

      <div className="center-logo">
        <img src={logo} alt="PAM Logo" />
      </div>

      <div className="buttons">
        <div className="button">PAM mini</div>
        <div className="button">PAM</div>
        <div className="button">PAM Ai</div>
      </div>
    </div>
  );
};

export default Service;
