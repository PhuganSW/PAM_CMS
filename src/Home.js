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
  const { setCurrentUser, companyId, userData } = useContext(UserContext);
  const [workplaceUserData, setWorkplaceUserData] = useState([]);

  const generateColors = (length) => {
    // Define a base color palette
    const baseColors = ['#4caf50', '#ff9800', '#f44336', '#3f51b5', '#9c27b0', '#00acc1', '#8bc34a', '#cddc39', '#ff5722', '#607d8b'];
    
    // If the length of data exceeds the base colors, cycle through the array
    return Array.from({ length }, (_, i) => baseColors[i % baseColors.length]);
  };

  useEffect(() => {
    // Fetch workplace user count data
    //console.log(userData.position)
    firestore.getWorkplaceUserCounts(
      companyId,
      (data) => setWorkplaceUserData(data),  // On success, set the state
      (error) => console.error('Error fetching workplace data:', error) // On error
    );
  }, [companyId]);

  const pieData1 = {
    labels: ['ช่าง', 'บัญชี', 'ฝ่ายบุคคล', 'วิศวกร'],
    datasets: [
      {
        label: 'จำนวนพนักงาน',
        data: [10, 15, 20, 50],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#3f51b5'],
        hoverBackgroundColor: ['#66bb6a', '#ffb74d', '#e57373', '#5c6bc0'],
      },
    ],
  };

  const pieData2 = {
    labels: ['เข้างาน', 'ลากิจ', 'ลาป่วย','ลาพักร้อน'],
    datasets: [
      {
        label: 'สรุปประจำวัน',
        data: [5, 10, 15,10],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336','#E7F7F7'],
        hoverBackgroundColor: ['#66bb6a', '#ffb74d', '#e57373','#E2F2F2'],
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
        backgroundColor: generateColors(workplaceUserData.length),
        hoverBackgroundColor: generateColors(workplaceUserData.length),
      },
    ],
  };

  const barData1 = {
    labels: ['group A', 'group B', 'group C','group D','group E','group F','group G','group H','group I','group J'],
    datasets: [
      {
        label: 'ขาดงาน',
        backgroundColor: '#4caf50',
        data: [4, 3, 5,8,1,5,3,1,4,2],
      },
      {
        label: 'ลาป่วย',
        backgroundColor: '#ff9800',
        data: [1, 6, 3,2,2,5,3,1,4,2],
      },
      {
        label: 'ลากิจ',
        backgroundColor: '#f44336',
        data: [2, 5, 6,2,2,5,3,1,4,2],
      },
    ],
  };

  const barData2 = {
    labels: ['group A', 'group B', 'group C','group D','group E','group F','group G','group H','group I','group J'],
    datasets: [
      {
        label: 'ขาดงาน',
        backgroundColor: '#3f51b5',
        data: [4, 3, 5,8,1,5,3,1,4,2],
      },
      {
        label: 'ลาป่วย',
        backgroundColor: '#ffeb3b',
        data: [1, 6, 3,2,2,5,3,1,4,2],
      },
      {
        label: 'ลากิจ',
        backgroundColor: '#9c27b0',
        data: [2, 5, 6,2,2,5,3,1,4,2],
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
            <p style={{marginBottom:-10}}>จำนวนพนักงาน</p>
            <Pie
              data={pieData1}
              options={{ maintainAspectRatio: false }}
              style={{ width: '300px', height: '300px' }} // Direct control of width and height
            />
          </div>
          
          <div className="pie-chart-container">
            <p style={{marginBottom:-10}}>สรุปประจำวัน</p>
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

        {/* Third Row: First Bar Chart */}
        <div className="chart-row">
          <div className="chart-container bar-chart-fullwidth">
            <Bar
              data={barData1}
              options={{ maintainAspectRatio: false }}
              style={{ width: '800px', height: '250px' }} // Set width to be wider
            />
          </div>
        </div>

        {/* Fourth Row: Second Bar Chart */}
        <div className="chart-row">
          <div className="chart-container bar-chart-fullwidth">
            <Bar
              data={barData2}
              options={{ maintainAspectRatio: false }}
              style={{ width: '800px', height: '250px' }} // Set width to be wider
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
