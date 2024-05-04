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
              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <p style={{marginRight:10}}>ชื่อ-นามสกุล</p>
                  <form>
                    <input class='addProfile_input' placeholder='Name' />
                    <input class='addProfile_input' placeholder='Last Name' />
                  </form>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginRight:85}}>
                  <p style={{marginRight:10}}>ชื่อ-นามสกุลภาษาอังกฤษ</p>
                  <form>
                    <input class='addProfile_input' placeholder='Name Eng' />
                    <input class='addProfile_input' placeholder='Last Name Eng' />
                  </form>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                  <p style={{marginRight:10}}>ตำแหน่ง</p>
                  <form>
                    <input class='addProfile_input' placeholder='Position' />
                  </form>
                  <p style={{marginRight:10}}>วันเข้าทำงาน</p>
                  <form>
                    <input class='addProfile_input' placeholder='Start Date' />
                  </form>
                </div>
                <p style={{marginRight:10}}>ที่อยู่</p>
                <form>
                    <input class='addProfile_input' placeholder='Address' />
                </form>
                <p style={{marginRight:10}}>เบอร์โทร</p>
                <form>
                  <input class='addProfile_input' placeholder='Phone no.' />
                </form>
                <button style={{margin:20}}>Save</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  