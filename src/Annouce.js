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
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';

function Annouce() {
  const navigate = useNavigate();
  const [title,setTitle] = useState('');
  const [date,setDate] = useState('');
  const [selectID,setSelectID] = useState('');
  const [allAnnouce,setAllAnnouce] = useState([]);
  const [show, setShow] = useState(false);
  const [filteredAnnouces, setFilteredAnnouces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);

  const getAllAnnouceSuc=(doc)=>{
    let annouces = []
    if (allAnnouce.length === 0) {
        
      doc.forEach((item) => {
        annouces.push({id: item.id,title:item.title,date:item.date});
      });
      setAllAnnouce(annouces);
      setFilteredAnnouces(annouces);
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
    navigate('/annouce_edit',{state:{id:id}})
  }


  useEffect(() => {
    firestore.getAllAnnouce(getAllAnnouceSuc,getAllAnnouceUnsuc)
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
    const filtered = allAnnouce.filter(annouce => annouce.title.toLowerCase().includes(query));
    setFilteredAnnouces(filtered);
  };


  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
         
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>ประกาศ</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
            <div className="search-field">
                {/* <p style={{marginTop:17}}>ค้นหาพนักงาน</p> */}
                <input style={{width:'95%',margin:5,height:40,borderRadius:5,paddingInlineStart:10,fontSize:22}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:10,width:'95%',alignSelf:'center'}}>
                <button className='Add-button' onClick={()=> navigate('/annouce_add')}>เพิ่มประกาศ</button>
              </div>
              <div style={{width:'95%',alignSelf:'center'}}>
              <TableBootstrap striped bordered hover className='table'>
                <thead>
                  <tr>
                    <th scope="col" style={{width:'10%'}}>ลำดับ</th>
                    <th scope="col" style={{width:'40%'}}>หัวข้อ</th>
                    <th scope="col" style={{width:'15%'}}>วันที่</th>
                    <th scope="col" style={{width:'35%'}}></th>
                  </tr>
                </thead>
                <tbody>
                {filteredAnnouces.slice(startIndex, endIndex).map((item, index) => (
                    <tr key={item.id}> 
                      <th scope="row">{startIndex + index + 1}</th>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td>
                        {item.title}
                      </td>
                      <td>{item.date}</td>
                      <td style={{width:'30%',textAlign:'center'}}>
                        <button className='Edit-button' onClick={()=>editAnnouce(item.id)}>แก้ไขประกาศ</button>
                        <button className='Delete-button' onClick={()=>handleShow(item.id)}>ลบประกาศ</button>
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
          <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ลบประกาศ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>ยืนยันจะลบประกาศหรือไม่</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" style={{backgroundColor:'#D3D3D3',color:'black'}} onClick={deleteAnnouce}>
            OK
          </Button>
          <Button variant="secondary" style={{backgroundColor:'#343434'}} onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </main>
      </div>
      
    
  );
}

export default Annouce;

  