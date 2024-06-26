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
import ProfileEdit from './ProfileEdit';
import AnnouceAdd  from './AnnouceAdd';
import AnnouceEdit from './AnnouceEdit';
import SalaryCal from './SalaryCal';
import WelthfareManage from './WelthfareManage';
import ForgotPass from './ForgotPass';
import SalaryList from './SalaryList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path='/forgot_password' Component={ForgotPass} />
        <Route path="/home" Component={Home} />
        <Route path='/profile' Component={ProfileManage} />
        <Route path='/checkin_history' Component={CheckHistory} />
        <Route path='/leave_request' Component={LeaveRequest} />
        <Route path='/ot_request' Component={OTRequest} />
        <Route path='/welthfare' Component={Welthfare} />
        <Route path='/salary_manage' Component={Salary}/>
        <Route path='/annouce' Component={Annouce} />
        <Route path='/add_annouce' Component={AnnouceAdd} />
        <Route path='/edit_annouce' Component={AnnouceEdit} />
        <Route path='/add_profile' Component={ProfileAdd} />
        <Route path='/edit_profile' Component={ProfileEdit} />
        <Route path='/manage_account' Component={ManageAccount} />
        <Route path='/salary_cal' Component={SalaryCal} />
        <Route path='/salary_list' Component={SalaryList} />
        <Route path='/welthfare_manage' Component={WelthfareManage} />
      </Routes>
    </Router>
  );
}

export default App;
