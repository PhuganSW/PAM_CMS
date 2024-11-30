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
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { AiOutlineEdit } from "react-icons/ai";
import Button from 'react-bootstrap/Button';

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
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const { setCurrentUser, companyId } = useContext(UserContext);
  const [editingField, setEditingField] = useState(null);
  const [data, setData] = useState([
    { type: 'ลากิจ', total: 0, used: 0, remaining: 0 },
    { type: 'ลาป่วย', total: 0, used: 0, remaining: 0 },
    { type: 'ลาพักร้อน', total: 0, used: 0, remaining: 0 },
    { type: 'ลาคลอด', total: 0, used: 0, remaining: 0 },
    { type: 'ลาบวช', total: 0, used: 0, remaining: 0 },
    { type: 'ลาด้วยสิทธิ์อื่นๆ', total: 0, used: 0, remaining: 0 },
  ]);


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
    navigate('/welthfare', { state: { startIndex, endIndex } })
  }

  const addWelthUnsuc=()=>{

  }

  const getWelSuc=(data)=>{
    let item = data
    setAbsence(Number(item.absence))
    setAbsenceR(Number(item.absenceR))
    setSick(Number(item.sick))
    setSickR(Number(item.sickR))
    setHoliday(Number(item.holiday))
    setHolidayR(Number(item.holidayR))
    setMaternity(Number(item.maternity))
    setMaternityR(Number(item.maternityR))
    setKama(Number(item.kama))
    setKamaR(Number(item.kamaR))
    setOther(Number(item.other))
    setOtherR(Number(item.otherR))
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
    if (location.state) {
      setStartIndex(location.state.startIndex || 0);
      setEndIndex(location.state.endIndex || 10);
    }
  }, [location.state]);

  const handleEdit = (index, field) => {
    setEditingField({ index, field });
  };

  const handleBlur = () => {
    setEditingField(null);
  };

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
              <p style={{fontSize:28,marginLeft:'2.5%',marginTop:20}}>ชื่อ - นามสกุล: {name}</p>
              {/* <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
                <div className="form-row" style={{display: 'flex', marginBottom: '20px'}}>
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
                    label="สิทธิ์ลาป่วยที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'23%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sickR}
                    onChange={(e) => handleNumberInput(e) && setSickR(e.target.value)}
                  />
                  <TextField
                    label="ลาป่วย"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sick}
                    onChange={(e) => handleNumberInput(e) && setSick(e.target.value)}
                  />    
                </div>
                <div className="form-row" style={{display: 'flex', marginBottom: '20px'}}>
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
                    label="สิทธิ์ลาคลอดที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'23%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={maternityR}
                    onChange={(e) => handleNumberInput(e) && setMaternityR(e.target.value)}
                  />
                  <TextField
                    label="ลาคลอด"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={maternity}
                    onChange={(e) => handleNumberInput(e) && setMaternity(e.target.value)}
                  />
                </div>
                <div className="form-row" style={{display: 'flex', marginBottom: '20px'}}>
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
                    label="จำนวนวันลาด้วยสิทธิ์อื่นๆ ที่เหลือ"
                    className="form-field"
                    variant="filled"
                    style={{width:'23%',marginRight:'1%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={otherR}
                    onChange={(e) => handleNumberInput(e) && setOtherR(e.target.value)}
                  />
                  <TextField
                    label="ลาด้วยสิทธิ์อื่นๆ"
                    className="form-field"
                    variant="filled"
                    style={{width:'24%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={other}
                    onChange={(e) => handleNumberInput(e) && setOther(e.target.value)}
                  />
                </div>
              </div> */}
              
              <TableBootstrap striped bordered hover className='table' style={{width:'95%',alignSelf:'center',tableLayout: 'fixed', }}>
                  <thead>
                    <tr>             
                      <th scope="col">สิทธิ์</th>
                      <th>
                        วันลาตามสิทธิ์ 
                      </th>
                      <th>
                        จำนวนวันที่ถูกใช้
                      </th>
                      <th>จำนวนวันคงเหลือ</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/* {filteredUsers.slice(startIndex, endIndex).map((item, index) => (  */}
                  {/* // {filteredUsers.map((item, index) => ( */}
                    <tr key={0}> 
                      <td scope="row">ลากิจ</td>
                      <td  onClick={() => handleEdit(0,'used')} style={{ cursor: 'pointer' }}>
                        {editingField?.index === 0 && editingField?.field === 'used' ? (
                        <input
                          type="number"
                          value={absence}
                          onChange={(e) => setAbsence(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        absence
                      )}
                      </td>
                      <td>{(absence-absenceR)}</td>
                      <td onClick={() => handleEdit(0,'remain')} style={{ cursor: 'pointer' }}>
                        {editingField?.index === 0 && editingField?.field === 'remain' ? (
                        <input
                          type="number"
                          value={absenceR}
                          onChange={(e) => setAbsenceR(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        absenceR
                      )}</td>
                    </tr>
                    <tr key={1}> 
                      <td scope="row">ลาป่วย</td>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td  onClick={() => handleEdit(1,'used')} style={{ cursor: 'pointer' }}>
                        {editingField?.index === 1 && editingField?.field === 'used' ? (
                        <input
                          type="number"
                          value={sick}
                          onChange={(e) => setSick(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        sick
                      )}
                      </td>
                      <td>{(sick-sickR)}</td>
                      <td onClick={() => handleEdit(1,'remain')} style={{ cursor: 'pointer' }}>
                        {editingField?.index === 1 && editingField?.field === 'remain' ? (
                        <input
                          type="number"
                          value={sickR}
                          onChange={(e) => setSickR(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        sickR
                      )}</td>
                    </tr>
                    <tr key={2}> 
                      <td scope="row">ลาพักร้อน</td>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td   onClick={() => handleEdit(2,'used')} style={{ cursor: 'pointer' }}>
                        {/* {holiday} */}
                        {editingField?.index === 2 && editingField?.field === 'used' ? (
                        <input
                          type="number"
                          value={holiday}
                          onChange={(e) => setHoliday(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        holiday
                      )}
                      </td>
                      <td>{(holiday-holidayR)}</td>
                      <td onClick={() => handleEdit(2,'remain')}  style={{ cursor: 'pointer' }}>
                        {editingField?.index === 2 && editingField?.field === 'remain' ? (
                        <input
                          type="number"
                          value={holidayR}
                          onChange={(e) => setHolidayR(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        holidayR
                      )}</td>
                    </tr>
                    <tr key={3}> 
                      <td scope="row">ลาคลอด</td>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td   onClick={() => handleEdit(3,'used')} style={{ cursor: 'pointer' }}>
                        {/* {holiday} */}
                        {editingField?.index === 3 && editingField?.field === 'used' ? (
                        <input
                          type="number"
                          value={maternity}
                          onChange={(e) => setMaternity(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        maternity
                      )}
                      </td>
                      <td>{(maternity-maternityR)}</td>
                      <td onClick={() => handleEdit(3,'remain')}  style={{ cursor: 'pointer' }}>
                        {editingField?.index === 3 && editingField?.field === 'remain' ? (
                        <input
                          type="number"
                          value={maternityR}
                          onChange={(e) => setMaternityR(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        maternityR
                      )}</td>
                    </tr>
                    <tr key={4}> 
                      <td scope="row">ลาบวช</td>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td   onClick={() => handleEdit(4,'used')} style={{ cursor: 'pointer' }}>
                        {/* {holiday} */}
                        {editingField?.index === 4 && editingField?.field === 'used' ? (
                        <input
                          type="number"
                          value={kama}
                          onChange={(e) => setKama(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        kama
                      )}
                      </td>
                      <td>{(kama-kamaR)}</td>
                      <td onClick={() => handleEdit(4,'remain')}  style={{ cursor: 'pointer' }}>
                        {editingField?.index === 4 && editingField?.field === 'remain' ? (
                        <input
                          type="number"
                          value={kamaR}
                          onChange={(e) => setKamaR(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        kamaR
                      )}</td>
                    </tr>
                    <tr key={5}> 
                      <td scope="row">ลาด้วยสิทธิ์อื่นๆ</td>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td   onClick={() => handleEdit(5,'used')} style={{ cursor: 'pointer' }}>
                        {/* {holiday} */}
                        {editingField?.index === 5 && editingField?.field === 'used' ? (
                        <input
                          type="number"
                          value={other}
                          onChange={(e) => setOther(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        other
                      )}
                      </td>
                      <td>{(other-otherR)}</td>
                      <td onClick={() => handleEdit(5,'remain')}  style={{ cursor: 'pointer' }}>
                        {editingField?.index === 5 && editingField?.field === 'remain' ? (
                        <input
                          type="number"
                          value={otherR}
                          onChange={(e) => setOtherR(e.target.value)}
                          onBlur={handleBlur}
                          autoFocus
                          style={{  border: 'none', background: 'transparent', textAlign: 'left' }}
                        />
                      ) : (
                        otherR
                      )}</td>
                    </tr>
                  {/* ))} */}
                </tbody>
                </TableBootstrap>
                <div style={{display:'flex', flexDirection:'row',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/welthfare', { state: { startIndex, endIndex } })}>ย้อนกลับ</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default WelthfareManage;

  