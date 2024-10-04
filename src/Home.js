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
  const [departmentData, setDepartmentData] = useState({});
  const [leaveData, setLeaveData] = useState({ working: 0, leave: { 'ลากิจ': 0, 'ป่วย': 0, 'พักร้อน': 0 } });
  const [employeeLeaveData, setEmployeeLeaveData] = useState([]);
  const [barData1, setBarData1] = useState({});
  const [barData2, setBarData2] = useState({}); 


  const generateColors = (length) => {
    // Define a base color palette
    const baseColors = ['#4caf50', '#ff9800', '#f44336', '#3f51b5', '#9c27b0', '#00acc1', '#8bc34a', '#cddc39', '#ff5722', '#607d8b'];
  
    // If length is less than or equal to baseColors, return the base colors slice
    if (length <= baseColors.length) {
      return baseColors.slice(0, length);
    }
  
    // Otherwise, generate additional random colors to fill the gap
    const randomColors = Array.from({ length: length - baseColors.length }, () => {
      // Generate random hex color
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    });
  
    // Concatenate base colors with the newly generated random colors
    return [...baseColors, ...randomColors];
  };

  const countEmployeesByDepartment = (employees) => {
    const departmentCounts = {};
    employees.forEach((user) => {
      const department = user.department?.trim() || "อื่นๆ"; // Handle undefined, null, or empty department
      departmentCounts[department] = (departmentCounts[department] || 0) + 1;
    });
    // Check if "อื่นๆ" exists and move it to the end
    if (departmentCounts['อื่นๆ']) {
      const othersCount = departmentCounts['อื่นๆ'];
      delete departmentCounts['อื่นๆ']; // Remove it from its original position
      departmentCounts['อื่นๆ'] = othersCount; // Add it to the end
    }
    return departmentCounts;
  };

  useEffect(() => {
    // Fetch workplace user count data
    //console.log(userData.position)
    firestore.getWorkplaceUserCounts(
      companyId,
      (data) => setWorkplaceUserData(data),  // On success, set the state
      (error) => console.error('Error fetching workplace data:', error) // On error
    );
    firestore.getAllUser(
      companyId,
      (users) => {
        const counts = countEmployeesByDepartment(users);
        setDepartmentData(counts); // Set the department counts in state
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
    firestore.getWorkAndLeaveDataForCurrentDate(
      companyId,
      (data) => {
        //console.log("Fetched leave data: ", data); 
        setLeaveData(data); // On success, set the data
      },
      (error) => console.error('Error fetching work and leave data:', error) // Handle error
    );
  }, [companyId]);

  useEffect(() => {
    // Fetch all users and then fetch their leave data from wealthfare collection
    firestore.getAllUser(
      companyId,
      (users) => {
        console.log("Fetched users:", users);

        const leaveDataPromises = users.map((user) =>
          new Promise((resolve, reject) => {
            firestore.getAllLeaveDataMtoL(companyId, user.id, (leaveData) => {
              // Ensure values are not negative
              const absenceUsed = Math.max(0, leaveData.absence - leaveData.absenceR);
              const sickUsed = Math.max(0, leaveData.sick - leaveData.sickR);
              const holidayUsed = Math.max(0, leaveData.holiday - leaveData.holidayR);

              resolve({
                name: user.name,
                image: user.image_off,
                absenceUsed,
                sickUsed,
                holidayUsed,
                totalLeaveUsed: absenceUsed + sickUsed + holidayUsed, // For sorting later
              });
            }, reject);
          })
        );

        // Process barData1 (Most to Least)
        Promise.all(leaveDataPromises).then((leaveDataResults) => {
          const top10LeaveData = leaveDataResults
            .sort((a, b) => b.totalLeaveUsed - a.totalLeaveUsed)  // Sort by total leave used (most to least)
            .slice(0, 10);
        
          console.log("Top 10 Leave Data:", top10LeaveData); // Add this line to debug
        
          setEmployeeLeaveData(top10LeaveData);
        
          if (top10LeaveData.length > 0) {
            const labels = top10LeaveData.map((employee) => employee.name);
            const absenceData = top10LeaveData.map((employee) => employee.absenceUsed);
            const sickData = top10LeaveData.map((employee) => employee.sickUsed);
            const holidayData = top10LeaveData.map((employee) => employee.holidayUsed);
        
            setBarData1({
              labels,
              datasets: [
                {
                  label: 'ลาพักร้อน',
                  backgroundColor: '#508C9B',  // Solid blue for 'ลาพักร้อน'
                  data: holidayData,
                },
                {
                  label: 'ลาป่วย',
                  backgroundColor: '#134B70',  // Solid yellow for 'ลาป่วย'
                  data: sickData,
                },
                {
                  label: 'ลากิจ',
                  backgroundColor: '#201E43',  // Solid purple for 'ลากิจ'
                  data: absenceData,
                },
              ],
              users: top10LeaveData, // This array should match the length of the labels array
            });
          }
        });
        
        // Process barData2 (Least to Most)
        Promise.all(leaveDataPromises).then((leaveDataResults) => {
          const bottom10LeaveData = leaveDataResults
            .sort((a, b) => a.totalLeaveUsed - b.totalLeaveUsed)  // Sort by total leave used (least to most)
            .slice(0, 10);
        
          console.log("Bottom 10 Leave Data:", bottom10LeaveData); // Add this line to debug
        
          if (bottom10LeaveData.length > 0) {
            const labels = bottom10LeaveData.map((employee) => employee.name);
            const absenceData = bottom10LeaveData.map((employee) => employee.absenceUsed);
            const sickData = bottom10LeaveData.map((employee) => employee.sickUsed);
            const holidayData = bottom10LeaveData.map((employee) => employee.holidayUsed);
        
            setBarData2({
              labels,
              datasets: [
                {
                  label: 'ลาพักร้อน',
                  backgroundColor: '#D5DEF5',  // Solid blue for 'ลาพักร้อน'
                  data: holidayData,
                },
                {
                  label: 'ลาป่วย',
                  backgroundColor: '#8594E4',  // Solid yellow for 'ลาป่วย'
                  data: sickData,
                },
                {
                  label: 'ลากิจ',
                  backgroundColor: '#6643B5',  // Solid purple for 'ลากิจ'
                  data: absenceData,
                },
              ],
              users: bottom10LeaveData, // This array should match the length of the labels array
            });
          }
        });
      },
      (error) => console.error('Error fetching users:', error)
    );
  }, [companyId]);

  const customTooltipPlugin = {
    id: 'customTooltipPlugin',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const users = chart.config.data.users || [];
      const meta = chart.getDatasetMeta(0);

      meta.data.forEach((bar, index) => {
        const user = users[index];
        if (user) {
          const image = new Image();
          image.src = user.image;
          const x = bar.x - 15;
          const y = chart.chartArea.bottom + 10;

          image.onload = () => {
            ctx.drawImage(image, x, y, 30, 30);
          };
        }
      });
    },
  };

  Chart.register(customTooltipPlugin);

  const pieData1 = {
    labels: Object.keys(departmentData),
    datasets: [
      {
        label: 'จำนวนพนักงาน',
        data: Object.values(departmentData),
        backgroundColor: generateColors(Object.keys(departmentData).length),
        hoverBackgroundColor: generateColors(Object.keys(departmentData).length),
      },
    ],
  };

  const pieData2Labels = ['เข้าทำงาน', 'ลากิจ', 'ลาป่วย', 'ลาพักร้อน'];
  const pieData2 = {
    labels: pieData2Labels,
    datasets: [
      {
        label: 'สรุปประจำวัน',
        data: [
          leaveData.working,
          leaveData.leave['ลากิจ'],
          leaveData.leave['ลาป่วย'],
          leaveData.leave['ลาพักร้อน'],
        ],
        backgroundColor: generateColors(pieData2Labels.length),
        hoverBackgroundColor: generateColors(pieData2Labels.length),
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
            <p>Data Visualization</p>
            <div style={{ backgroundColor: '#f5f5f5', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              Custom content here
            </div>
          </div>
        </div>

        {/* Third Row: First Bar Chart */}
        <div className="chart-row">
          <div className="chart-container bar-chart-fullwidth">
            {barData1 && barData1.labels ? (
              <Bar
                data={barData1}
                options={{ maintainAspectRatio: false }}
                plugins={[customTooltipPlugin]} // Register image plugin
                style={{ width: '800px', height: '400px' }}
              />
            ) : (
              <p>Loading bar chart...</p>
            )}
          </div>
        </div>

        {/* Fourth Row: Second Bar Chart */}
        <div className="chart-row">
          <div className="chart-container bar-chart-fullwidth">
            {barData2 && barData2.labels ? (
              <Bar
                data={barData2}
                options={{ maintainAspectRatio: false }}
                plugins={[customTooltipPlugin]} // Register image plugin
                style={{ width: '800px', height: '1000px' }}
              />
            ) : (
              <p>Loading bar chart...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
