import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css'; // Your custom CSS file
import Sidebar from './sidebar';
/*import BarChart from './BarChart'; // Custom bar chart component
import PieChart from './PieChart'; // Custom pie chart component
import ApplicantList from './ApplicantList'; // Applicant list component
import InterviewSchedule from './InterviewSchedule'; // Interview schedule component*/
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Layout from './Layout';

function Home() {

  return (
    
      <div className="dashboard">
       <Layout />
        
        
        <main className="main-content">
        
          <header>
            <h1>Dashboard</h1>
            {/* Add user profile and logout here */}
          </header>
          <section className="most-applied-positions">
          <p>จำนวนคนเข้าทำงาน</p>
          <PieChart
            series={[
              {
                data: [
                  { value: 10, label: 'เข้างาน' },
                  {  value: 15, label: 'ลางาน' },
                  {  value: 20, label: 'เข้าสาย' },
                ],
              },
            ]}
            width={400}
            height={200}
          />
          </section>

          <section className="statistics">
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
              width={500}
              height={300}
            />
          </section>
         
        </main>
      </div>
      
    
  );
}

export default Home;

  