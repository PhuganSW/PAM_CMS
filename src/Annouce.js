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
  const [endIndex, setEndIndex] = useState(5);
  const [startNews, setStartNews] = useState(0);
  const [endNews, setEndNews] = useState(5);
  const [startRule, setStartRule] = useState(0);
  const [endRule, setEndRule] = useState(5);
  const [startGeneral, setStartGeneral] = useState(0);
  const [endGeneral, setEndGeneral] = useState(5);
  const [startCampaign, setStartCampaign] = useState(0);
  const [endCampaign, setEndCampaign] = useState(5);
  const [startHoliday, setStartHoliday] = useState(0);
  const [endHoliday, setEndHoliday] = useState(5);
  const [newsAnnouce,setNewsAnnouce] = useState([]);
  const [filterNews,setFilterNews] = useState([]);
  const [ruleAnnouce,setRuleAnnouce] = useState([]);
  const [filterRule,setFilterRule] = useState([]);
  const [generalAnnouce,setGeneralAnnouce] = useState([]);
  const [filterGeneral,setFilterGeneral] = useState([]);
  const [campaignAnnouce,setCampaignAnnouce] = useState([]);
  const [filterCampaign,setFilterCampaign] = useState([]);
  const [holidayAnnouce,setHolidayAnnouce] = useState([]);
  const [filterHoliday,setFilterHoliday] = useState([]);
  const { setCurrentUser, companyId } = useContext(UserContext);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const getAllAnnouceSuc=(doc)=>{
    
    let annouces = []
    let news = []
    let rules = []
    let generals = []
    let campaigns = []
    let holidays = []
    if (allAnnouce.length === 0) {
      
      doc.forEach((item) => {
        //console.log(item.title+":"+item.type)
        if(item.type == 1){
          annouces.push({id: item.id,title:item.title,date:item.date,type:item.type});
        }
        else if(item.type == 2){
          news.push({id: item.id,title:item.title,date:item.date,type:item.type});
        }
        else if(item.type == 3){
          rules.push({id: item.id,title:item.title,date:item.date,type:item.type});
        }
        else if(item.type==4){
          generals.push({id: item.id,title:item.title,date:item.date,type:item.type});
        }
        else if(item.type==5){
          campaigns.push({id: item.id,title:item.title,date:item.date,type:item.type});
        }
        else if(item.type==6){
          holidays.push({id: item.id,title:item.title,date:item.date,type:item.type});
        }
        
      });
      annouces.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      news.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      rules.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      generals.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      campaigns.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      holidays.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      setAllAnnouce(annouces);
      setNewsAnnouce(news)
      setRuleAnnouce(rules)
      setGeneralAnnouce(generals);
      setCampaignAnnouce(campaigns);
      setHolidayAnnouce(holidays);
      setFilteredAnnouces(annouces);
      setFilterNews(news)
      setFilterRule(rules)
      setFilterGeneral(generals)
      setFilterCampaign(campaigns)
      setFilterHoliday(holidays)
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
    firestore.deleteAnnouce(companyId,selectID)
    //console.log('Del'+selectID)
    handleClose()
  }

  const editAnnouce =(id)=>{
    navigate('/annouce_edit',{state:{id:id}})
  }


  useEffect(() => {
    firestore.getAllAnnouce(companyId,getAllAnnouceSuc,getAllAnnouceUnsuc)
  }, []);

  const onNext = () => {
    setStartIndex(startIndex + 5); // Increment the start index by 5
    setEndIndex(endIndex + 5); // Increment the end index by 5
  };

  const onPrevious = () => {
    setStartIndex(Math.max(startIndex - 5, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndIndex(Math.max(endIndex - 5, 5)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const NextNews = () => {
    setStartNews(startNews + 5); // Increment the start index by 5
    setEndNews(endNews + 5); // Increment the end index by 5
  };

  const PreviousNews = () => {
    setStartNews(Math.max(startNews - 5, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndNews(Math.max(endNews - 5, 5)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const NextRule = () => {
    setStartRule(startRule + 5); // Increment the start index by 5
    setEndRule(endRule + 5); // Increment the end index by 5
  };

  const PreviousRule = () => {
    setStartRule(Math.max(startRule - 5, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndRule(Math.max(endRule - 5, 5)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const NextGeneral = () => {
    setStartGeneral(startGeneral + 5); // Increment the start index by 5
    setEndGeneral(endGeneral + 5); // Increment the end index by 5
  };

  const PreviousGeneral = () => {
    setStartGeneral(Math.max(startGeneral - 5, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndGeneral(Math.max(endGeneral - 5, 5)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const NextCampaign = () => {
    setStartCampaign(startCampaign + 5); // Increment the start index by 5
    setEndCampaign(endCampaign + 5); // Increment the end index by 5
  };

  const PreviousCampaign = () => {
    setStartCampaign(Math.max(startCampaign - 5, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndCampaign(Math.max(endCampaign - 5, 5)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const NextHoliday = () => {
    setStartHoliday(startHoliday + 5); // Increment the start index by 5
    setEndHoliday(endHoliday + 5); // Increment the end index by 5
  };

  const PreviousHoliday = () => {
    setStartHoliday(Math.max(startHoliday - 5, 0)); // Decrement the start index by 5, ensuring it doesn't go below 0
    setEndHoliday(Math.max(endHoliday - 5, 5)); // Decrement the end index by 5, ensuring it doesn't go below 5
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(event.target.value);
    setSearchQuery(query);
    const filtered = allAnnouce.filter(annouce => annouce.title.toLowerCase().includes(query));
    const filteredNews = newsAnnouce.filter(annouce => annouce.title.toLowerCase().includes(query));
    const filteredRule = ruleAnnouce.filter(annouce => annouce.title.toLowerCase().includes(query));
    const filteredGeneral = generalAnnouce.filter(annouce => annouce.title.toLowerCase().includes(query));
    const filteredCampaign = campaignAnnouce.filter(annouce => annouce.title.toLowerCase().includes(query));
    const filteredHoliday = holidayAnnouce.filter(annouce => annouce.title.toLowerCase().includes(query));
    setFilteredAnnouces(filtered);
    setFilterNews(filteredNews);
    setFilterRule(filteredRule);
    setFilterGeneral(filteredGeneral)
    setFilterCampaign(filteredCampaign)
    setFilterHoliday(filteredHoliday)
  };


  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
         
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>การประกาศข่าวสาร</h1>
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
                <button className='Add-button' onClick={()=> navigate('/annouce_add')}>เพิ่มประกาศ</button>
              </div>
              <div style={{width:'95%',alignSelf:'center',justifyContent:'center'}}>
              <div className="form-row" style={{ display: 'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
                <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',marginLeft:5,borderLeft: '5px solid black',borderRadius:5}}>ประกาศฉุกเฉิน</p>
                {/* <p style={{fontSize:28,textAlign:'center',width:'100%',alignSelf:'center',marginLeft:0,paddingLeft:0}}>ประกาศฉุกเฉิน</p> */}
              </div>
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
              <div style={{width:'100%'}}>
                  <button className='Previous-button' onClick={onPrevious}>Previous</button>
                  <button className='Next-button' onClick={onNext}>Next</button>
                </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: 20,marginTop:20,alignItems:'center',justifyContent:'center'}}>
              <div className="form-row" style={{ display: 'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
                <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',marginLeft:5,borderLeft: '5px solid black',borderRadius:5}}>ข่าวสารภายใน</p>
              </div>
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
                  {filterNews.slice(startNews, endNews).map((item, index) => (
                      <tr key={item.id}> 
                        <th scope="row">{startNews + index + 1}</th>
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
                <div style={{width:'100%'}}>
                  <button className='Previous-button' onClick={PreviousNews}>Previous</button>
                  <button className='Next-button' onClick={NextNews}>Next</button>
                </div>
              </div>
              <div className="form-row" style={{ display: 'flex', marginBottom: 20,alignItems:'center',justifyContent:'center',}}>
              <div className="form-row" style={{ display: 'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
                <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',marginLeft:5,borderLeft: '5px solid black',borderRadius:5}}>กฎระเบียบ</p>
              </div>
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
                  {filterRule.slice(startRule, endRule).map((item, index) => (
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
                <div style={{width:'100%'}}>
                <button className='Previous-button' onClick={PreviousRule}>Previous</button>
                <button className='Next-button' onClick={NextRule}>Next</button>
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', marginBottom: 20,alignItems:'center',justifyContent:'center',}}>
              <div className="form-row" style={{ display: 'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
                <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',marginLeft:5,borderLeft: '5px solid black',borderRadius:5}}>ข่าวสารทั่วไป</p>
              </div>
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
                  {filterGeneral.slice(startRule, endRule).map((item, index) => (
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
                <div style={{width:'100%'}}>
                <button className='Previous-button' onClick={PreviousGeneral}>Previous</button>
                <button className='Next-button' onClick={NextGeneral}>Next</button>
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', marginBottom: 20,alignItems:'center',justifyContent:'center',}}>
              <div className="form-row" style={{ display: 'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
                <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',marginLeft:5,borderLeft: '5px solid black',borderRadius:5}}>รณรงค์ลดโลกร้อน</p>
              </div>
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
                  {filterCampaign.slice(startRule, endRule).map((item, index) => (
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
                <div style={{width:'100%'}}>
                <button className='Previous-button' onClick={PreviousCampaign}>Previous</button>
                <button className='Next-button' onClick={NextCampaign}>Next</button>
                </div>
              </div>

              <div className="form-row" style={{ display: 'flex', marginBottom: 20,alignItems:'center',justifyContent:'center',}}>
              <div className="form-row" style={{ display: 'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
                <p style={{fontSize:28,textAlign:'center',backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',marginLeft:5,borderLeft: '5px solid black',borderRadius:5}}>ปฏิทินวันหยุด</p>
              </div>
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
                  {filterHoliday.slice(startRule, endRule).map((item, index) => (
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
                <div style={{width:'100%'}}>
                <button className='Previous-button' onClick={PreviousHoliday}>Previous</button>
                <button className='Next-button' onClick={NextHoliday}>Next</button>
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

export default Annouce;

  