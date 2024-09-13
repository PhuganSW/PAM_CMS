import React, { useState,useEffect,useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';
import auth from './Firebase/Auth';
import { UserContext } from './UserContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId, setCurrentUser, setCompanyId } = useContext(UserContext);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false); // Collapse sidebar if screen is small
      } else {
        setSidebarOpen(true);  // Open sidebar if screen is large
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logOutSuccess = () => {
    setCurrentUser(null);  // Clear user from context
    setCompanyId(null);    // Clear companyId from context
    localStorage.removeItem('companyId');  // Clear companyId from localStorage
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
        {/* <button className="toggle-button" onClick={toggleSidebar}>
            {sidebarOpen ? '☰' : '☰'}
          </button>
           */}
        <div className='head-sidebar'>
            <img src="https://i.postimg.cc/VLLwZdzX/PAM-logo.png" width={80} height={80} style={{marginRight:20}} alt="Logo" />
            {sidebarOpen && <h4>Personnel Assistance Manager</h4>}
          </div>
          <nav>
          <ul>
              <li className={isActive("/home") ? "active" : ""}>
                <Link to="/home">
                  <i className="fas fa-home"></i> {/* Home Icon */}
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className={isActive("/manageIndex") ? "active" : ""}>
                <Link to="/manageIndex">
                  <i className="fas fa-database"></i> {/* Database Icon */}
                  <span>จัดการ Index</span>
                </Link>
              </li>
              <li className={isActive("/profile") ? "active" : ""}>
                <Link to="/profile">
                  <i className="fas fa-user"></i> {/* User Icon */}
                  <span>จัดการประวัติพนักงาน</span>
                </Link>
              </li>
              <li className={isActive("/checkin_history") ? "active" : ""}>
                <Link to="/checkin_history">
                  <i className="fas fa-clock"></i> {/* Clock Icon */}
                  <span>ประวัติการเข้า-ออกงาน</span>
                </Link>
              </li>
              <li className={isActive("/managment") ? "active" : ""}>
                <Link to="/managment">
                  <i className="fas fa-users"></i> {/* Users Icon */}
                  <span>จัดการกำลังคน</span>
                </Link>
              </li>
              <li className={isActive("/network") ? "active" : ""}>
                <Link to="/network">
                  <i className="fas fa-network-wired"></i> {/* Network Icon */}
                  <span>Network</span>
                </Link>
              </li>
              <li className={isActive("/leave_request") ? "active" : ""}>
                <Link to="/leave_request">
                  <i className="fas fa-suitcase"></i> {/* Suitcase Icon */}
                  <span>คำขอลางาน</span>
                </Link>
              </li>
              <li className={isActive("/ot_request") ? "active" : ""}>
                <Link to="/ot_request">
                  <i className="fas fa-hourglass-half"></i> {/* Hourglass Icon */}
                  <span>คำขอทำ OT</span>
                </Link>
              </li>
              <li className={isActive("/welthfare") ? "active" : ""}>
                <Link to="/welthfare">
                  <i className="fas fa-calendar-check"></i> {/* Calendar Check Icon */}
                  <span>จัดการสิทธิ์และวันหยุด</span>
                </Link>
              </li>
              <li className={isActive("/salary") ? "active" : ""}>
                <Link to="/salary">
                  <i className="fas fa-money-bill-wave"></i> {/* Money Icon */}
                  <span>ทำเรื่องเงินเดือน</span>
                </Link>
              </li>
              <li className={isActive("/annouce") ? "active" : ""}>
                <Link to="/annouce">
                  <i className="fas fa-bullhorn"></i> {/* Announcement Icon */}
                  <span>ลงประกาศ</span>
                </Link>
              </li>
              <li className={isActive("/calendar") ? "active" : ""}>
                <Link to="/calendar">
                  <i className="fas fa-calendar"></i> {/* Calendar Icon */}
                  <span>ปฏิทิน</span>
                </Link>
              </li>
              <li className={isActive("/manage_account") ? "active" : ""}>
                <Link to="/manage_account">
                  <i className="fas fa-cogs"></i> {/* Settings Icon */}
                  <span>จัดการผู้ใช้</span>
                </Link>
              </li>
              <li className={isActive("/contact") ? "active" : ""}>
                <Link to="/contact">
                  <i className="fas fa-envelope"></i> {/* Envelope Icon */}
                  <span>ติดต่อผู้พัฒนา</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className='logout-button'> 
          <button style={{ fontSize: 22 }} onClick={logout}>
              <i className="fas fa-sign-out-alt"></i> {/* Sign Out Icon */}
              {sidebarOpen && "Sign Out"}
            </button>
          </div>
        </div>
      </div>
      
        
          <button className="toggle-button" onClick={toggleSidebar}>
            {sidebarOpen ? '☰' : '☰'}
          </button>
          
       
        <div className="content">
          {children}
        </div>
      </div>
    
  );
};

export default Layout;
