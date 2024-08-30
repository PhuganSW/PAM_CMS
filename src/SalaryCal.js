import React, { useState,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import Sidebar from './sidebar';
import './Home.css';
import { useNavigate,useLocation } from 'react-router-dom';
import './addProfile.css'
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import firestore from './Firebase/Firestore';
import storage from './Firebase/Storage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
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
  const [status,setStatus] = useState(''); //new or edit
  const [id,setId] = useState(''); // user id
  const [uid,setUid] = useState(''); //id doc
  const [name,setName] = useState('');
  const [position,setPosition] = useState('');
  const [editable,setEditable] = useState(true)
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
  const [allDeposit,setAllDeposit] = useState(0);
  const [allWithdraw,setAllWithdraw] = useState(0);
  const [allInsurance,setAllInsurance] = useState(0);
  const [confirm,setConfirm] = useState(null);
  const [urlPDF,setURLpdf] = useState('');
  const { setCurrentUser, companyId } = useContext(UserContext);


  const getUserSuccess=(data)=>{
    setName(data.name+" "+data.lastname)
    setPosition(data.position)
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
    setConfirm(false)
  }

  const getUserUnsuccess=(e)=>{
    console.log(e)
  }

  const getBillSuc = (data) => {
    //console.log("bill S",data.length)

    const billData = data; // Assuming you want the first item
    setDate(dayjs(billData.date, 'DD-MM-YYYY'));
    setName(billData.name);
    setPosition(billData.position || '');
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
    setAllDeposit(billData.allDeposit)
    setAllInsurance(billData.allInsurance)
    setConfirm(billData.confirm)
    setURLpdf(billData.urlPDF)
    if(billData.confirm){
      setEditable(false)
    }
  };

  const getBillUnsuc=()=>{

  }

  const saveSuc=()=>{
    navigate('/salary_list',{state:{uid:id}})
  }

  const saveUnsuc=(e)=>{
    console.log(e)
  }

  const onSave=()=>{
    let date_str = date.format('DD/MM/YYYY');
    let item ={
      id:id,
      name:name,
      position:position,
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
      confirm:false,
      urlPDF:urlPDF,
    }
    console.log('save')
    if(status == "edit"){
      firestore.updateBill(companyId, uid, item, saveSuc, saveUnsuc);
    }else{
      firestore.addBill(companyId,item,saveSuc,saveUnsuc)
    }
  }

  useEffect(() => {
    if (location.state && location.state.uid) {
      setId(location.state.uid);
      //console.log('from eff'+uid)
      if(location.state.act == "cal"){
        firestore.getUser(companyId,location.state.uid,getUserSuccess,getUserUnsuccess)
      }
      if(location.state.act=="edit"){
        console.log("edit "+ location.state.id)
        setStatus(location.state.act)
        setUid(location.state.id)
        firestore.getBill(companyId,location.state.id,location.state.date,getBillSuc,getBillUnsuc)
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

    // const total3 = Number(allInsurance)+Number(insurance)
    // setAllInsurance(total3)
  };

  const calculateTotalAmount = () => {
    const total1 =
      Number(deposit) -
      Number(allWithdraw)

    setAmount(total1);
    // const total2 = Number(allDeposit)+Number(total1)
    // setAllDeposit(total2)
  };

  const validateNumberInput = (input) => {
    const number = Number(input);
    if (isNaN(number)) {
      alert("Invalid input, resetting to 0.");
      return 0;
    }
    return number;
  }

  const exportToPDF = async () => {
  const doc = new jsPDF();
  
  doc.addFileToVFS("THSarabunNew.ttf", THSarabunNew.base64);
  doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
  doc.setFont("THSarabunNew");
  
  // Add title and company information
  doc.setFontSize(24);
  doc.text("บริษัท มิสซิเบิล เทคโนโลยี จำกัด", 14, 22);
  doc.setFontSize(20);
  doc.text("ใบแจ้งเงินเดือน (PAY SLIP)", 14, 30);
  doc.text(`ชื่อ: ${name}`, 14, 38);
  doc.text(`ตำแหน่ง: ${position}`, 14, 46);  // You can add the department dynamically if available
  doc.text(`วันที่จ่าย (DATE): ${date.format('DD/MM/YYYY')}`, 14, 54);
  
  // Define columns and rows for the table
  const tableColumn = [
    [{ content: "รวมรายได้", colSpan: 2, styles: { halign: 'center' } }, { content: "รวมเงินหัก", colSpan: 2, styles: { halign: 'center' } }]
  ];
  
  const tableRows = [
    ["เงินเดือน", salary.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "ประกันสังคม", insurance.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    ["ค่าจ้าง", sub.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "ภาษีหัก ณ ที่จ่าย", late.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    ["ค่าพาหนะ", venhicle.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "เงินเบิกล่วงหน้า", withdraw.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    ["ค่าเบี้ยเลี้ยง", allowance.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "สินเชื่อพนักงาน", borrow.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    ["ค่าล่วงเวลา", ot.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "ขาดงาน", missing.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    ["ค่าสวัสดิการ", welth.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "ภาษีเงินได้", tax.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    ["เงินโบนัส", bonus.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "-", "-"],
    ["เงินพิเศษ", costL.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "-", "-"],
    ["เงินได้สะสม", allDeposit.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "ประกันสังคมสะสม", allInsurance.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    ["รวมเงินได้", deposit.toLocaleString('th-TH', { minimumFractionDigits: 2 }), "รวมเงินหัก", allWithdraw.toLocaleString('th-TH', { minimumFractionDigits: 2 })],
    // [{ content: "เงินได้สุทธิ", colSpan: 4, styles: { halign: 'center' } }]
  ];
  
  // Add the table with custom rendering for description and value
  doc.autoTable({
    head: tableColumn,
    body: tableRows,
    startY: 60,
    styles: {
      font: 'THSarabunNew',
      fontSize: 18,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'right', // Align numbers to the right
      valign: 'middle',
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [191, 228, 255], // Light blue background for header
      textColor: [0, 0, 0], // Black text color for header
      halign: 'center', // Center-align header
    },
    columnStyles: {
      0: { halign: 'left' }, // Left align for the first column (descriptions)
      1: { halign: 'right',cellWidth: 30 ,}, // Right align for the second column (values)
      2: { halign: 'left' }, // Left align for the third column (descriptions)
      3: { halign: 'right',cellWidth: 30 }, // Right align for the fourth column (values)
    },
    tableLineColor: [0, 0, 0], // Color of table borders
    tableLineWidth: 0.75,
    didDrawCell: (data) => {
      // Remove border between column 1 and 2
      if (data.column.index === 1) {
        doc.setDrawColor(255, 255, 255); // Set the draw color to white to "erase" the border
        doc.line(data.cell.x - 0.5, data.cell.y, data.cell.x - 0.5, data.cell.y + data.cell.height);
      }
      // Remove border between column 3 and 4
      if (data.column.index === 3) {
        doc.setDrawColor(255, 255, 255); // Set the draw color to white to "erase" the border
        doc.line(data.cell.x - 0.5, data.cell.y, data.cell.x - 0.5, data.cell.y + data.cell.height);
      }
    },
  });
  
  // Calculate the final line (Net Salary)
  const netSalary = amount;
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(191, 228, 255); // Light blue background color
  doc.rect(14, doc.lastAutoTable.finalY + 10, 182, 10, 'F'); // Draw a filled rectangle
  doc.text(`เงินได้สุทธิ: ${netSalary.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`, 18, doc.lastAutoTable.finalY + 17);
  
  // Save or open the PDF
  const pdfDataUri = doc.output('dataurlstring');
  const newWindow = window.open();
  newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);

   // Save the PDF to the user's device
   const pdfBlob = doc.output('blob');
   const pdfFileName = `${name}_salary_${date.format('DD_MM_YYYY')}.pdf`;
   saveAs(pdfBlob, pdfFileName);
 
   //Upload the PDF to Firebase Storage
   try {
    const downloadURL = await storage.uploadBill(companyId, pdfFileName, pdfBlob);
 
     // Store the download URL in Firestore
     setURLpdf(downloadURL)
     //alert('PDF uploaded and link saved successfully!');
     if(!urlPDF){
      firestore.updateBill(companyId, uid, {urlPDF:downloadURL}, saveSuc, saveUnsuc);
    }
   } catch (error) {
     console.error('Error uploading PDF: ', error);
     alert('Error uploading PDF.');
   }
};
  


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
                        disabled={!editable}
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
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={salary}
                    onChange={(e) => setSalary(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="ค่าจ้าง"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={sub}
                    onChange={(e) => setSub(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    
                    label="ค่าล่วงเวลา"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={ot}
                    onChange={(e) => setOT(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="ค่าเบี้ยเลี้ยง"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
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
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
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
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={welth}
                    onChange={(e) => setWelth(validateNumberInput(e.target.value))}
                  />
                   <TextField
                    label="เงินโบนัส"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={bonus}
                    onChange={(e) => setBonus(validateNumberInput(e.target.value))}
                      />
                  <TextField
                    label="เงินพิเศษ"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
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
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={allDeposit}
                    onChange={(e) => setAllDeposit(validateNumberInput(e.target.value))}
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
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={insurance}
                    onChange={(e) => setInsurance(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="เงินหัก ณ ที่จ่าย"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={late}
                    onChange={(e) => setLate(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    
                    label="เงินเบิกล่วงหน้า"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={withdraw}
                    onChange={(e) => setWithdraw(validateNumberInput(e.target.value))}
                  />
                  <TextField
                    label="เงินกู้ยืมสวัสดิการ"
                    className="form-field"
                    variant="filled"
                    style={{width:'19%',marginRight:'1.25%'}}
                    InputLabelProps={{ style: { color: '#000' } }}
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
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
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
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
                    InputProps={{ style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
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
                    InputProps={{style: { color: '#000', backgroundColor: '#fff' },readOnly: !editable }}
                    value={allInsurance}
                    onChange={(e) => setAllInsurance(validateNumberInput(e.target.value))}
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
                    InputProps={{style: { color: '#000', backgroundColor: '#fff' },readOnly: true }}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center',width:'100%'}}>
                {confirm == false && <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#D3D3D3',marginRight:10}} onClick={onSave}>บันทึกข้อมูล</button>}
                <button style={{width:100,height:50,borderRadius:5,backgroundColor:'#343434',color:'#FFFFFF'}} onClick={()=>navigate('/salary_list',{state:{uid:id}})}>ยกเลิก</button>
                {status == 'edit' && <button style={{ width: 100, height: 50, borderRadius: 5, backgroundColor: '#026440', color: '#FFFFFF', marginLeft: 10 }} onClick={exportToPDF}>Export PDF</button>}
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default SalaryCal;

  