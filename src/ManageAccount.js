import React,{useState,useEffect,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';
import './addProfile.css'
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { IoTrashBin,IoPencil } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';
import Layout from './Layout';
import { UserContext } from './UserContext';
import ReactSelect from 'react-select';
import CryptoJS from 'crypto-js';
import { IoEyeOff, IoEye } from "react-icons/io5";
import { hashPassword } from './hashPassword';


function ManageAccount() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showDel, setShowDel] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [level, setLevel] = useState('');
    const [allaccount, setAllAccount] = useState([]);
    const [selectID, setSelectID] = useState();
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(10);
    const { setCurrentUser, companyId } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);

    const levels = [
      { label: 'Administrator', value: 0 },
      { label: 'Super Admin', value: 1 },
      { label: 'Admin', value: 2 },
      { label: 'User', value: 3 }
    ];

    const selectableLevels = levels.filter(l => l.value !== 0);
    
    const getallAccountSuccess=(doc)=>{
      let accounts = [];
      if (allaccount.length === 0) {
        
        doc.forEach((item) => {
          const matchingLevel = levels.find(l => l.value === item.level);
          accounts.push({id: item.id, email: item.email, name: item.name, position: item.position, level: matchingLevel ? matchingLevel.label : 'Unknown'});
        });
        setAllAccount(accounts);
      }
      console.log(doc)
    }
    const getallAccountUnsuccess=(error)=>{
      
    }

    useEffect(() => {
      firestore.getAllAccount(companyId,getallAccountSuccess,getallAccountUnsuccess)
    }, []);
  

    const handleClose = () => {
      setSelectID('');
      setEmail('');
      setName('');
      setPosition('');
      setLevel(''); 
      setShow(false);
      setIsEditing(false);
    }
    const handleShow = () => setShow(true);
    const handleDelClose = () => setShowDel(false);
    const handleDelShow = (id,email) => {
      setEmail(email)
      setSelectID(id)
      setShowDel(true);
    }

    const handleEditShow = (account) => {
      console.log(account)
      setIsEditing(true); // Set editing mode to true
      setSelectID(account.id);
      setEmail(account.email);
      setName(account.name);
      setPosition(account.position);
      setLevel(levels.find(l => l.label === account.level)?.value || ''); // Match level to its value
      setShow(true);
    };

    const createSuccess=async(user)=>{
      //const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashedPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      let item={
        email:email,
        name:name,
        position:position,
        level:level,
        password: hashedPassword
      }
      //console.log(item)
      firestore.addAccount(companyId,user.uid,item)
      .then(() => {
        alert("Account created successfully!");
        handleClose();
      })
      .catch((error) => {
        console.error("Error adding account to Firestore", error);
      });
    }

    const createUnsuccess=(error)=>{

    }

    const onSave = async (e) => {
      e.preventDefault();
      if (isEditing) {
        // Edit existing account
        const updatedData = {
          email,
          name,
          position,
          level
        };
        if (password) {
          const hashedPassword = await hashPassword(password); // Hash password if provided
          updatedData.password = hashedPassword;
        }
        firestore.updateAccount(companyId, selectID, updatedData, () => {
          alert("Account updated successfully!");
          handleClose();
          // Reload accounts if necessary
        }, (error) => {
          console.error("Error updating account:", error);
        });
      } else {
        // Create a new account
        auth.createAccount(email, password, async (user) => {
          const hashedPassword = await hashPassword(password);
          let item = {
            email,
            name,
            position,
            level,
            password: hashedPassword
          };
          firestore.addAccount(companyId, user.uid, item)
            .then(() => {
              alert("Account created successfully!");
              handleClose();
            })
            .catch((error) => {
              console.error("Error adding account to Firestore", error);
            });
        }, (error) => {
          console.error("Error creating account:", error);
        });
      }
    };

    const delSuc =()=>{

    }

    const delUnsuc =(e)=>{
      console.log(e)
    }
    
    const Delete =()=>{
      auth.deleteUser(selectID, () => {
        // After successfully deleting from Firebase Authentication, delete from Firestore
        //firestore.deleteAccount(companyId, selectID)
        console.log('Del')
          .then(() => {
            alert(`User with email ${email} deleted successfully!`);
            handleDelClose();
          })
          .catch((error) => {
            console.error('Error deleting user from Firestore:', error);
          });
      }, (error) => {
        console.error('Error deleting user from Firebase Authentication:', error);
      });
    }

    const onNext = () => {
      setStartIndex(startIndex + 10); // Increment the start index by 5
      setEndIndex(endIndex + 10); // Increment the end index by 5
    };
  
    const onPrevious = () => {
      setStartIndex(Math.max(startIndex - 10, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
      setEndIndex(Math.max(endIndex - 10, 10)); // Decrement the end index by 5, ensuring it doesn't go below 5
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div class="main">
            <div className='header-page'>
            <header>
              <h1>การจัดการผู้ใช้งาน</h1>
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
                        <td style={{textAlign: 'center'}}>
                          <IoPencil size={24} onClick={() => handleEditShow(item)} style={{ marginRight: 10 }} />
                          <IoTrashBin size={24} onClick={()=>handleDelShow(item.id,item.email)} />
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
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'แก้ไขบัญชีผู้ใช้' : 'เพิ่มบัญชีผู้ใช้'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Password</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}  // Change input type based on visibility state
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  style={{ paddingRight: '2.5rem' }}  // Adjust padding to prevent text overlaying the icon
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <IoEyeOff size={24} /> : <IoEye size={24} />}
                </button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="name"
                autoFocus
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLevel">
              <Form.Label>Level</Form.Label>
              <ReactSelect
                value={levels.find(option => option.value === level)}
                onChange={(selectedOption) => setLevel(selectedOption.value)}
                options={selectableLevels}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '4px', // Border radius for the select field
                    border: '1px solid #ced4da',
                    padding: '4px',  // Adjust padding for the select field
                  }),
                  option: (base) => ({
                    ...base,
                    borderRadius: '4px', // Border radius for options when they are rendered
                    padding: '10px', // Add padding to options
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '4px', // Border radius for the dropdown menu
                  }),
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black'}} onClick={onSave}>
            {isEditing ? 'Save Changes' : 'Create Account'}
          </Button>
          <Button variant="secondary" style={{backgroundColor:'#343434',width:'20%'}} onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
      <Modal show={showDel} onHide={handleDelClose}>
        <Modal.Header closeButton>
          <Modal.Title>ลบบัญชีผู้ใช้: {email}</Modal.Title>
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

  