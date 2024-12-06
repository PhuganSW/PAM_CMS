import React, { useContext, useEffect, useState } from 'react';
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const generateSummary = (labels, data, total) => {
    return labels
      .map((label, index) => `${label} [${data[index]} / ${(data[index] / total * 100).toFixed(2)}%],`)
      .join(' ');
  };
  
  // Summarize pieData1 (Department Data)
  const pieData1Labels = Object.keys(departmentData);
  const pieData1Values = Object.values(departmentData);
  const pieData1Total = pieData1Values.reduce((acc, val) => acc + val, 0);
  const pieData1Summary = generateSummary(pieData1Labels, pieData1Values, pieData1Total);

  // Summarize pieData2 (Work and Leave Summary)
  const pieData2Labels = ['เข้าทำงาน', 'ลากิจ', 'ลาป่วย', 'ลาพักร้อน'];
  const pieData2Values = [
    leaveData.working,
    leaveData.leave['ลากิจ'],
    leaveData.leave['ลาป่วย'],
    leaveData.leave['ลาพักร้อน'],
  ];
  const pieData2Total = pieData2Values.reduce((acc, val) => acc + val, 0);
  const pieData2Summary = generateSummary(pieData2Labels, pieData2Values, pieData2Total);

  // Summarize otherPieChartData (Workplace Data)
  const otherPieChartLabels = workplaceUserData.map((workplace) => workplace.name);
  const otherPieChartValues = workplaceUserData.map((workplace) => workplace.count);
  const otherPieChartTotal = otherPieChartValues.reduce((acc, val) => acc + val, 0);
  const otherPieChartSummary = generateSummary(otherPieChartLabels, otherPieChartValues, otherPieChartTotal);

  const slides = [
    { title: "สรุปรายละเอียดพนักงานทั้งหมด", content: pieData1Summary },
    { title: "สรุปรายละเอียดการเข้าทำงาน", content: pieData2Summary },
    { title: "สรุปการจัดการกำลังพล", content: otherPieChartSummary },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

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
    if (!companyId) {
      console.error('Invalid companyId:', companyId);
      return;
    }
    // Fetch workplace user count data
    //console.log(userData.position)
    firestore.getWorkplaceUserCounts(
      companyId,
      (data) => {setWorkplaceUserData(data); console.log(data)},  // On success, set the state
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
    if (!companyId) {
      console.error('Invalid companyId:', companyId);
      return;
    }
    // Fetch all users and then fetch their leave data from wealthfare collection
    firestore.getAllUser(
      companyId,
      (users) => {
        console.log("Fetched users:", users);
  
        const leaveDataPromises = users.map((user) =>
          new Promise((resolve) => {
            firestore.getAllLeaveDataMtoL(
              companyId, 
              user.id, 
              (leaveData) => {
                const absenceUsed = Math.max(0, leaveData.absence - leaveData.absenceR);
                const sickUsed = Math.max(0, leaveData.sick - leaveData.sickR);
                const holidayUsed = Math.max(0, leaveData.holiday - leaveData.holidayR);
  
                resolve({
                  name: user.name,
                  image: user.image_off,
                  absenceUsed,
                  sickUsed,
                  holidayUsed,
                  totalLeaveUsed: absenceUsed + sickUsed + holidayUsed,
                });
              },
              (error) => {
                console.warn(`Skipping user ${user.id} due to missing data: ${error}`);
                resolve(null); // Resolve with null if wealthfare document is missing
              }
            );
          })
        );
  
        Promise.all(leaveDataPromises).then((leaveDataResults) => {
          const filteredData = leaveDataResults.filter(data => data !== null);
  
          // Process barData1 (Most to Least)
          const top10LeaveData = filteredData
            .sort((a, b) => b.totalLeaveUsed - a.totalLeaveUsed)
            .slice(0, 10);
  
          setEmployeeLeaveData(top10LeaveData);
  
          if (top10LeaveData.length > 0) {
            setBarData1({
              labels: top10LeaveData.map(employee => employee.name),
              datasets: [
                {
                  label: 'ลาพักร้อน',
                  backgroundColor: '#508C9B',
                  data: top10LeaveData.map(employee => employee.holidayUsed),
                },
                {
                  label: 'ลาป่วย',
                  backgroundColor: '#134B70',
                  data: top10LeaveData.map(employee => employee.sickUsed),
                },
                {
                  label: 'ลากิจ',
                  backgroundColor: '#201E43',
                  data: top10LeaveData.map(employee => employee.absenceUsed),
                },
              ],
              users: top10LeaveData,
            });
          }
  
          // Process barData2 (Least to Most)
          const bottom10LeaveData = filteredData
            .sort((a, b) => a.totalLeaveUsed - b.totalLeaveUsed)
            .slice(0, 10);
  
          if (bottom10LeaveData.length > 0) {
            setBarData2({
              labels: bottom10LeaveData.map(employee => employee.name),
              datasets: [
                {
                  label: 'ลาพักร้อน',
                  backgroundColor: '#D5DEF5',
                  data: bottom10LeaveData.map(employee => employee.holidayUsed),
                },
                {
                  label: 'ลาป่วย',
                  backgroundColor: '#8594E4',
                  data: bottom10LeaveData.map(employee => employee.sickUsed),
                },
                {
                  label: 'ลากิจ',
                  backgroundColor: '#6643B5',
                  data: bottom10LeaveData.map(employee => employee.absenceUsed),
                },
              ],
              users: bottom10LeaveData,
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
    labels: pieData1Labels,
    datasets: [
      {
        label: 'จำนวนพนักงาน',
        data: Object.values(departmentData),
        backgroundColor: generateColors(Object.keys(departmentData).length),
        hoverBackgroundColor: generateColors(Object.keys(departmentData).length),
      },
    ],
  };

  //const pieData2Labels = ['เข้าทำงาน', 'ลากิจ', 'ลาป่วย', 'ลาพักร้อน'];
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
    labels: otherPieChartLabels, // Workplace names
    datasets: [
      {
        label: 'จำนวนคนตามพื้นที่ทำงาน',
        data: otherPieChartValues, // Number of users in each workplace
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
            <p className="data-title">Data Visualization</p>

            <div className="slideDash-container">
              <button onClick={prevSlide} className="slide-nav-btn">◀</button>

              <div className="slide">
                <p className="slideDash-title">{slides[currentSlide].title}</p>
                <p className="slideDash-content">{slides[currentSlide].content}</p>
              </div>

              <button onClick={nextSlide} className="slide-nav-btn">▶</button>
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
