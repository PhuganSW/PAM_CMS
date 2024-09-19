import React, { useContext,useEffect,useState } from 'react';
import './Home.css'; // Your custom CSS file
import Layout from './Layout';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { UserContext } from './UserContext';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import firestore from './Firebase/Firestore';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Home() {
  const { setCurrentUser, companyId } = useContext(UserContext);
  const [workplaceUserData, setWorkplaceUserData] = useState([]);

  useEffect(() => {
    // Fetch workplace user count data
    firestore.getWorkplaceUserCounts(
      companyId,
      (data) => setWorkplaceUserData(data),  // On success, set the state
      (error) => console.error('Error fetching workplace data:', error) // On error
    );
  }, [companyId]);

  const pieData1 = {
    labels: ['เข้างาน', 'ลางาน', 'เข้าสาย', 'อื่นๆ'],
    datasets: [
      {
        label: 'จำนวนคนเข้าทำงาน',
        data: [10, 15, 20, 50],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#3f51b5'],
        hoverBackgroundColor: ['#66bb6a', '#ffb74d', '#e57373', '#5c6bc0'],
      },
    ],
  };

  const pieData2 = {
    labels: ['ออกงาน', 'ลาออก', 'ปลดออก'],
    datasets: [
      {
        label: 'จำนวนคนออกงาน',
        data: [5, 10, 15],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#ffb74d', '#e57373'],
      },
    ],
  };

  // Prepare the data for "จำนวนคนอื่นๆ" pie chart
  const otherPieChartData = {
    labels: workplaceUserData.map((workplace) => workplace.name), // Workplace names
    datasets: [
      {
        label: 'จำนวนคนตามพื้นที่ทำงาน',
        data: workplaceUserData.map((workplace) => workplace.count), // Number of users in each workplace
        backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#3f51b5', '#9c27b0'],  // Add more colors if needed
        hoverBackgroundColor: ['#66bb6a', '#ffb74d', '#e57373', '#5c6bc0', '#d05ce3'],
      },
    ],
  };

  const barData1 = {
    labels: ['group A', 'group B', 'group C'],
    datasets: [
      {
        label: 'Dataset 1',
        backgroundColor: '#4caf50',
        data: [4, 3, 5],
      },
      {
        label: 'Dataset 2',
        backgroundColor: '#ff9800',
        data: [1, 6, 3],
      },
      {
        label: 'Dataset 3',
        backgroundColor: '#f44336',
        data: [2, 5, 6],
      },
    ],
  };

  const barData2 = {
    labels: ['group D', 'group E', 'group F'],
    datasets: [
      {
        label: 'Dataset 1',
        backgroundColor: '#3f51b5',
        data: [5, 2, 4],
      },
      {
        label: 'Dataset 2',
        backgroundColor: '#ffeb3b',
        data: [3, 5, 6],
      },
      {
        label: 'Dataset 3',
        backgroundColor: '#9c27b0',
        data: [4, 3, 7],
      },
    ],
  };

  return (
    <div className="dashboard">
      <Layout />
      
      <main className="dashboard-contain">
        {/* First Row: Two Pie Charts */}
        <div className="chart-row">
          <div className="pie-chart-container">
            <p style={{marginBottom:-10}}>จำนวนคนเข้าทำงาน</p>
            <Pie
              data={pieData1}
              options={{ maintainAspectRatio: false }}
              style={{ width: '300px', height: '300px' }} // Direct control of width and height
            />
          </div>
          
          <div className="pie-chart-container">
            <p style={{marginBottom:-10}}>จำนวนคนออกงาน</p>
            <Pie
              data={pieData2}
              options={{ maintainAspectRatio: false }}
              style={{ width: '300px', height: '300px' }} // Direct control of width and height
            />
          </div>
        </div>

        {/* Second Row: One Pie Chart and One Container */}
        <div className="chart-row">
          <div className="pie-chart-container">
            <p style={{marginBottom:-10}}>จัดการกำลังคน</p>
            <Pie
              data={otherPieChartData}
              options={{ maintainAspectRatio: false }}
              style={{ width: '300px', height: '300px' }} // Direct control of width and height
            />
          </div>
          
          <div className="chart-container">
            <p>Custom Container</p>
            <div style={{ backgroundColor: '#f5f5f5', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Custom content here
            </div>
          </div>
        </div>

        {/* Third Row: Two Bar Charts */}
        <div className="chart-row">
          <div className="chart-container">
            <Bar
              data={barData1}
              options={{ maintainAspectRatio: false }}
              style={{ width: '400px', height: '250px' }} // Direct control of width and height
            />
          </div>

          <div className="chart-container">
            <Bar
              data={barData2}
              options={{ maintainAspectRatio: false }}
              style={{ width: '400px', height: '250px' }} // Direct control of width and height
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
