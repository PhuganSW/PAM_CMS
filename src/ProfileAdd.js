import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';

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

const Levels = [
  {
    value: 'None',
    label: ' ',
  },
  {
    value: 'employee',
    label: 'Employee',
  },
  {
    value: 'HR',
    label: 'HR',
  },
];

function ProfileAdd() {
  const navigate = useNavigate();
  const [name,setName] = useState('');
  const [nameEng,setNameEng] = useState('');
  const [position,setPosition] = useState('');
  const [firstDay,setFirstDay] = useState('');
  const [address,setAddress] = useState('');
  const [email,setEmail] = useState('');
  const [phone,setPhone] = useState('');
  const [sex,setSex] = useState('');
  const [level,setLevel] = useState('');

  const addUserSuccess=()=>{
    navigate('/profile')
  }

  const addUserUnsuccess=(e)=>{
    console.log(e)
  }

  const onSave=()=>{
    var nameth = name.split(" ")
    var nameEn = nameEng.split(" ")
    let item ={
      name:nameth[0],
      lastname:nameth[1],
      FName:nameEn[0],
      LName:nameEn[1],
      position:position,
      workstart:firstDay,
      address:address,
      tel:phone,
      email:email,
      sex:sex,
      level:level,
      quote:'',
      image:'',
    }
    firestore.addUser(item,addUserSuccess,addUserUnsuccess)
  }

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
                {/*<img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" />*/}
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
                    {positions.map((option) => (
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
                  <TextField
                    id="filled-select"
                    select
                    label="ระดับ"
                    defaultValue="None"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {Levels.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกขอมูล</button>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#ff6666',color:'#FFFFFF'}} onClick={()=>navigate('/profile')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  