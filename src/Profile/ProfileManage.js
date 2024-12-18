import React, { useState, useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import '../Home.css';
import Sidebar from '../sidebar';
import '../Profile.css';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate,useLocation } from 'react-router-dom';
import firestore from '../Firebase/Firestore';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IoSearchOutline, IoPencil, IoTrash, IoPerson, IoBarChart, IoNotifications } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Layout from '../Layout';
import { UserContext } from '../UserContext';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

function ProfileManage() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [name,setName] = useState('');
  const [sortOrderName, setSortOrderName] = useState('asc'); // Track sorting order for names

  const [positionOptions, setPositionOptions] = useState([]);
  const { account, companyId } = useContext(UserContext);
  
  const getAllUsersSuccess=(doc)=>{
    let users = []
    if (allUser.length === 0) {
        
      doc.forEach((item) => {
        if(item.position != 'tester')
          users.push({id: item.id, name: item.name, position: item.position});
      });
      setAllUser(users);
      applyFilters(users);
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
  const handleDelShow = (id,name) => {
    setSelectID(id)
    setName(name)
    setShowDel(true);
  }

  const Delete =()=>{
    if(selectID != '8H1ETSH8pE0s7lvKeLzk'){
      firestore.deleteUser(companyId,selectID)
      firestore.deleteUsername(companyId,selectID)
    }
    else{
      console.log('not Del!')
    }
    //console.log('Del'+selectID)
    handleDelClose()
  }

  const onAdd =()=>{
    console.log(account)
    navigate('/profile_add',{state:{startIndex, endIndex, search,
      searchQuery,
      position,}});
  }

  const onEdit =(id)=>{
    navigate('/profile_edit',{state:{uid:id,startIndex, endIndex,  search,
      searchQuery,
      position,}})
  }

  const onRole =(id)=>{
    navigate('/profile_role',{state:{uid:id,startIndex, endIndex,  search,
      searchQuery,
      position,}})
  }

  const onUpSkill =(id)=>{
    navigate('/profile_upskill',{state:{uid:id,startIndex, endIndex,  search,
      searchQuery,
      position,}})
  }

  const onNotice =(id)=>{
    navigate('/profile_notice',{state:{uid:id,startIndex, endIndex,  search,
      searchQuery,
      position,}})
  }

  const fetchDropdownOptions = async () => {
    try {
      
      const positionOptions = await firestore.getDropdownOptions(companyId,'position');
      setPositionOptions(positionOptions.map(option => option.name));
      //console.log(positionOptions)
      
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const applyFilters = (users) => {
    let filtered = users || allUser;
    if (searchQuery) {
      filtered = filtered.filter(user => user.name.toLowerCase().includes(searchQuery) || user.position.toLowerCase().includes(searchQuery));
    }
    if (position) {
      filtered = filtered.filter(user => user.position.toLowerCase().includes(position.toLowerCase()));
    }
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (location.state && location.state.startIndex !== undefined) {
      setStartIndex(location.state.startIndex);
      setEndIndex(location.state.endIndex);
      setSearch(location.state.search || '');
      setSearchQuery(location.state.searchQuery || '');
      setPosition(location.state.position || '');
    } else {
      setStartIndex(0); // Default to first page if no state is provided
      setEndIndex(10);
    }
    firestore.getAllUser(companyId,getAllUsersSuccess,getAllUsersUnsuccess)
    fetchDropdownOptions();
  }, [location.state]);

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
    applyFilters(allUser); // Reapply filters whenever search changes
  };

  const handleFillter = () => {
    applyFilters(allUser); // Apply filters when filter button is clicked
    setShowFillter(false);
  };

  // Sorting function for names
  const sortByName = () => {
    const newOrder = sortOrderName === 'asc' ? 'desc' : 'asc';
    setSortOrderName(newOrder);
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return newOrder === 'asc' ? (nameA < nameB ? -1 : 1) : (nameA > nameB ? -1 : 1);
    });
    setFilteredUsers(sortedUsers);
  };

  return (
    
      <div className="dashboard">
        <Layout />
        
        <main className="main-content">
          
          <div className="main">
          <div className='header-page'>
          <header>
            <h1 >การจัดการข้อมูลพนักงาน</h1>
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
              <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:10,width:'95%',alignSelf:'center'}}>
                <button className='fillter-button' onClick={()=>setShowFillter(true)}><IoFilterOutline size={20} /></button>
                <button className='Add-button' onClick={onAdd}>เพิ่มพนักงาน</button>
              </div>
              
              <div style={{width:'95%',alignSelf:'center'}}>
              <TableBootstrap striped bordered hover className='table'>
                <thead>
                  <tr>
                    <th scope="col">ลำดับ</th>
                    <th scope="col" onClick={sortByName} style={{ cursor: 'pointer' }}>
                      ชื่อ-สกุล {sortOrderName === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </th>
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
                      <td style={{width:'50%',textAlign:'center'}}>
                        <button className='Edit-button' onClick={()=>onEdit(item.id)} title="แก้ไข"><IoPencil size={20} /></button>
                        <button className='Delete-button' onClick={()=>handleDelShow(item.id,item.name)} title="ลบ"><IoTrash size={20} /></button>
                        <button className='Role-button' onClick={()=>onRole(item.id)} title="Role"><IoPerson size={20} /></button>
                        <button className='UpSkill-button' onClick={()=>onUpSkill(item.id)} title="Up Skill"><IoBarChart size={20} /></button>
                        <button className='Notice-button' onClick={()=>onNotice(item.id)} title="My Notice"><IoNotifications size={20} /></button>
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
          <h5>ยืนยันจะลบข้อมูลพนักงาน {name} หรือไม่</h5>
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
                    SelectProps={{
                      displayEmpty: true,
                    }}
                  >
                     <MenuItem value="">None / Clear Filter</MenuItem>
                    {positionOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
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

  