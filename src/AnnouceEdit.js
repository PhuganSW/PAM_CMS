import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import firestore from './Firebase/Firestore';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';



function AnnouceEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title,setTitle] = useState('');
  const [desc,setDesc] = useState('');
  const [date,setDate] = useState(dayjs(new Date(),'DD-MM-YYYY'));
  const [detail,setDetail] = useState('');
  const [selectID,setSelectID] = useState('');


  const getAnnouceSuc=(data)=>{
    setTitle(data.title)
    setDesc(data.desc)
    setDate(dayjs(data.date,'DD-MM-YYYY'))
    setDetail(data.detail)

  }

  const getAnnouceUnsuc=(e)=>{
    console.log('f edit'+e)
  }

  const updateAnnouceSuc=()=>{
    navigate('/annouce')
  }

  const updateAnnouceUnsuc=(error)=>{
    console.log(error)
  }

  const onSave=()=>{
    let date_str = `${("0"+(date.get('date'))).slice(-2)}/${("0"+(date.month()+1)).slice(-2)}/${date.get('year')}`
    let item={
      title:title,
      desc:desc,
      detail:detail,
      date:date_str,
      file:""
    }
    firestore.updateAnnouce(selectID,item,updateAnnouceSuc,updateAnnouceUnsuc)
  }

  useEffect(() => {
    if (location.state && location.state.id) {
      setSelectID(location.state.id);
      //console.log('from eff'+uid)
      firestore.getAnnouce(location.state.id,getAnnouceSuc,getAnnouceUnsuc)
    } else {
      console.warn('No ID found in location state');
    }
  }, [location.state]);


  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>แก้ไขประกาศ</h1>
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
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                        
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
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#ff6666',color:'#FFFFFF'}} onClick={()=>navigate('/annouce')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default AnnouceEdit;

  