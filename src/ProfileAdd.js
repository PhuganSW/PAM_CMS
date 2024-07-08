import React, { useState,useRef,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';
import storage from './Firebase/Storage';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Layout from './Layout';
import { sha256 } from 'crypto-hash';
import { validateDate } from '@mui/x-date-pickers/internals';
import { Label } from '@mui/icons-material';
//import { image } from 'html2canvas/dist/types/css/types/image';
import html2canvas from 'html2canvas';

// const positions = [
//   {
//     value: '',
//     label: 'None',
//   },
//   {
//     value: 'SW',
//     label: 'Software Engineer',
//   },
//   {
//     value: 'EE',
//     label: 'Electical Engineer',
//   },
//   {
//     value: 'MEC',
//     label: 'Mechanical',
//   },
//   {
//     value:'HR',
//     label:'Human Resource'
//   },
// ];

// const sexs = [
//   {
//     value: '',
//     label: ' ',
//   },
//   {
//     value: 'men',
//     label: 'ชาย',
//   },
//   {
//     value: 'lady',
//     label: 'หญิง',
//   },
//   {
//     value: 'other',
//     label: 'อื่นๆ',
//   },
// ];

// const Levels = [
//   {
//     value: '',
//     label: ' ',
//   },
//   {
//     value: 'employee',
//     label: 'Employee',
//   },
//   {
//     value: 'Lead',
//     label: 'Leader'
//   },
//   {
//     value: 'HR',
//     label: 'HR',
//   },
// ];

function ProfileAdd() {
  const navigate = useNavigate();
  const formRef = useRef(null);

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
  const [image_off,setImage_Off] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [nat_id,setNat_ID] = useState('');
  const [personal_status,setPersonal_Status] = useState('');
  const [child,setChild] = useState('');
  const [bank,setBank] = useState('');
  const [bank_type,setBank_type] = useState('');
  const [bank_id,setBank_ID] = useState('');
  const [emer_name,setEmer_Name] = useState('');
  const [emer_relate,setEmer_Relate] = useState('');
  const [emer_phone,setEmer_Phone] = useState('');
  const [address_off,setAddress_Off] = useState(''); //ที่อยู่ตามบัตรประชาชน

  const [sexOptions, setSexOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  // const Levels = [
  //   {
  //     value: '',
  //     label: ' ',
  //   },
  //   {
  //     value: 'employee',
  //     label: 'Employee',
  //   },
  //   {
  //     value: 'Lead',
  //     label: 'Leader'
  //   },
  //   {
  //     value: 'HR',
  //     label: 'HR',
  //   },
  // ];

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage_Off(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const onSave= async()=>{
    let imageUrl = '';
    if (image_off) {
      imageUrl = await storage.uploadImage(image_off);
    }

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
      image:'https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/image-10.png?alt=media&token=db1833a9-afab-4b4f-808c-2fe62c29b4cc',
      image_off:imageUrl
    }
    //firestore.addUser(item,addUserSuccess,addUserUnsuccess)
    console.log(imageUrl)
  }

  useEffect(() => {
    const unsubscribeSex = firestore.getDropdownOptions(
      'sex',
      setSexOptions,
      (error) => console.error(error)
    );

    const unsubscribePosition = firestore.getDropdownOptions(
      'position',
      setPositionOptions,
      (error) => console.error(error)
    );

    const unsubscribeLevel = firestore.getDropdownOptions(
      'level',
      setLevelOptions,
      (error) => console.error(error)
    );

    return () => {
      unsubscribeSex();
      unsubscribePosition();
      unsubscribeLevel();
    };
  }, []);

  return (
    
      <div className="dashboard">
        <Layout />
        
        <main className="main-content">
          
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>เพิ่มประวัติพนักงาน</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
              <div className='block_img'>
                <img src={imagePreview || 'https://i.postimg.cc/YChjY7Pc/image-10.png'} width={150} height={150} alt="Profile" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="imagePicker"
                />
                <label htmlFor="imagePicker" style={{ cursor: 'pointer', color: '#007bff' }}>
                  <p>Click to upload image</p>
                </label>
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
                  {sexOptions.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px' }}>
                <TextField
                  className="form-field"
                  label="ที่อยู่ปัจจุบัน"
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
                  {positionOptions.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
                
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px' }}>
              <TextField
                  className="form-field"
                  label="ที่อยู่ตามบัตรประชาชน"
                  variant="filled"
                  style={{ width: '71%',marginRight:'1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เลขบัตรประจำตัวประชาชน"
                  variant="filled"
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  style={{ width: '28%'}}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
              <TextField
                  className="form-field"
                  select
                  label="สถานภาพ"
                  variant="filled"
                  style={{ width: '35%', marginRight:'1%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="จำนวนบุตร"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
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
              <div className="form-row" style={{ display: 'flex',}}>
                <p style={{fontSize:28}}>บัญชีธนาคาร :</p>
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                  className="form-field"
                  select
                  label="ชื่อธนาคาร"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="ประเภทบัญชี"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เลขที่บัญชี"
                  variant="filled"
                  style={{ width: '28%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex'}}>
                <p style={{fontSize:28}}>บุคคลติดต่อฉุกเฉิน :</p>
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                  className="form-field"
                  label="ชื่อ - นามสกุล"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="ความสัมพันธ์"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เบอร์โทร"
                  variant="filled"
                  style={{ width: '28%',}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
                <TextField
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
                </FormControl>
                <TextField
                  className="form-field"
                  id="filled-select"
                  select
                  label="ระดับ"
                  variant="filled"
                  style={{ width: '28%'}}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  {levelOptions.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
              <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/profile')}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  