import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

const positions = [
  {
    value: 'None',
    label: ' ',
  },
  {
    value: 'SW',
    label: 'Software Engineer',
  },
  {
    value: 'EE',
    label: 'Electical Engineer',
  },
  {
    value: 'MEC',
    label: 'Mechanical',
  },
];

const sexs = [
  {
    value: 'None',
    label: ' ',
  },
  {
    value: 'men',
    label: 'ชาย',
  },
  {
    value: 'lady',
    label: 'หญิง',
  },
  {
    value: 'other',
    label: 'อื่นๆ',
  },
];

function ProfileAdd() {
  const [name,setName] = useState('');
  const [nameEng,setNameEng] = useState('');
  const [position,setPosition] = useState('');
  const [firstDay,setFirstDay] = useState('');
  const [address,setAddress] = useState('');
  const [email,setEmail] = useState('');
  const [phone,setPhone] = useState('');
  const [sex,setSex] = useState('');

  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>เพิ่มประวัติพนักงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div className="main">
            <div className="main-contain">
              <div className='block_img'>
                <img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" />
              </div>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center'}}>
                <div style={{ gap: '10px', marginBottom: '20px'}}>
                  <TextField
                    label="ชื่อ-นามสกุล"
                    variant="filled"
                    style={{width:400,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="ชื่อ-นามสกุล ภาษาอังกฤษ"
                    variant="filled"
                    style={{width:400,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={nameEng}
                    onChange={(e) => setNameEng(e.target.value)}
                  />
                  <TextField
                    id="filled-select"
                    select
                    label="เพศ"
                    defaultValue="None"
                    variant="filled"
                    style={{width:150}}
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    {sexs.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                  <TextField
                    id="filled-select"
                    select
                    label="ตำแหน่ง"
                    defaultValue="None"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    {sexs.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="วันเข้าทำงาน"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={firstDay}
                    onChange={(e) => setFirstDay(e.target.value)}
                  />
                  <TextField
                    label="ที่อยู๋"
                    variant="filled"
                    style={{width:500}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                <TextField
                    label="E-mail"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="เบอร์โทร"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  