import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useEffect, useState } from 'react';
import firestore from './Firebase/Firestore';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Annouce() {
  const navigate = useNavigate();
  const [title,setTitle] = useState('');
  const [date,setDate] = useState('');
  const [selectID,setSelectID] = useState('');
  const [allAnnouce,setAllAnnouce] = useState([]);
  const [show, setShow] = useState(false);

  const getAllAnnouceSuc=(doc)=>{
    let annouces = []
    if (allAnnouce.length === 0) {
        
      doc.forEach((item) => {
        annouces.push({id: item.id,title:item.title,date:item.date});
      });
      setAllAnnouce(annouces);
    }
  }

  const getAllAnnouceUnsuc=(error)=>{
    console.log("getAnnouce: "+error)
  }

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setSelectID(id)
    setShow(true);
  }

  const deleteAnnouce =()=>{
    firestore.deleteAnnouce(selectID)
    //console.log('Del'+selectID)
    handleClose()
  }

  const editAnnouce =(id)=>{
    navigate('/edit_annouce',{state:{id:id}})
  }


  useEffect(() => {
    firestore.getAllAnnouce(getAllAnnouceSuc,getAllAnnouceUnsuc)
  }, []);

  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>ประกาศ</h1>
            {/* Add user profile and logout here */}
          </header>
          <div className="main">
            <div className="main-contain">
            <div className="search-field">
                <p style={{marginTop:10}}>ค้นหาประกาศ</p>
                <input style={{width:'40%',margin:5,height:30,borderRadius:20,paddingInlineStart:10,fontSize:18}} />
                <button className="search-button"></button>
              </div>
              
              <button className='Add-button' onClick={()=> navigate('/add_annouce')}>เพิ่มประกาศ</button>
              <div style={{width:'90%',alignSelf:'center'}}>
              <TableBootstrap striped bordered hover>
                <thead>
                  <tr>
                    <th scope="col" style={{width:'10%'}}>ลำดับ</th>
                    <th scope="col">หัวข้อ</th>
                    <th scope="col" style={{width:'20%'}}>วันที่</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                {allAnnouce.map((item, index) => (
                    <tr key={item.id}> 
                      {/*<th scope="row">{startIndex + index + 1}</th>*/}
                      <th scope="row">{index + 1}</th>
                      <td>
                        {item.title}
                      </td>
                      <td>{item.date}</td>
                      <td style={{width:'25%',textAlign:'center'}}>
                        <button className='Edit-button' onClick={()=>editAnnouce(item.id)}>แก้ไขประกาศ</button>
                        <button className='Delete-button' onClick={()=>handleShow(item.id)}>ลบประกาศ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableBootstrap>
              </div>

            </div>
          </div>
          <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ลบประกาศ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>ยืนยันจะลบประกาศหรือไม่</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={deleteAnnouce}>
            OK
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </main>
      </div>
      
    
  );
}

export default Annouce;

  