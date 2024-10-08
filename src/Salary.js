import React,{useState,useEffect,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import firestore from './Firebase/Firestore';
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';
import { UserContext } from './UserContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { hashPassword } from './hashPassword';

function Salary() {
  const navigate = useNavigate();
  const [allUser,setAllUser] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [selectID, setSelectID] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const { setCurrentUser, companyId, userData } = useContext(UserContext);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  const calSalary=(id)=>{
    navigate('/salary_list',{state:{uid:id}})
  }

  useEffect(() => {
    setShowPasswordModal(true);
    //firestore.getAllUser(companyId,getAllUsersSuccess,getAllUsersUnsuccess)
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
    const filtered = allUser.filter(user => user.name.toLowerCase().includes(query));
    setFilteredUsers(filtered);
  };

  const handlePasswordSubmit = async () => {
    const hashedInputPassword = await hashPassword(inputPassword); // Hash the entered password
    if (hashedInputPassword === userData.password) {
      setPasswordError('');
      setShowPasswordModal(false); // Close modal on correct password
      firestore.getAllUser(companyId, getAllUsersSuccess, getAllUsersUnsuccess);
    } else {
      setPasswordError('Incorrect password, please try again.');
    }
  };

  const handleClickShowPasswordInModal = () => setShowPasswordInModal(!showPasswordInModal);

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    navigate(-1); // Redirect to the previous page
  };

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div class="main">
            <div className='header-page'>
            <header>
              <h1>การจัดการเงินเดือน</h1>
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
              
      
              <div style={{width:'95%',alignSelf:'center',marginTop:20}}>
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
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                  // {filteredUsers.map((item, index) => (
                    <tr key={item.id} onClick={()=>calSalary(item.id)}>
                      <th scope="row">{startIndex + index + 1}</th>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td>
                        {item.name}
                      </td>
                      <td>{item.position}</td>
                      <td style={{width:'20%',textAlign:'center'}}>
                        
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
        {/* Password Modal */}
        <Modal show={showPasswordModal} onHide={handleCloseModal}>
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
            <Button variant="secondary" onClick={handleCloseModal}>
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

export default Salary;

  