//App.js
import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
import { AdminProvider, AdminContext } from './AdminContext';
import Login from './Login';
import Home from './Home';
import ProfileManage from './Profile/ProfileManage';
import CheckHistory from './CheckHistory';
import LeaveRequest from './LeaveRequest';
import OTRequest from './OTRequest';
import Welthfare from './Welthfare';
import Salary from './Salary';
import Annouce from './Annouce';
import ProfileAdd from './Profile/ProfileAdd';
import ManageAccount from './ManageAccount';
import ProfileEdit from './Profile/ProfileEdit';
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
import ProfileRole from './Profile/ProfileRole';
import ProfileUpSk from './Profile/ProfileUpSk';
import ProfileNotice from './Profile/ProfileNotice';
import ProfileSalary from './Profile/ProfileSalary';
import Register from './Register';
import SplashScreen from './SplashScreen';
import Service from './Service';
import LoginAdmin from './LoginAdmin';
import ApprovePlan from './ApprovePlan';
import ResetPassword from './ResetPassword';
import NotFound from './NotFound';
import AnnouceExtend from './AnnouceExtend';
import AnnouceExtendAdd from './AnnouceExtendAdd';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // Hide the splash screen after 3 seconds
    }, 2000); // Duration of the splash screen (3000ms = 3 seconds)

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  if (showSplash) {
    return <SplashScreen />; // Show the splash screen while the timer is running
  }
  
  return (
    <>
    <UserProvider>
    <AdminProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Service />}/>
          <Route path="/login_company" element={<ProtectedRouteHome><LoginCompany /></ProtectedRouteHome>} />
          <Route path="/login" element={<ProtectedLogin><Login /></ProtectedLogin>} />
          <Route path="/register" element={<Register />}/>
          <Route path="/forgot_password" element={<ForgotPass />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login_admin" element={<LoginAdmin />} />
          <Route path="/home" element={<ProtectedUserRoute><Home /></ProtectedUserRoute>} />
          <Route path="/profile" element={<ProtectedUserRoute><ProfileManage /></ProtectedUserRoute>} />
          <Route path="/checkin_history" element={<ProtectedUserRoute><CheckHistory /></ProtectedUserRoute>} />
          <Route path="/leave_request" element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />
          <Route path="/ot_request" element={<ProtectedRoute><OTRequest /></ProtectedRoute>} />
          <Route path="/welthfare" element={<ProtectedRoute><Welthfare /></ProtectedRoute>} />
          <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
          <Route path="/annouce" element={<ProtectedRoute><Annouce /></ProtectedRoute>} />
          <Route path="/annouce_add" element={<ProtectedRoute><AnnouceAdd /></ProtectedRoute>} />
          <Route path="/annouce_edit" element={<ProtectedRoute><AnnouceEdit /></ProtectedRoute>} />
          <Route path="/annouce_extend" element={<ProtectedRoute><AnnouceExtend /></ProtectedRoute>} />
          <Route path="/annouce_extend/add" element={<ProtectedRoute><AnnouceExtendAdd /></ProtectedRoute>} />
          <Route path="/profile_add" element={<ProtectedRoute><ProfileAdd /></ProtectedRoute>} />
          <Route path="/profile_edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/profile_role" element={<ProtectedRoute><ProfileRole /></ProtectedRoute>} />
          <Route path="/profile_upskill" element={<ProtectedRoute><ProfileUpSk /></ProtectedRoute>} />
          <Route path="/profile_notice" element={<ProtectedRoute><ProfileNotice /></ProtectedRoute>} />
          <Route path="/profile_salary" element={<ProtectedRoute><ProfileSalary /></ProtectedRoute>} />
          <Route path="/manage_account" element={<ProtectedRoute><ManageAccount /></ProtectedRoute>} />
          <Route path="/salary_cal" element={<ProtectedRoute><SalaryCal /></ProtectedRoute>} />
          <Route path="/salary_list" element={<ProtectedRoute><SalaryList /></ProtectedRoute>} />
          <Route path="/welthfare_manage" element={<ProtectedRoute><WelthfareManage /></ProtectedRoute>} />
          <Route path="/manageIndex" element={<ProtectedRoute><ManageIndex /></ProtectedRoute>} />
          <Route path="/managment" element={<ProtectedRoute><ManagePeople /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />

          <Route path="/approve_plan" element={<ProtectedAdminRoute><ApprovePlan /></ProtectedAdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      </AdminProvider>
    </UserProvider>
    </>
  );
}

const ProtectedRouteHome = ({ children }) => {
  const { currentUser, loading, companyId } = useContext(UserContext);

  if (loading) {
    console.log('loading is true');
    return <div>Loading...</div>; // Show loading while checking auth state
  }

  console.log('currentUser:', currentUser, 'companyId:', companyId);

  if (currentUser && companyId) {
    return <Navigate to="/home" />; // If user is signed in and companyId exists, redirect to home
  }

  return children; // Otherwise, show login company page
};

// Protect all authenticated routes
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>;  // Show loading while checking auth state
  }

  if (!currentUser) {
    return <Navigate to="/login_company" />;  // Redirect to the login company page if not logged in
  }

  return children;
};

// Prevent access to login page if already signed in
const ProtectedLogin = ({ children }) => {
  const { currentUser, companyId } = useContext(UserContext);

  if (currentUser && companyId) {
    return <Navigate to="/home" />;  // Redirect to home if already logged in
  }

  return children;
};

const ProtectedUserRoute = ({ children }) => {
  const { currentUser, loading,setLoading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  // หากอยู่ใน Admin Mode หรือไม่มี currentUser ให้ Redirect ไปหน้า Login User
  if (localStorage.getItem('isAdminMode') === 'true' || !currentUser) {
    localStorage.setItem('isAdminMode', 'false'); // เปลี่ยนโหมดเป็น User
    setLoading(false)
    return <Navigate to="/login_company" />;
  }

  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { currentAdmin, loadingAdmin,setLoadingAdmin } = useContext(AdminContext);
  console.log('currentAdmin:',currentAdmin)
  if (loadingAdmin) return <div>Loading...</div>;

  // หากอยู่ใน User Mode หรือไม่มี currentAdmin ให้ Redirect ไปหน้า Login Admin
  if (localStorage.getItem('isAdminMode') !== 'true' || !currentAdmin) {
    localStorage.setItem('isAdminMode', 'true'); // เปลี่ยนโหมดเป็น Admin
    setLoadingAdmin(false)
    return <Navigate to="/login_admin" />;
  }

  return children;
};

export default App;

