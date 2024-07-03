import React,{useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';
import './Profile.css';

function CheckHistory() {

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    // setSearch(event.target.value);
    // setSearchQuery(query);
    // const filtered = allUser.filter(user => user.name.toLowerCase().includes(query) || 
    //   user.position.toLowerCase().includes(query));
    // setFilteredUsers(filtered);
  };

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
              
              <div style={{display:'flex',width:'100%',alignSelf:'center',flexDirection:'row',justifyContent: 'space-around'}}>
                
                <div style={{width:'45%'}}>
                <p style={{fontSize:24}}>เวลาเข้างาน</p>
                <TableBootstrap striped bordered hover className='table' style={{marginTop:10}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*people.map((person) => (
                      <tr key={person.id}>*/}
                      <tr>
                        <th scope="row">17/04/2567</th>
                        <td>
                          AAA BBB
                        </td>
                        <td>07.35</td>
                      </tr>
                    {/*}))}*/}
                  </tbody>
                </TableBootstrap>
                </div>
                
                <div style={{width:'45%'}}>
                <p style={{fontSize:24}}>เวลาออกงาน</p>
                <TableBootstrap striped bordered hover style={{marginTop:10}}>
                  <thead>
                    <tr>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*people.map((person) => (
                      <tr key={person.id}>*/}
                      <tr>
                        <th scope="row">17/04/2567</th>
                        <td>
                          AAA BBB
                        </td>
                        <td>17.05</td>
                      </tr>
                    {/*}))}*/}
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

  