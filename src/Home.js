import React, { useContext } from 'react';
import './Home.css'; // Your custom CSS file
import Layout from './Layout';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { UserContext } from './UserContext';

function Home() {
  const { setCurrentUser, companyId } = useContext(UserContext);

  return (
    <div className="dashboard">
      <Layout />
      
      <main className="dashboard-contain">
        <div className="chart-row">
          <div className="chart-container">
            <p>จำนวนคนเข้าทำงาน</p>
            <PieChart
              series={[
                {
                  data: [
                    { value: 10, label: 'เข้างาน', color: '#4caf50' }, // Green color
                    { value: 15, label: 'ลางาน', color: '#ff9800' },  // Orange color
                    { value: 20, label: 'เข้าสาย', color: '#f44336' }, // Red color
                    { value: 50, label: 'อื่นๆ', color: '#3f51b5' },   // Blue color
                  ],
                },
              ]}
              width={350}
              height={150}
              labels={{
                style: {
                  fontFamily: 'THSarabunNew',
                  fontSize: 16,
                  color: '#ffffff', // Change label color here
                },
              }}
              responsive
            />
          </div>
          
          <div className="chart-container">
            <p>จำนวนคนออกงาน</p>
            <PieChart
              series={[
                {
                  data: [
                    { value: 5, label: 'ออกงาน', color: '#4caf50' }, // Green
                    { value: 10, label: 'ลาออก', color: '#ff9800' },  // Orange
                    { value: 15, label: 'ปลดออก', color: '#f44336' }, // Red
                  ],
                },
              ]}
              width={350}
              height={150}
              labels={{
                style: {
                  fontFamily: 'THSarabunNew',
                  fontSize: 16,
                  color: '#ffffff', // Change label color here
                },
              }}
              responsive
            />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-container">
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
              series={[
                { data: [4, 3, 5], color: '#4caf50' }, // Green bars
                { data: [1, 6, 3], color: '#ff9800' },  // Orange bars
                { data: [2, 5, 6], color: '#f44336' },  // Red bars
              ]}
              width={500}
              height={250}
              style={{ fontFamily: 'THSarabunNew', fontSize: 16 }}
              responsive
            />
          </div>

          <div className="chart-container">
            <BarChart
              xAxis={[{ scaleType: 'band', data: ['group D', 'group E', 'group F'] }]}
              series={[
                { data: [5, 2, 4], color: '#3f51b5' }, // Blue bars
                { data: [3, 5, 6], color: '#ffeb3b' }, // Yellow bars
                { data: [4, 3, 7], color: '#9c27b0' }, // Purple bars
              ]}
              width={500}
              height={250}
              style={{ fontFamily: 'THSarabunNew', fontSize: 16 }}
              responsive
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
