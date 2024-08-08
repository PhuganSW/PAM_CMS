//App.js
import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
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
import AnnouceAdd from './AnnouceAdd';
import AnnouceEdit from './AnnouceEdit';
import SalaryCal from './SalaryCal';
import WelthfareManage from './WelthfareManage';
import ForgotPass from './ForgotPass';
import SalaryList from './SalaryList';
import ManageIndex from './ManageIndex';
import ManagePeople from './Managepeople';
import Network from './Network';
import Contact from './Contact';
import CalendarPage from './Calendar';
import LoginCompany from './LoginCompany';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginCompany /> }/>
          <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />
          <Route path="/forgot_password" element={<ForgotPass />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileManage /></ProtectedRoute>} />
          <Route path="/checkin_history" element={<ProtectedRoute><CheckHistory /></ProtectedRoute>} />
          <Route path="/leave_request" element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />
          <Route path="/ot_request" element={<ProtectedRoute><OTRequest /></ProtectedRoute>} />
          <Route path="/welthfare" element={<ProtectedRoute><Welthfare /></ProtectedRoute>} />
          <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
          <Route path="/annouce" element={<ProtectedRoute><Annouce /></ProtectedRoute>} />
          <Route path="/annouce_add" element={<ProtectedRoute><AnnouceAdd /></ProtectedRoute>} />
          <Route path="/annouce_edit" element={<ProtectedRoute><AnnouceEdit /></ProtectedRoute>} />
          <Route path="/profile_add" element={<ProtectedRoute><ProfileAdd /></ProtectedRoute>} />
          <Route path="/profile_edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/manage_account" element={<ProtectedRoute><ManageAccount /></ProtectedRoute>} />
          <Route path="/salary_cal" element={<ProtectedRoute><SalaryCal /></ProtectedRoute>} />
          <Route path="/salary_list" element={<ProtectedRoute><SalaryList /></ProtectedRoute>} />
          <Route path="/welthfare_manage" element={<ProtectedRoute><WelthfareManage /></ProtectedRoute>} />
          <Route path="/manageIndex" element={<ProtectedRoute><ManageIndex /></ProtectedRoute>} />
          <Route path="/managment" element={<ProtectedRoute><ManagePeople /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

const Redirecthome = ({ children }) => {
  const { currentUser, checkUser } = useContext(UserContext);

  if (!currentUser || !checkUser) {
    return <Navigate to="/home" />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, checkUser } = useContext(UserContext);

  if (!currentUser || !checkUser) {
    return <Navigate to="/" />;
  }

  return children;
};

const ProtectedLogin = ({ children }) => {
  const { currentUser, checkUser,companyId } = useContext(UserContext);
  console.log("App: ",companyId)
  if (!companyId) {
    return <Navigate to="/" />;
  }

  return children;
};

export default App;
