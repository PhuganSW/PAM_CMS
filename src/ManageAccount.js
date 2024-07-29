import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { IoTrashBin } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';
import Layout from './Layout';



function ManageAccount() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showDel, setShowDel] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [level, setLevel] = useState('');
    const [allaccount, setAllAccount] = useState([]);
    const [selectID, setSelectID] = useState();
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(10);
    
    const getallAccountSuccess=(doc)=>{
      let accounts = [];
      if (allaccount.length === 0) {
        
        doc.forEach((item) => {
          accounts.push({id: item.id, email: item.email, name: item.name, position: item.position, level: item.level});
        });
        setAllAccount(accounts);
      }
      console.log(doc)
    }
    const getallAccountUnsuccess=(error)=>{
      
    }

    useEffect(() => {
      firestore.getAllAccount("miscible",getallAccountSuccess,getallAccountUnsuccess)
    }, []);
  

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelClose = () => setShowDel(false);
    const handleDelShow = (id) => {
      setSelectID(id)
      setShowDel(true);
    }

    const createSuccess=(user)=>{
      let item={
        email:email,
        name:name,
        position:position,
        level:level
      }
      //console.log(item)
      firestore.addAccount("miscible",user.uid,item)
      handleClose()
    }

    const createUnsuccess=(error)=>{

    }

    const onSave=(e)=>{
      e.preventDefault()
      auth.createAccount(email,password,createSuccess,createUnsuccess)
      
    }

    const delSuc =()=>{

    }

    const delUnsuc =(e)=>{
      console.log(e)
    }
    
    const Delete =()=>{
      firestore.deleteAccount("miscible",selectID)
      //auth.deleteUser(selectID,delSuc,delUnsuc)
      console.log('Del'+selectID)
      console.log(auth.currentUser)
      handleDelClose()
    }

    const onNext = () => {
      setStartIndex(startIndex + 10); // Increment the start index by 5
      setEndIndex(endIndex + 10); // Increment the end index by 5
    };
  
    const onPrevious = () => {
      setStartIndex(Math.max(startIndex - 10, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
      setEndIndex(Math.max(endIndex - 10, 10)); // Decrement the end index by 5, ensuring it doesn't go below 5
    };

    return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div class="main">
            <div className='header-page'>
            <header>
              <h1>จัดการผู้ใช้</h1>
              {/* Add user profile and logout here */}
            </header>
            </div>
            <div class="main-contain">
            {/*<div class="search-field">
                <p style={{marginTop:10}}>ค้นหาพนักงาน</p>
                <input style={{width:'40%',margin:5,height:30,borderRadius:20,paddingInlineStart:10,fontSize:18}} />
                <button class="search-button"></button>
    </div>*/}
              
        
              <button className='addAccount-button' onClick={handleShow}>เพิ่มผู้ใช้</button>
              
              
                
                <div style={{width:'95%',alignSelf:'center'}}>
                
                <TableBootstrap striped bordered hover className='table' style={{marginTop:20}} >
                  <thead>
                    <tr>
                      <th scope="col">Email</th>
                      <th scope="col">User</th>
                      <th scope="col">Position</th>
                      <th scope="col">Level</th>
                      <th scope='col'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allaccount.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={item.id}>
                        {/* <th scope="row">{startIndex + index + 1}</th> */}
                        <td>{item.email}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.position}
                        </td>
                        <td>{item.level}</td>
                        <td style={{textAlign: 'center'}}><IoTrashBin size={28} onClick={()=>handleDelShow(item.id)} /></td>
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
          <Modal.Title>เพิ่มบัญชีผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                //placeholder="name@example.com"
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
              />
              {/*<Form.Control as="textarea" rows={3} />*/}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                onChange={(e) => setPosition(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Level</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                onChange={(e) => setLevel(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black'}} onClick={onSave}>
            Save Changes
          </Button>
          <Button variant="secondary" style={{backgroundColor:'#343434',width:'20%'}} onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
      <Modal show={showDel} onHide={handleDelClose}>
        <Modal.Header closeButton>
          <Modal.Title>ลบบัญชีผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>ยืนยันจะลบบัญชีผู้ใช้หรือไม่</h5>
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
      </div>
      
    
  );
}

export default ManageAccount;

  