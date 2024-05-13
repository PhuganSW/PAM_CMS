import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import firestore from './Firebase/Firestore';


function OTRequest() {
  const navigate = useNavigate();
  const [allOT, setAllOT] = useState([]);

  const getAllOTSuccess=(doc)=>{
    let ots = []
    if (allOT.length === 0) {
        
      doc.forEach((item) => {
        ots.push({id: item.id,date:item.date, name: item.name,time:item.time, state:item.state});
      });
      setAllOT(ots);
    }
  }

  const getAllOTUnsuccess=(error)=>{
    console.log("getOTLeave: "+error)
  }

  useEffect(() => {
    firestore.getAllOT(getAllOTSuccess,getAllOTUnsuccess)
  }, []);



  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>คำขอทำ OT</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">
            <div class="search-field">
                <p style={{marginTop:10}}>ค้นหาพนักงาน</p>
                <input style={{width:'40%',margin:5,height:30,borderRadius:20,paddingInlineStart:10,fontSize:18}} />
                <button class="search-button"></button>
              </div>
              
              <div style={{display:'flex',width:'95%',alignSelf:'center',flexDirection:'row',justifyContent: 'space-around'}}>
                
                <div style={{width:'95%'}}>
                
                <TableBootstrap striped bordered hover style={{marginTop:20}}>
                  <thead>
                    <tr>
                      <th scope="col">ลำดับ</th>
                      <th scope="col">วันที่</th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope='col'>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/*{allUser.slice(startIndex, endIndex).map((item, index) => (*/}
                  {allOT.map((item, index) => (
                    <tr key={item.id}>
                      {/*<th scope="row">{startIndex + index + 1}</th>*/}
                      <th scope="row">{index + 1}</th>
                      <td>
                        {item.date}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.time}</td>
                      {item.state ? (
                        <td>allowed</td>
                      ) : (
                        <td>not allowed</td>
                      )}
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

export default OTRequest;

  