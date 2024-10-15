import React,{useEffect,useState,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import firestore from './Firebase/Firestore';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { IoSearchOutline, IoArrowDown, IoArrowUp } from "react-icons/io5";
import Layout from './Layout';
import { UserContext } from './UserContext';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import { TextField} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { hashPassword } from './hashPassword';


function LeaveRequest() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [allLeave, setAllLeave] = useState([]);
  const [selectID,setSelectID] = useState('');
  const [uid,setUid] = useState('');
  const [name,setName] = useState('');
  const [type,setType] = useState('');
  const [detail,setDetail] = useState('');
  const [phone,setPhone] = useState('');
  const [dateStart,setDateStart] = useState('');
  const [dateEnd,setDateEnd] = useState('');
  const [amount,setAmount] = useState('');
  const [state,setState] = useState('') //CMS
  const [state1,setState1] = useState(''); //App
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [imageURLs, setImageURLs] = useState([]);
  const { setCurrentUser, companyId,setNewLeaveRequests,newLeaveRequests,userData } = useContext(UserContext);

  const [sortOrder, setSortOrder] = useState('desc'); // State to track sorting order for dates
  const [nameSortOrder, setNameSortOrder] = useState('asc');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);

  const getAllLeaveSuccess=(doc)=>{
    let leaves = []
    if (allLeave.length === 0) {
      console.log(doc)
      doc.forEach((item) => {
        leaves.push({id: item.id,date:item.date, name: item.name, state1:item.state1});
      });
      setAllLeave(leaves);
      setFilteredUsers(leaves);
    }
  }

  const getAllLeaveUnsuccess=(error)=>{
    console.log("getAllLeave: "+error)
  }

  const handleClose = () => setShow(false);
  const handleShow = () =>{

    setShow(true);
  } 

  const getLeaveSuc=(data)=>{
    let user = data.user.substring(3)
    setUid(user)
    setName(data.name)
    setType(data.types)
    setDetail(data.detail)
    setPhone(data.phone)
    setDateStart(data.dateStart)
    setDateEnd(data.dateEnd)
    setAmount(data.amount)
    setState(data.state)
    setState1(data.state1)
    setImageURLs(data.fileURLs || []);
    handleShow()
  }

  const getLeaveUnsuc=(error)=>{
    console.log(error)
  }

  const getLeave=(id)=>{
    setSelectID(id)
    firestore.getLeave(companyId,id,getLeaveSuc,getLeaveUnsuc)
  }

  const allowSuc =()=>{
    handleClose()
  }

  const allowUnsuc=(error)=>{

  }

  const onAllow = async (leaveId, userId, leaveType, leaveAmount) => {
    try {
      const welthfareData = await fetchWelthfare(userId);
  
      let remainingDays = 0;
      let updatedData = {};
  
      switch (leaveType) {
        case 'ลากิจ':
          remainingDays = welthfareData.absenceR - leaveAmount;
          if (remainingDays < 0) {
            alert("ไม่เหลือวันลากิจ");
            // return;
          }
          updatedData.absenceR = remainingDays;
          break;
        case 'ลาป่วย':
          remainingDays = welthfareData.sickR - leaveAmount;
          if (remainingDays < 0) {
            alert("ไม่เหลือวันลาป่วย");
            // return;
          }
          updatedData.sickR = remainingDays;
          break;
        case 'ลาพักร้อน':
          remainingDays = welthfareData.holidayR - leaveAmount;
          if (remainingDays < 0) {
            alert("ไม่เหลือวันลาพักร้อน");
            // return;
          }
          updatedData.holidayR = remainingDays;
          break;
        case 'ลาคลอด':
          remainingDays = welthfareData.maternityR - leaveAmount;
          if (remainingDays < 0) {
            alert("ไม่เหลือวันลาคลอด");
            // return;
          }
          updatedData.maternityR = remainingDays;
          break;
        case 'ลาบวช':
          remainingDays = welthfareData.kamaR - leaveAmount;
          if (remainingDays < 0) {
            alert("ไม่เหลือวันลาบวช");
            // return;
          }
          updatedData.kamaR = remainingDays;
          break;
        default:
          remainingDays = welthfareData.otherR - leaveAmount;
          if (remainingDays < 0) {
            alert("ไม่เหลือวันลาประเภทอื่น");
            // return;
          }
          updatedData.otherR = remainingDays;
          break;
      }
  
      // Proceed with updating leave and welthfare if leave days are available
      console.log(updatedData)
      await updateLeaveAndWelthfare(leaveId, userId, updatedData);
    } catch (error) {
      console.error("Error processing leave request:", error);
    }
  };

  const updateLeaveAndWelthfare = async (leaveId, userId, updatedWelthData) => {
    try {
      // First, update the leave request status
      await firestore.updateLeave(companyId, leaveId, { state1: true },allowSuc,allowUnsuc);
  
      // Then, update the user's remaining leave days in the welthfare collection
      await firestore.updateWelth(companyId, userId, updatedWelthData,allowUnsuc);
  
      alert("Leave approved and remaining days updated successfully!");
    } catch (error) {
      console.error("Error updating leave and welthfare:", error);
      alert("Error processing leave request.");
    }
  };

  const fetchWelthfare = async (userId) => {
    console.log("companyId: ", companyId, "userId: ", userId);  // Log companyId and userId
    return new Promise((resolve, reject) => {
      firestore.getWelth(companyId, userId, (data) => {
        console.log("Fetched welthfare data: ", data);  // Log fetched data
        resolve(data);  // Resolve the promise with fetched data
      }, (error) => {
        console.error("Error fetching welthfare data: ", error);
        reject(error);
      });
    });
  };

  useEffect(() => {
    // Reset the new leave requests notification when entering this component
    if (newLeaveRequests) {
      console.log('check state')
      setNewLeaveRequests(false);
    }
  }, []);

  useEffect(() => {
    // Fetch all leave data from Firestore
    firestore.getAllLeave(companyId, (data) => {
      setAllLeave(data);
      sortData(sortOrder, setFilteredUsers, data); // Initially sort by date
      if (data.length > 0  && data.state1 == false) {
        console.log('check state')
        setNewLeaveRequests(true);  // Only set to true if there are new requests
      }
    }, console.error);

    
  }, [companyId, sortOrder,]);

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
    const filtered = allLeave.filter(user => user.name.toLowerCase().includes(query));
    setFilteredUsers(filtered);
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  // Sort the data based on the date (toggle between ascending and descending)
  const sortData = (order, setData, data) => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setData(sortedData);
  };

  // Sort the data based on names (toggle between ascending and descending)
  const sortByName = (order, setData, data) => {
    const sortedData = [...data].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return order === 'asc' ? -1 : 1;
      if (nameA > nameB) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  // Toggle sorting order for dates
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortData(newOrder, setFilteredUsers, allLeave);
  };

  // Toggle sorting order for names
  const toggleNameSortOrder = () => {
    const newOrder = nameSortOrder === 'asc' ? 'desc' : 'asc';
    setNameSortOrder(newOrder);
    sortByName(newOrder, setFilteredUsers, allLeave);
  };

  const handleClickShowPasswordInModal = () => setShowPasswordInModal((show) => !show);

  const handlePasswordSubmit = async() => {
    const hashedPass = await hashPassword(inputPassword)
    if (hashedPass === userData.password) {
      firestore.updateLeave(companyId,selectID,{state:false,state1:false,deny:true,exp:new Date()},handleClose,(e)=>console.log(e))
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

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div class="main">
          <div className='header-page'>
          <header>
            <h1>การขอลางาน</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div class="main-contain">
            <div className="search-field">
                {/* <p style={{marginTop:17}}>ค้นหาพนักงาน</p> */}
                <input style={{width:'95%',margin:5,height:40,borderRadius:5,paddingInlineStart:10,fontSize:22,alignSelf:'center',justifyContent:'center'}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              
              
                
                <div style={{width:'95%',alignSelf:'center'}}>
                
                <TableBootstrap striped bordered hover className='table' style={{marginTop:20}}>
                  <thead>
                    <tr>
                      <th scope="col">ลำดับ</th>
                      <th scope="col" onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                        วันที่ {sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope="col" onClick={toggleNameSortOrder} style={{ cursor: 'pointer' }}>
                        ชื่อ-สกุล {nameSortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope="col">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/* {filteredUsers.slice(startIndex, endIndex).map((item, index) => ( */}
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                    <tr key={item.id} onClick={()=>getLeave(item.id)}>
                      <th scope="row">{startIndex + index + 1}</th>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td>
                        {item.date}
                      </td>
                      <td>{item.name}</td>
                      {item.state1 ? (
                        <td>allowed</td>
                      ) : (
                        <td>not allowed</td>
                      )}
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
          <Modal.Title style={{ fontSize: '24px' }}>รายละเอียดการขอลางาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>ชื่อ - นามสกุล</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="text"
                value={name}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ fontSize: '20px' }}>ประเภทการลา</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="text"
                value={type}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>ลาเนื่องจาก</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="text"
                value={detail}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>เบอร์โทรติดต่อ</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="text"
                value={phone}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>ลาตั้งแต่วันที่</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="text"
                value={dateStart}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>ลาถึงวันที่</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="text"
                value={dateEnd}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>รวมวันลาที่ต้องการลา</Form.Label>
              <Form.Control
                style={{ fontSize: '18px' }}
                type="text"
                value={amount}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>เอกสารแนบ</Form.Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {imageURLs.map((url, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`attachment-${index}`}
                      style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '10px', objectFit: 'contain' }}
                    />
                  </a>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{ backgroundColor: '#D3D3D3', color: 'black',fontSize:20 }} 
          disabled={state1} onClick={()=>onAllow(selectID,uid,type,amount)}>
            Allow
          </Button>
          <Button variant="secondary" style={{ backgroundColor: '#343434',fontSize:20, }} onClick={
            handleClick
            // firestore.updateLeave(companyId,selectID,{state:false,state1:false,deny:true},handleClose,(e)=>console.log(e))
          }>
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
      </div>
      
    
  );
}

export default LeaveRequest;

  