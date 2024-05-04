import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";

function CheckHistory() {

  return (
    
      <div className="dashboard">
        <Sidebar />
        
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

  