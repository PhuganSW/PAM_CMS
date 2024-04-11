import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/home" Component={Home} />
       
        
      </Routes>
    </Router>
  );
}

export default App;
