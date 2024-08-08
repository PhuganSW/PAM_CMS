import React, { useState,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './fonts/THSarabunNew-normal'
import THSarabunNew from './fonts/THSarabunNew-normal';
import 'jspdf-autotable';
import logo from './fonts/logo';
import Layout from './Layout';
import { UserContext } from './UserContext';

function SalaryCal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [id_file,setID_File] = useState('');
  const [uid,setUid] = useState('');
  const [name,setName] = useState('');
  const [date,setDate] = useState(dayjs(new Date()));
  const [valuePos,setValuePos] = useState(0); //ค่าประจำตำแน่ง
  const [costL,setCostL] = useState(0); //ค่าครองชีพ
  const [food,setFood] = useState(0); //ค่าอาหาร
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
  const [amount,setAmount] = useState('');
  const [deposit,setDeposit] = useState('');
  const [allDeposit,setAllDeposit] = useState('');
  const [allWithdraw,setAllWithdraw] = useState('');
  const [allInsurance,setAllInsurance] = useState('');
  const { setCurrentUser, companyId } = useContext(UserContext);

  const getUserSuccess=(data)=>{
    setName(data.name+" "+data.lastname)
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
  }

  const getUserUnsuccess=(e)=>{
    console.log(e)
  }

  const getBillSuc = (data) => {
    if (data.length > 0) {
      const billData = data[0]; // Assuming you want the first item
      setDate(dayjs(billData.date, 'DD-MM-YYYY'));
      setSalary(billData.salary);
      setSub(billData.sub);
      setOT(billData.ot);
      setAllowance(billData.allowance);
      setVenhicle(billData.venhicle);
      setWelth(billData.welth);
      setBonus(billData.bonus);
      setCostL(billData.costL);
      setInsurance(billData.insurance);
      setLate(billData.late);
      setWithdraw(billData.withdraw);
      setBorrow(billData.borrow);
      setMissing(billData.missing);
      setTax(billData.tax);
   
    }
  };

  const getBillUnsuc=()=>{

  }

  const saveSuc=()=>{
    navigate('/salary_list',{state:{uid:uid}})
  }

  const saveUnsuc=(e)=>{
    console.log(e)
  }

  const onSave=()=>{
    let date_str = date.format('DD/MM/YYYY');
    let item ={
      id:uid,
      name:name,
      date:date_str,
      costL:costL,
      ot:ot,
      allowance:allowance,
      salary:salary,
      venhicle:venhicle,
      sub:sub,
      welth:welth,
      bonus:bonus,
      tax:tax,
      insurance:insurance,
      late:late,
      missing:missing,
      borrow:borrow,
      withdraw:withdraw,
      deposit:deposit,
      allDeposit:allDeposit,
      allWithdraw:allWithdraw,
      allInsurance:allInsurance,
      amount:amount,
    }
    console.log('save')
    firestore.addBill(companyId,item,saveSuc,saveUnsuc)
  }

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      //console.log('from eff'+uid)
      firestore.getUser(companyId,location.state.uid,getUserSuccess,getUserUnsuccess)
      if(location.state.act=="edit"){
        //console.log("edit "+ location.state.date)
        firestore.getBill(companyId,location.state.uid,location.state.date,getBillSuc,getBillUnsuc)
      }
    } else {
      console.warn('No ID found in location state');
    }
  }, [location.state]);

  useEffect(() => {
    calculateTotalDep();
    calculateTotalwith();
    calculateTotalAmount();
  }, [valuePos, costL, food, ot, allowance, salary, venhicle, sub, welth, bonus, tax, insurance, late, missing, borrow, withdraw,deposit,allWithdraw]);

  const calculateTotalDep = () => {
    const total =
     
      Number(costL)+
      Number(ot)+
      Number(allowance)+
      Number(salary)+
      Number(venhicle)+
      Number(sub)+
      Number(welth)+
      Number(bonus) ;

    setDeposit(total);
  };

  const calculateTotalwith = () => {
    const total1 =
      Number(insurance) +
      Number(late)+
      Number(withdraw)+
      Number(borrow)+
      Number(missing)+
      Number(tax)

    setAllWithdraw(total1);
  };

  const calculateTotalAmount = () => {
    const total1 =
      Number(deposit) -
      Number(allWithdraw)

    setAmount(total1);
  };

  const validateNumberInput = (input) => {
    const number = Number(input);
    if (isNaN(number)) {
      alert("Invalid input, resetting to 0.");
      return 0;
    }
    return number;
  }

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS("THSarabunNew.ttf",THSarabunNew.base64);
    doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
    doc.setFont("THSarabunNew");

    // Add title
    doc.setFontSize(24);
    doc.text("รายละเอียดเงินเดือน", 14, 22);

    // Add user name and date
    doc.setFontSize(22);
    doc.text(`ชื่อ: ${name}`, 14, 30);
    doc.text(`วันที่: ${date.format('DD/MM/YYYY')}`, 14, 36);

    // Add table headers
   /* doc.setFontSize(20);
    doc.text('รายละเอียด', 14, 50);
    doc.text('จำนวนเงิน', 90, 50);*/


    // Add table
    const tableColumn = ["รายละเอียด", "จำนวนเงิน"];
    const tableRows = [
      ["ค่าครองชีพ", costL],
      ["ค่าประจำตำแหน่ง", valuePos],
      ["ค่าอาหาร", food],
      ["ค่าล่วงเวลา", ot],
      ["ค่าเบี้ยเลี้ยง", allowance],
      ["ค่าเงินเดือน", salary],
      ["ค่ายานพาหนะ", venhicle],
      ["เงินอุดหนุน", sub],
      ["ค่าสวัสดิการ", welth],
      ["เงินโบนัส", bonus],
      ["หักภาษี", tax],
      ["ประกันสังคม", insurance],
      ["เข้างานสาย", late],
      ["ขาดงาน", missing],
      ["เงินกู้ยืม", borrow],
      ["เงินเบิกล่วงหน้า", withdraw]
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { 
        font: 'THSarabunNew',
        fontSize: 18,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        fillColor: [240, 240, 240], // Light gray background color for the cells
      },
      headStyles: {
        fillColor: [0, 57, 107], // Dark blue background for header
        textColor: [255, 255, 255], // White text color for header
        fontSize: 20,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250] // Alternate row color (lighter gray)
      },
      tableLineColor: [0, 0, 0], // Color of table borders
      tableLineWidth: 0.75,
    });

    //doc.addImage(logo.base64, 'PNG', 14, 100, 50, 50);


    //doc.save(`${name}_salary_details.pdf`);
    const pdfDataUri = doc.output('dataurlstring');

    // Open the PDF in a new tab
    const newWindow = window.open();
    newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
  }


  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>คำนวณเงินเดือน</h1>
                {/* Add user profile and logout here */}
              </header>
              </div>
            <div className="main-contain">
              
              <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%'}}>
                <p style={{fontSize:28,marginTop:20}}>เงินเดือน: {name}</p>
                <div style={{display:'flex', gap: '10px', marginBottom: '10px',flexDirection:'row',alignItems:'center'}}>
                  <p style={{fontSize:24}}>วันออกบิลเงินเดือน</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                        <DatePicker
                        label="วันที่"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        />
                  </LocalizationProvider>
                </div>
                <p style={{fontSize:24}}>รายได้</p>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
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
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px', }}>
                
                  
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
                  {/* <TextField
                    label="เงินสวัสดิการ"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={welth}
                    onChange={(e) => setWelth(Number(e.target.value))}
                  />
                 
                 <TextField
                    label="เงินโบนัส"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={bonus}
                    onChange={(e) => setBonus(Number(e.target.value))}
                  /> */}
                </div>
                <div className="form-row" style={{ display: 'flex'}}>
                  <p style={{fontSize:22}}>รวมรายได้</p>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}} >
                <TextField
                    variant="filled"
                    className="form-field"
                    style={{width:'100%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ readOnly: true,style: { color: '#000', backgroundColor: '#fff' } }}
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                  />
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}} >
                  <p style={{fontSize:22}}>รวมรายได้สะสม</p>
                  <TextField
                    variant="filled"
                    className="form-field"
                    style={{width:'100%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' } }}
                    value={allDeposit}
                    onChange={(e) => setAllDeposit(e.target.value)}
                  />
                </div>
                <div className="form-row" style={{ display: 'flex',}} >
                  <p style={{fontSize:22}}>รายการหัก</p>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}} >
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
                  <p style={{fontSize:22}}>รวมรายการหัก</p>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}} >
                  <TextField
                    variant="filled"
                    className="form-field"
                    style={{width:'100%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ readOnly: true,style: { color: '#000', backgroundColor: '#fff' } }}
                    value={allWithdraw}
                    onChange={(e) => setAllWithdraw(e.target.value)}
                  />
                </div>
                <div className="form-row" style={{ display: 'flex'}}>
                  <p style={{fontSize:22}}>รวมเงินประกันสังคมสะสม</p>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}} >
                  <TextField
                    variant="filled"
                    className="form-field"
                    style={{width:'100%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{style: { color: '#000', backgroundColor: '#fff' } }}
                    value={allInsurance}
                    onChange={(e) => setAllWithdraw(e.target.value)}
                  />
                </div>
                <div className="form-row" style={{ display: 'flex'}}>
                  <p style={{fontSize:22}}>สรุปรวมทั้งหมด</p>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px'}} >
                <TextField
                    variant="filled"
                    className="form-field"
                    style={{width:'100%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{style: { color: '#000', backgroundColor: '#fff',readOnly:true } }}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/salary_list',{state:{uid:uid}})}>ยกเลิก</button>
                <button style={{ width: 100, height: 50, borderRadius: 5, backgroundColor: '#026440', color: '#FFFFFF', marginLeft: 10 }} onClick={exportToPDF}>Export PDF</button>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default SalaryCal;

  