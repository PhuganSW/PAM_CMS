//AnnouceExtend.js
import React,{useContext} from 'react';
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
import { UserContext } from './UserContext';

function AnnouceExtend() {
  const navigate = useNavigate();
  const [title,setTitle] = useState('');
  const [date,setDate] = useState('');
  const [selectID,setSelectID] = useState('');
  const [allHealth,setAllHealth] = useState([]);
  const [allClimate,setAllClimate] = useState([]);
  const [show, setShow] = useState(false);
  const [filteredHealth, setFilteredHealth] = useState([]);
  const [filteredClimate, setFilteredClimate] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [newsAnnouce,setNewsAnnouce] = useState([]);
  const [filterNews,setFilterNews] = useState([]);
  const { setCurrentUser, companyId } = useContext(UserContext);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const getAllAnnouceSuc=(doc)=>{
    
    let annouces = []
    let relaxs = []
    let healths = []
    let climates = []
    
      
    doc.forEach((item) => {
      //console.log(item.title+":"+item.type)
      if(item.type == 1){
        relaxs.push({id: item.id,title:item.title,date:item.date,type:item.type});
      }
      else if(item.type == 2){
        healths.push({id: item.id,title:item.title,date:item.date,type:item.type});
      }
      else if(item.type == 3){
        climates.push({id: item.id,title:item.title,date:item.date,type:item.type});
      }
      
    });
    healths.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    climates.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    setAllHealth(healths);
    setAllClimate(climates)
    
    setFilteredHealth(healths);
    setFilteredClimate(climates)
      
    
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
    firestore.deleteAnnouceHome2(companyId,selectID)
    //console.log('Del'+selectID)
    handleClose()
  }

  const editAnnouce =(id)=>{
    console.log(id)
    navigate('/annouce_extend/edit',{state:{id:id}})
  }

  const onRelax=()=>{
    navigate('/annouce_extend/add', { state: { sender: 'relax' } })
  }


  useEffect(() => {
    firestore.getAllAnnouceHome2(companyId,getAllAnnouceSuc,getAllAnnouceUnsuc)
  }, []);

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
    const filteredHealth = allHealth.filter(annouce => annouce.title.toLowerCase().includes(query));
    const filteredClimate = allClimate.filter(annouce => annouce.title.toLowerCase().includes(query));
    setFilteredHealth(filteredHealth);
    setFilteredClimate(filteredClimate);
  };


  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
         
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>การประกาศ</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
            <div className="search-field">
                {/* <p style={{marginTop:17}}>ค้นหาพนักงาน</p> */}
                <input style={{width:'95%',margin:5,height:40,borderRadius:5,paddingInlineStart:10,fontSize:22,alignSelf:'center',justifyContent:'center'}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:10,width:'95%',alignSelf:'center'}}>
                <button className='Add-button' onClick={()=> navigate('/annouce_extend/add', { state: { sender: 'other' } })}>เพิ่มประกาศ</button>
              </div>
              <div style={{width:'95%',alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
              <div style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                          alignSelf:'center',borderLeft: '5px solid black',borderRadius:5}}>Relaxation</div>
                          <button className='Previous-button' onClick={onRelax}>จัดการ</button>
              <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                          alignSelf:'center',borderLeft: '5px solid black',borderRadius:5}}>Health News</p>
      
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
                {filteredHealth.slice(startIndex, endIndex).map((item, index) => (
                    <tr key={item.id}> 
                      <th scope="row">{startIndex + index + 1}</th>
                      {/* <th scope="row">{index + 1}</th> */}
                      <td>
                        {item.title}
                      </td>
                      <td>{item.date}</td>
                      <td style={{width:'30%',textAlign:'center'}}>
                        <button className='Edit-button' onClick={()=>editAnnouce(item.id)}>แก้ไข</button>
                        <button className='Delete-button' onClick={()=>handleShow(item.id)}>ลบ</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableBootstrap>
              <div style={{width:'100%'}}>
                  <button className='Previous-button' onClick={onPrevious}>Previous</button>
                  <button className='Next-button' onClick={onNext}>Next</button>
              </div>

              <div className="form-row" style={{ display: 'flex', marginBottom: 20,alignItems:'center',justifyContent:'center',marginTop:20}}>      
                <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5}}>Climate Content</p>
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
                  {filteredClimate.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={item.id}> 
                        <th scope="row">{startIndex + index + 1}</th>
                        <td>
                          {item.title}
                        </td>
                        <td>{item.date}</td>
                        <td style={{width:'30%',textAlign:'center'}}>
                          <button className='Edit-button' onClick={()=>editAnnouce(item.id)}>แก้ไข</button>
                          <button className='Delete-button' onClick={()=>handleShow(item.id)}>ลบ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableBootstrap>
                <div style={{width:'100%'}}>
                <button className='Previous-button' >Previous</button>
                <button className='Next-button'>Next</button>
                </div>
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

export default AnnouceExtend;

  