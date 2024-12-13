import React, { useState,useRef,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from '../sidebar';
import '../Home.css';
import { useNavigate, useLocation } from 'react-router-dom';
import '../addProfile.css'
import { Alert, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from '../Firebase/Firestore';
import storage from '../Firebase/Storage';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Layout from '../Layout';
import { sha256 } from 'crypto-hash';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { validateDate } from '@mui/x-date-pickers/internals';
import { Label } from '@mui/icons-material';
//import { image } from 'html2canvas/dist/types/css/types/image';
import html2canvas from 'html2canvas';
import { UserContext } from '../UserContext';
import { count } from 'firebase/firestore';
import Modal from 'react-bootstrap/Modal'; // Import Bootstrap modal
import Button from 'react-bootstrap/Button'; // Import Bootstrap button
import { AiFillWarning,AiOutlineMan,AiOutlineWoman } from "react-icons/ai";
import { hashPassword } from '../hashPassword';

function ProfileAdd() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const location = useLocation()
  const [uid,setUid] = useState('');
  
  const [prefixth,setPrefixTh] = useState('');
  const [prefixEn,setPrefixEn] = useState('');
  const [emID,setEmID] = useState('');
  const [name,setName] = useState('');
  const [nameEng,setNameEng] = useState('');
  const [position,setPosition] = useState('');
  const [firstDay,setFirstDay] = useState(null);
  const [address,setAddress] = useState('');
  const [email,setEmail] = useState('');
  const [phone,setPhone] = useState('');
  const [sex,setSex] = useState('');
  const [level,setLevel] = useState('employee');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [image_off,setImage_Off] = useState("https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/333.png?alt=media&token=f5b9e3a6-8644-417e-a366-c4cddac12007");
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
  const [disease,setDisease] = useState('');
  const [blood_type,setBlood_type] = useState('');
  const [Ldrug,setLdrug] = useState('');
  const [wealthHos,setWealthHos] = useState('');
  const [department,setDepartment] =useState('');
  const [nickNameTh,setNickNameTH] = useState('');
  const [nickNameEn,setNickNameEN] = useState('');
  const [birthDay,setBirthDay] = useState(null);

  const [prefixThOptions, setPrefixThOptions] = useState([]);
  const [prefixEnOptions, setPrefixEnOptions] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  // const [levelOptions, setLevelOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [levels, setLevels] = useState([]);
  const { setCurrentUser, companyId,userData } = useContext(UserContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);

  const levelOptions = [
    {label:'Employee',value:'employee'},
    {label:'Leader',value:'leader'},
    {label:'Master',value:'master'}
  ]

  const defaultMen = "https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/333.png?alt=media&token=f5b9e3a6-8644-417e-a366-c4cddac12007"
  const defaultWm = "https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/222.png?alt=media&token=97664b5e-3970-4805-a7b4-9fbd43baf2c4"


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const addUsernameSuc=()=>{
    alert('Save data success!!')
    navigate('/profile', { state: { startIndex, endIndex } })
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
      console.log(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateNumberInput = (input) => {
    const number = Number(input);
    if (isNaN(number)) {
      alert("Invalid input, resetting to 0.");
      return 0;
    }
    return number;
  }


  const addUserSuccess=async(id)=>{
    setUid(id)
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
    let network={
      count:0
    }
    let action ={
      like:false
    }
    firestore.addUsername(companyId,id,user,addUsernameSuc,addUsernameUnsuc)
    // firestore.addNetwork(companyId,id,network,)
  }

  const addUserUnsuccess=(e)=>{
    console.log(e)
    alert('กรอกชื่อกับนามสกุลให้ครบถ้วน')
  }

  const onSave= async()=>{
    let imageUrl = '';
    if (image_off) {
      imageUrl = await storage.uploadImage(companyId,image_off);
    }

    var nameth = name.split(" ")
    var nameEn = nameEng.split(" ")
    const formattedFirstDay = firstDay ? firstDay.format('DD/MM/YYYY') : null;
    const formattedBirthDay = birthDay ? birthDay.format('DD/MM/YYYY') : null;
    let item ={
      prefixth:prefixth,
      prefixEn:prefixEn,
      emID:emID,
      name:nameth[0],
      lastname:nameth[1],
      FName:nameEn[0],
      LName:nameEn[1],
      position:position,
      workstart:formattedFirstDay,
      address:address,
      phone:phone,
      email:email,
      sex:sex,
      level:level,
      quote:'',
      // image:'https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/image-10.png?alt=media&token=db1833a9-afab-4b4f-808c-2fe62c29b4cc',
      image_off:imageUrl,
      nickNameTh:nickNameTh,
      nickNameEn:nickNameEn,
      birthDay:formattedBirthDay,
      
      nat_id:nat_id,
      personal_status:personal_status,
      child:child,
      bank:bank,
      bank_type:bank_type,
      bank_id:bank_id,
      emer_name:emer_name,
      emer_relate:emer_relate,
      emer_phone:emer_phone,
      address_off:address_off,
      disease:disease,
      blood_type:blood_type,
      Ldrug:Ldrug,
      wealthHos:wealthHos,
    }
    // if(password != ''){
    //   firestore.addUser(item,addUserSuccess,addUserUnsuccess)
    // }
    // else{
    //   alert('กรุณาระบุรหัสผ่าน')
    // }
    //firestore.addUser(item,addUserSuccess,addUserUnsuccess)

    try {
      const isUsernameAvailable = await firestore.verifyUsername(companyId, username);
      if (isUsernameAvailable) {
        firestore.addUser(companyId, item, addUserSuccess, addUserUnsuccess);
      } else {
        alert("The username is already taken. Please choose another one.");
      }
    } catch (error) {
      console.error("Error verifying username:", error);
      alert("An error occurred while verifying the username. Please try again.");
    }
  }

  const fetchDropdownOptions = async () => {
    try {
      const prefixThOptions = await firestore.getDropdownOptions(companyId,'prefixTh');
      setPrefixThOptions(prefixThOptions.map(option => option.name));
      const prefixEnOptions = await firestore.getDropdownOptions(companyId,'prefixEn');
      setPrefixEnOptions(prefixEnOptions.map(option => option.name));
      const sexOptions = await firestore.getDropdownOptions(companyId,'sex');
      setSexOptions(sexOptions.map(option => option.name));
      const positionOptions = await firestore.getDropdownOptions(companyId,'position');
      console.log(positionOptions)
      setPositionOptions(positionOptions.map(option => option.name));
      const departmentOptions = await firestore.getDropdownOptions(companyId,'department');
      console.log(departmentOptions)
      setDepartmentOptions(departmentOptions.map(option => option.name));
      // const levelOptions = await firestore.getDropdownOptions('level');
      // setLevelOptions(levelOptions.map(option => option.name));
      const bankOptions = await firestore.getDropdownOptions(companyId,'bank')
      setBankOptions(bankOptions.map(option => option.name));
      const statusOptions = await firestore.getDropdownOptions(companyId,'status_per')
      setStatusOptions(statusOptions.map(option => option.name));
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const getUsernameSuc=(data)=>{
    setUsername(data.username)
    // setOriginalUsername(data.username); 
    setLevel(data.level)
  }

  const getUsernameUnsuc =(err) => console.log(err);

  const getUserSuccess = (data) => {
    setPrefixTh(data.prefixth);
    setPrefixEn(data.prefixEn);
    setEmID(data.emID);
    setName(data.name + " " + data.lastname);
    setNameEng(data.FName + " " + data.LName);
    setSex(data.sex);
    setPosition(data.position);
    setFirstDay(data.workstart);
    setAddress(data.address);
    setEmail(data.email);
    setPhone(data.phone);
    setLevel(data.level);
    setImage_Off(data.image_off);
    setNat_ID(data.nat_id);
    setPersonal_Status(data.personal_status);
    setChild(data.child);
    setBank(data.bank);
    setBank_type(data.bank_type);
    setBank_ID(data.bank_id);
    setEmer_Name(data.emer_name);
    setEmer_Relate(data.emer_relate);
    setEmer_Phone(data.emer_phone);
    setAddress_Off(data.address_off);
    setDisease(data.disease);
    setBlood_type(data.blood_type);
    setLdrug(data.Ldrug);
    setDepartment(data.department)
    setNickNameTH(data.nickNameTh);
    setNickNameEN(data.nickNameEn);
    setBirthDay(data.birthDay);
  };

  const getUserUnsuccess = (e) => {
    console.log('f edit' + e);
  };

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      firestore.getUser(companyId,location.state.uid, getUserSuccess, getUserUnsuccess);
      firestore.getUsername(companyId,location.state.uid, getUsernameSuc, getUsernameUnsuc)
    } else {
      console.warn('No ID found in location state');
    }
    if (location.state) {
      setStartIndex(location.state.startIndex || 0);
      setEndIndex(location.state.endIndex || 10);
    }
    fetchDropdownOptions();
  }, [location.state]);

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
            <div className="main-contain" style={{overflowX:'hidden'}}>
              <div className='block_img'>
                <img src={imagePreview || image_off} width={150} height={150} alt="Profile" />
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button style={{ borderRadius: 10 }} onClick={() => setImage_Off(defaultMen)}>
                    <AiOutlineMan />
                  </button>
                  <button style={{ borderRadius: 10 }} onClick={() => setImage_Off(defaultWm)}>
                    <AiOutlineWoman />
                  </button>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
              <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'101%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>ข้อมูลส่วนบุคคล :</p>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                  className="form-field"
                  select
                  label="คำนำหน้าชื่อ"
                  variant="filled"
                  style={{ width: '35%',marginRight:'1%'}}
                  value={prefixth}
                  onChange={(e) => setPrefixTh(e.target.value)}
                >{prefixThOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
                </TextField>
                <TextField
                  className="form-field"
                  select
                  label="คำนำหน้าชื่อภาษาอังกฤษ"
                  variant="filled"
                  style={{ width: '35%',marginRight:'1%'}}
                  value={prefixEn}
                  onChange={(e) => setPrefixEn(e.target.value)}
                >{prefixEnOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
                </TextField>
                <TextField
                  className="form-field"
                  label="รหัสพนักงาน"
                  variant="filled"
                  style={{ width: '28%',}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={emID}
                  onChange={(e) => setEmID(e.target.value)}
                />
              </div>
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
                  label="ชื่อ-นามสกุล(ภาษาอังกฤษ)"
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
                  {sexOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                <TextField
                  className="form-field"
                  label="ชื่อเล่น"
                  variant="filled"
                  style={{ width: '35%',marginRight:'1%'}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={nickNameTh}
                  onChange={(e) => setNickNameTH(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="ชื่อเล่น(ภาษาอังกฤษ)"
                  variant="filled"
                  style={{ width: '35%',marginRight:'1%'}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={nickNameEn}
                  onChange={(e) => setNickNameEN(e.target.value)}
                />
               
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                      <DatePicker
                      label="วันเกิด"
                      value={birthDay}
                      onChange={(newValue) => setBirthDay(newValue)}
                      //disabled={!editable}
                      sx={{
                        width: '28%', // Set the width
                      }}
                      />
                </LocalizationProvider>
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
                 {positionOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
                  <TextField
                    className="form-field"
                    select
                    label="แผนก"
                    variant="filled"
                    //InputLabelProps={{ style: { color: '#000' } }}
                    //InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    style={{ width: '35%', marginRight:'1%' }}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departmentOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
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
                  value={address_off}
                  onChange={(e) => setAddress_Off(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เลขบัตรประจำตัวประชาชน"
                  variant="filled"
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  style={{ width: '28%'}}
                  value={nat_id}
                  onChange={(e) => setNat_ID(e.target.value)}
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
                <LocalizationProvider className="form-field" dateAdapter={AdapterDayjs} adapterLocale="th">
                        <DatePicker
                        label="วันเข้าทำงาน"
                        value={firstDay}
                        onChange={(newValue) => setFirstDay(newValue)}
                        //disabled={!editable}
                        sx={{
                          width: '28%', // Set the width
                        }}
                        />
                  </LocalizationProvider>
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
              <TextField
                  className="form-field"
                  select
                  label="สถานภาพ"
                  variant="filled"
                  style={{ width: '35%', marginRight:'1%' }}
                  value={personal_status}
                  onChange={(e) => setPersonal_Status(e.target.value)}
                >
                  {statusOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  </TextField>
                <TextField
                  className="form-field"
                  label="จำนวนบุตร"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={child}
                  onChange={(e) => setChild(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="กรุ๊ปเลือด"
                  variant="filled"
                  style={{ width: '28%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={blood_type}
                  onChange={(e) => setBlood_type(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
              <TextField
                    className="form-field"
                    label="โรงพยาบาล ที่มีสิทธิประกันสังคม"
                    variant="filled"
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    style={{ width: '35%', marginRight:'1%' }}
                    value={wealthHos}
                    onChange={(e) => setWealthHos(e.target.value)}
                  />
                <TextField
                    className="form-field"
                    label="โรคประจำตัว"
                    variant="filled"
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    style={{ width: '35%', marginRight:'1%' }}
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                  />
                  <TextField
                    className="form-field"
                    label="แพ้ยา"
                    variant="filled"
                    style={{ width: '28%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={Ldrug}
                    onChange={(e) => setLdrug(e.target.value)}
                  />
              </div>
              <div className="form-row" style={{ display: 'flex',}}>
                <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>บัญชีธนาคาร :</p>
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                  className="form-field"
                  select
                  label="ชื่อธนาคาร"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                >
                  {bankOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                  </TextField>
                <TextField
                  className="form-field"
                  label="ประเภทบัญชี"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={bank_type}
                  onChange={(e) => setBank_type(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เลขที่บัญชี"
                  variant="filled"
                  style={{ width: '28%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={bank_id}
                  onChange={(e) => setBank_ID(e.target.value)}
                />
              </div>
              <div className="form-row" style={{ display: 'flex'}}>
                <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>บุคคลติดต่อฉุกเฉิน :</p>
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                  className="form-field"
                  label="ชื่อ - นามสกุล"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={emer_name}
                  onChange={(e) => setEmer_Name(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="ความสัมพันธ์"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={emer_relate}
                  onChange={(e) => setEmer_Relate(e.target.value)}
                />
                <TextField
                  className="form-field"
                  label="เบอร์โทร"
                  variant="filled"
                  style={{ width: '28%',}}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={emer_phone}
                  onChange={(e) => setEmer_Phone(e.target.value)}
                />
              </div>
              
              <div className="form-row" style={{ display: 'flex'}}>
                <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>สิทธิ์การใช้งานแอปฯ :</p>
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
                    required
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
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF',marginRight:10}} onClick={()=>navigate('/profile',{ state: { startIndex, endIndex } })}>ย้อนกลับ</button>
                {/* <button style={{ width: 120, height: 50, borderRadius: 5, backgroundColor: '#BEBEBE' }} onClick={handleSalaryClick}>ข้อมูลเงินเดือน</button> */}
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileAdd;

  