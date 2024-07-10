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
  const [disease,setDisease] = useState('');
  const [blood_type,setBlood_type] = useState('');
  const [Ldrug,setLdrug] = useState('');
  const [wealthHos,setWealthHos] = useState('');

 
  const [costL,setCostL] = useState(0); //ค่าครองชีพ
  const [ot,setOT] = useState(0); //ค่าล่วงเวลา
  const [allowance,setAllowance] = useState(0); //เบี้ยเลี้ยง
  const [salary,setSalary] = useState(0); //ค่าเงินเดือน
  const [venhicle,setVenhicle] = useState(0); //ค่ายานพาหนะ
  const [sub,setSub] = useState(0); //เงินอุดหนุน
  const [welth,setWelth] = useState(0); //ค่าสวัสดิการ
  const [bonus,setBonus] = useState(0); //เงินโบนัส
  const [tax,setTax] = useState(0); //หักภาษี
  const [insurance,setInsurance] = useState(0); //ประกันสังคม
  const [late,setLate] = useState(0); //เข้างานสาย
  const [missing,setMissing] = useState(0); //ขาดงาน
  const [borrow,setBorrow] = useState(0); //เงินกู้ยืม
  const [withdraw,setWithdraw] = useState(0); //เงินเบิกล่วงหน้า

  const [sexOptions, setSexOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [levels, setLevels] = useState([]);

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

  const validateNumberInput = (input) => {
    const number = Number(input);
    if (isNaN(number)) {
      alert("Invalid input, resetting to 0.");
      return 0;
    }
    return number;
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
    firestore.addUser(item,addUserSuccess,addUserUnsuccess)
    //console.log(imageUrl)
  }

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const positions = await firestore.getDropdownOptions('position');
        setPositionOptions(positions);
        const sexOptions = await firestore.getDropdownOptions('categories');
        setSexOptions(sexOptions);
        const levels = await firestore.getDropdownOptions('levels');
        setLevelOptions(levels);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };

    fetchDropdownOptions();
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
                    <MenuItem key={option} value={option}>
                      {option}
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
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}}>
              <TextField
                  className="form-field"
                  select
                  label="สถานภาพ"
                  variant="filled"
                  style={{ width: '35%', marginRight:'1%' }}
                  value={personal_status}
                  onChange={(e) => setPersonal_Status(e.target.value)}
                />
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
                <p style={{fontSize:28}}>บัญชีธนาคาร :</p>
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
                />
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
                <p style={{fontSize:28}}>เงินเดือน :</p>
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                    label="เงินเดือน"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={salary}
                    onChange={(e) => setSalary(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="ค่าจ้าง"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={sub}
                    onChange={(e) => setSub(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    
                    label="ค่าล่วงเวลา"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={ot}
                    onChange={(e) => setOT(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="ค่าเบี้ยเลี้ยง"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={allowance}
                    onChange={(e) => setAllowance(validateNumberInput(e.target.value))}
                  >
                  </TextField>
                  <TextField
                    label="ค่าพาหนะ"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={venhicle}
                    onChange={(e) => setVenhicle(validateNumberInput(e.target.value))}
                  />
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                    label="ค่าสวัสดิการ"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={welth}
                    onChange={(e) => setWelth(validateNumberInput(e.target.value))}
                  />
                   <TextField
                    label="เงินโบนัส"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={bonus}
                    onChange={(e) => setBonus(validateNumberInput(e.target.value))}
                      />
                  <TextField
                    label="เงินพิเศษ"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={costL}
                    onChange={(e) => setCostL(validateNumberInput(e.target.value))}
                  />
              </div>
              <div className="form-row" style={{ display: 'flex' }}>
                <p style={{fontSize:28}}>รายการหัก :</p>
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                    label="เงินประกันสังคม"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={insurance}
                    onChange={(e) => setInsurance(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="เงินหัก ณ ที่จ่าย"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={late}
                    onChange={(e) => setLate(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    
                    label="เงินเบิกล่วงหน้า"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={withdraw}
                    onChange={(e) => setWithdraw(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="เงินกู้ยืมสวัสดิการ"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={borrow}
                    onChange={(e) => setBorrow(validateNumberInput(e.target.value))}
                  >
                  </TextField>
                  <TextField
                    label="ขาดงาน"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={missing}
                    onChange={(e) => setMissing(validateNumberInput(e.target.value))}
                  />
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}} >
                  <TextField
                    label="หักภาษีเงินได้"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={tax}
                    onChange={(e) => setTax(validateNumberInput(e.target.value))}
                  />
                </div>
              <div className="form-row" style={{ display: 'flex'}}>
                <p style={{fontSize:28}}>สิทธิ์การใช้งานแอปฯ :</p>
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

  