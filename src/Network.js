import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useEffect, useState } from 'react';
import firestore from './Firebase/Firestore';

import Layout from './Layout';
import './Network.css'

function Network() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users from Firestore
    const unsubscribe = firestore.getAllUser(
      (usersData) => {
        console.log("Fetched users:", usersData); // Log fetched users
        setUsers(usersData);
      },
      (error) => console.error("Error fetching users: ", error)
    );
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100'; // Fallback image URL
  };

  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
         
          <div className="main">
            <div className='header-page'>
              <header>
                <h1>Network</h1>
                {/* Add user profile and logout here */}
              </header>
            </div>
            <div className="main-contain">
            <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '95%', marginTop: 30 }}>
            <div className="form-row" style={{ display: 'flex',}}>
                <p style={{fontSize:28}}>ตำแหน่งงาน :</p>
              </div>
              <div className="user-grid">
                {users.map((user, index) => (
                  <div key={user.id} className="user-card">
                    <img
                      src={user.image_off}
                      alt={`${user.name}'s profile`}
                      width={100}
                      height={100}
                      onError={handleImageError}
                    />
                    <h3>{user.name}</h3>
                    <p>{user.position}</p>
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

  