import React,{useState,useEffect,useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Home.css';
import Sidebar from './sidebar';
import "bootstrap/dist/css/bootstrap.min.css";
import TableBootstrap from "react-bootstrap/Table";
import { IoSearchOutline,IoTime,IoCloseOutline } from "react-icons/io5";
import Layout from './Layout';
import './Profile.css';
import './checkHis.css'
import firestore from './Firebase/Firestore';
import { AiOutlineEdit,AiOutlineDelete,AiOutlineFilter,AiOutlineExport } from "react-icons/ai";
import { SiMicrosoftexcel } from "react-icons/si";
import { Select, FormControl, InputLabel } from '@mui/material';
import Form from 'react-bootstrap/Form';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { UserContext } from './UserContext';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material'
import LocationPickerMap from './LocationPickerMap';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import * as XLSX from 'xlsx';



function CheckHistory() {

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredOut, setFilteredOut] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [uid,setUid] = useState('')
  const [name,setName] = useState('');
  const [date,setDate] = useState('');
  const [time,setTime] = useState('');
  const [late,setLate] = useState('');
  const [lat,setLat] = useState('');
  const [lon,setLon] = useState('');
  const [isInvalidArea,setIsInvalidArea] = useState(false)
  const [id,setID] = useState('');
  const [allIN,setAllIn] = useState('');
  const [allOut,setAllOut] = useState('');
  const [show, setShow] = useState(false);
  const [workplace,setWorkplace] =useState('');
  const [selectFillter,setSelectFillter] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [outStartIndex, setOutStartIndex] = useState(0);
  const [outEndIndex, setOutEndIndex] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc'); // State to track sorting order
  const [sortOrderOut, setSortOrderOut] = useState('desc'); // For checkout sorting order
  const [isCheckin, setIsCheckin] = useState(true);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedFilterUser, setSelectedFilterUser] = useState(null);
  const [users, setUsers] = useState([]); // List of users for dropdown
  const [selectedUser, setSelectedUser] = useState(''); // Track selected user
  const [selectedUserId, setSelectedUserId] = useState('');
  const [reason,setReason] = useState('');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [defaultCheckInTime, setDefaultCheckInTime] = useState('08:00'); // Default check-in time
  const [defaultCheckOutTime, setDefaultCheckOutTime] = useState('17:00');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonthRange, setSelectedMonthRange] = useState('');

  const [workplaces,setWorkplaces] = useState([]);
  const [item,setItem] = useState([]);
  const { setCurrentUser, companyId } = useContext(UserContext);

  const handleClose = () => setShow(false);
  const handleCloseNewEntry = () => setShowNewEntryModal(false);
  const handleCloseFilterModal = () => setShowFilterModal(false);
  const handleShowFilterModal = () => setShowFilterModal(true);
  const handleShow = (uid,date,time,workplace,isCheckin,data) =>{
    setItem(data)
    setUid(uid);
    setName(data.name)
    setDate(date)
    setTime(time)
    setWorkplace(workplace)
    setLat(data.lat)
    setLon(data.lon)
    setIsInvalidArea(data.isInvalidArea)
    setIsCheckin(isCheckin);
    setReason(data.reason || '')
    setShow(true);
  } 

  const onNextIn = () => {
    setStartIndex(startIndex + 10);
    setEndIndex(endIndex + 10);
  };

  const onPreviousIn = () => {
    setStartIndex(Math.max(startIndex - 10, 0));
    setEndIndex(Math.max(endIndex - 10, 10));
  };

  const onNextOut = () => {
    setOutStartIndex(outStartIndex + 10);
    setOutEndIndex(outEndIndex + 10);
  };

  const onPreviousOut = () => {
    setOutStartIndex(Math.max(outStartIndex - 10, 0));
    setOutEndIndex(Math.max(outEndIndex - 10, 10));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(event.target.value);
    setSearchQuery(query);
    const filtered = allIN.filter(user =>user.name?.toLowerCase().includes(query));
    const filtered1 = allOut.filter(user => user.name?.toLowerCase().includes(query));
    setFilteredUsers(filtered);
    setFilteredOut(filtered1);
  };

  const handleDelete = () => {
    const confirmation = window.confirm("Are you sure you want to delete this record?");
    if (!confirmation) return; // If user cancels, do nothing

    const deleteFunction = isCheckin ? firestore.deleteCheckin : firestore.deleteCheckout;
    deleteFunction(companyId, uid, 
      () => {
        alert('Record deleted successfully!');
        setShow(false); // Close modal on successful delete
      }, 
      (error) => {
        console.error("Error deleting record: ", error);
      }
    );
  };

  const handleSave = async () => {
    const updatedData = {
      date:date,
      time:time,
      workplace:workplace || '',
      reason:reason ||'',
    };

    console.log(`UID: ${uid}`);  // Debugging the UID

    if (isCheckin) {
      // Update check-in data
      firestore.updateCheckin(companyId, uid, updatedData, 
        () => alert("Check-in updated successfully!"), 
        (error) => console.error("Error updating check-in:", error)
      );
    } else {
      // Update check-out data
      firestore.updateCheckout(companyId, uid, updatedData, 
        () => alert("Check-out updated successfully!"), 
        (error) => console.error("Error updating check-out:", error)
      );
    }

    setShow(false);
  };

  const handleMove = async (item) => {
    try {
      const updatedData = {
        name:item.name,
        date: date,
        time: time,
        workplace: workplace || '',
        lat:item.lat,
        lon:item.lon,
        isInvalidArea:item.isInvalidArea,
        late:item.late || null,
        user:item.user,
        reason:reason || '',
      };

      if (isCheckin) {
        // Move data from check-in to check-out
        await firestore.updateCheckout(
          companyId,
          uid,
          updatedData,
          () => alert('Moved to check-out successfully!'),
          (error) => console.error('Error moving to check-out:', error)
        );
        firestore.deleteCheckin(companyId, uid, () => console.log('Check-in deleted successfully'), console.error);
      } else {
        // Move data from check-out to check-in
        await firestore.updateCheckin(
          companyId,
          uid,
          updatedData,
          () => alert('Moved to check-in successfully!'),
          (error) => console.error('Error moving to check-in:', error)
        );
        firestore.deleteCheckout(companyId, uid, () => console.log('Check-out deleted successfully'), console.error);
      }
      setShow(false);
    } catch (error) {
      console.error('Error moving data:', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleMonthRangeChange = (event) => {
    setSelectedMonthRange(event.target.value);
  };

  const handleUserSelect = () => {
    const monthFilter = selectedMonth ? parseInt(selectedMonth) : null;
    const rangeMonths = {
      Q1: [1, 2, 3],
      Q2: [4, 5, 6],
      Q3: [7, 8, 9],
      Q4: [10, 11, 12],
    };
    const selectedRangeMonths = rangeMonths[selectedMonthRange] || null;

    if (selectedFilterUser) {
      // Filter the data by the selected user
      const filteredInData = allIN.filter(item => {
        const isUserMatch = item.name === selectedFilterUser.name;
        const itemMonth = new Date(item.date.split('/').reverse().join('-')).getMonth() + 1;
  
        const isMonthMatch = monthFilter
          ? itemMonth === monthFilter
          : selectedRangeMonths
          ? selectedRangeMonths.includes(itemMonth)
          : true;
  
        return isUserMatch && isMonthMatch;
      });
      const filteredOutData = allOut.filter(item => {
        const isUserMatch = item.name === selectedFilterUser.name;
        const itemMonth = new Date(item.date.split('/').reverse().join('-')).getMonth() + 1;
  
        const isMonthMatch = monthFilter
          ? itemMonth === monthFilter
          : selectedRangeMonths
          ? selectedRangeMonths.includes(itemMonth)
          : true;
  
        return isUserMatch && isMonthMatch;
      });
  
      // Apply sorting to filtered data
      sortData(sortOrder, setFilteredUsers, filteredInData); 
      sortData(sortOrderOut, setFilteredOut, filteredOutData);
      
      // Mark filtering as active
      setIsFiltered(true);
    }else {
      // Clear filter to show all users if `None / Clear Filter` is selected
      sortData(sortOrder, setFilteredUsers,allIN); 
      sortData(sortOrderOut, setFilteredOut, allOut);
      setIsFiltered(false);
    }
    
    setShowFilterModal(false);  // Close the filter modal
  };

  const handleClearSearch = () => {
    setSearch(''); // Clear the search input
    setSearchQuery('');
    sortData(sortOrder, setFilteredUsers,allIN); 
    sortData(sortOrderOut, setFilteredOut, allOut); // Reset filtered data for check-outs
  };
  
  const handleCancelFilter = () => {
    // Reset filtered data to the original dataset
    sortData(sortOrder, setFilteredUsers,allIN); 
    sortData(sortOrderOut, setFilteredOut, allOut)
    setIsFiltered(false);  // Reset filtering state
    setSelectedFilterUser(null);
    setSelectedMonth('');
    setSelectedMonthRange('');
    setShowFilterModal(false);  // Close the filter modal
  };

  const fetchDropdownOptions = async () => {
    try {
      const workplaces = await firestore.getDropdownOptions(companyId,'workplace');
      setWorkplaces(workplaces.map(option => option.name));
      
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
    const unsubscribeDefaultTimes = firestore.onDefaultCheckInOutTimesChange(companyId, (data) => {
      setDefaultCheckInTime(data.checkInTime);
      setDefaultCheckOutTime(data.checkOutTime);
    });

    const unsubscribeIn = firestore.getAllCheckin(companyId, (inData) => {
      setAllIn(inData);
      sortData(sortOrder, setFilteredUsers, inData); // Ensure sorting after data update
    }, console.error);

    const unsubscribeOut = firestore.getAllCheckout(companyId, (outData) => {
      setAllOut(outData);
      sortData(sortOrderOut, setFilteredOut, outData); // Ensure sorting after data update
    }, console.error);

    const unsubscribeUsers = firestore.getAllUser(companyId, setUsers, console.error);

    const cleanupOldData = async () => {
      await firestore.cleanupOldCheckInOut(
        companyId,
        (deleteCount) => console.log(`${deleteCount} old check-in/out records were cleaned up.`),
        (error) => console.error("Error during cleanup:", error)
      );
    };
  
    cleanupOldData();

    const intervalId = setInterval(() => {
      cleanupOldData();
    }, 24 * 60 * 60 * 1000); // Run once every 24 hours

    return () => {
      unsubscribeDefaultTimes();
      unsubscribeIn();
      unsubscribeOut();
      unsubscribeUsers();
      clearInterval(intervalId);
    };
  }, [companyId, sortOrder, sortOrderOut]);

  const handleTimeModalShow = () => setShowTimeModal(true);
  const handleTimeModalClose = () => setShowTimeModal(false);

  const handleSaveDefaultTimes = () => {
    const data = {
      checkInTime: defaultCheckInTime,
      checkOutTime: defaultCheckOutTime,
    };
  
    firestore.setDefaultCheckInOutTimes(
      companyId,
      data,
      () => {
        alert("Default check-in and check-out times updated successfully!");
        setDefaultCheckInTime(data.checkInTime); // Update local state
        setDefaultCheckOutTime(data.checkOutTime); // Update local state
        setShowTimeModal(false);
      },
      (error) => {
        console.error("Error saving default times:", error);
        alert("Failed to update default times. Please try again.");
      }
    );
  };

  // Function to convert date string to Date object for comparison
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  // Sort the data based on the date (toggle between ascending and descending)
  const sortData = (order, setData, data) => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setData(sortedData);
  };

  // Toggle sorting order for check-ins
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
  
    // If filtering is active, sort the filtered data; otherwise, sort the full dataset
    if (isFiltered) {
      sortData(newOrder, setFilteredUsers, filteredUsers);  // Sorting filtered check-ins
    } else {
      sortData(newOrder, setFilteredUsers, allIN);  // Sorting all check-ins
    }
  };
  
  const toggleSortOrderOut = () => {
    const newOrder = sortOrderOut === 'asc' ? 'desc' : 'asc';
    setSortOrderOut(newOrder);
  
    // If filtering is active, sort the filtered data; otherwise, sort the full dataset
    if (isFiltered) {
      sortData(newOrder, setFilteredOut, filteredOut);  // Sorting filtered check-outs
    } else {
      sortData(newOrder, setFilteredOut, allOut);  // Sorting all check-outs
    }
  };

  const getRowColor = (item) => {
    if (item.late && item.isCheckIn) return '#B20600';
    if (item.isInvalidArea) return '#050C9C';
    return 'black';
  };

  const handleNewEntry = (isCheckIn) => {
    setIsCheckin(isCheckIn);
    setSelectedUserId('');
    setSelectedUser('');
    setDate('');
    setTime('');
    setWorkplace('');
    setLat('');
    setLon('');
    setIsInvalidArea(false);
    setLate(false);
    setReason('')
    setShowNewEntryModal(true);
  };

  const handleAddData = () => {
    const newData = {
      user: selectedUserId,
      name: selectedUser,
      date,
      time,
      workplace,
      lat,
      lon,
      isInvalidArea,
      late,
      reason,
    };

    firestore.addCheckInOut(companyId, isCheckin, newData,
      () => {
        alert('Data added successfully!');
        setShowNewEntryModal(false);
      },
      (error) => {
        console.error("Error adding data:", error);
      }
    );
  };

  const handleExportToExcel = () => {
    // Check if any filter is applied; if not, apply filters based on modal selections
    let filteredCheckInData = filteredUsers;
    let filteredCheckOutData = filteredOut;

    if (!isFiltered) {
        // Apply filters if not already applied
        const userFilter = selectedFilterUser ? selectedFilterUser.name : null;
        const monthFilter = selectedMonth ? parseInt(selectedMonth) : null;

        filteredCheckInData = allIN.filter(item => {
            const isUserMatch = !userFilter || item.name === userFilter;
            const itemMonth = new Date(item.date.split('/').reverse().join('-')).getMonth() + 1;
            const isMonthMatch = !monthFilter || itemMonth === monthFilter;
            return isUserMatch && isMonthMatch;
        });

        filteredCheckOutData = allOut.filter(item => {
            const isUserMatch = !userFilter || item.name === userFilter;
            const itemMonth = new Date(item.date.split('/').reverse().join('-')).getMonth() + 1;
            const isMonthMatch = !monthFilter || itemMonth === monthFilter;
            return isUserMatch && isMonthMatch;
        });
    }

    // Get the selected user's name or default to 'AllUsers'
    const userName = selectedFilterUser ? selectedFilterUser.name : 'AllUsers';
    // Format the current date as dd-mm-yyyy
    const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '_');
    // Create the filename with the specified format
    const fileName = `CheckHistory_${userName}_${currentDate}.xlsx`;

    // Prepare data for "Check-In" sheet with title row
    const checkInData = [
        { Date: "Check-In Data", Name: "", Workplace: "", Time: "" },
        { Date: "Date", Name: "Name", Workplace: "Workplace", Time: "Time", Reason:"Reason" },
        ...filteredCheckInData.map(({ date, name, workplace, time, reason }) => ({
            Date: date,
            Name: name,
            Workplace: workplace || '*นอกพื้นที่',
            Time: time,
            Reason: reason
        }))
    ];

    // Prepare data for "Check-Out" sheet with title row
    const checkOutData = [
        { Date: "Check-Out Data", Name: "", Workplace: "", Time: "" },
        { Date: "Date", Name: "Name", Workplace: "Workplace", Time: "Time", Reason:"Reason" },
        ...filteredCheckOutData.map(({ date, name, workplace, time, reason }) => ({
            Date: date,
            Name: name,
            Workplace: workplace || '*นอกพื้นที่',
            Time: time,
            Reason: reason
        }))
    ];

    // Create worksheets for each data set
    const checkInWorksheet = XLSX.utils.json_to_sheet(checkInData, { skipHeader: true });
    const checkOutWorksheet = XLSX.utils.json_to_sheet(checkOutData, { skipHeader: true });

    // Set column widths for readability
    const columnWidths = [{ wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, {wch:25}];
    checkInWorksheet['!cols'] = columnWidths;
    checkOutWorksheet['!cols'] = columnWidths;

    // Merge cells for the title row in both sheets
    checkInWorksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
    checkOutWorksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

    // Apply styling for the title row in both sheets
    const titleCellStyle = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" },
    };

    // Apply the title cell style to each cell in the merged range of the title row
    ["A1", "B1", "C1", "D1", "E1"].forEach((cell) => {
        checkInWorksheet[cell] = checkInWorksheet[cell] || {};
        checkInWorksheet[cell].s = titleCellStyle;

        checkOutWorksheet[cell] = checkOutWorksheet[cell] || {};
        checkOutWorksheet[cell].s = titleCellStyle;
    });

    // Apply center alignment for data cells
    const dataCellStyle = {
        alignment: { horizontal: "center", vertical: "center" },
    };

    // Get data range for Check-In worksheet (from A2 to D last row)
    const checkInRange = XLSX.utils.decode_range(checkInWorksheet['!ref']);
    for (let row = 1; row <= checkInRange.e.r; row++) {
        for (let col = 0; col <= checkInRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!checkInWorksheet[cellAddress]) continue;
            checkInWorksheet[cellAddress].s = dataCellStyle;
        }
    }

    // Get data range for Check-Out worksheet (from A2 to D last row)
    const checkOutRange = XLSX.utils.decode_range(checkOutWorksheet['!ref']);
    for (let row = 1; row <= checkOutRange.e.r; row++) {
        for (let col = 0; col <= checkOutRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!checkOutWorksheet[cellAddress]) continue;
            checkOutWorksheet[cellAddress].s = dataCellStyle;
        }
    }

    // Create a new workbook and append both sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, checkInWorksheet, 'Check-In');
    XLSX.utils.book_append_sheet(workbook, checkOutWorksheet, 'Check-Out');

    // Save the workbook as an Excel file with the custom filename
    XLSX.writeFile(workbook, fileName);
  };


  return (
    
      <div className="dashboard">
        {/* <Sidebar /> */}
        <div><Layout /></div>
        <main className="main-content">
         
          
          <div class="main">
          <div className='header-page'>
          <header>
            <h1>ประวัติการเข้า-ออกงาน</h1>
            {/* Add user profile and logout here */}
          </header>
          </div>
            <div class="main-contain">
            <div className="search-field" style={{ position: "relative", width: '95%', margin: '5px auto' }}>
              <input
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 5,
                  paddingInlineStart: 10,
                  fontSize: 22,
                  paddingRight: "2.5rem" // Extra padding for icon space
                }}
                placeholder="Search.."
                value={search}
                onChange={handleSearch}
              />
              {search && (
                <button
                  onClick={handleClearSearch}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  <IoCloseOutline size={24} color="#999" />
                </button>
              )}
            </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', width: '95%', alignSelf: 'center',marginTop:10}}>
                <Button 
                  onClick={handleShowFilterModal} 
                  variant="primary" 
                  title="Filter"
                  style={{ display: 'flex', alignItems: 'center',marginLeft: '5px' }}
                >
                  <AiOutlineFilter size={24} />
                </Button>
                {/* <Button onClick={handleTimeModalShow} variant="info" title="ตั้งเวลาเข้า-ออก" style={{ marginLeft: '5px' }} >
                 <IoTime />
                </Button> */}
                <Button onClick={() => handleNewEntry(true)} variant="success" style={{ marginLeft: '5px' }}>Add Check-In</Button>
                <Button onClick={() => handleNewEntry(false)} variant="info" style={{ marginLeft: '5px' }}>Add Check-Out</Button>
              </div>
              <div style={{width:'100%',alignSelf:'center'}}>
              <div className="table-container">
                
                <div className="table-section">
                <p className="table-title">เวลาเข้างาน</p>
                <TableBootstrap striped bordered hover className='table' style={{marginTop:10,width:'100%'}}>
                  <thead>
                    <tr>
                      <th scope="col" onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
                        วันที่ {sortOrder === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {/* {filteredUsers.slice(startIndex, endIndex).map((item, index) => ( */}
                  {filteredUsers.slice(startIndex, endIndex).map((item, index) => (
                      <tr key={item.id} style={{ color: getRowColor(item) }}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>
                          {item.workplace || '*นอกพื้นที่'}
                          {item.reason && (
                            <span style={{ fontSize: '0.8em', color: '#666', display: 'block', marginTop: '2px' }}>
                              {item.reason}
                            </span>
                          )}
                        </td>
                        <td><button style={{borderRadius:10}} onClick={() => handleShow(item.id, item.date, item.time, item.workplace, true,item)}><AiOutlineEdit /></button></td>
                      </tr>
                   ))}
                  </tbody>
                </TableBootstrap>
                <div>
                  <button className='Previous-button' style={{minWidth:'20%'}} onClick={onPreviousIn}>Previous</button>
                  <button className='Next-button' style={{minWidth:'20%',}} onClick={onNextIn}>Next</button>
                </div>
                </div>
                
                <div className="table-section">
                <p className="table-title">เวลาออกงาน</p>
                <TableBootstrap striped bordered hover className='table' style={{marginTop:10,width:'100%'}}>
                  <thead>
                    <tr>
                      <th scope="col" onClick={toggleSortOrderOut} style={{ cursor: 'pointer' }}>
                        วันที่ {sortOrderOut === 'asc' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </th>
                      <th scope="col">ชื่อ-สกุล</th>
                      <th scope="col">เวลา</th>
                      <th scope="col">พื้นที่ปฏิบัติงาน</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredOut.slice(outStartIndex, outEndIndex).map((item, index) => (
                      <tr key={item.id} style={{ color: getRowColor(item) }}>
                        <th scope="row">{item.date}</th>
                        <td>
                          {item.name}
                        </td>
                        <td>{item.time}</td>
                        <td>
                          {item.workplace || '*นอกพื้นที่'}
                          {item.reason && (
                            <span style={{ fontSize: '0.8em', color: '#666', display: 'block', marginTop: '2px' }}>
                              {item.reason}
                            </span>
                          )}
                        </td>
                        <td><button style={{borderRadius:10}} onClick={() => handleShow(item.id, item.date, item.time, item.workplace, false,item)}><AiOutlineEdit /></button></td>
                      </tr>
                   ))}
                  </tbody>
                </TableBootstrap>
                <div>
                  <button className='Previous-button' style={{minWidth:'20%'}} onClick={onPreviousOut}>Previous</button>
                  <button className='Next-button' style={{minWidth:'20%'}} onClick={onNextOut}>Next</button>
                </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </main>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '24px' }}>ข้อมูลเข้าออกงาน {name}
              <Button variant="link" onClick={handleDelete} style={{ color: 'red' }}>
                <AiOutlineDelete size={24} />
              </Button>
            </Modal.Title>
            
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="date">
                <Form.Label style={{ fontSize: 22 }}>วันที่</Form.Label>
                <Form.Control
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ fontSize: 20, marginBottom: 20 }}
                />
              </Form.Group>
              <Form.Group controlId="time">
                <Form.Label style={{ fontSize: 22 }}>เวลา</Form.Label>
                <Form.Control
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{ fontSize: 20, marginBottom: 30 }}
                />
              </Form.Group>
              <FormControl variant="filled" fullWidth>
                <InputLabel>พื้นที่ทำงาน</InputLabel>
                <Select
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                >
                <MenuItem value="">
                  <em>None</em> {/* Label for the blank option */}
                </MenuItem>  
                  {workplaces.map((option, index) => (
                    <MenuItem key={index} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {isInvalidArea && (
                <div style={{ marginTop: '20px' }}>
                  <h5 style={{ marginBottom: '10px', color: 'red' }}>Invalid Location Detected:</h5>
                  <LocationPickerMap
                    lat={lat}
                    lon={lon}
                    showSearch={false}
                    onLocationSelect={(lat, lon) => {
                      setLat(lat);
                      setLon(lon);
                    }}
                  />
                </div>
              )}
              <Form.Group>
                  <Form.Label style={{marginTop:10}}>Reason</Form.Label>
                  <Form.Control
                    placeholder="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" style={{ backgroundColor: '#D3D3D3', color: 'black', fontSize: 20 }} onClick={handleSave}>
              Save
            </Button>
            <Button style={{ backgroundColor: '#BEBEBE', color: 'black', fontSize: 20 }} onClick={()=>handleMove(item)}>
              Move
            </Button>
            <Button variant="secondary" style={{ backgroundColor: '#343434', fontSize: 20 }} onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showNewEntryModal} onHide={handleCloseNewEntry}>
        <Modal.Header closeButton>
            <Modal.Title>{isCheckin ? "Add Check-In Data" : "Add Check-Out Data"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormControl variant="filled" fullWidth style={{ marginBottom: 15 }}>
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    const user = users.find(user => user.id === e.target.value);
                    setSelectedUser(user ? user.name : '');
                  }}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Form.Group controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="time">
                <Form.Label style={{marginTop:10}}>Time</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="hh:mm:ss"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </Form.Group>

              <FormControl variant="filled" fullWidth style={{ marginBottom: 15,marginTop:20 }}>
                <InputLabel>Workplace</InputLabel>
                <Select
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                >
                <MenuItem value="">
                  <em>None</em> {/* Label for the blank option */}
                </MenuItem>  
                  {workplaces.map((workplace, index) => (
                    <MenuItem key={index} value={workplace}>{workplace}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* <Form.Group controlId="lat">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="lon">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="text"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                />
              </Form.Group> */}

                <Form.Group>
                  <Form.Label style={{marginTop:10}}>Reason</Form.Label>
                  <Form.Control
                    placeholder="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleAddData}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleCloseNewEntry}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showTimeModal} onHide={handleTimeModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Default Check-In/Check-Out Times</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Default Check-In Time</label>
              <Flatpickr
                data-enable-time
                value={defaultCheckInTime}
                onChange={([date]) => setDefaultCheckInTime(date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))}
                options={{
                  noCalendar: true,
                  enableTime: true,
                  dateFormat: 'H:i', // 24-hour format
                  time_24hr: true,
                  inline: true // Display inline to ensure visibility and interactivity
                }}
                className="form-control"
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Default Check-Out Time</label>
              <Flatpickr
                data-enable-time
                value={defaultCheckOutTime}
                onChange={([date]) => setDefaultCheckOutTime(date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))}
                options={{
                  noCalendar: true,
                  enableTime: true,
                  dateFormat: 'H:i', // 24-hour format
                  time_24hr: true,
                  inline: true // Display inline to ensure visibility and interactivity
                }}
                className="form-control"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveDefaultTimes} style={{ fontSize: '16px', padding: '10px 20px' }}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleTimeModalClose} style={{ fontSize: '16px', padding: '10px 20px' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFilterModal} onHide={handleCloseFilterModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select User to Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdown for selecting the user */}
          <FormControl variant="filled" fullWidth style={{ marginBottom: 20 }}>
            <InputLabel shrink={true}>Select User</InputLabel>
            <Select
              value={selectedFilterUser ? selectedFilterUser.id : ''}
              onChange={(e) => {
                const user = users.find(user => user.id === e.target.value) || null;
                setSelectedFilterUser(user);
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em>None / Clear Filter</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="filled" fullWidth style={{ marginBottom: 20 }}>
            <InputLabel shrink={true}>Select Month</InputLabel>
            <Select value={selectedMonth} onChange={handleMonthChange} displayEmpty>
              <MenuItem value="">
                <em>All Months</em>
              </MenuItem>
              {Array.from({ length: 12 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl variant="filled" fullWidth>
            <InputLabel shrink={true}>Select Month Range</InputLabel>
            <Select value={selectedMonthRange} onChange={handleMonthRangeChange} displayEmpty>
              <MenuItem value="">
                <em>All Ranges</em>
              </MenuItem>
              <MenuItem value="Q1">Q1 (Jan-Mar)</MenuItem>
              <MenuItem value="Q2">Q2 (Apr-Jun)</MenuItem>
              <MenuItem value="Q3">Q3 (Jul-Sep)</MenuItem>
              <MenuItem value="Q4">Q4 (Oct-Dec)</MenuItem>
            </Select>
          </FormControl>     */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" color="primary" onClick={handleExportToExcel} style={{ display: 'flex', alignItems: 'center',  borderColor: '#BEBEBE',borderWidth: '2px' }}>
            <SiMicrosoftexcel size={24} color="#217346" style={{ marginRight: 5 }}/>
            Export
          </Button>
          <Button variant="primary" onClick={handleUserSelect} style={{width:100}}>
            OK
          </Button>
          <Button variant="secondary" onClick={handleCancelFilter} style={{width:100}}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    
      </div>
    
  );
}

export default CheckHistory;

  