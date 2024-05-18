import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import firestore from './Firebase/Firestore';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';




function AnnouceAdd() {
  const navigate = useNavigate();
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [date,setDate] = useState(dayjs());
  const [detail,setDetail] = useState('');


  const addUserSuccess=()=>{
    navigate('/profile')
  }

  const addUserUnsuccess=(e)=>{
    console.log(e)
  }

  const onSave=()=>{
    
  }

  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>เพิ่มประกาศ</h1>
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
                    label="หัวข้อ"
                    variant="filled"
                    style={{width:'100%',marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  
                   
                  
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        
                        <DatePicker
                        label="วันที่ลงประกาศ"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        />
                
                    </LocalizationProvider>

                    <TextField
                        label="คำอธิบาย"
                        variant="filled"
                        style={{width:400,marginRight:10,marginLeft:10}}
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
               
                    <TextField
                        label="รายละเอียด"
                        variant="filled"
                        InputLabelProps={{ style: { color: '#000' } }}
                        InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                        style={{width:300,marginRight:10}}
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                    >
                    </TextField>
                    
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกขอมูล</button>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#ff6666',color:'#FFFFFF'}} onClick={()=>navigate('/annouce')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default AnnouceAdd;

  