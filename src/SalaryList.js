import React,{useState,useEffect,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate,useLocation } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import firestore from './Firebase/Firestore';
import { IoSearchOutline,IoTrash,IoChevronBackOutline } from "react-icons/io5";
import Layout from './Layout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { UserContext } from './UserContext';



function SalaryList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid,setUid] = useState('') // user id
  const [name,setName] = useState('');
  const [date,setDate] = useState(dayjs(new Date(),'DD-MM-YYYY'));
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [startIndexSalary, setStartIndexSalary] = useState(location.state?.startIndex || 0);
  const [endIndexSalary, setEndIndexSalary] = useState(location.state?.endIndex || 10);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [allBill,setAllBill] = useState([])
  const [allBillCF,setAllBillCF] = useState([])
  const [addAble,setAddAble] = useState(null)
  const { setCurrentUser, companyId } = useContext(UserContext);

  const [selectedBillIds, setSelectedBillIds] = useState([]); // Track selected bills for the first table
  const [selectedBillCFIds, setSelectedBillCFIds] = useState([]); // Track selected bills for the second table
  const [selectAllBills, setSelectAllBills] = useState(false);
  const [selectAllBillCFs, setSelectAllBillCFs] = useState(false);

  const getUserSuccess=(data)=>{
    setName(data.name+" "+data.lastname)
  }

  const getUserUnsuccess=(e)=>{
    console.log(e)
  }

  const getAllBillSuc = (doc) => {
    let bills = [];
    let billsCF = [];
  
    doc.forEach((item) => {
      const billData = {
        id: item.id,
        uid: item.uid,
        date: item.date,
        dateObj: dayjs(item.date, 'DD/MM/YYYY'), // Convert date to dayjs object for sorting
      };
  
      if (item.confirm === false) {
        bills.push(billData);
      } else {
        billsCF.push(billData);
      }
    });
  
    // Sort the bills array by date in descending order
    bills.sort((a, b) => b.dateObj - a.dateObj);
    billsCF.sort((a, b) => b.dateObj - a.dateObj);

    if(bills.length < 1){
      setAddAble(true)
    }else{
      setAddAble(false)
    }

  
    setAllBill(bills);
    setAllBillCF(billsCF);
  };

  const getAllBillUnsuc=(error)=>{
    console.log(error)
  }

  const addSalary=(id)=>{
    navigate('/profile_salary', { state: { action: 'edit', uid: uid } })
  }

  const calSalary=(id)=>{
    if(addAble){
      let act = "cal";
      navigate('/salary_cal',{state:{uid,act:id,act}})
    }else{
      alert('You create bill already.')
    }
  }

  const toEdit=(date,id)=>{
    let act = "edit";
    navigate('/salary_cal',{state:{uid,date,act,id:uid,date,act,id}})
  }

  const saveSuc=()=>{}
  const saveUnsuc=(e)=>console.log(e)

  const onConfirm=(id)=>{
    let item={
      confirm:true
    }
    firestore.updateBill(companyId, id, item, saveSuc, saveUnsuc);
  }

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      //console.log('from eff'+uid)
      firestore.getUser(companyId,location.state.uid,getUserSuccess,getUserUnsuccess)
      firestore.getAllBill(companyId,location.state.uid,getAllBillSuc,getAllBillUnsuc)
    } else {
      console.warn('No ID found in location state');
    }
  }, [location.state]);

  const onNext = () => {
    setStartIndex(startIndex + 5); // Increment the start index by 5
    setEndIndex(endIndex + 5); // Increment the end index by 5
  };

  const onPrevious = () => {
    setStartIndex(Math.max(startIndex - 5, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndIndex(Math.max(endIndex - 5, 5)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(event.target.value);
    setSearchQuery(query);
    // const filtered = allUser.filter(user => user.name.toLowerCase().includes(query));
    // setFilteredUsers(filtered);
  };

  const handleSelectAllBills = () => {
    if (selectAllBills) {
      setSelectedBillIds([]);
    } else {
      const allIds = allBill.map((bill) => bill.id);
      setSelectedBillIds(allIds);
    }
    setSelectAllBills(!selectAllBills);
  };

  const handleSelectAllBillCFs = () => {
    if (selectAllBillCFs) {
      setSelectedBillCFIds([]);
    } else {
      const allIds = allBillCF.map((bill) => bill.id);
      setSelectedBillCFIds(allIds);
    }
    setSelectAllBillCFs(!selectAllBillCFs);
  };

  const handleSelectBill = (id) => {
    if (selectedBillIds.includes(id)) {
      setSelectedBillIds(selectedBillIds.filter((billId) => billId !== id));
    } else {
      setSelectedBillIds([...selectedBillIds, id]);
    }
  };

  const handleSelectBillCF = (id) => {
    if (selectedBillCFIds.includes(id)) {
      setSelectedBillCFIds(selectedBillCFIds.filter((billId) => billId !== id));
    } else {
      setSelectedBillCFIds([...selectedBillCFIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    const allSelectedIds = [...selectedBillIds, ...selectedBillCFIds];
    if (allSelectedIds.length === 0) {
      alert("No bills selected for deletion.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the selected bills?")) {
      allSelectedIds.forEach((id) => {
        firestore.deleteBill(
          companyId,
          id,
          () => {
            console.log("Bill deleted successfully:", id);
            // Update the state by filtering out the deleted ID
            setAllBill((prevBills) => prevBills.filter((bill) => bill.id !== id));
            setAllBillCF((prevBillsCF) => prevBillsCF.filter((billCF) => billCF.id !== id));
          },
          (error) => {
            console.error("Error deleting bill:", error);
          }
        );
      });
  
      // Reset selection after deletion
      setSelectedBillIds([]);
      setSelectedBillCFIds([]);
      setSelectAllBills(false);
      setSelectAllBillCFs(false);
    }
  };

  const handleBack = () => {
    navigate('/salary', { state: { startIndex: startIndexSalary, endIndex: endIndexSalary, bypassPassword: true } });
  };


  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        
        <main className="main-content">
          
          <div class="main">
            <div className='header-page'>
            <header>
              <h1>ทำเรื่องเงินเดือน</h1>
              {/* Add user profile and logout here */}
            </header>
            </div>
            <div class="main-contain">
                
              <p style={{fontSize:36,marginLeft:15,marginTop:20}} onClick={handleBack}>
                <IoChevronBackOutline
                  size={32}
                  style={{ cursor: 'pointer', marginRight: 10,alignSelf:'center',justifyContent:'center' }}
                  onClick={handleBack}
                />
                เงินเดือน: {name}
              </p>
            {/* <div className="search-field">
                <button className='Add-button' onClick={()=> calSalary(uid)}>คำนวณเงินเดือน</button>
            <p style={{marginTop:17}}>ค้นหา</p>
                <input style={{width:'40%',margin:5,height:40,borderRadius:20,paddingInlineStart:10,fontSize:18}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                <button className="search-button" ><IoSearchOutline size={24} /></button>
              </div> */}
              <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:10,width:'95%',alignSelf:'center'}}>
                <button className='Edit-button' style={{fontSize:16,width:150,height:50}} onClick={()=> addSalary(uid)}>เพิ่มข้อมูลเงินเดือน</button>
                <button className='Add-button' style={{fontSize:16}} onClick={()=> calSalary(uid)}>คำนวณเงินเดือน</button>
              </div>
      
              <div style={{width:'95%',alignSelf:'center',marginTop:20}}>
              <p style={{fontSize:28,textAlign:'center'}}>เงินเดือนล่าสุด</p>
              <IoTrash
                size={32}
                className="trash-icon"
                onClick={handleDeleteSelected}
                style={{
                  marginBottom: '10px',
                  cursor: 'pointer',
                  color: 'red',
                  border: '2px solid red',
                  padding: '5px',
                  borderRadius: '5px',
                }}
              />
              <TableBootstrap striped bordered hover className='table'>
                <thead>
                    <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAllBills}
                        onChange={handleSelectAllBills}
                      />
                    </th>
                    <th scope="col">ลำดับ</th>
                    <th scope="col">เดือน</th>
                    <th scope="col" style={{width:'35%'}}>actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/*{allUser.slice(startIndex, endIndex).map((item, index) => (*/}
                  {allBill.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBillIds.includes(item.id)}
                          onChange={() => handleSelectBill(item.id)}
                        />
                      </td>
                      {/*<th scope="row">{startIndex + index + 1}</th>*/}
                      <th scope="row">{index + 1}</th>
                      <td>
                        {item.date}
                      </td>
                      <td style={{textAlign:'center'}}>
                          <button className='Edit-button' style={{width:'35%',height:'30%'}} onClick={()=> toEdit(item.date,item.id)}>ดูและแก้ไข</button>
                          <button className='Add-button' style={{height:'30%',width:'35%'}} onClick={()=>onConfirm(item.id)}>Submit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableBootstrap>
              <p style={{fontSize:28,textAlign:'center',marginTop:20}}>ประวัติการจัดทำเงินเดือน</p>
              <TableBootstrap striped bordered hover className='table'>
                <thead>
                  <tr>
                  <th>
                      <input
                        type="checkbox"
                        checked={selectAllBillCFs}
                        onChange={handleSelectAllBillCFs}
                      />
                    </th>
                    <th scope="col">ลำดับ</th>
                    <th scope="col">เดือน</th>
                    <th scope="col" style={{width:'35%'}}>actions</th>
                  </tr>
                </thead>
                <tbody>
                {allBillCF.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBillCFIds.includes(item.id)}
                          onChange={() => handleSelectBillCF(item.id)}
                        />
                      </td>
                      {/*<th scope="row">{startIndex + index + 1}</th>*/}
                      <th scope="row">{index + 1}</th>
                      <td>
                        {item.date}
                      </td>
                      <td style={{textAlign:'center'}}>
                        <button className='Edit-button' style={{width:'35%',height:'30%'}} onClick={()=> toEdit(item.date,item.id)}>ดูและแก้ไข</button>  
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableBootstrap>
              {/*<div>
                <button onClick={onPrevious}>Previous</button>
                <button onClick={onNext}>Next</button>
                </div>*/}
              </div>
            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default SalaryList;

  