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

function LeaveRequest() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [allLeave, setAllLeave] = useState([]);
  const [selectID,setSelectID] = useState('');
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
  const { setCurrentUser, companyId } = useContext(UserContext);

  const [sortOrder, setSortOrder] = useState('desc'); // State to track sorting order for dates
  const [nameSortOrder, setNameSortOrder] = useState('asc');

  const getAllLeaveSuccess=(doc)=>{
    let leaves = []
    if (allLeave.length === 0) {
      console.log(doc)
      doc.forEach((item) => {
        leaves.push({id: item.id,date:item.date, name: item.name, state:item.state});
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

  const onAllow=()=>{
    setState(true)
    let item={
      state:true
    }
    firestore.updateLeave(companyId,selectID,item,allowSuc,allowUnsuc)
  }

  useEffect(() => {
    // Fetch all leave data from Firestore
    firestore.getAllLeave(companyId, (data) => {
      setAllLeave(data);
      sortData(sortOrder, setFilteredUsers, data); // Initially sort by date
    }, console.error);
  }, [companyId, sortOrder]);

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

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div class="main">
          <div className='header-page'>
          <header>
            <h1>คำขอลางาน</h1>
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
          <Button variant="primary" style={{ backgroundColor: '#D3D3D3', color: 'black',fontSize:20 }} onClick={onAllow}>
            Allow
          </Button>
          <Button variant="secondary" style={{ backgroundColor: '#343434',fontSize:20, }} onClick={handleClose}>
            Deny
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      
    
  );
}

export default LeaveRequest;

  