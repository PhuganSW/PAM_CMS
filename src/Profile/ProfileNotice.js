import React, { useState,useRef,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from '../sidebar';
import '../Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import '../addProfile.css'
import { Alert, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from '../Firebase/Firestore';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Layout from '../Layout';
import { Label } from '@mui/icons-material';
import { UserContext } from '../UserContext';
import { count } from 'firebase/firestore';

function ProfileNotice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, companyId } = useContext(UserContext);
  const [uid,setUid] = useState('');
  const [other,setOther] = useState('');
  const [notice,setNotice] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  

  const SaveSuc=()=> navigate('/profile',{ state: { startIndex, endIndex } });
  const SaveUnsuc=(e)=>{
    try{
        let item= {
            other:other,
            notice:notice,
            newRead:true,
         }
        firestore.addNotice(companyId,uid,item,()=>navigate('/profile',{ state: { startIndex, endIndex } }),(e)=>console.log(e))
    }catch{
        console.log(e)
    }
  }
  
  const onSave=()=>{
    let item= {
        other:other,
        notice:notice,
        newRead:true,
    }
    firestore.updateNotice(companyId,uid,item,SaveSuc,SaveUnsuc)
  }

  const getUserSuccess=(data)=>{
    setOther(data.other || '')
    setNotice(data.notice || '')
  }

  const getUserUnsuccess=(e)=> {console.log(e)}

  useEffect(() => {
    if (location.state && location.state.uid) {
        setUid(location.state.uid);
        firestore.getNotice(companyId,location.state.uid, getUserSuccess, getUserUnsuccess)
      } else {
        console.warn('No ID found in location state');
      }
      if (location.state) {
        setStartIndex(location.state.startIndex || 0);
        setEndIndex(location.state.endIndex || 10);
      }
  }, [location.state]);

  return (
    
      <div className="dashboard">
        <Layout />
        
        <main className="main-content">
          
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>การแจ้งเตือน</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%',marginTop:30}}>
              <div className="form-row" style={{ display: 'flex',}}>
                <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>ข้อมูลอื่นๆ</p>
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                  className="form-field"
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  label="ข้อมูลอื่นๆ"
                  variant="filled"
                  multiline
                  rows={5}
                  style={{ width: '100%'}}
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                >
                </TextField>
              </div>
              <div className="form-row" style={{ display: 'flex',}}>
                <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>แจ้งเตือน</p>
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                  className="form-field"
                  label="แจ้งเตือน"
                  variant="filled"
                  multiline
                  rows={5}
                  style={{ width: '100%'}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                />
              </div>
            
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/profile',{ state: { startIndex, endIndex } })}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileNotice;

  