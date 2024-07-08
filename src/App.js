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
import { auth } from './Firebase/Config';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
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

        <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Login />} />
        <Route path='/forgot_password' Component={ForgotPass} />
        <Route path="/home" element={currentUser ? <Home /> : <Navigate to="/" />} />
        <Route path='/profile' element={currentUser ? <ProfileManage /> : <Navigate to="/" />} />
        <Route path='/checkin_history' element={currentUser ? <CheckHistory /> : <Navigate to="/" />} />
        <Route path='/leave_request' element={currentUser ? <LeaveRequest /> : <Navigate to="/" />} />
        <Route path='/ot_request' element={currentUser ? <OTRequest /> : <Navigate to="/" />} />
        <Route path='/welthfare' element={currentUser ? <Welthfare /> : <Navigate to="/" />} />
        <Route path='/salary' element={currentUser ? <Salary /> : <Navigate to="/" />}/>
        <Route path='/annouce' element={currentUser ? <Annouce /> : <Navigate to="/" />} />
        <Route path='/annouce_add' element={currentUser ? <AnnouceAdd /> : <Navigate to="/" />} />
        <Route path='/annouce_edit' element={currentUser ? <AnnouceEdit /> : <Navigate to="/" />} />
        <Route path='/profile_add' element={currentUser ? <ProfileAdd /> : <Navigate to="/" />} />
        <Route path='/profile_edit' element={currentUser ? <ProfileEdit /> : <Navigate to="/" />} />
        <Route path='/manage_account' element={currentUser ? <ManageAccount /> : <Navigate to="/" />} />
        <Route path='/salary_cal' element={currentUser ? <SalaryCal /> : <Navigate to="/" />} />
        <Route path='/salary_list' element={currentUser ? <SalaryList /> : <Navigate to="/" />} />
        <Route path='/welthfare_manage' element={currentUser ? <WelthfareManage /> : <Navigate to="/" />} />
        <Route path='/manageIndex' element={currentUser ? <ManageIndex /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
