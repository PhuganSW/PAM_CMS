import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";

function CheckHistory() {

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
            <h1>ประวัติการเข้า-ออกงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
            <div class="search-field">
                <p style={{marginTop:10}}>ค้นหาพนักงาน</p>
                <input style={{width:'40%',margin:5,height:30,borderRadius:20,paddingInlineStart:10,fontSize:18}} />
                <button class="search-button"></button>
              </div>
              
              <div style={{display:'flex',width:'95%',alignSelf:'center',flexDirection:'row',justifyContent: 'space-around'}}>
                
                <div style={{width:'45%'}}>
                <p>เวลาเข้างาน</p>
                <TableBootstrap striped bordered hover style={{marginTop:20}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*people.map((person) => (
                      <tr key={person.id}>*/}
                      <tr>
                        <th scope="row">17/04/2567</th>
                        <td>
                          AAA BBB
                        </td>
                        <td>07.35</td>
                      </tr>
                    {/*}))}*/}
                  </tbody>
                </TableBootstrap>
                </div>
                
                <div style={{width:'45%'}}>
                <p>เวลาออกงาน</p>
                <TableBootstrap striped bordered hover style={{marginTop:20}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*people.map((person) => (
                      <tr key={person.id}>*/}
                      <tr>
                        <th scope="row">17/04/2567</th>
                        <td>
                          AAA BBB
                        </td>
                        <td>17.05</td>
                      </tr>
                    {/*}))}*/}
                  </tbody>
                </TableBootstrap>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default CheckHistory;

  