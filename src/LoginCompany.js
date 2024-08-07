import './App.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import firestore from './Firebase/Firestore';

const LoginCompany = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState('');
  const { setCompanyId: setContextCompanyId } = useContext(UserContext);

  const onLogin = async (e) => {
    e.preventDefault();

    const success = (found) => {
      if (found) {
        setContextCompanyId(companyId);
        navigate('/login');
      } else {
        alert('Company not found!');
      }
    };

    const unsuccess = () => {
      alert('Company not found!');
    };

    firestore.checkCompany(companyId, success, unsuccess);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className='Main' style={{height:450}}>
          <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={200} height={200} alt="Logo" />
          <form onSubmit={onLogin}>
            <input
              style={{ marginTop: 20 }}
              className="input-field"
              placeholder="CompanyId"
              onChange={(e) => setCompanyId(e.target.value)}
              required
            />
            <button type="submit" className="login-button">Next</button>
          </form>
        </div>
      </header>
    </div>
  );
};

export default LoginCompany;
