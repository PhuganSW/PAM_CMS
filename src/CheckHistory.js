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
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material'
import LocationPickerMap from './LocationPickerMap';

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
  const [lat,setLat] = useState('');
  const [lon,setLon] = useState('');
  const [isInvalidArea,setIsInvalidArea] = useState(false)
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
  const [sortOrder, setSortOrder] = useState('desc'); // State to track sorting order
  const [sortOrderOut, setSortOrderOut] = useState('desc'); // For checkout sorting order
  const [isCheckin, setIsCheckin] = useState(true);

  const [workplaces,setWorkplaces] = useState([]);
  const [item,setItem] = useState([]);
  const { setCurrentUser, companyId } = useContext(UserContext);

  const handleClose = () => setShow(false);
  const handleShow = (uid,date,time,workplace,isCheckin,data) =>{
    setItem(data)
    setUid(uid);
    setDate(date)
    setTime(time)
    setWorkplace(workplace)
    setLat(data.lat)
    setLon(data.lon)
    setIsInvalidArea(data.isInvalidArea)
    setIsCheckin(isCheckin);
    setShow(true);
  } 

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
    const filtered = allIN.filter(user =>user.name?.toLowerCase().includes(query));
    const filtered1 = allOut.filter(user => user.name?.toLowerCase().includes(query));
    setFilteredUsers(filtered);
    setFilteredOut(filtered1);
  };

  const handleSave = async () => {
    const updatedData = {
      date:date,
      time:time,
      workplace:workplace || '',
    };

    console.log(`UID: ${uid}`);  // Debugging the UID

    if (isCheckin) {
      // Update check-in data
      firestore.updateCheckin(companyId, uid, updatedData, 
        () => alert("Check-in updated successfully!"), 
        (error) => console.error("Error updating check-in:", error)
      );
    } else {
      // Update check-out data
      firestore.updateCheckout(companyId, uid, updatedData, 
        () => alert("Check-out updated successfully!"), 
        (error) => console.error("Error updating check-out:", error)
      );
    }

    setShow(false);
  };

  const handleMove = async (item) => {
    try {
      const updatedData = {
        name:item.name,
        date: date,
        time: time,
        workplace: workplace || '',
        lat:item.lat,
        lon:item.lon,
        isInvalidArea:item.isInvalidArea,
        late:item.late || null,
        user:item.user,
      };

      if (isCheckin) {
        // Move data from check-in to check-out
        await firestore.updateCheckout(
          companyId,
          uid,
          updatedData,
          () => alert('Moved to check-out successfully!'),
          (error) => console.error('Error moving to check-out:', error)
        );
        firestore.deleteCheckin(companyId, uid, () => console.log('Check-in deleted successfully'), console.error);
      } else {
        // Move data from check-out to check-in
        await firestore.updateCheckin(
          companyId,
          uid,
          updatedData,
          () => alert('Moved to check-in successfully!'),
          (error) => console.error('Error moving to check-in:', error)
        );
        firestore.deleteCheckout(companyId, uid, () => console.log('Check-out deleted successfully'), console.error);
      }
      setShow(false);
    } catch (error) {
      console.error('Error moving data:', error);
    }
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
    fetchDropdownOptions();
    const unsubscribeIn = firestore.getAllCheckin(companyId, (inData) => {
      setAllIn(inData);
      sortData(sortOrder, setFilteredUsers, inData); // Ensure sorting after data update
    }, console.error);

    const unsubscribeOut = firestore.getAllCheckout(companyId, (outData) => {
      setAllOut(outData);
      sortData(sortOrderOut, setFilteredOut, outData); // Ensure sorting after data update
    }, console.error);

    return () => {
      unsubscribeIn();
      unsubscribeOut();
    };
  }, [companyId, sortOrder, sortOrderOut]);

  // Function to convert date string to Date object for comparison
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

  // Toggle sorting order for check-ins
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortData(newOrder, setFilteredUsers, allIN);
  };

  // Toggle sorting order for check-outs
  const toggleSortOrderOut = () => {
    const newOrder = sortOrderOut === 'asc' ? 'desc' : 'asc';
    setSortOrderOut(newOrder);
    sortData(newOrder, setFilteredOut, allOut);
  };

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <div><Layout /></div>
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
                      <th scope="col" onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                        วันที่ {sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/* {filteredUsers.slice(startIndex, endIndex).map((item, index) => ( */}
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={item.id} style={{
                        color: (item.late || item.isInvalidArea) ? 'red' : 'black'
                      }}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.late?'*'+item.name:item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>{item.workplace}</td>
                        <td><button style={{borderRadius:10}} onClick={() => handleShow(item.id, item.date, item.time, item.workplace, true,item)}><AiOutlineEdit /></button></td>
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
                      <th scope="col" onClick={toggleSortOrderOut} style={{ cursor: 'pointer' }}>
                        วันที่ {sortOrderOut === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredOut.slice(outStartIndex, outEndIndex).map((item, index) => (
                      <tr key={item.id} style={{
                        color: (item.late || item.isInvalidArea) ? 'red' : 'black'
                      }}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>{item.workplace}</td>
                        <td><button style={{borderRadius:10}} onClick={() => handleShow(item.id, item.date, item.time, item.workplace, false,item)}><AiOutlineEdit /></button></td>
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
              <Form.Group controlId="date">
                <Form.Label style={{fontSize:22}}>วันที่</Form.Label>
                <Form.Control
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{fontSize:20,marginBottom:20}}
                />
              </Form.Group>

              <Form.Group controlId="time">
                <Form.Label style={{fontSize:22}}>เวลา</Form.Label>
                <Form.Control
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{fontSize:20,marginBottom:30}}
                />
              </Form.Group>
              <FormControl variant="filled" fullWidth>
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
              </FormControl>
              {isInvalidArea && (
                <div style={{ marginTop: '20px' }}>
                  <h5 style={{ marginBottom: '10px', color: 'red' }}>Invalid Location Detected:</h5>
                  {/* Hide the search bar for this use case */}
                  <LocationPickerMap
                    lat={lat}
                    lon={lon}
                    showSearch={false} // Hides the search input in this instance
                    onLocationSelect={(lat, lon) => {
                      setLat(lat);
                      setLon(lon);
                    }}
                  />
                </div>
              )}
            </Form>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black',fontSize:20}} onClick={handleSave}>
              Save
            </Button>
            <Button style={{ backgroundColor: '#BEBEBE', color: 'black', fontSize: 20 }} onClick={()=>handleMove(item)}>
              Move
            </Button>
            <Button variant="secondary" style={{backgroundColor:'#343434',fontSize:20}} onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      
    
  );
}

export default CheckHistory;

  