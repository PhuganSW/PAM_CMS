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
  {
    value:'HR',
    label:'Human Resource'
  },
];

const sexs = [
  {
    value: 'None',
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
    value: 'Lead',
    label: 'Leader'
  },
  {
    value: 'HR',
    label: 'HR',
  },
];

function ProfileEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid,setUid] = useState('')
  const [name,setName] = useState('');
  const [nameEng,setNameEng] = useState('');
  const [position,setPosition] = useState('');
  const [firstDay,setFirstDay] = useState('');
  const [address,setAddress] = useState('');
  const [email,setEmail] = useState('');
  const [phone,setPhone] = useState('');
  const [sex,setSex] = useState('');
  const [level,setLevel] = useState('');
  

  const getUserSuccess=(data)=>{

    setName(data.name+" "+data.lastname)
    setNameEng(data.FName+" "+data.LName)
    setSex(data.sex)
    setPosition(data.position)
    setFirstDay(data.workstart)
    setAddress(data.address)
    setEmail(data.email)
    setPhone(data.tel)
    setLevel(data.level)

  }

  const getUserUnsuccess=(e)=>{
    console.log('f edit'+e)
  }

  const updateSuccess=()=>{
    navigate('/profile')
  }

  const updateUnsuccess=(error)=>{
    console.log(error)
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
      phone:phone,
      email:email,
      sex:sex,
      level:level
    }
    console.log('save')
    firestore.updateUser(uid,item,updateSuccess,updateUnsuccess)
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
        <Layout />
        
        <main className="main-content">
          
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>แก้ไขประวัติพนักงาน</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
              <div className='block_img'>
                {/*<img src='https://i.postimg.cc/YChjY7Pc/image-10.png' width={150} height={150} alt="Logo" />*/}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
    
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                  className="form-field"
                  label="ชื่อ-นามสกุล"
                  variant="filled"
                  style={{ width: '35%',marginRight:'1%'}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="ชื่อ-นามสกุล ภาษาอังกฤษ"
                  variant="filled"
                  style={{ width: '35%',marginRight:'1%'}}
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
                  style={{ width: '28%' }}
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
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px' }}>
                <TextField
                  className="form-field"
                  label="ที่อยู๋"
                  variant="filled"
                  style={{ width: '71%',marginRight:'1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                  className="form-field"
                  select
                  label="ตำแหน่ง"
                  variant="filled"
                  style={{ width: '28%'}}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  {positions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
                <TextField
                  className="form-field"
                  label="E-mail"
                  variant="filled"
                  style={{ width: '35%', marginRight:'1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เบอร์โทร"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="วันเข้าทำงาน"
                  variant="filled"
                  style={{ width: '28%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={firstDay}
                  onChange={(e) => setFirstDay(e.target.value)}
                />
                
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
                {/* <TextField
                  className="form-field"
                  label="Username"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FormControl className="form-field" sx={{ width: '35%', backgroundColor: '#fff',marginRight:'1%' }} variant="filled">
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
                </FormControl> */}
                <TextField
                  className="form-field"
                  id="filled-select"
                  select
                  label="ระดับ"
                  variant="filled"
                  style={{ width: '35%'}}
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
            
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
                <button style={{ width: 100, maxWidth: 300,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/profile')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileEdit;

  