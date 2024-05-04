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



function ManageAccount() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [level, setLevel] = useState('');
    const [allaccount, setAllAccount] = useState([]);
    
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
      firestore.getAllAccount(getallAccountSuccess,getallAccountUnsuccess)
    }, []);
  

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const createSuccess=(user)=>{
      let item={
        email:email,
        name:name,
        position:position,
        level:level
      }
      console.log(item)
      firestore.addAccount(user.uid,item)
      handleClose()
    }

    const createUnsuccess=(error)=>{

    }

    const onSave=(e)=>{
      e.preventDefault()
      auth.createAccount(email,password,createSuccess,createUnsuccess)
      
    }

    
    const Delete =()=>{
      console.log('Delelte')
    }

    return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>จัดการผู้ใช้</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
            <div class="search-field">
                <p style={{marginTop:10}}>ค้นหาพนักงาน</p>
                <input style={{width:'40%',margin:5,height:30,borderRadius:20,paddingInlineStart:10,fontSize:18}} />
                <button class="search-button"></button>
              </div>
              <button className='addAccount-button' onClick={handleShow}>เพิ่มผู้ใช้</button>
              
              <div style={{display:'flex',width:'95%',alignSelf:'center',flexDirection:'row',justifyContent: 'space-around'}}>
                
                <div style={{width:'95%'}}>
                
                <TableBootstrap striped bordered hover style={{marginTop:20}}>
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
                    {allaccount.map((item) =>(
                      <tr key={item.id}>
                        <td>{item.email}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.position}
                        </td>
                        <td>{item.level}</td>
                        <td style={{textAlign: 'center'}}><IoTrashBin size={28} onClick={Delete} /></td>
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      
    
  );
}

export default ManageAccount;

  