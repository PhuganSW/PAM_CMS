import React,{useState,useEffect} from 'react';
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const getAllOTSuccess=(doc)=>{
    let ots = []
    if (allOT.length === 0) {
        
      doc.forEach((item) => {
        ots.push({id: item.id,date:item.date, name: item.name,time:item.time, state:item.state});
      });
      setAllOT(ots);
      setFilteredUsers(ots);
    }
  }

  const getAllOTUnsuccess=(error)=>{
    console.log("getOTLeave: "+error)
  }

  const getOTSuc=(data)=>{
    setName(data.name)
    setPosition(data.position)
    setDate(data.date)
    setTimeStart(data.timeStart)
    setTimeEnd(data.timeEnd)
    setAmount(data.amount)
    setDetail(data.detail)
    
    if(data.status){
      setStatus("Allowed")
    }else{
      setStatus("Not allowed")
    }

    handleShow()
  }

  const getOTUnsuc =(error)=>{

  }

  const getOT=(id)=>{
    setSelectID(id)
    firestore.getOT(id,getOTSuc,getOTUnsuc)
  }

  useEffect(() => {
    firestore.getAllOT(getAllOTSuccess,getAllOTUnsuccess)
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
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      {/* <th scope="col">เวลา</th> */}
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
          <Modal.Title>รายละเอียดการขอทำ OT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ชื่อ - นามสกุล</Form.Label>
              <Form.Control
                type="email"
                value={name}
                autoFocus
                
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>ตำแหน่ง</Form.Label>
              <Form.Control
                value={position}
                autoFocus
                
              />
              {/*<Form.Control as="textarea" rows={3} />*/}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>วันที่</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={date}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>เริ่มตั้งแต่เวลา</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={timeStart}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>จนถึงเวลา</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={timeEnd}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>รวมจำนวนชั่วโมงการทำ OT</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={amount}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>รายละเอียด</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={detail}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>สถานะ</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={status}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
      </div>
      
    
  );
}

export default OTRequest;

  