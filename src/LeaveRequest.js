import React,{useEffect,useState} from 'react';
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
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';

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
  const [state,setState] = useState('')
  const [state1,setState1] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');

  const getAllLeaveSuccess=(doc)=>{
    let leaves = []
    if (allLeave.length === 0) {
        
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
    handleShow()
  }

  const getLeaveUnsuc=(error)=>{
    console.log(error)
  }

  const getLeave=(id)=>{
    setSelectID(id)
    firestore.getLeave(id,getLeaveSuc,getLeaveUnsuc)
  }

  const allowSuc =()=>{
    handleClose()
  }

  const allowUnsuc=(error)=>{

  }

  const onAllow=()=>{
    setState1(true)
    let item={
      state1:true
    }
    firestore.updateLeave(selectID,item,allowSuc,allowUnsuc)
  }

  useEffect(() => {
    firestore.getAllLeave(getAllLeaveSuccess,getAllLeaveUnsuccess)
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(event.target.value);
    setSearchQuery(query);
    const filtered = allLeave.filter(user => user.name.toLowerCase().includes(query));
    setFilteredUsers(filtered);
  };

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          <header>
            <h1>คำขอลางาน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
            <div class="search-field">
                <p style={{marginTop:17}}>ค้นหาพนักงาน</p>
                <input style={{width:'40%',margin:5,height:40,borderRadius:20,paddingInlineStart:10,fontSize:18}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              
              <div style={{display:'flex',width:'95%',alignSelf:'center',flexDirection:'row',justifyContent: 'space-around'}}>
                
                <div style={{width:'95%'}}>
                
                <TableBootstrap striped bordered hover style={{marginTop:20}}>
                  <thead>
                    <tr>
                      <th scope="col">ลำดับ</th>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/*{allUser.slice(startIndex, endIndex).map((item, index) => (*/}
                  {filteredUsers.map((item, index) => (
                    <tr key={item.id} onClick={()=>getLeave(item.id)}>
                      {/*<th scope="row">{startIndex + index + 1}</th>*/}
                      <th scope="row">{index + 1}</th>
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
                </div>
                
              </div>

            </div>
          </div>
        </main>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียดการขอลางาน</Modal.Title>
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
              <Form.Label>ประเภทการลา</Form.Label>
              <Form.Control
                value={type}
                autoFocus
                
              />
              {/*<Form.Control as="textarea" rows={3} />*/}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ลาเนื่องจาก</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={detail}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>เบอร์โทรติดต่อ</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={phone}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ลาตั้งแต่วันที่</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={dateStart}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ลาถึงวันที่</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={dateEnd}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>รวมวันลาที่ต้องการลา</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={amount}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>สถานะ(หัวหน้างาน)</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={state}
              />
            </Form.Group>
          </Form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Deny
          </Button>
          <Button variant="primary" style={{backgroundColor:'#50C878'}} onClick={onAllow}>
            Allow
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      
    
  );
}

export default LeaveRequest;

  