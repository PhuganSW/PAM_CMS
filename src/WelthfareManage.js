import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';

function WelthfareManage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid,setUid] = useState('')
  const [name,setName] = useState('');
  const [absence,setAbsence] = useState(''); //ลากิจ
  const [sick,setSick] = useState(''); //ลาป่วย
  const [holiday,setHoliday] = useState(''); //ลาพักร้อน
  const [maternity,setMaternity] = useState(''); //ลาคลอด
  const [other,setOther] = useState(''); //ลาสิทธิ์อื่น

  const getUserSuccess=(data)=>{
    setName(data.name+" "+data.lastname)
  }

  const getUserUnsuccess=(e)=>{
    console.log(e)
  }

  const onSave=()=>{
    let item ={
      id:uid,
      name:name,
    }
    console.log('save')
    
  }

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      //console.log('from eff'+uid)
      firestore.getUser(location.state.uid,getUserSuccess,getUserUnsuccess)
    } else {
      console.warn('No ID found in location state');
    }
  }, [location.state]);

  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>จัดการสิทธิ์และวันหยุด</h1>
            {/* Add user profile and logout here */}
          </header>
          <div className="main">
            <div className="main-contain">
              <p style={{fontSize:28,marginLeft:15,marginTop:20}}>ชื่อ - นามสกุล: {name}</p>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
                <div style={{ gap: '10px', marginBottom: '20px'}}>

                  <TextField
                    label="ลากิจ"
                    variant="filled"
                    style={{width:400,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={absence}
                    onChange={(e) => setAbsence(e.target.value)}
                  />
                  <TextField
                    label="ลาป่วย"
                    variant="filled"
                    style={{width:400,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sick}
                    onChange={(e) => setSick(e.target.value)}
                  />
                  <TextField
                    
                    label="ลาพักร้อน"
                    variant="filled"
                    style={{width:150}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={holiday}
                    onChange={(e) => setHoliday(e.target.value)}
                  >
                  </TextField>
                  
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                  <TextField
                    label="ลาคลอด"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={maternity}
                    onChange={(e) => setMaternity(e.target.value)}
                  >
                  </TextField>
                  <TextField
                    label="ลาด้วยสิทธิ์อื่นๆ"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                  />
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#ff6666',color:'#FFFFFF'}} onClick={()=>navigate('/welthfare')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default WelthfareManage;

  