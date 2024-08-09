import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, MenuItem } from '@mui/material';
import firestore from './Firebase/Firestore';
import storage from './Firebase/Storage';
import Layout from './Layout';
import './Home.css';
import './addProfile.css';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import { sha256 } from 'crypto-hash';
import { UserContext } from './UserContext';

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

  const [prefixThOptions, setPrefixThOptions] = useState([]);
  const [prefixEnOptions, setPrefixEnOptions] = useState([]);
  const [sexOptions, setSexOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  // const [levelOptions, setLevelOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const { setCurrentUser, companyId } = useContext(UserContext);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const levelOptions = [
    {label:'Employee',value:'employee'},
    {label:'HR',value:'HR'}
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
  };

  const getUserUnsuccess = (e) => {
    console.log('f edit' + e);
  };

  const updateSuccess = () => {
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
      console.log(isTaken)
      if (!isTaken) {
        alert("This username is already taken.");
        return;
      }
    }
    let imageUrl = '';
  if (image_off instanceof File) {
    imageUrl = await storage.uploadImage(companyId,image_off);
  } else {
    imageUrl = image_off; // Keep the existing URL if no new image is uploaded
  }

    var nameth = name.split(" ");
    var nameEn = nameEng.split(" ");
    let item = {
      prefixth:prefixth,
      prefixEn:prefixEn,
      emID:emID,
      name: nameth[0],
      lastname: nameth[1],
      FName: nameEn[0],
      LName: nameEn[1],
      position: position,
      workstart: firstDay,
      address: address,
      phone: phone,
      email: email,
      sex: sex,
      level: level,
      image_off: imageUrl,
      nat_id: nat_id,
      personal_status: personal_status,
      child: child,
      bank: bank,
      bank_type: bank_type,
      bank_id: bank_id,
      emer_name: emer_name,
      emer_relate: emer_relate,
      emer_phone: emer_phone,
      address_off: address_off,
      disease: disease,
      blood_type: blood_type,
      Ldrug: Ldrug,
      wealthHos: wealthHos,
      costL: costL,
      ot: ot,
      allowance: allowance,
      salary: salary,
      venhicle: venhicle,
      sub: sub,
      welth: welth,
      bonus: bonus,
      allDeposit:allDeposit,
      tax: tax,
      insurance: insurance,
      late: late,
      missing: missing,
      borrow: borrow,
      withdraw: withdraw,
      allInsurance:allInsurance,
      jobDesc: jobDesc,
      duty:duty,
    };

    firestore.updateUser(companyId,uid, item, updateSuccess, updateUnsuccess);
    if(password != ''){
      let pass = await hashPass(password);
      setPassword(pass)
      let item1 = {
        username:username,
        password:pass,
        level:level,
      } 
      firestore.updateUsername(companyId,uid,item1,updateUsernameS,updateUsernameUn)
    }else{
      let item1 = {
        username:username,
        level:level,
      } 
      firestore.updateUsername(companyId,uid,item1,updateUsernameS,updateUsernameUn)
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const prefixThOptions = await firestore.getDropdownOptions("miscible",'prefixTh');
      setPrefixThOptions(prefixThOptions.map(option => option.name));
      const prefixEnOptions = await firestore.getDropdownOptions("miscible",'prefixEn');
      setPrefixEnOptions(prefixEnOptions.map(option => option.name));
      const sexOptions = await firestore.getDropdownOptions("miscible",'sex');
      setSexOptions(sexOptions.map(option => option.name));
      const positionOptions = await firestore.getDropdownOptions("miscible",'position');
      console.log(positionOptions);
      setPositionOptions(positionOptions.map(option => option.name));
      // const levelOptions = await firestore.getDropdownOptions('level');
      // setLevelOptions(levelOptions.map(option => option.name));
      const bankOptions = await firestore.getDropdownOptions("miscible",'bank');
      setBankOptions(bankOptions.map(option => option.name));
      const statusOptions = await firestore.getDropdownOptions("miscible",'status_per');
      setStatusOptions(statusOptions.map(option => option.name));
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      firestore.getUser("miscible",location.state.uid, getUserSuccess, getUserUnsuccess);
      firestore.getUsername("miscible",location.state.uid, getUsernameSuc, getUsernameUnsuc)
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
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>ข้อมูลเพิ่มเติม :</p>
              </div>
              <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
              <TextField
                  className="form-field"
                  label="คำอธิบายตำแหน่ง"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                >
                  </TextField>
                <TextField
                  className="form-field"
                  label="ขอบเขตงาน"
                  variant="filled"
                  style={{ width: '35%', marginRight: '1%' }}
                  InputLabelProps={{ style: { color: '#000' } }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={duty}
                  onChange={(e) => setDuty(e.target.value)}
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
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>เงินเดือน :</p>
            </div>
            <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
            <TextField
                  label="เงินเดือน"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={salary}
                  onChange={(e) => setSalary(validateNumberInput(e.target.value))}
                />
                <TextField
                  label="ค่าจ้าง"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={sub}
                  onChange={(e) => setSub(validateNumberInput(e.target.value))}
                />
                <TextField
                  
                  label="ค่าล่วงเวลา"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={ot}
                  onChange={(e) => setOT(validateNumberInput(e.target.value))}
                />
                <TextField
                  label="ค่าเบี้ยเลี้ยง"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
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
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
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
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={welth}
                  onChange={(e) => setWelth(validateNumberInput(e.target.value))}
                />
                 <TextField
                  label="เงินโบนัส"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={bonus}
                  onChange={(e) => setBonus(validateNumberInput(e.target.value))}
                    />
                <TextField
                  label="เงินพิเศษ"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={costL}
                  onChange={(e) => setCostL(validateNumberInput(e.target.value))}
                />
                <TextField
                    label="รายได้สะสม"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={allDeposit}
                    onChange={(e) => setAllDeposit(validateNumberInput(e.target.value))}
                  />
            </div>
            <div className="form-row" style={{ display: 'flex' }}>
              <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>รายการหัก :</p>
            </div>
            <div className="form-row" style={{ display: 'flex',  marginBottom: '20px' }}>
            <TextField
                  label="เงินประกันสังคม"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={insurance}
                  onChange={(e) => setInsurance(validateNumberInput(e.target.value))}
                />
                <TextField
                  label="เงินหัก ณ ที่จ่าย"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={late}
                  onChange={(e) => setLate(validateNumberInput(e.target.value))}
                />
                <TextField
                  
                  label="เงินเบิกล่วงหน้า"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={withdraw}
                  onChange={(e) => setWithdraw(validateNumberInput(e.target.value))}
                />
                <TextField
                  label="เงินกู้ยืมสวัสดิการ"
                  className="form-field"
                  variant="filled"
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
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
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
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
                  style={{width:'19%',marginRight:'1.25%'}}
                  InputLabelProps={{ style: { color: '#000' },shrink: true  }}
                  InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                  value={tax}
                  onChange={(e) => setTax(validateNumberInput(e.target.value))}
                />
                <TextField
                    label="เงินประกันสังคมสะสม"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={allInsurance}
                    onChange={(e) => setAllInsurance(validateNumberInput(e.target.value))}
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
              <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/profile')}>ยกเลิก</button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileEdit;
