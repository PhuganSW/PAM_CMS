import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useEffect, useState } from 'react';

function Annouce() {
  const navigate = useNavigate();



  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>ประกาศ</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
            <div class="search-field">
                <p style={{marginTop:10}}>ค้นหาประกาศ</p>
                <input style={{width:'40%',margin:5,height:30,borderRadius:20,paddingInlineStart:10,fontSize:18}} />
                <button class="search-button"></button>
              </div>
              
              <button className='Add-button' onClick={()=> navigate('/add_annouce')}>เพิ่มประกาศ</button>
              <div style={{width:'95%',alignSelf:'center'}}>
              <TableBootstrap striped bordered hover>
                <thead>
                  <tr>
                    <th scope="col">ลำดับ</th>
                    <th scope="col">หัวข้อ</th>
                    <th scope="col">วันที่</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {/*people.map((person) => (
                    <tr key={person.id}>*/}
                    <tr>
                      <th scope="row">1</th>
                      <td>
                        ประกาศ AAAA
                      </td>
                      <td>17/04/2567</td>
                      <td style={{width:'25%',justifyContent:'center'}}>
                        <button className='Edit-button'>แก้ไขประกาศ</button>
                        <button className='Delete-button'>ลบประกาศ</button>
                      </td>
                    </tr>
                  {/*}))}*/}
                </tbody>
              </TableBootstrap>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default Annouce;

  