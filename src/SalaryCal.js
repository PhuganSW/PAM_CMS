import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

function SalaryCal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid,setUid] = useState('')
  const [name,setName] = useState('');
  const [date,setDate] = useState(dayjs(new Date(),'DD-MM-YYYY'));
  const [valuePos,setValuePos] = useState(''); //ค่าประจำตำแน่ง
  const [costL,setCostL] = useState(''); //ค่าครองชีพ
  const [food,setFood] = useState(''); //ค่าอาหาร
  const [ot,setOT] = useState(''); //ค่าล่วงเวลา
  const [allowance,setAllowance] = useState(''); //เบี้ยเลี้ยง
  const [salary,setSalary] = useState(''); //ค่าเงินเดือน
  const [venhicle,setVenhicle] = useState(''); //ค่ายานพาหนะ
  const [sub,setSub] = useState(''); //เงินอุดหนุน
  const [welth,setWelth] = useState(''); //ค่าสวัสดิการ
  const [bonus,setBonus] = useState(''); //เงินโบนัส
  const [tax,setTax] = useState(''); //หักภาษี
  const [insurance,setInsurance] = useState(''); //ประกันสังคม
  const [late,setLate] = useState(''); //เข้างานสาย
  const [missing,setMissing] = useState(''); //ขาดงาน
  const [borrow,setBorrow] = useState(''); //เงินกู้ยืม
  const [withdraw,setWithdraw] = useState(''); //เงินเบิกล่วงหน้า
  const [amount,setAmount] = useState('');

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
            <h1>คำนวณเงินเดือน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div className="main">
            <div className="main-contain">
              <p style={{fontSize:28,marginLeft:15,marginTop:20}}>เงินเดือน: {name}</p>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
                <div style={{ gap: '10px', marginBottom: '20px'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                        
                        <DatePicker
                        label="วันที่"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        />
                
                    </LocalizationProvider>

                  <TextField
                    label="ค่าครองชีพ"
                    variant="filled"
                    style={{width:400,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={costL}
                    onChange={(e) => setCostL(e.target.value)}
                  />
                  <TextField
                    label="ค่าประจำตำแหน่ง"
                    variant="filled"
                    style={{width:400,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={valuePos}
                    onChange={(e) => setValuePos(e.target.value)}
                  />
                  <TextField
                    
                    label="ค่าอาหาร"
                    variant="filled"
                    style={{width:150}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                  >
                  </TextField>
                  
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                  <TextField
                    label="ค่าล่วงเวลา"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={ot}
                    onChange={(e) => setOT(e.target.value)}
                  >
                  </TextField>
                  <TextField
                    label="ค่าเบี้ยเลี้ยง"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={allowance}
                    onChange={(e) => setAllowance(e.target.value)}
                  />
                  <TextField
                    label="ค่าเงินเดือน"
                    variant="filled"
                    style={{width:500}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
                <div style={{ gap: '10px', marginBottom: '10px'}}>
                <TextField
                    label="ค่ายานพาหนะ"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={venhicle}
                    onChange={(e) => setVenhicle(e.target.value)}
                  />
                  <TextField
                    label="เงินอุดหนุน"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                  />
                  <TextField
                    label="ค่าสวัสดิการ"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={welth}
                    onChange={(e) => setWelth(e.target.value)}
                  >
                  </TextField>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#ff6666',color:'#FFFFFF'}} onClick={()=>navigate('/salary_manage')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default SalaryCal;

  