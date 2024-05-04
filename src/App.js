import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ProfileManage from './ProfileManage';
import CheckHistory from './CheckHistory';
import LeaveRequest from './LeaveRequest';
import OTRequest from './OTRequest';
import Welthfare from './Welthfare';
import Salary from './Salary';
import Annouce from './Annouce';
import ProfileAdd from './ProfileAdd';
import ManageAccount from './ManageAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/home" Component={Home} />
        <Route path='/profile' Component={ProfileManage} />
        <Route path='/checkin_history' Component={CheckHistory} />
        <Route path='/leave_request' Component={LeaveRequest} />
        <Route path='/ot_request' Component={OTRequest} />
        <Route path='/welthfare_manage' Component={Welthfare} />
        <Route path='/salary_manage' Component={Salary}/>
        <Route path='/annouce' Component={Annouce} />
        <Route path='/add_profile' Component={ProfileAdd} />
        <Route path='/manage_account' Component={ManageAccount} />
        
      </Routes>
    </Router>
  );
}

export default App;
