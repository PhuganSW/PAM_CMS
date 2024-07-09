import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';
import './Profile.css';
import './checkHis.css'
import firestore from './Firebase/Firestore';

function CheckHistory() {

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredOut, setFilteredOut] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [name,setName] = useState('');
  const [date,setDate] = useState('');
  const [time,setTime] = useState('');
  const [late,setLate] = useState('');
  const [id,setID] = useState('');
  const [allIN,setAllIn] = useState('');
  const [allOut,setAllOut] = useState('');

  const getInSuc=(doc)=>{
    console.log(doc)
    let ins = []
    if (allIN.length === 0) {
        
      doc.forEach((item) => {
        ins.push({id: item.id,date:item.date, name: item.name, time: item.time,workplace:item.workplace,late:item.late});
      });
      setAllIn(ins);
      setFilteredUsers(ins);
    }
  }

  const getOutSuc=(doc)=>{
    let outs = []
    if (allOut.length === 0) {
        
      doc.forEach((item) => {
        outs.push({id: item.id,date:item.date, name: item.name, time: item.time,workplace:item.workplace,late:item.late});
      });
      setAllOut(outs);
      setFilteredOut(outs);
    }
  }

  const getInUnsuc=(e)=> console.log(e)
  const getOutUnsuc=(e)=> console.log(e)

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(event.target.value);
    setSearchQuery(query);
    const filtered = allIN.filter(user => user.name.toLowerCase().includes(query));
    const filtered1 = allOut.filter(user => user.name.toLowerCase().includes(query));
    setFilteredUsers(filtered);
    setFilteredOut(filtered1);
  };

  useEffect(() => {
    firestore.getAllCheckin(getInSuc,getInUnsuc)
    firestore.getAllCheckout(getOutSuc,getOutUnsuc)
  }, []);

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
        
          <div class="main">
          <div className='header-page'>
          <header>
            <h1>ประวัติการเข้า-ออกงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div class="main-contain">
            <div className="search-field">
                {/* <p style={{marginTop:17}}>ค้นหาพนักงาน</p> */}
                <input style={{width:'95%',margin:5,height:40,borderRadius:5,paddingInlineStart:10,fontSize:22}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} />
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              
              <div className="table-container">
                
                <div className="table-section">
                <p className="table-title">เวลาเข้างาน</p>
                <TableBootstrap striped bordered hover className='table' style={{marginTop:10}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/* {filteredUsers.slice(startIndex, endIndex).map((item, index) => ( */}
                  {filteredUsers.map((item, index) => (
                      <tr key={item.id}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>{item.workplace}</td>
                      </tr>
                   ))}
                  </tbody>
                </TableBootstrap>
                </div>
                
                <div className="table-section">
                <p className="table-title">เวลาออกงาน</p>
                <TableBootstrap striped bordered hover style={{marginTop:10}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredOut.map((item, index) => (
                      <tr key={item.id}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>{item.workplace}</td>
                      </tr>
                   ))}
                  </tbody>
                </TableBootstrap>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default CheckHistory;

  