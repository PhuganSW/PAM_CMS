import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'

function ProfileAdd() {

  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>เพิ่มประวัติพนักงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
              <div class='block_img'>
                <img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" />
              </div>
              <div style={{display:'flex',flexDirection:'row'}}>

              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  