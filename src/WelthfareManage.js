import React, { useState,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';
import Layout from './Layout';
import { UserContext } from './UserContext';

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

  const [absenceR,setAbsenceR] = useState(''); //ลากิจ
  const [sickR,setSickR] = useState(''); //ลาป่วย
  const [holidayR,setHolidayR] = useState(''); //ลาพักร้อน
  const [maternityR,setMaternityR] = useState(''); //ลาคลอด
  const [kamaR,setKamaR] = useState('') //ลาบวช
  const [otherR,setOtherR] = useState(''); //ลาสิทธิ์อื่น
  const { setCurrentUser, companyId } = useContext(UserContext);

  const handleNumberInput = (e) => {
    const { value } = e.target;
    const validNumber = /^-?\d*\.?\d*$/; // Regex to allow only numbers and decimal
    if (value === '' || validNumber.test(value)) {
      return true;
    }
    return false;
  };

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

  const getWelSuc=(data)=>{
    let item = data
    setAbsence(item.absence)
    setAbsenceR(item.absenceR)
    setSick(item.sick)
    setSickR(item.sickR)
    setHoliday(item.holiday)
    setHolidayR(item.holidayR)
    setMaternity(item.maternity)
    setMaternityR(item.maternityR)
    setKama(item.kama)
    setKamaR(item.kamaR)
    setOther(item.other)
    setOtherR(item.otherR)
  }
  
  const getWelunsuc=(err)=>{
    console.log(err)
  }


  const onSave=()=>{
    let item ={
      name:name,
      absence:absence,
      sick:sick,
      holiday:holiday,
      maternity:maternity,
      kama:kama,
      other:otherR,
      absenceR:absenceR,
      sickR:sickR,
      holidayR:holidayR,
      maternityR:maternityR,
      kamaR:kamaR,
      otherR:otherR
    }
    //console.log('save')
    firestore.addWelth(companyId,uid,item,addWelthSuc,addWelthUnsuc)
  }

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      //console.log('from eff'+uid)
      firestore.getUser(companyId,location.state.uid,getUserSuccess,getUserUnsuccess)
      firestore.getWelth(companyId,location.state.uid,getWelSuc,getWelunsuc)
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
                    style={{width:'25%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={absence}
                    onChange={(e) => handleNumberInput(e) && setAbsence(e.target.value)}
                  />
                  <TextField
                    label="สิทธิ์ลากิจที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={absenceR}
                    onChange={(e) => handleNumberInput(e) && setAbsenceR(e.target.value)}
                  />
                  <TextField
                    label="ลาป่วย"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sick}
                    onChange={(e) => handleNumberInput(e) && setSick(e.target.value)}
                  />
                  <TextField
                    label="สิทธิ์ลาป่วยที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'23%',}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sickR}
                    onChange={(e) => handleNumberInput(e) && setSickR(e.target.value)}
                  />
                  
                </div>
                <div className="form-row" style={{display: 'flex', marginBottom: '20px'}}>
                <TextField
                    label="ลาพักร้อน"
                    className="form-field"
                    variant="filled"
                    style={{width:'25%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={holiday}
                    onChange={(e) => handleNumberInput(e) && setHoliday(e.target.value)}
                  />
                  <TextField
                    label="สิทธิ์ลาพักร้อนที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={holidayR}
                    onChange={(e) => handleNumberInput(e) && setHolidayR(e.target.value)}
                  />
                  <TextField
                    label="ลาคลอด"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={maternity}
                    onChange={(e) => handleNumberInput(e) && setMaternity(e.target.value)}
                  />
                   <TextField
                    label="สิทธิ์ลาคลอดที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'23%',}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={maternityR}
                    onChange={(e) => handleNumberInput(e) && setMaternityR(e.target.value)}
                  />
                  
                </div>
                <div className="form-row" style={{display: 'flex', marginBottom: '20px'}}>
                <TextField
                    label="ลาบวช"
                    className="form-field"
                    variant="filled"
                    style={{width:'25%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={kama}
                    onChange={(e) => handleNumberInput(e) && setKama(e.target.value)}
                  />
                  <TextField
                    label="สิทธิ์ลาบวชที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={kamaR}
                    onChange={(e) => handleNumberInput(e) && setKamaR(e.target.value)}
                  />
                  <TextField
                    label="ลาด้วยสิทธิ์อื่นๆ"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={other}
                    onChange={(e) => handleNumberInput(e) && setOther(e.target.value)}
                  />
                  <TextField
                    label="จำนวนวันลาด้วยสิทธิ์อื่นๆ ที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'23%',}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={otherR}
                    onChange={(e) => handleNumberInput(e) && setOtherR(e.target.value)}
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

  