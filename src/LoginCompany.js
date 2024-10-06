import './App.css';
import React, { useState, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import firestore from './Firebase/Firestore';
import auth from './Firebase/Auth';

const LoginCompany = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState('');
  const { setCompanyId: setContextCompanyId } = useContext(UserContext);

  const onLogin = async (e) => {
    e.preventDefault();

    const success = (found) => {
      if (found) {
        setContextCompanyId(companyId);
        localStorage.setItem('companyId', companyId);  // Save companyId to localStorage
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

  useEffect(() => {
    auth.checksignin((user) => {
      if (user) {
        //firestore.getAccount(companyId,user.id,(data)=>console.log(data),(e)=>console.log(e))
        navigate('/home');
      }
    });
  }, [navigate]);

  return (
    <div className="App">
      <header className="App-header">
        <div className='Main'>
          <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={200} height={200} alt="Logo" />
          <form onSubmit={onLogin}>
            <input
              style={{ marginTop: 50, textAlign: companyId ? 'left' : 'center'}}
              className="input-field"
              placeholder="Company ID"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            />
            <button type="submit" className="login-button" style={{marginTop:30}}>Next</button>
          </form>
        </div>
      </header>
    </div>
  );
};

export default LoginCompany;
