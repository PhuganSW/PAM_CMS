import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css'; // Your custom CSS file
/*import BarChart from './BarChart'; // Custom bar chart component
import PieChart from './PieChart'; // Custom pie chart component
import ApplicantList from './ApplicantList'; // Applicant list component
import InterviewSchedule from './InterviewSchedule'; // Interview schedule component*/

function Home() {
  return (
    
      <div className="dashboard">
        <nav className="sidebar">
          <div className='head-sidebar'>
            <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={80} height={80} style={{marginRight:20}} alt="Logo" />
            <h4>Personnel Assistance Manager</h4>
          </div>
          <ul>
            <li><Link to="/profile">ประวัติพนักงาน</Link></li>
            <li><Link to="/applicants">Applicants</Link></li>
            <li><Link to="/jobs">Jobs</Link></li>
            {/* Add other navigation links here */}
          </ul>
        </nav>
        
        <main className="main-content">
          <header>
            <h1></h1>
            {/* Add user profile and logout here */}
          </header>
          
         
        </main>
      </div>
      
    
  );
}

export default Home;

  