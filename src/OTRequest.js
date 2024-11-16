import React,{useState,useEffect,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import firestore from './Firebase/Firestore';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';
import { UserContext } from './UserContext';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { TextField} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import {FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { AiOutlineEdit,AiOutlineDelete,AiOutlineFilter, AiOutlineExport } from "react-icons/ai";
import { SiMicrosoftexcel } from "react-icons/si";
import { hashPassword } from './hashPassword';
import * as XLSX from 'xlsx';

function OTRequest() {
  const navigate = useNavigate();
  const [allOT, setAllOT] = useState([]);
  const [show,setShow] = useState(false);
  const [selectID,setSelectID] = useState('')
  const [name,setName] = useState('');
  const [position,setPosition] = useState('');
  const [date,setDate] = useState('');
  const [timeStart,setTimeStart] = useState('');
  const [timeEnd,setTimeEnd] = useState('');
  const [amount,setAmount] = useState('');
  const [detail,setDetail] = useState('');
  const [status,setStatus] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [selectedOTIds, setSelectedOTIds] = useState([]); // Track selected OT requests
  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deny,setDeny]= useState(false)
  const { setCurrentUser, companyId, userData } = useContext(UserContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sortOrder, setSortOrder] = useState('desc'); // State for date sorting order
  const [nameSortOrder, setNameSortOrder] = useState('asc');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);


  const getAllOTSuccess=(doc)=>{
    
    let ots = []
    if (allOT.length === 0) {
        
      doc.forEach((item) => {
        ots.push({uid: item.uid,date:item.date, name: item.name,position:item.position,timeStart:item.timeStart,timeEnd:item.timeEnd,
                  amount:item.amount,detail:item.detail,requestTime:item.requestTime, state:item.state1,deny:item.deny});
      });
      setAllOT(ots);
      sortData(sortOrder, setFilteredUsers, ots);
    }
  }

  const getAllOTUnsuccess=(error)=>{
    console.log("getOTLeave: "+error)
  }

  const allowSuc=()=>setShow(false)
  const allowUnsuc=(e)=> console.log(e)

  const getOTSuc=(data)=>{
    setName(data.name)
    setPosition(data.position)
    setDate(data.date)
    setTimeStart(data.timeStart)
    setTimeEnd(data.timeEnd)
    setAmount(data.amount)
    setDetail(data.detail)
    setDeny(data.deny || false)
    if(data.status1){
      setStatus("Allowed")
    }else{
      setStatus("Not allowed")
    }

    handleShow()
  }

  const onAllow=()=>{
    setStatus(true)
    let item={
      status1:true
    }
    if(deny){
      item.deny=false
      item.status=true
    }
    firestore.updateOT(companyId,selectID,item,allowSuc,allowUnsuc)
  }

  const getOTUnsuc =(error)=>{

  }

  const getOT=(uid)=>{
    setSelectID(uid)
    firestore.getOT(companyId,uid,getOTSuc,getOTUnsuc)
  }

  useEffect(() => {
    
    firestore.getAllUser(companyId, setUsers, console.error);
    const cleanupAndFetch = async () => {
      await firestore.autoDeleteOldOT(
        companyId,
        (deleteCount) => {
          console.log(`${deleteCount} old OT records were deleted.`);
        },
        (error) => {
          console.error("Error during auto-delete process:", error);
        }
      );
  
      firestore.getAllOT(companyId,getAllOTSuccess,getAllOTUnsuccess)
    };
  
    cleanupAndFetch();
  }, []);

  const onNext = () => {
    setStartIndex(startIndex + 10); // Increment the start index by 5
    setEndIndex(endIndex + 10); // Increment the end index by 5
  };

  const onPrevious = () => {
    setStartIndex(Math.max(startIndex - 10, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndIndex(Math.max(endIndex - 10, 10)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(event.target.value);
    setSearchQuery(query);
    const filtered = allOT.filter(user => user.name.toLowerCase().includes(query));
    sortData(sortData, setFilteredUsers, filtered);
  };

   // Convert date string (dd/MM/yyyy) to Date object for sorting
   const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  // Sort data by date
  const sortData = (order, setData, data) => {
    const sortedData = [...data].sort((a, b) => {
      // Primary sorting: 'not allowed' (state1 === false) entries first
      // if (a.state !== b.state) {
      //   return a.state1 ? 1 : -1;
      // }
      
      // Secondary sorting: sort by date within each status group
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      if (dateA < dateB) return order === 'asc' ? -1 : 1;
      if (dateA > dateB) return order === 'asc' ? 1 : -1;

      // If dates are the same, sort by requestTime
      const timeA = a.requestTime ? new Date(`1970-01-01T${a.requestTime}`).getTime() : 0;
      const timeB = b.requestTime ? new Date(`1970-01-01T${b.requestTime}`).getTime() : 0;

      return order === 'asc' ? timeA - timeB : timeB - timeA;
    });
  
    setData(sortedData);
  };

  // Sort data by name
  const sortByName = (order, setData, data) => {
    const sortedData = [...data].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return order === 'asc' ? (nameA < nameB ? -1 : 1) : (nameA > nameB ? -1 : 1);
    });
    setData(sortedData);
  };

  // Toggle date sorting order
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortData(newOrder, setFilteredUsers, allOT);
  };

  // Toggle name sorting order
  const toggleNameSortOrder = () => {
    const newOrder = nameSortOrder === 'asc' ? 'desc' : 'asc';
    setNameSortOrder(newOrder);
    sortByName(newOrder, setFilteredUsers, allOT);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedOTIds([]);
    } else {
      // Select all visible OT requests
      const allVisibleIds = filteredUsers.map((ot) => ot.uid);
      setSelectedOTIds(allVisibleIds);
    }
    setSelectAll(!selectAll);
  };

  // Handle selection of individual OT request
  const handleSelect = (id) => {
    if (selectedOTIds.includes(id)) {
      // Deselect
      setSelectedOTIds(selectedOTIds.filter((otId) => otId !== id));
    } else {
      // Select
      setSelectedOTIds([...selectedOTIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedOTIds.length === 0) {
      alert("No OT requests selected for deletion.");
      return;
    }
    if (window.confirm("Are you sure you want to delete the selected OT requests?")) {
      selectedOTIds.forEach((id) => {
        firestore.deleteOT(companyId, id, () => {
          console.log("OT request deleted successfully.");
        }, (error) => {
          console.error("Error deleting leave request:", error);
        });
      });
      // Reset selection after deletion
      setSelectedOTIds([]);
      setSelectAll(false);
    }
  };

  const handleClickShowPasswordInModal = () => setShowPasswordInModal((show) => !show);

  const handlePasswordSubmit = async() => {
    const hashedPass = await hashPassword(inputPassword)
    if (hashedPass === userData.password) {
      let item={
        status:false,
        status1:false,
        deny:true,
        exp:new Date()
      }
      firestore.updateOT(companyId,selectID,item,allowSuc,allowUnsuc)
      setInputPassword('')
      setShowPasswordModal(false);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password, please try again.');
    }
  };

  const handleClick = () => {
    setShowPasswordModal(true);
  };

  const handleFilter = () => {
    const filtered = allOT.filter(item => {
        const matchesName = selectedName ? item.name === selectedName : true;
        const matchesMonth = selectedMonth
            ? item.date && new Date(item.date.split('/').reverse().join('-')).getMonth() + 1 === parseInt(selectedMonth)
            : true;
        return matchesName && matchesMonth;
    });
    sortData(sortData, setFilteredUsers, filtered);
    setShowFilterModal(false);
  };

  const handleExportToExcel = () => {
    const selectedOrUserName = selectedName || 'AllUsers';
    const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '_');
    const fileName = `OT_${selectedOrUserName}_${currentDate}.xlsx`;

    const exportData = [
        { requestTime: "OT Data", date: "", name: "", position: "", timeStart: "", timeEnd: "", amount: "", detail: "" },
        { requestTime: "Request Time", date: "Date", name: "Name", position: "Position", timeStart: "Start Time", timeEnd: "End Time", amount: "Amount", detail: "Detail" },
        ...filteredUsers.map(item => ({
            requestTime: item.requestTime || "",
            date: item.date || "",
            name: item.name || "",
            position: item.position || "",
            timeStart: item.timeStart || "",
            timeEnd: item.timeEnd || "",
            amount: String(item.amount) || "",
            detail: item.detail || "",
        }))
    ];

    const worksheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OT Data');
    worksheet['!cols'] = Array(8).fill({ wch: 20 });

    XLSX.writeFile(workbook, fileName);
};

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
        
          <div className="main">
          <div className='header-page'>
          <header>
            <h1>การขอทำงานล่วงเวลา</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div className="main-contain">
            <div className="search-field">
                {/* <p style={{marginTop:17}}>ค้นหาพนักงาน</p> */}
                <input style={{width:'95%',margin:5,height:40,borderRadius:5,paddingInlineStart:10,fontSize:22,alignSelf:'center',justifyContent:'center'}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              

                
                <div style={{width:'95%',alignSelf:'center'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                  <AiOutlineDelete
                    size={42}
                    className="trash-icon"
                    onClick={handleDeleteSelected}
                    style={{
                      marginTop: '20px',      
                      // marginBottom: '10px',    
                      cursor: 'pointer',       
                      color: 'red',            
                      border: '2px solid red', 
                      padding: '5px',          
                      borderRadius: '5px',  
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="outlined" onClick={handleExportToExcel} style={{
                      borderColor: '#000000', // Set border color
                      borderWidth: '2px',     // Set border width
                      color: '#000000'        // Set text color to match the border
                    }}>
                      <SiMicrosoftexcel size={24} color="#217346"/> Export
                    </Button>
                    <Button variant="outlined" onClick={() => setShowFilterModal(true)} style={{
                      borderColor: '#000000', // Set border color
                      borderWidth: '2px',     // Set border width
                      color: '#000000'        // Set text color to match the border
                    }}>
                      <AiOutlineFilter size={24} /> Filter
                    </Button>
                  </div>
                </div>
                <TableBootstrap striped bordered hover className='table' style={{marginTop:20}}>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th scope="col">ลำดับ</th>
                      <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                        วันที่ {sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th onClick={toggleNameSortOrder} style={{ cursor: 'pointer' }}>
                        ชื่อ-สกุล {nameSortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope='col'>เวลายื่นคำขอ</th>
                      <th scope='col'>สถานะ</th>
                      <th scope='col' className="center-text">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                  // {filteredUsers.map((item, index) => (
                    <tr key={item.uid} style={{color:item.state||item.deny?'black':'red'}}> 
                      <td>
                          <input
                            type="checkbox"
                            checked={selectedOTIds.includes(item.uid)}
                            onChange={() => handleSelect(item.uid)}
                          />
                        </td>
                      <td scope="row">{startIndex + index + 1}</td>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td>
                        {item.date}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.requestTime}</td>
                      {item.deny ? (
                          <td>Deny</td>
                        ) : item.state ? (
                          <td>allowed</td>
                        ) : (
                          <td>not allowed</td>
                        )}
                      <td className="center-text">
                        <Button variant="info" onClick={()=>getOT(item.uid)}>
                          <AiOutlineEdit size={20} /> {/* Icon for editing */}
                        </Button>
                        {/* <Button variant="danger" style={{ marginLeft: 10 }} onClick={() => handleSelect(item.id)}>
                          <AiOutlineDelete size={20} /> 
                        </Button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </TableBootstrap>
                <div>
                <button className='Previous-button' onClick={onPrevious}>Previous</button>
                <button className='Next-button' onClick={onNext}>Next</button>
                </div>
                </div>
                
              

            </div>
          </div>
        </main>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '24px' }}>รายละเอียดการขอทำ OT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>ชื่อ - นามสกุล</Form.Label>
              <Form.Control
                type="email"
                value={name}
                autoFocus
                style={{ fontSize: '18px' }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label style={{ fontSize: '20px' }}>ตำแหน่ง</Form.Label>
              <Form.Control
                value={position}
                autoFocus
                style={{ fontSize: '18px' }}
              />
              {/*<Form.Control as="textarea" rows={3} />*/}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>วันที่</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="name"
                autoFocus
                value={date}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>เริ่มตั้งแต่เวลา</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="name"
                autoFocus
                value={timeStart}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>จนถึงเวลา</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="name"
                autoFocus
                value={timeEnd}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>รวมจำนวนชั่วโมงการทำ OT</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="name"
                autoFocus
                value={amount}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>รายละเอียด</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="name"
                autoFocus
                value={detail}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>สถานะ</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="name"
                autoFocus
                value={status}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button style={{backgroundColor:'#000000', fontSize:20}} onClick={onAllow}>
           Allow
          </Button>
          <Button style={{ fontSize: '20px' }} variant="secondary" onClick={handleClick}>
            Deny
          </Button>
          
        </Modal.Footer>
      </Modal>
      <Modal show={showPasswordModal} onHide={() => { setShowPasswordModal(false); setInputPassword(''); }}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            label="Password"
            variant="filled"
            type={showPasswordInModal ? 'text' : 'password'}
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordInModal}
                    edge="end"
                  >
                    {showPasswordInModal ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowPasswordModal(false); setInputPassword(''); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Filter Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormControl fullWidth>
                <InputLabel>Name</InputLabel>
                <Select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
                    <MenuItem value="">All Names</MenuItem>
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginTop: 20 }}>
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <MenuItem value="">All Months</MenuItem>
                    {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem key={i} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleFilter} variant="primary">Apply Filter</Button>
            <Button onClick={() => setShowFilterModal(false)} variant="secondary">Close</Button>
        </Modal.Footer>
      </Modal>
      </div>
      
    
  );
}

export default OTRequest;

  