import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Layout from './Layout';
import { sha256 } from 'crypto-hash';

const positions = [
  {
    value: '',
    label: 'None',
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
    value: '',
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
    value: '',
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
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const addUsernameSuc=()=>{
    navigate('/profile')
  }

  const addUsernameUnsuc=(e)=>{
    console.log(e)
  }

  const hashPass=async(password)=>{
    try {
      const hashedPassword = await sha256(password);
      console.log("Encrypt pass: " + hashedPassword)
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Hashing failed');
    }
  }

  const addUserSuccess=async(id)=>{
    let pass = await hashPass(password);
    setPassword(pass)
    let user={
      username:username,
      password:pass,
      nameth:name,
      nameEng:nameEng,
      level:level,
      email:email,
      state:false
    }
    firestore.addUsername(id,user,addUsernameSuc,addUsernameUnsuc)

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
        <Layout />
        
        <main className="main-content">
          <header>
            <h1 className='header-page'>เพิ่มประวัติพนักงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div className="main">
            <div className="main-contain">
              <div className='block_img'>
                {/*<img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" />*/}
              </div>
              <div style={{display:'flex',flexDirection:'column',margin:20,alignSelf:'center',width:'95%',}}>
    
              <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '20px', width: '100%' }}>
                <TextField
                  className="form-field"
                  label="ชื่อ-นามสกุล"
                  variant="filled"
                  style={{ width: '35%', marginRight: 10 }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="ชื่อ-นามสกุล ภาษาอังกฤษ"
                  variant="filled"
                  style={{ width: '35%', marginRight: 10 }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={nameEng}
                  onChange={(e) => setNameEng(e.target.value)}
                />
                <TextField
                  className="form-field"
                  id="filled-select"
                  select
                  label="เพศ"
                  variant="filled"
                  style={{ width: '20%' }}
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
              <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '20px', width: '100%' }}>
                <TextField
                  className="form-field"
                  select
                  label="ตำแหน่ง"
                  variant="filled"
                  style={{ width: '20%', marginRight: 10 }}
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
                  className="form-field"
                  label="วันเข้าทำงาน"
                  variant="filled"
                  style={{ width: '25%', marginRight: 10 }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={firstDay}
                  onChange={(e) => setFirstDay(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="ที่อยู๋"
                  variant="filled"
                  style={{ width: '50%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '20px', width: '100%' }}>
                <TextField
                  className="form-field"
                  label="E-mail"
                  variant="filled"
                  style={{ width: '30%', marginRight: 10 }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เบอร์โทร"
                  variant="filled"
                  style={{ width: '30%', marginRight: 10 }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                  className="form-field"
                  id="filled-select"
                  select
                  label="ระดับ"
                  variant="filled"
                  style={{ width: '20%', marginRight: 10 }}
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
              <div className="form-row" style={{ display: 'flex', gap: '10px', marginBottom: '20px', width: '100%' }}>
                <TextField
                  className="form-field"
                  label="Username"
                  variant="filled"
                  style={{ width: '30%', marginRight: 10 }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FormControl className="form-field" sx={{ width: '30%', backgroundColor: '#fff' }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                  <FilledInput
                    id="filled-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
              </div>
            
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:10,backgroundColor:'#ff6666',color:'#FFFFFF'}} onClick={()=>navigate('/profile')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  