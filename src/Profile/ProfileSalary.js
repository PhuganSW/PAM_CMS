import React, { useState,useRef,useEffect,useContext } from 'react';
import Sidebar from '../sidebar';
import '../Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
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
import { UserContext } from '../UserContext';


function ProfileSalary() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const location = useLocation();

  const [action,setAction] = useState('');
  const [uid,setUid] = useState('');

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
  const [allDeposit,setAllDeposit] = useState(0); //รายได้สะสม
  const [allInsurance,setAllInsurance] = useState(0); //ประกันสังคมสะสม
 
  const { setCurrentUser, companyId } = useContext(UserContext);

  const validateNumberInput = (input) => {
    const number = Number(input);
    if (isNaN(number)) {
      alert("Invalid input, resetting to 0.");
      return 0;
    }
    return number;
  }


  const addUserSuccess=async(id)=>{

  }

  const addUserUnsuccess=(e)=>{
    console.log(e)
    alert('กรอกชื่อกับนามสกุลให้ครบถ้วน')
  }

  const updateSuccess = () => {
    navigate('/profile_edit',{state:{uid:uid}});
  };

  const updateUnsuccess = (error) => {
    console.log(error);
  };

  const onSave= async()=>{

    let item ={
    costL: costL || 0,
    ot: ot || 0,
    allowance: allowance || 0,
    salary: salary || 0,
    venhicle: venhicle || 0,
    sub: sub || 0,
    welth: welth || 0,
    bonus: bonus || 0,
    allDeposit: allDeposit || 0,
    tax: tax || 0,
    insurance: insurance || 0,
    late: late || 0,
    missing: missing || 0,
    borrow: borrow || 0,
    withdraw: withdraw || 0,
    allInsurance: allInsurance || 0,
    }
    if(action=='edit'){
        firestore.updateUser(companyId, uid, item, updateSuccess, updateUnsuccess);
    }
  }
    

  const getUserSuccess = (data) => {
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
    setAllDeposit(data.allDeposit)
    setAllInsurance(data.allInsurance)
  };

  const getUserUnsuccess = (e) => {
    console.log('f edit' + e);
  };

  useEffect(() => {
    if (location.state) {
        setAction(location.state.action)
        if(location.state.action=='edit'){
            setUid(location.state.uid)
            firestore.getUser(companyId,location.state.uid, getUserSuccess, getUserUnsuccess);
        }else{
          setUid(location.state.uid)
          console.log(uid)
        }
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
                <h1>เพิ่มประวัติพนักงาน</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
              
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%',marginTop:30}}>
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
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
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
            
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF',marginRight:10}} onClick={()=>{
                    action == 'add'?navigate('/profile_add',{state:{uid:uid}}):navigate('/profile_edit',{state:{uid:uid}})}}>ยกเลิก</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileSalary;

  