import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import './Profile.css';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import firestore from './Firebase/Firestore';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IoSearchOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Layout from './Layout';

const positions = [
  {
    value: '',
    label: 'None',
  },
  {
    value: 'SW',
    label: 'Software Engineer',
  },
  {
    value: 'EE',
    label: 'Electical Engineer',
  },
  {
    value: 'MEC',
    label: 'Mechanical',
  },
];

function ProfileManage() {
  const navigate = useNavigate();
  const [allUser,setAllUser] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [showDel, setShowDel] = useState(false);
  const [selectID, setSelectID] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [showFillter,setShowFillter] = useState(false);
  const [selectFillter,setSelectFillter] = useState('');
  const [position,setPosition] = useState('');
  
  const getAllUsersSuccess=(doc)=>{
    let users = []
    if (allUser.length === 0) {
        
      doc.forEach((item) => {
        users.push({id: item.id, name: item.name, position: item.position});
      });
      setAllUser(users);
      setFilteredUsers(users);
    }
  }

  const getAllUsersUnsuccess=(error)=>{
    console.log("getAllUsers: "+error)
  }
  
  const handleFillterClose = () => setShowFillter(false);
  const handleFilterShow = () => { 
    setShowFillter(true);
  }

  const handleDelClose = () => setShowDel(false);
  const handleDelShow = (id) => {
    setSelectID(id)
    setShowDel(true);
  }

  const Delete =()=>{
    firestore.deleteUser(selectID)
    firestore.deleteUsername(selectID)
    //console.log('Del'+selectID)
    handleDelClose()
  }

  const onAdd =()=>{
    navigate('/profile_add');
  }

  const onEdit =(id)=>{
    navigate('/profile_edit',{state:{uid:id}})
  }

  useEffect(() => {
    firestore.getAllUser(getAllUsersSuccess,getAllUsersUnsuccess)
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
    const filtered = allUser.filter(user => user.name.toLowerCase().includes(query) || 
      user.position.toLowerCase().includes(query));
    setFilteredUsers(filtered);
  };

  const handleFillter = () => {
    const query = position.toLowerCase();
    //setSearch(event.target.value);
    setSearchQuery(query);
    const filtered = allUser.filter(user => user.position.toLowerCase().includes(query) );
    setFilteredUsers(filtered);
    setShowFillter(false)
  };

  return (
    
      <div className="dashboard">
        <Layout />
        
        <main className="main-content">
          
          <div className="main">
          <div className='header-page'>
          <header>
            <h1 >จัดการประวัติพนักงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div className="main-contain">

              <div className="search-field">
                {/* <p style={{marginTop:17}}>ค้นหาพนักงาน</p> */}
                <input style={{width:'95%',margin:5,height:40,borderRadius:5,paddingInlineStart:10,fontSize:22}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:10}}>
                <button className='fillter-button' onClick={()=>handleFilterShow()}><IoFilterOutline size={20} /></button>
                <button className='Add-button' onClick={onAdd}>เพิ่มพนักงาน</button>
              </div>
              
              <div style={{width:'95%',alignSelf:'center'}}>
              <TableBootstrap striped bordered hover className='table'>
                <thead>
                  <tr>
                    <th scope="col">ลำดับ</th>
                    <th scope="col">ชื่อ-สกุล</th>
                    <th scope="col">ตำแหน่ง</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {/*{allUser.slice(startIndex, endIndex).map((item, index) => (*/}
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row">{startIndex + index + 1}</th>
                      {/* <th scope="row" style={{width:80}}>{index + 1}</th> */}
                      <td>
                        {item.name}
                      </td>
                      <td>{item.position}</td>
                      <td style={{width:'30%',textAlign:'center'}}>
                        <button className='Edit-button' onClick={()=>onEdit(item.id)}>แก้ไขประวัติ</button>
                        <button className='Delete-button' onClick={()=>handleDelShow(item.id)}>ลบประวัติ</button>
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
        <Modal show={showDel} onHide={handleDelClose}>
        <Modal.Header closeButton>
          <Modal.Title>ลบข้อมูลพนักงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>ยืนยันจะลบข้อมูลพนักงานหรือไม่</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black'}} onClick={Delete}>
            OK
          </Button>
          <Button variant="secondary" style={{backgroundColor:'#343434'}} onClick={handleDelClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFillter} onHide={handleFillterClose}>
        <Modal.Header closeButton>
          <Modal.Title>เลือกข้อมูลที่ต้องการกรอง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <TextField
                    id="filled-select"
                    select
                    label="ตำแหน่ง"
                    variant="filled"
                    style={{width:300,marginRight:10}}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    {positions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black'}} onClick={handleFillter}>
            OK
          </Button>
          <Button variant="secondary" style={{backgroundColor:'#343434'}} onClick={handleFillterClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      
    
  );
}

export default ProfileManage;

  