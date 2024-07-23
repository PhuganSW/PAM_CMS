import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ProfileManage from './ProfileManage';
import CheckHistory from './CheckHistory';
import LeaveRequest from './LeaveRequest';
import OTRequest from './OTRequest';
import Welthfare from './Welthfare';
import Salary from './Salary';
import Annouce from './Annouce';
import ProfileAdd from './ProfileAdd';
import ManageAccount from './ManageAccount';
import ProfileEdit from './ProfileEdit';
import AnnouceAdd  from './AnnouceAdd';
import AnnouceEdit from './AnnouceEdit';
import SalaryCal from './SalaryCal';
import WelthfareManage from './WelthfareManage';
import ForgotPass from './ForgotPass';
import SalaryList from './SalaryList';
import ManageIndex from './ManageIndex';
import ManagePeople from './Managepeople';
import Network from './Network';
import Contact from './Contact';
import { auth } from './Firebase/Config';
import firestore from './Firebase/Firestore';
import CalendarPage from './Calendar';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkUser,setCheckuser] = useState(false)

  const getAccountS=(data)=>{
    setCheckuser(true)
  }

  const getAccountUn=()=> alert("Not Found user!!");


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if(user){
        console.log(user.uid)
        firestore.getAccount(user.uid,getAccountS,getAccountUn)
      }
      //console.log(user.uid)
      
      setLoading(false); // Stop loading when auth state is determined
    });
    return unsubscribe;
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>; // Show loading indicator while checking auth state
  // }

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={currentUser ? <Home /> : <Navigate to="/" />} />
        <Route path="/profile" element={currentUser ? <ProfileManage /> : <Navigate to="/" />} />
        <Route path="/checkin_history" element={currentUser ? <CheckHistory /> : <Navigate to="/" />} />
        <Route path="/leave_request" element={currentUser ? <LeaveRequest /> : <Navigate to="/" />} />
        <Route path="/ot_request" element={currentUser ? <OTRequest /> : <Navigate to="/" />} />
        <Route path="/welthfare_manage" element={currentUser ? <Welthfare /> : <Navigate to="/" />} />
        <Route path="/salary_manage" element={currentUser ? <Salary /> : <Navigate to="/" />} />
        <Route path="/annouce" element={currentUser ? <Annouce /> : <Navigate to="/" />} />
        <Route path="/add_profile" element={currentUser ? <ProfileAdd /> : <Navigate to="/" />} />
        <Route path="/edit_profile" element={currentUser ? <ProfileEdit /> : <Navigate to="/" />} />
        <Route path="/manage_account" element={currentUser ? <ManageAccount /> : <Navigate to="/" />} /> */}

        <Route path="/" element={currentUser && checkUser ? <Navigate to="/home" /> : <Login />} />
        <Route path='/forgot_password' Component={ForgotPass} />
        <Route path="/home" element={currentUser && checkUser ? <Home /> : <Navigate to="/" />} />
        <Route path='/profile' element={currentUser && checkUser ? <ProfileManage /> : <Navigate to="/" />} />
        <Route path='/checkin_history' element={currentUser && checkUser ? <CheckHistory /> : <Navigate to="/" />} />
        <Route path='/leave_request' element={currentUser && checkUser ? <LeaveRequest /> : <Navigate to="/" />} />
        <Route path='/ot_request' element={currentUser && checkUser ? <OTRequest /> : <Navigate to="/" />} />
        <Route path='/welthfare' element={currentUser && checkUser ? <Welthfare /> : <Navigate to="/" />} />
        <Route path='/salary' element={currentUser && checkUser ? <Salary /> : <Navigate to="/" />}/>
        <Route path='/annouce' element={currentUser && checkUser ? <Annouce /> : <Navigate to="/" />} />
        <Route path='/annouce_add' element={currentUser && checkUser ? <AnnouceAdd /> : <Navigate to="/" />} />
        <Route path='/annouce_edit' element={currentUser && checkUser ? <AnnouceEdit /> : <Navigate to="/" />} />
        <Route path='/profile_add' element={currentUser && checkUser ? <ProfileAdd /> : <Navigate to="/" />} />
        <Route path='/profile_edit' element={currentUser && checkUser ? <ProfileEdit /> : <Navigate to="/" />} />
        <Route path='/manage_account' element={currentUser && checkUser ? <ManageAccount /> : <Navigate to="/" />} />
        <Route path='/salary_cal' element={currentUser && checkUser ? <SalaryCal /> : <Navigate to="/" />} />
        <Route path='/salary_list' element={currentUser && checkUser ? <SalaryList /> : <Navigate to="/" />} />
        <Route path='/welthfare_manage' element={currentUser && checkUser ? <WelthfareManage /> : <Navigate to="/" />} />
        <Route path='/manageIndex' element={currentUser && checkUser ? <ManageIndex /> : <Navigate to="/" />} />
        <Route path='/managment' element={currentUser && checkUser ? <ManagePeople /> : <Navigate to="/" />} />
        <Route path='/network' element={currentUser && checkUser ? <Network /> : <Navigate to="/" />} />
        <Route path='/contact' element={currentUser && checkUser ? <Contact /> : <Navigate to="/" />} />
        <Route path='/calendar' element={currentUser && checkUser ? <CalendarPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
