//Login.js
import './App.css';
import React, { useState,useEffect, useContext  } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from './Firebase/Config';
import { useNavigate } from 'react-router-dom';
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';
import { UserContext } from './UserContext';
import { Tune } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [currentUser,setCurrentUser] = useState(null)
  const { setCurrentUser, companyId } = useContext(UserContext);

  const getAccountS = (data) => {
    // Save companyId to local storage to persist across refreshes
    localStorage.setItem('companyId', companyId);
    navigate("/home");
  };

  const getAccountUn = () => alert("Account: Not Found user!!");

  const loginSuc = (user) => {
    if (user) {
      setCurrentUser(user);
      firestore.getAccount(companyId, user.uid, getAccountS, getAccountUn);
    } else {
      alert("Login: Not Found user!!");
    }
  }

  const loginUnsuc = (err1, err2) => {
    console.log(err1 + ": " + err2);
    alert("email or password is wrong!!");
  }

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    auth.signin(email,password,loginSuc,loginUnsuc)
  };

  // Define the forgotPassword function
  const forgotPassword = () => {
    navigate('/forgot_password')
  };

  // const suc=(user)=>{
  //   if (user) {
  //     setCurrentUser(user)
  //     firestore.getAccount("miscible",user.uid,getAccountS,getAccountUn)
      
  //   }
  // }

  // useEffect(() => {
  //   auth.checksignin(suc);
  // }, []);


  return (
    <div className="App">
      <header className="App-header">
        <div className='Main'>
          <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={200} height={200} alt="Logo" />
          <form onSubmit={onLogin}>
            <input type="email" style={{marginTop:10}} className="input-field" placeholder="Email" onChange={(e) => setEmail(e.target.value)} autoFocus={true} required />
            <input type="password" className="input-field" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <div className="forgotPass" onClick={forgotPassword}>forgot password?</div>
            <button type="submit" className="login-button">LOGIN</button>
          </form>
        </div>
      </header>
    </div>
  );
};

export default Login;
