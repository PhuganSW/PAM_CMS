import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css'; // Your custom CSS file
import Sidebar from './sidebar';
/*import BarChart from './BarChart'; // Custom bar chart component
import PieChart from './PieChart'; // Custom pie chart component
import ApplicantList from './ApplicantList'; // Applicant list component
import InterviewSchedule from './InterviewSchedule'; // Interview schedule component*/
import { PieChart } from '@mui/x-charts/PieChart';

function Home() {

  return (
    
      <div className="dashboard">
       
        <Sidebar />
        
        <main className="main-content">
          <header>
            <h1>Dashboard</h1>
            {/* Add user profile and logout here */}
          </header>
          <section className="most-applied-positions">
          <PieChart
  series={[
    {
      data: [
        { id: 0, value: 10, label: 'series A' },
        { id: 1, value: 15, label: 'series B' },
        { id: 2, value: 20, label: 'series C' },
      ],
    },
  ]}
  width={400}
  height={200}
/>
          </section>
         
        </main>
      </div>
      
    
  );
}

export default Home;

  