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
import { hashPassword } from './hashPassword';


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
        ots.push({id: item.id,date:item.date, name: item.name,time:item.time, state:item.state1});
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
    firestore.updateOT(companyId,selectID,item,allowSuc,allowUnsuc)
  }

  const getOTUnsuc =(error)=>{

  }

  const getOT=(id)=>{
    setSelectID(id)
    firestore.getOT(companyId,id,getOTSuc,getOTUnsuc)
  }

  useEffect(() => {
    firestore.getAllOT(companyId,getAllOTSuccess,getAllOTUnsuccess)
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
    setFilteredUsers(filtered);
  };

   // Convert date string (dd/MM/yyyy) to Date object for sorting
   const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  // Sort data by date
  const sortData = (order, setData, data) => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
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

  const handleClickShowPasswordInModal = () => setShowPasswordInModal((show) => !show);

  const handlePasswordSubmit = async() => {
    const hashedPass = await hashPassword(inputPassword)
    if (hashedPass === userData.password) {
      let item={
        status:false,
        status1:false,
      }
      firestore.updateOT(companyId,selectID,item,allowSuc,allowUnsuc)
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
            <h1>คำขอทำ OT</h1>
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
                      <th onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                        วันที่ {sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th onClick={toggleNameSortOrder} style={{ cursor: 'pointer' }}>
                        ชื่อ-สกุล {nameSortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope='col'>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                  // {filteredUsers.map((item, index) => (
                    <tr key={item.id} onClick={()=>getOT(item.id)}> 
                      <th scope="row">{startIndex + index + 1}</th>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td>
                        {item.date}
                      </td>
                      <td>{item.name}</td>
                      {/* <td>{item.time}</td> */}
                      {item.state ? (
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
      </div>
      
    
  );
}

export default OTRequest;

  