import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';
import Layout from './Layout';

function WelthfareManage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid,setUid] = useState('')
  const [name,setName] = useState('');
  const [absence,setAbsence] = useState(''); //ลากิจ
  const [sick,setSick] = useState(''); //ลาป่วย
  const [holiday,setHoliday] = useState(''); //ลาพักร้อน
  const [maternity,setMaternity] = useState(''); //ลาคลอด
  const [kama,setKama] = useState('') //ลาบวช
  const [other,setOther] = useState(''); //ลาสิทธิ์อื่น

  const getUserSuccess=(data)=>{
    setName(data.name+" "+data.lastname)
  }

  const getUserUnsuccess=(e)=>{
    console.log(e)
  }

  const addWelthSuc=()=>{
    navigate('/welthfare')
  }

  const addWelthUnsuc=()=>{

  }


  const onSave=()=>{
    let item ={
      id:uid,
      name:name,
      absence:absence,
      sick:sick,
      holiday:holiday,
      maternity:maternity,
      other:other
    }
    //console.log('save')
    firestore.addWelth(item,addWelthSuc,addWelthUnsuc)
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
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>จัดการสิทธิ์และวันหยุด</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
              <p style={{fontSize:28,marginLeft:15,marginTop:20}}>ชื่อ - นามสกุล: {name}</p>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
                <div className="form-row" style={{display: 'flex', marginBottom: '20px'}}>

                  <TextField
                    label="ลากิจ"
                    className="form-field"
                    variant="filled"
                    style={{width:'33%',marginRight:'0.5%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={absence}
                    onChange={(e) => setAbsence(e.target.value)}
                  />
                  <TextField
                    label="ลาป่วย"
                    className="form-field"
                    variant="filled"
                    style={{width:'33%',marginRight:'0.5%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sick}
                    onChange={(e) => setSick(e.target.value)}
                  />
                  <TextField
                    
                    label="ลาพักร้อน"
                    className="form-field"
                    variant="filled"
                    style={{width:'33%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={holiday}
                    onChange={(e) => setHoliday(e.target.value)}
                  >
                  </TextField>
                  
                </div>
                <div className="form-row" style={{display: 'flex', marginBottom: '20px'}}>
                  <TextField
                    label="ลาคลอด"
                    className="form-field"
                    variant="filled"
                    style={{width:'33%',marginRight:'0.5%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={maternity}
                    onChange={(e) => setMaternity(e.target.value)}
                  >
                  </TextField>
                  <TextField
                    label="ลาบวช"
                    className="form-field"
                    variant="filled"
                    style={{width:'33%',marginRight:'0.5%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={maternity}
                    onChange={(e) => setKama(e.target.value)}
                  >
                  </TextField>
                  <TextField
                    label="ลาด้วยสิทธิ์อื่นๆ"
                    className="form-field"
                    variant="filled"
                    style={{width:'33%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                  />
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'row',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/welthfare')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default WelthfareManage;

  