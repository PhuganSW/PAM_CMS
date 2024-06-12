import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate,useLocation } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import firestore from './Firebase/Firestore';
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';


function SalaryList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid,setUid] = useState('')
  const [name,setName] = useState('');
  const [date,setDate] = useState(dayjs(new Date(),'DD-MM-YYYY'));
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');

  const getUserSuccess=(data)=>{
    setName(data.name+" "+data.lastname)
  }

  const getUserUnsuccess=(e)=>{
    console.log(e)
  }

  const calSalary=(id)=>{
    navigate('/salary_cal',{state:{uid:id}})
  }

  useEffect(() => {
    if (location.state && location.state.uid) {
      setUid(location.state.uid);
      //console.log('from eff'+uid)
      firestore.getUser(location.state.uid,getUserSuccess,getUserUnsuccess)
    } else {
      console.warn('No ID found in location state');
    }
  }, [location.state]);

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
    // const filtered = allUser.filter(user => user.name.toLowerCase().includes(query));
    // setFilteredUsers(filtered);
  };


  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        
        <main className="main-content">
          <header>
            <h1>ทำเรื่องเงินเดือน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
                <p style={{fontSize:28,marginLeft:15,marginTop:20}}>เงินเดือน: {name}</p>
            <div className="search-field">
                <button onClick={()=> calSalary(uid)}>คำนวณเงินเดือน</button>
            {/* <p style={{marginTop:17}}>ค้นหา</p>
                <input style={{width:'40%',margin:5,height:40,borderRadius:20,paddingInlineStart:10,fontSize:18}}
                placeholder='search..' 
                value={search}
                onChange={handleSearch} /> */}
                {/*<button className="search-button" ><IoSearchOutline size={24} /></button>*/}
              </div>
              
      
              <div style={{width:'95%',alignSelf:'center',marginTop:20}}>
              <TableBootstrap striped bordered hover>
                <thead>
                  <tr>
                    <th scope="col">ลำดับ</th>
                    <th scope="col">เดือน</th>
                    <th scope="col">ตำแหน่ง</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {/*{allUser.slice(startIndex, endIndex).map((item, index) => (*/}
                  {/* {filteredUsers.map((item, index) => (
                    <tr key={item.id} onClick={()=>calSalary(item.id)}>
                      {/*<th scope="row">{startIndex + index + 1}</th>*
                      <th scope="row">{index + 1}</th>
                      <td>
                        {item.name}
                      </td>
                      <td>{item.position}</td>
                      <td style={{width:'20%',textAlign:'center'}}>
                        
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </TableBootstrap>
              {/*<div>
                <button onClick={onPrevious}>Previous</button>
                <button onClick={onNext}>Next</button>
                </div>*/}
              </div>
            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default SalaryList;

  