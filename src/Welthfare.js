import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';

function Welthfare() {

  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>จัดการสิทธิ์และวันหยุด</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default Welthfare;

  