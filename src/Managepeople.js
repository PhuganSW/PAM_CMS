import React, { useState, useEffect,useContext } from 'react';
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
import { Select, FormControl, InputLabel } from '@mui/material';
import Form from 'react-bootstrap/Form';
import { UserContext } from './UserContext';


function ManagePeople() {
  const navigate = useNavigate();

  const [allUser,setAllUser] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [show, setShow] = useState(false);
  const [selectID, setSelectID] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [workplaceUsers, setWorkplaceUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [selectFillter,setSelectFillter] = useState('');
  const [workplace,setWorkplace] =useState('');
  const [showWorkPlace,setShowWorkPlace] = useState('');
  const [workplaces,setWorkplaces] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const { setCurrentUser, companyId } = useContext(UserContext);


  const handleClose = () => setShow(false);
  const handleShow = (user) =>{
    setSelectedUser(user);
    setShow(true);
  } 

  const onAssign=()=>{
    console.log(showWorkPlace,selectedUser.id)
    if (selectedUser && workplace) {
      firestore.assignWork(companyId, showWorkPlace, selectedUser.id, {
        username: selectedUser.name,
        position: selectedUser.position
      }, () => {
        alert("Workplace assigned successfully!");
        handleClose();
      }, (error) => {
        alert("Error assigning workplace: " + error);
      });
    } else {
      alert("Please select a workplace.");
    }
  }


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

  const getUsersByWorkplaceSuccess = (users) => {
    setWorkplaceUsers(users);
  };

  const getUsersByWorkplaceUnsuccess = (error) => {
    console.error("Error fetching workplace users:", error);
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
    firestore.getAllUser(companyId,getAllUsersSuccess,getAllUsersUnsuccess);
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    return () => {
      if (unsubscribe) {
        console.log('Unsubscribing from previous listener');
        unsubscribe();
      }
    };
  }, [unsubscribe]);

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
    const filtered = allUser.filter(user => user.name.toLowerCase().includes(query) || 
      user.position.toLowerCase().includes(query));
    setFilteredUsers(filtered);
  };

  const handleWorkplaceChange = (event) => {
    const selectedWorkplace = event.target.value;
    setWorkplace(selectedWorkplace);
    try{
    if (unsubscribe) {
      unsubscribe(); // Unsubscribe from the previous listener
    }

    const unsubscribeFn = firestore.getUsersByWorkplace(
      companyId,
      selectedWorkplace,
      getUsersByWorkplaceSuccess,
      getUsersByWorkplaceUnsuccess
    );

    setUnsubscribe(() => unsubscribeFn);
  }catch{
    console.log('error')
  }
  };

  return (
    
      <div className="dashboard">
        <Layout />
        
        <main className="main-content">
          
          <div className="main">
          <div className='header-page'>
          <header>
            <h1 >จัดการกำลังคน</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div className="main-contain">
                {/* Add component for manage data of dropdown*/}
                <div style={{display:'flex',flexDirection:'column',alignSelf:'center',width:'95%',marginTop:30}}>
                <div className="search-field">
                {/* <p style={{marginTop:17}}>ค้นหาพนักงาน</p> */}
                <input style={{width:'100%',height:40,borderRadius:5,paddingInlineStart:10,fontSize:22}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              {/* <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:10,width:'95%',alignSelf:'center'}}>
          
                <button className='Add-button' >เพิ่มพนักงาน</button>
              </div> */}
              
              <div style={{width:'100%',alignSelf:'center',marginTop:20}}>
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
                        <button className='Edit-button' onClick={()=>handleShow(item)} >มอบหมาย</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableBootstrap>
                <div>
                  <button className='Previous-button' onClick={onPrevious}>Previous</button>
                  <button className='Next-button' onClick={onNext}>Next</button>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px',marginTop:20 }}>
                  <TextField
                    className="form-field"
                    id="filled-select"
                    select
                    label="พื้นที่ทำงาน"
                    variant="filled"
                    style={{ width: '100%' }}
                    value={workplace}
                    onChange={handleWorkplaceChange}
                  >
                    {workplaces.map((option,index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
                  </TextField>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px',}}>
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
                {workplaceUsers.map((user, index) => (
                      <tr key={user.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{user.username}</td>
                        <td>{user.position}</td>
                        <td style={{width:'30%',textAlign:'center'}}>
                          {/* Additional actions can go here */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </TableBootstrap>
                </div>
              </div>
          
            </div>
            </div>
          </div>
        </main>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>การมอบหมายงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <FormControl variant="filled" fullWidth>
              <InputLabel>พื้นที่ทำงาน</InputLabel>
              <Select
                value={showWorkPlace}
                onChange={(e) => setShowWorkPlace(e.target.value)}
              >
                {workplaces.map((option,index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black'}} onClick={onAssign}>
            Allow
          </Button>
          <Button variant="secondary" style={{backgroundColor:'#343434'}} onClick={handleClose}>
            Deny
          </Button>
        </Modal.Footer>
      </Modal>
      
      </div>
      
    
  );
}

export default ManagePeople;

  