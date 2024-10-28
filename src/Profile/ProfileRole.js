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

function ProfileRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, companyId } = useContext(UserContext);
  const [uid,setUid] = useState('');
  const [role1,setRole1] = useState('');
  const [role2,setRole2] = useState('');
  const [role3,setRole3] = useState('');
  const [role4,setRole4] = useState('');
  const [role5,setRole5] = useState('');
  const [other,setOther] = useState('');
  const [startIndex, setStartIndex] = useState(0);
const [endIndex, setEndIndex] = useState(10);

  const SaveSuc=()=> navigate('/profile', { state: { startIndex, endIndex } });
  const SaveUnsuc=(e)=>{
    try{
        let item= {
            role1:role1,
            role2:role2,
            role3:role3,
            role4:role4,
            role5:role5,
            other:other,
        }
        firestore.addUserRole(companyId,uid,item,()=>navigate('/profile', { state: { startIndex, endIndex } }),(e)=>console.log(e))
    }catch{
        console.log(e)
    }
  }
  
  const onSave=()=>{
    let item= {
        role1:role1,
        role2:role2,
        role3:role3,
        role4:role4,
        role5:role5,
        other:other,
    }
    firestore.updateUserRole(companyId,uid,item,SaveSuc,SaveUnsuc)
  }

  const getUserSuccess=(data)=>{
    setRole1(data.role1 || '')
    setRole2(data.role2 || '')
    setRole3(data.role3 || '')
    setRole4(data.role4 || '')
    setRole5(data.role5 || '')
    setOther(data.other || '')
  }

  const getUserUnsuccess=(e)=> {console.log(e)}

  useEffect(() => {
    if (location.state && location.state.uid) {
        setUid(location.state.uid);
        firestore.getUserRole(companyId,location.state.uid, getUserSuccess, getUserUnsuccess)
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
                <h1>หน้าที่รับผิดชอบ</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%',marginTop:30}}>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                  className="form-field"
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  label="Role.1"
                  variant="filled"
                  style={{ width: '100%'}}
                  value={role1}
                  onChange={(e) => setRole1(e.target.value)}
                >
                </TextField>
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                  className="form-field"
                  label="Role.2"
                  variant="filled"
                  style={{ width: '100%'}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={role2}
                  onChange={(e) => setRole2(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px' }}>
                <TextField
                  className="form-field"
                  label="Role.3"
                  variant="filled"
                  style={{ width: '100%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={role3}
                  onChange={(e) => setRole3(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px' }}>
              <TextField
                  className="form-field"
                  label="Role.4"
                  variant="filled"
                  style={{ width: '100%'}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={role4}
                  onChange={(e) => setRole4(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
                <TextField
                  className="form-field"
                  label="Role.5"
                  variant="filled"
                  style={{ width: '100%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={role5}
                  onChange={(e) => setRole5(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
              <TextField
                  className="form-field"
                  label="Other Role"
                  variant="filled"
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  style={{ width: '100%' }}
                  multiline
                  rows={5}
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                >
                </TextField>
              </div>
            
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/profile', { state: { startIndex, endIndex } })}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileRole;

  