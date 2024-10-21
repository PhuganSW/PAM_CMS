import React, { useState,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';
import auth from './Firebase/Auth';
import { UserContext } from './UserContext';
import firestore from './Firebase/Firestore';

const Layout = ({ children }) => {
  // const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024); // Default: open on large screens, closed on small screens
  // const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1024); // Check if it's mobile view
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId, setCurrentUser, setCompanyId,setUserData,userData,newLeaveRequests, setNewLeaveRequests,newOtRequests,setNewOtRequests } = useContext(UserContext);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    return savedSidebarState ? JSON.parse(savedSidebarState) : window.innerWidth > 1024;
  });
  
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsMobileView(true);
        setSidebarOpen(false); // Collapse on mobile view
      } else {
        setIsMobileView(false);
        //setSidebarOpen(true); // Expand on large screens
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!companyId) {
      console.error('Invalid companyId:', companyId);
      return; // Early exit if companyId is not valid
    }
  
    // Listen for new leave requests from Firestore
    const unsubscribe = firestore.getAllLeave(companyId, (allLeave) => {
      // Check if there are any requests with state === true
      const hasNewRequests = allLeave.some(leave => leave.state1 === false);

      if (hasNewRequests) {
        setNewLeaveRequests(true); // Set notification flag to true when new requests are detected
      } else {
        setNewLeaveRequests(false); // Set it to false if there are no new requests
      }
    }, console.error);

    return () => unsubscribe(); // Unsubscribe from Firestore when the component unmounts
  }, [companyId, setNewLeaveRequests]);

  useEffect(() => {
    // Reset `newLeaveRequests` when "คำขอลางาน" page is active
    if (location.pathname === '/leave_request' && newLeaveRequests) {
      console.log('Resetting newLeaveRequests to false');
      setNewLeaveRequests(false); // Reset flag when user navigates to the leave request page
    }
  }, [location.pathname, newLeaveRequests, setNewLeaveRequests]);

  useEffect(() => {
    if (!companyId) {
      console.error('Invalid companyId:', companyId);
      return;
    }
    // Listen for new leave requests from Firestore
    const unsubscribe = firestore.getAllOT(companyId, (allOt) => {
      // Check if there are any requests with state === true
      const hasNewRequests = allOt.some(ot => ot.state1 === false);

      if (hasNewRequests) {
        setNewOtRequests(true); // Set notification flag to true when new requests are detected
      } else {
        setNewOtRequests(false); // Set it to false if there are no new requests
      }
    }, console.error);

    return () => unsubscribe(); // Unsubscribe from Firestore when the component unmounts
  }, [companyId, setNewOtRequests]);

  useEffect(() => {
    // Reset `newLeaveRequests` when "คำขอลางาน" page is active
    if (location.pathname === '/ot_request' && newOtRequests) {
      //console.log('Resetting newLeaveRequests to false');
      setNewOtRequests(false); // Reset flag when user navigates to the leave request page
    }
  }, [location.pathname, newOtRequests, setNewOtRequests]);

  const toggleSidebar = () => {
    const newSidebarState = !sidebarOpen;
    setSidebarOpen(newSidebarState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newSidebarState)); // Store sidebar state
  };

  const logOutSuccess = () => {
    setCurrentUser(null);  // Clear user from context
    setCompanyId(null);    // Clear companyId from context
    setUserData(null);     // Clear userData from context
    localStorage.removeItem('companyId');  // Clear companyId from localStorage
    localStorage.removeItem('userData'); // Clear companyId from localStorage
    localStorage.removeItem('sidebarOpen');
    navigate('/');  // Redirect to login company page
  };

  const logout = (e) => {
    e.preventDefault();
    auth.signOut(logOutSuccess);
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
        <div className='head-sidebar'>
            <img src="https://i.postimg.cc/VLLwZdzX/PAM-logo.png" width={80} height={80} style={{marginRight:20}} alt="Logo" />
            {sidebarOpen && <h4>Personnel Assistance Manager</h4>}
          </div>
          <nav>
          <ul>
              <li className={isActive("/home") ? "active" : ""}>
                <Link to="/home">
                  <i className="fas fa-home"></i> {/* Home Icon */}
                  <span>สรุปภาพรวมข้อมูล</span>
                </Link>
              </li>
              <li className={isActive("/manageIndex") ? "active" : ""}>
                <Link to="/manageIndex">
                  <i className="fas fa-database"></i> {/* Database Icon */}
                  <span>การตั้งค่าพื้นฐาน</span>
                </Link>
              </li>
              <li className={isActive("/profile") ? "active" : ""}>
                <Link to="/profile">
                  <i className="fas fa-user"></i> {/* User Icon */}
                  <span>การจัดการข้อมูลพนักงาน</span>
                </Link>
              </li>
              <li className={isActive("/welthfare") ? "active" : ""}>
                <Link to="/welthfare">
                  <i className="fas fa-calendar-check"></i> {/* Calendar Check Icon */}
                  <span>การจัดการสิทธิ์และวันหยุด</span>
                </Link>
              </li>
              <li className={isActive("/managment") ? "active" : ""}>
                <Link to="/managment">
                  <i className="fas fa-users"></i> {/* Users Icon */}
                  <span>การบริหารพื้นที่ปฏิบัติการ</span>
                </Link>
              </li>
              <li className={isActive("/salary") ? "active" : ""}>
                <Link to="/salary">
                  <i className="fas fa-money-bill-wave"></i> {/* Money Icon */}
                  <span>การจัดการเงินเดือน</span>
                </Link>
              </li>
              <li className={isActive("/checkin_history") ? "active" : ""}>
                <Link to="/checkin_history">
                  <i className="fas fa-clock"></i> {/* Clock Icon */}
                  <span>ประวัติการเข้า-ออกงาน</span>
                </Link>
              </li>
              <li className={isActive("/leave_request") ? "active" : ""}>
                <Link to="/leave_request">
                  <i className="fas fa-suitcase"></i> {/* Suitcase Icon */}
                  <span>การขอลางาน</span>
                  {newLeaveRequests && <span className="notification-dot"></span>}
                </Link>
              </li>
              <li className={isActive("/ot_request") ? "active" : ""}>
                <Link to="/ot_request">
                  <i className="fas fa-hourglass-half"></i> {/* Hourglass Icon */}
                  <span>การขอทำงานล่วงเวลา</span>
                  {newOtRequests && <span className="notification-dot"></span>}
                </Link>
              </li>
              <li className={isActive("/annouce") ? "active" : ""}>
                <Link to="/annouce">
                  <i className="fas fa-bullhorn"></i> {/* Announcement Icon */}
                  <span>การประกาศข่าวสาร</span>
                </Link>
              </li>
              <li className={isActive("/network") ? "active" : ""}>
                <Link to="/network">
                  <i className="fas fa-network-wired"></i> {/* Network Icon */}
                  <span>เครือข่ายภายใน</span>
                </Link>
              </li>
              
              <li className={isActive("/calendar") ? "active" : ""}>
                <Link to="/calendar">
                  <i className="fas fa-calendar"></i> {/* Calendar Icon */}
                  <span>ปฏิทินบันทึกโน้ต</span>
                </Link>
              </li>
              <li className={isActive("/manage_account") ? "active" : ""}>
                <Link to="/manage_account">
                  <i className="fas fa-cogs"></i> {/* Settings Icon */}
                  <span>การจัดการผู้ใช้งาน</span>
                </Link>
              </li>
              <li className={isActive("/contact") ? "active" : ""}>
                <Link to="/contact">
                  <i className="fas fa-envelope"></i> {/* Envelope Icon */}
                  <span>ติดต่อผู้พัฒนาโปรแกรม</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className='logout-button'> 
          <button style={{ fontSize: 22 }} onClick={logout}>
              <i className="fas fa-sign-out-alt"></i> {/* Sign Out Icon */}
              {sidebarOpen && "ออกจากระบบ"}
            </button>
          </div>
        </div>
      </div>
      
        
        <button className="toggle-button" onClick={toggleSidebar}>
          ☰
        </button>
          
       
        <div className="content">
          {children}
        </div>
      </div>
    
  );
};

export default Layout;
