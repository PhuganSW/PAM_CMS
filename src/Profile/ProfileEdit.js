import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, MenuItem } from '@mui/material';
import firestore from '../Firebase/Firestore';
import storage from '../Firebase/Storage';
import Layout from '../Layout';
import '../Home.css';
import '../addProfile.css';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import { sha256 } from 'crypto-hash';
import { UserContext } from '../UserContext';
import Modal from 'react-bootstrap/Modal'; // Import Bootstrap modal
import Button from 'react-bootstrap/Button'; // Import Bootstrap button
import { AiFillWarning,AiOutlineMan,AiOutlineWoman } from "react-icons/ai";
import { hashPassword } from '../hashPassword';

function ProfileEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  const [prefixth,setPrefixTh] = useState('');
  const [prefixEn,setPrefixEn] = useState('');
  const [emID,setEmID] = useState('');
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [nameEng, setNameEng] = useState('');
  const [position, setPosition] = useState('');
  const [firstDay, setFirstDay] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [username,setUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [password,setPassword] = useState('');
  const [level, setLevel] = useState('');
  const [image_off, setImage_Off] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [nat_id, setNat_ID] = useState('');
  const [personal_status, setPersonal_Status] = useState('');
  const [child, setChild] = useState('');
  const [bank, setBank] = useState('');
  const [bank_type, setBank_type] = useState('');
  const [bank_id, setBank_ID] = useState('');
  const [emer_name, setEmer_Name] = useState('');
  const [emer_relate, setEmer_Relate] = useState('');
  const [emer_phone, setEmer_Phone] = useState('');
  const [address_off, setAddress_Off] = useState(''); // ที่อยู่ตามบัตรประชาชน
  const [disease, setDisease] = useState('');
  const [blood_type, setBlood_type] = useState('');
  const [Ldrug, setLdrug] = useState(''); //แพ้ยา
  const [wealthHos, setWealthHos] = useState('');
  const [jobDesc,setJobDesc] = useState('');
  const [duty,setDuty] = useState('');

  const [costL, setCostL] = useState(0); // ค่าครองชีพ
  const [ot, setOT] = useState(0); // ค่าล่วงเวลา
  const [allowance, setAllowance] = useState(0); // เบี้ยเลี้ยง
  const [salary, setSalary] = useState(0); // ค่าเงินเดือน
  const [venhicle, setVenhicle] = useState(0); // ค่ายานพาหนะ
  const [sub, setSub] = useState(0); // เงินอุดหนุน
  const [welth, setWelth] = useState(0); // ค่าสวัสดิการ
  const [bonus, setBonus] = useState(0); // เงินโบนัส
  const [tax, setTax] = useState(0); // หักภาษี
  const [insurance, setInsurance] = useState(0); // ประกันสังคม
  const [late, setLate] = useState(0); // เข้างานสาย
  const [missing, setMissing] = useState(0); // ขาดงาน
  const [borrow, setBorrow] = useState(0); // เงินกู้ยืม
  const [withdraw, setWithdraw] = useState(0); // เงินเบิกล่วงหน้า
  const [allDeposit,setAllDeposit] = useState(0); //รายได้สะสม
  const [allInsurance,setAllInsurance] = useState(0); //ประกันสังคมสะสม
  const [department,setDepartment] =useState('');

  const [prefixThOptions, setPrefixThOptions] = useState([]);
  const [prefixEnOptions, setPrefixEnOptions] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  // const [levelOptions, setLevelOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const { setCurrentUser, companyId,userData } = useContext(UserContext);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);

  const warningImg = "https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/%E0%B8%9B%E0%B9%89%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%95%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%95%E0%B9%88%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B8%E0%B8%A0%E0%B8%B2%E0%B8%9E.jpg?alt=media&token=e704f682-cf3c-4e6f-97c8-4ad7e6fdbefe"
  const defaultMen = "https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/333.png?alt=media&token=f5b9e3a6-8644-417e-a366-c4cddac12007"
  const defaultWm = "https://firebasestorage.googleapis.com/v0/b/pamproject-a57c5.appspot.com/o/222.png?alt=media&token=97664b5e-3970-4805-a7b4-9fbd43baf2c4"

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const levelOptions = [
    {label:'Employee',value:'employee'},
    {label:'Leader',value:'leader'}
  ]

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const getUsernameSuc=(data)=>{
    setUsername(data.username)
    setOriginalUsername(data.username); 
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
    setWealthHos(data.wealthHos);
    setSalary(data.salary);
    setSub(data.sub);
    setOT(data.ot);
    setAllowance(data.allowance);
    setVenhicle(data.venhicle);
    setWelth(data.welth);
    setBonus(data.bonus);
    setCostL(data.costL);
    setInsurance(data.insurance);
    setLate(data.late);
    setWithdraw(data.withdraw);
    setBorrow(data.borrow);
    setMissing(data.missing);
    setTax(data.tax);
    setJobDesc(data.jobDesc);
    setDuty(data.duty);
    setAllDeposit(data.allDeposit)
    setAllInsurance(data.allInsurance)
    setDepartment(data.department)
  };

  const getUserUnsuccess = (e) => {
    console.log('f edit' + e);
  };

  const updateSuccess = () => {
    alert('Update data success!!')
    navigate('/profile');
  };

  const updateUnsuccess = (error) => {
    console.log(error);
  };

  const updateUsernameS =()=>{}
  const updateUsernameUn =(e)=> console.log(e)

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

  const validateNumberInput = (input) => {
    const number = Number(input);
    if (isNaN(number)) {
      alert("Invalid input, resetting to 0.");
      return 0;
    }
    return number;
  };

  const onSave = async () => {
    if (username !== originalUsername) {
      const isTaken = await firestore.verifyUsername(companyId, username);
      if (!isTaken) {
        alert("This username is already taken.");
        return;
      }
    }
  
    let imageUrl = '';
    if (image_off instanceof File) {
      imageUrl = await storage.uploadImage(companyId, image_off);
      firestore.resetLikeStatus(companyId,uid)
    } else {
      imageUrl = image_off; // Keep the existing URL if no new image is uploaded
    }
  
    var nameth = name.split(" ");
    var nameEn = nameEng.split(" ");
    let item = {
      prefixth: prefixth || '',
      prefixEn: prefixEn || '',
      emID: emID || '',
      name: nameth[0] || '',
      lastname: nameth[1] || '',
      FName: nameEn[0] || '',
      LName: nameEn[1] || '',
      position: position || '',
      workstart: firstDay || '',
      address: address || '',
      phone: phone || '',
      email: email || '',
      sex: sex || '',
      level: level || '',
      image_off: imageUrl || '',
      nat_id: nat_id || '',
      personal_status: personal_status || '',
      child: child || '',
      bank: bank || '',
      bank_type: bank_type || '',
      bank_id: bank_id || '',
      emer_name: emer_name || '',
      emer_relate: emer_relate || '',
      emer_phone: emer_phone || '',
      address_off: address_off || '',
      disease: disease || '',
      blood_type: blood_type || '',
      Ldrug: Ldrug || '',
      wealthHos: wealthHos || '',
      department:department || '',
    };
  
    firestore.updateUser(companyId, uid, item, updateSuccess, updateUnsuccess);
  
    if (password !== '') {
      let pass = await hashPass(password);
      let item1 = {
        username: username || '',
        password: pass,
        level: level || '',
      };
      firestore.updateUsername(companyId, uid, item1, updateUsernameS, updateUsernameUn);
    } else {
      let item1 = {
        username: username || '',
        level: level || '',
      };
      firestore.updateUsername(companyId, uid, item1, updateUsernameS, updateUsernameUn);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const prefixThOptions = await firestore.getDropdownOptions(companyId,'prefixTh');
      setPrefixThOptions(prefixThOptions.map(option => option.name));
      const prefixEnOptions = await firestore.getDropdownOptions(companyId,'prefixEn');
      setPrefixEnOptions(prefixEnOptions.map(option => option.name));
      const sexOptions = await firestore.getDropdownOptions(companyId,'sex');
      setSexOptions(sexOptions.map(option => option.name));
      const positionOptions = await firestore.getDropdownOptions(companyId,'position');
      console.log(positionOptions);
      setPositionOptions(positionOptions.map(option => option.name));
      const departmentOptions = await firestore.getDropdownOptions(companyId,'department');
      console.log(departmentOptions)
      setDepartmentOptions(departmentOptions.map(option => option.name));
      // const levelOptions = await firestore.getDropdownOptions('level');
      // setLevelOptions(levelOptions.map(option => option.name));
      const bankOptions = await firestore.getDropdownOptions(companyId,'bank');
      setBankOptions(bankOptions.map(option => option.name));
      const statusOptions = await firestore.getDropdownOptions(companyId,'status_per');
      setStatusOptions(statusOptions.map(option => option.name));
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      firestore.getUser(companyId,location.state.uid, getUserSuccess, getUserUnsuccess);
      firestore.getUsername(companyId,location.state.uid, getUsernameSuc, getUsernameUnsuc)
    } else {
      console.warn('No ID found in location state');
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
              <h1>แก้ไขประวัติพนักงาน</h1>
            </header>
          </div>
          <div className="main-contain">
            <div className='block_img'>
              <img src={imagePreview || image_off } width={150} height={150} alt="Logo" />
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
                <button style={{ borderRadius: 10 }} onClick={() => setImage_Off(warningImg)}>
                  <AiFillWarning />
                </button>
                <button style={{ borderRadius: 10 }} onClick={() => setImage_Off(defaultMen)}>
                  <AiOutlineMan />
                </button>
                <button style={{ borderRadius: 10 }} onClick={() => setImage_Off(defaultWm)}>
                  <AiOutlineWoman />
                </button>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>

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
                {sexOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
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
                  style={{ width: '28%' }}
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
              <button style={{ width: 100, maxWidth: 300,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
              <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF',marginRight:10}} onClick={()=>navigate('/profile')}>ยกเลิก</button>
              
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileEdit;
