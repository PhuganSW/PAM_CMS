import React, { useState, useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import './Profile.css';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import firestore from './Firebase/Firestore';
import storage from './Firebase/Storage'
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
import LocationPickerMap from './LocationPickerMap';

function ManagePeople() {
  const navigate = useNavigate();

  const [allUser,setAllUser] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [show, setShow] = useState(false);
  const [showManageWP, setShowManageWp] = useState(false);
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
  const [lat,setLat] = useState(null);
  const [lon,setLon] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const { setCurrentUser, companyId } = useContext(UserContext);
  const [leader,setLeader] = useState('');
  const [leaderId,setLeaderId] = useState('');
  const [leaders, setLeaders] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);  // Add state for selected image
  const [uploading, setUploading] = useState(false);  // State to handle uploading status
  const [workplaceImageUrl, setWorkplaceImageUrl] = useState(null);

  const handleClose = () => setShow(false);
  const handleCloseWP = () => {
    setShowManageWp(false);
    setShowWorkPlace('')
  }
  const handleShow = async (user) =>{
    let Leader = []
    let WP = ''
    await firestore.getLeader(companyId,user.id,(data,wp)=>{Leader.push(data)
    WP = wp.workplace})
    setShowWorkPlace(WP)
    setLeaderId(Leader[0].leadId)
    setSelectedUser(user);
    setShow(true);
  } 

  const handleShowWP = () =>{
    setShowWorkPlace('');
    setLat('');
    setLon('');
    setWorkplaceImageUrl(null)
    setShowManageWp(true);
  } 

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onAssign = async () => {
    if (selectedUser && showWorkPlace && leader) {

        firestore.assignWork(companyId, showWorkPlace, selectedUser.id, {
            username: selectedUser.name,
            position: selectedUser.position,
        },{workplace:showWorkPlace}, () => {
            alert("Workplace assigned successfully!");
            handleClose();
        }, (error) => {
            alert("Error assigning workplace: " + error);
        });
        firestore.addLeader(companyId,selectedUser.id,{leadId:leaderId,name:leader})
    } else {
        alert("Please select a workplace and leader.");
    }
  };

  const onManageWP = async () => {
    if (showWorkPlace) {
      let imageUrl = null || workplaceImageUrl;

      if (selectedImage) {
        setUploading(true);
        imageUrl = await storage.uploadWorkplaceImg(selectedImage, `${companyId}/workplace_images/${showWorkPlace}`);
        setUploading(false);
      }
        firestore.ManageWP(companyId, showWorkPlace, {
            imageUrl: imageUrl,  // Save the image URL in Firestore
            lat:lat || null,
            lon:lon || null
        }, () => {
            alert("Workplace update successfully!");
            handleCloseWP();
        }, (error) => {
            alert("Error assigning workplace: " + error);
        });
    } else {
        alert("Error assigning workplace: ");
    }
  };


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

  const fetchWorkplaceImage = async (workplaceId) => {
    try {
      const workplaceDoc = await firestore.getWorkplaceDoc(companyId, workplaceId);
      if (workplaceDoc.exists()) {
        const imageUrl = workplaceDoc.data().imageUrl || null;
        setWorkplaceImageUrl(imageUrl); // Set the image URL
        setLat(workplaceDoc.data().lat || '')
        setLon(workplaceDoc.data().lon || '')
      } else {
        setWorkplaceImageUrl(null); // Clear if no image
        console.log("No image URL found for this workplace.");
      }
    } catch (error) {
      console.error('Error fetching workplace image:', error);
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

  useEffect(() => {
    const getLeadersSuccess = (leaders) => {
      setLeaders(leaders); // Store the leaders in state
    };
  
    const getLeadersUnsuccess = (error) => {
      console.error("Error fetching leaders: ", error);
    };
  
    const unsubscribeLeaders = firestore.getAllLeaders(companyId, getLeadersSuccess, getLeadersUnsuccess);
  
    return () => {
      unsubscribeLeaders(); // Cleanup on unmount
    };
  }, [companyId]);

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

  const handleWorkplaceChange = async (event,{ updateWorkplace = false, updateShowWorkPlace = false }) => {
    const selectedWorkplace = event.target.value;
    if (updateWorkplace) {
      setWorkplace(selectedWorkplace);
    }
    if (updateShowWorkPlace) {
      setShowWorkPlace(selectedWorkplace);
    }
   
    if (unsubscribe) {
        unsubscribe();
    }
  
    if(updateWorkplace){
      const unsubscribeFn = firestore.getUsersByWorkplace(
        companyId,
        selectedWorkplace,
        getUsersByWorkplaceSuccess,
        getUsersByWorkplaceUnsuccess
    );
  
    setUnsubscribe(() => unsubscribeFn);
    }
    
    await fetchWorkplaceImage(selectedWorkplace); 
  };

  const openLargeImage = () => {
    if (workplaceImageUrl) {
      window.open(workplaceImageUrl, '_blank');
    }
  };

  const onLocationSelect = (lat, lon) => {
    setLat(lat);
    setLon(lon);
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
                  <button className='Previous-button' style={{marginLeft:0}} onClick={onPrevious}>Previous</button>
                  <button className='Next-button' onClick={onNext}>Next</button>
                </div>
                <div className="form-row" style={{ display: 'flex', marginBottom: '20px',marginTop:20 }} >
                  
                    <Button style={{textAlign: 'center',width:'20%',marginRight:'0.5%',fontSize:20 }} onClick={()=>handleShowWP()} >
                      จัดการพื้นที่
                    </Button>
                  
                  <TextField
                    className="form-field"
                    id="filled-select"
                    select
                    label="พื้นที่ทำงาน"
                    variant="filled"
                    style={{ width: '79%' }}
                    value={workplace}
                    onChange={(e) => handleWorkplaceChange(e, { updateWorkplace: true })}
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
                    {/* <th scope="col"></th> */}
                  </tr>
                </thead>
                <tbody>
                {workplaceUsers.map((user, index) => (
                      <tr key={user.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{user.username}</td>
                        <td>{user.position}</td>
                        {/* <td style={{width:'30%',textAlign:'center'}}>
                          
                        </td> */}
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
        {/* assignWP */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>การมอบหมายงาน: {selectedUser?selectedUser.name:''}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormControl variant="filled" fullWidth>
                <InputLabel>พื้นที่ทำงาน</InputLabel>
                <Select value={showWorkPlace} onChange={(e) => setShowWorkPlace(e.target.value)}>
                  {workplaces.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: 22, marginTop: 15 }}>หัวหน้างาน</Form.Label>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>หัวหน้างาน</InputLabel>
                  <Select
                    value={leaderId} // Set value to leaderId for tracking
                    onChange={(e) => {
                      const selectedLeader = leaders.find((leader) => leader.id === e.target.value);
                      setLeader(selectedLeader?.name || ''); // Set the leader's name
                      setLeaderId(selectedLeader?.id || ''); // Set the leader's id
                    }}
                  >
                    {leaders.map((leader, index) => (
                      <MenuItem key={index} value={leader.id}>
                        {leader.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" style={{ backgroundColor: '#D3D3D3', color: 'black' }} onClick={onAssign} disabled={uploading}>
             Assign
            </Button>
            <Button variant="secondary" style={{ backgroundColor: '#343434' }} onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* showManageWP */}
        <Modal show={showManageWP} onHide={handleCloseWP}>
          <Modal.Header closeButton>
            <Modal.Title>Manage Workplace</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormControl variant="filled" fullWidth>
                <InputLabel>พื้นที่ทำงาน</InputLabel>
                {/* On changing the workplace, handleWorkplaceChange is called */}
                <Select value={showWorkPlace} onChange={(e) => handleWorkplaceChange(e, { updateShowWorkPlace: true })}>
                  {workplaces.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div style={{ marginTop: '15px' }}>
                <Form.Label>พิกัด (Latitude, Longitude)</Form.Label>
                <LocationPickerMap lat={lat} lon={lon} showSearch={true} onLocationSelect={onLocationSelect} />
              </div>

              {/* Display the current latitude and longitude */}
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ marginTop: 15 }}>
                <Form.Label>พิกัด Latitude</Form.Label>
                <Form.Control value={lat} onChange={(e) => setLat(e.target.value)} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>พิกัด Longitude</Form.Label>
                <Form.Control value={lon} onChange={(e) => setLon(e.target.value)} readOnly />
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{marginTop:15}}>
              <Form.Label>พิกัด latitude</Form.Label>
              <Form.Control
                
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>พิกัด longtitude</Form.Label>
                <Form.Control
                  
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                />
              </Form.Group> */}

              {/* If workplaceImageUrl exists, show the image */}
              {workplaceImageUrl && (
                <div className="image-container mt-3">
                  <img
                    src={workplaceImageUrl}
                    alt="Workplace"
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={openLargeImage} // Clicking opens the image in a new tab
                  />
                </div>
              )}

              <Form.Group controlId="formFile" className="mt-3">
                <Form.Label>แนบรูปภาพ</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              style={{ backgroundColor: '#D3D3D3', color: 'black' }}
              disabled={uploading}
              onClick={onManageWP}
            >
              {uploading ? 'กำลังอัพโหลด...' : 'Save'}
            </Button>
            <Button variant="secondary" style={{ backgroundColor: '#343434' }} onClick={handleCloseWP}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      
      </div>
      
    
  );
}

export default ManagePeople;

  