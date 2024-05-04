import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import './Profile.css';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';

function ProfileManage() {
  const navigate = useNavigate();
  const onAdd =()=>{
    navigate('/add_profile');
  }
  {/*const [people, setItems] = useState([]);

  useEffect(() => {
    fetch("https://www.mecallapi.com/api/users")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
          console.log(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);*/}

  return (
    
      <div className="dashboard">
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>จัดการประวัติพนักงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          <div class="main">
            <div class="main-contain">

              <div class="search-field">
                <p style={{marginTop:10}}>ค้นหาพนักงาน</p>
                <input style={{width:'40%',margin:5,height:30,borderRadius:20,paddingInlineStart:10,fontSize:18}} />
                <button class="search-button"></button>
              </div>
              
              <button className='Add-button' onClick={onAdd}>เพิ่มพนักงาน</button>
              <div style={{width:'95%',alignSelf:'center'}}>
              <TableBootstrap striped bordered hover>
                <thead>
                  <tr>
                    <th scope="col">ลำดับ</th>
                    <th scope="col">ชื่อ-สกุล</th>
                    <th scope="col">ตำแหน่ง</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {/*people.map((person) => (
                    <tr key={person.id}>*/}
                    <tr>
                      <th scope="row">1</th>
                      <td>
                        AAA BBB
                      </td>
                      <td>img</td>
                      <td style={{width:'20%',textAlign:'center'}}>
                        <button className='Edit-button'>แก้ไขประวัติ</button>
                        <button className='Delete-button'>ลบประวัติ</button>
                      </td>
                    </tr>
                  {/*}))}*/}
                </tbody>
              </TableBootstrap>
              </div>

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default ProfileManage;

  