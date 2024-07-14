import React,{useEffect,useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Navigate } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { useNavigate } from 'react-router-dom';
import firestore from './Firebase/Firestore';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { IoSearchOutline } from "react-icons/io5";
import Layout from './Layout';

function Contact() {
  const navigate = useNavigate();
 
  useEffect(() => {
    
  }, []);

  return (
        
      <div className="dashboard">
        {/* <Sidebar /> */}
        <Layout />
        <main className="main-content">
          
          <div class="main">
          <div className='header-page'>
          <header>
            <h1>ติดต่อผู้พัฒนา</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div class="main-contain">
           
              

            </div>
          </div>
        </main>
      </div>
      
    
  );
}

export default Contact;

  