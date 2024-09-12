import React,{useState,useEffect,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';
import './Profile.css';
import './checkHis.css'
import firestore from './Firebase/Firestore';
import { AiOutlineEdit } from "react-icons/ai";
import { Select, FormControl, InputLabel } from '@mui/material';
import Form from 'react-bootstrap/Form';
import MenuItem from '@mui/material/MenuItem';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { UserContext } from './UserContext';

function CheckHistory() {

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredOut, setFilteredOut] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [uid,setUid] = useState('')
  const [name,setName] = useState('');
  const [date,setDate] = useState('');
  const [time,setTime] = useState('');
  const [late,setLate] = useState('');
  const [id,setID] = useState('');
  const [allIN,setAllIn] = useState('');
  const [allOut,setAllOut] = useState('');
  const [show, setShow] = useState(false);
  const [workplace,setWorkplace] =useState('');
  const [selectFillter,setSelectFillter] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [outStartIndex, setOutStartIndex] = useState(0);
  const [outEndIndex, setOutEndIndex] = useState(10);

  const [workplaces,setWorkplaces] = useState([]);
  const { setCurrentUser, companyId } = useContext(UserContext);

  const handleClose = () => setShow(false);
  const handleShow = (uid,date,time,workplace) =>{
    
    setUid(uid);
    setDate(date)
    setTime(time)
    setWorkplace(workplace)
    setShow(true);
  } 


  const getInSuc=(doc)=>{
    console.log(doc)
    let ins = []
    if (allIN.length === 0) {
        
      doc.forEach((item) => {
        ins.push({id: item.id,uid:item.user,date:item.date, name: item.name, time: item.time,});
      });
      setAllIn(ins);
      setFilteredUsers(ins);
    }
  }

  const getOutSuc=(doc)=>{
    let outs = []
    if (allOut.length === 0) {
        
      doc.forEach((item) => {
        outs.push({id: item.id,uid:item.user,date:item.date, name: item.name, time: item.time,});
      });
      setAllOut(outs);
      setFilteredOut(outs);
    }
  }

  const getInUnsuc=(e)=> console.log(e)
  const getOutUnsuc=(e)=> console.log(e)

  const onNextIn = () => {
    setStartIndex(startIndex + 10);
    setEndIndex(endIndex + 10);
  };

  const onPreviousIn = () => {
    setStartIndex(Math.max(startIndex - 10, 0));
    setEndIndex(Math.max(endIndex - 10, 10));
  };

  const onNextOut = () => {
    setOutStartIndex(outStartIndex + 10);
    setOutEndIndex(outEndIndex + 10);
  };

  const onPreviousOut = () => {
    setOutStartIndex(Math.max(outStartIndex - 10, 0));
    setOutEndIndex(Math.max(outEndIndex - 10, 10));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(event.target.value);
    setSearchQuery(query);
    const filtered = allIN.filter(user => user.name.toLowerCase().includes(query));
    const filtered1 = allOut.filter(user => user.name.toLowerCase().includes(query));
    setFilteredUsers(filtered);
    setFilteredOut(filtered1);
  };

  const fetchDropdownOptions = async () => {
    try {
      const workplaces = await firestore.getDropdownOptions(companyId,'workplace');
      setWorkplaces(workplaces.map(option => option.name));
      
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  useEffect(() => {
    firestore.getAllCheckin(companyId,getInSuc,getInUnsuc)
    firestore.getAllCheckout(companyId,getOutSuc,getOutUnsuc)
    fetchDropdownOptions();
  }, []);

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
        
          <div class="main">
          <div className='header-page'>
          <header>
            <h1>ประวัติการเข้า-ออกงาน</h1>
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
              <div style={{width:'100%',alignSelf:'center'}}>
              <div className="table-container">
                
                <div className="table-section">
                <p className="table-title">เวลาเข้างาน</p>
                <TableBootstrap striped bordered hover className='table' style={{marginTop:10,width:'100%'}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/* {filteredUsers.slice(startIndex, endIndex).map((item, index) => ( */}
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={item.id}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>{item.workplace}</td>
                        <td><button style={{borderRadius:10}} onClick={()=>handleShow(item.uid,item.date,item.time,item.workplace)}><AiOutlineEdit /></button></td>
                      </tr>
                   ))}
                  </tbody>
                </TableBootstrap>
                <div>
                  <button className='Previous-button' style={{width:'20%'}} onClick={onPreviousIn}>Previous</button>
                  <button className='Next-button' style={{width:'20%'}} onClick={onNextIn}>Next</button>
                </div>
                </div>
                
                <div className="table-section">
                <p className="table-title">เวลาออกงาน</p>
                <TableBootstrap striped bordered hover style={{marginTop:10}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredOut.slice(outStartIndex, outEndIndex).map((item, index) => (
                      <tr key={item.id}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>{item.workplace}</td>
                        <td><button style={{borderRadius:10}} onClick={()=>handleShow(item.uid,item.date,item.time,item.workplace)}><AiOutlineEdit /></button></td>
                      </tr>
                   ))}
                  </tbody>
                </TableBootstrap>
                <div>
                  <button className='Previous-button' style={{width:'20%'}} onClick={onPreviousOut}>Previous</button>
                  <button className='Next-button' style={{width:'20%'}} onClick={onNextOut}>Next</button>
                </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </main>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '24px' }}>ข้อมูลเข้าออกงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>วันที่</Form.Label>
              <Form.Control
                autoFocus
                value={date}
                style={{ fontSize: '18px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: '20px' }}>เวลา</Form.Label>
              <Form.Control
                autoFocus
                value={time}
                style={{ fontSize: '18px' }}
              />
            </Form.Group>
          {/* <FormControl variant="filled" fullWidth>
              <InputLabel>พื้นที่ทำงาน</InputLabel>
              <Select
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
              >
                {workplaces.map((option,index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black',fontSize:20}} >
            Allow
          </Button>
          <Button variant="secondary" style={{backgroundColor:'#343434',fontSize:20}} onClick={handleClose}>
            Deny
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      
    
  );
}

export default CheckHistory;

  