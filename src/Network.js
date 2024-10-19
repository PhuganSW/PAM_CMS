import React,{useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useEffect, useState } from 'react';
import firestore from './Firebase/Firestore';
import { UserContext } from './UserContext';

import Layout from './Layout';
import './Network.css'

function Network() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [topProfiles, setTopProfiles] = useState([]);
  const { setCurrentUser, companyId } = useContext(UserContext);

  useEffect(() => {
    // Fetch all users from Firestore
    const unsubscribeAllUsers = firestore.getAllUser(companyId,
      (usersData) => {
        console.log("Fetched users:", usersData); // Log fetched users
        setUsers(usersData);
      },
      (error) => console.error("Error fetching users: ", error)
    );
    const unsubscribeTopProfiles = firestore.getTopProfiles(
      companyId,
      (topProfilesData) => {
        setTopProfiles(topProfilesData);
      },
      (error) => console.error("Error fetching top profiles: ", error)
    );
    return () => {
      unsubscribeAllUsers(); // Clean up all users listener
      unsubscribeTopProfiles(); // Clean up top profiles listener
    };
  }, [companyId]);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100'; // Fallback image URL
  };

  const getBorderColor = (userId) => {
    const topIndex = topProfiles.findIndex((profile) => profile.id === userId);
    if (topIndex === 0) return "#E1AE04"; // 1st place
    if (topIndex === 1) return "#929292"; // 2nd place
    if (topIndex === 2) return "#C44500"; // 3rd place
    return 'transparent'; // No border for users outside top 3
  };

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
         
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>เครือข่ายภายใน</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
            <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '95%', marginTop: 30 }}>
            <div className="form-row" style={{ display: 'flex',}}>
                <p style={{fontSize:28,backgroundColor:'#D3D3D3',width:'100%',
                            alignSelf:'center',borderLeft: '5px solid black',borderRadius:5,paddingLeft:5}}>ตำแหน่งงาน :</p>
              </div>
              <div className="user-grid">
              {users.map((user) => (
                  <div
                    key={user.id}
                    className="user-card"
                    style={{
                      border: `5px solid ${getBorderColor(user.id)}`,
                      borderRadius: '10px',
                    }}
                  >
                    <img
                      src={user.image_off}
                      alt={`${user.name}'s profile`}
                      width={100}
                      height={100}
                      onError={handleImageError}
                    />
                    <h3>{user.name}</h3>
                    <p>{user.position}</p>
                    {/* Show Likes only for top profiles */}
                    {topProfiles.find((profile) => profile.id === user.id) && (
                      <p>Likes: {topProfiles.find((profile) => profile.id === user.id).count}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            </div>
          </div>
        
        </main>
      </div>
      
    
  );
}

export default Network;

  