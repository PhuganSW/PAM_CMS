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
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Icons for visibility


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [currentUser,setCurrentUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const { setCurrentUser, setCompanyId, companyId, setUserData } = useContext(UserContext);

  const allowedTestEmails = ['admin.miscible@pam.com','sisira.w@miscible.com','hr.miscible@pam.com','test@test.com']

  const getAccountS = (data) => {
    // Save companyId to local storage to persist across refreshes
    console.log(data)
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
    navigate("/home");
  };

  const getAccountUn = () => alert("Account: Not Found user!!");

  const loginSuc = (user) => {
    if (user) {
      const userEmail = user.email.toLowerCase();
      if (user.emailVerified || allowedTestEmails.includes(userEmail)) {
        setCurrentUser(user);
        firestore.getAccount(companyId, user.uid, getAccountS, getAccountUn);
      } else {
        // If the email isn't verified, and it's not in the allowed list, alert the user
        alert("Please verify your email address before logging in.");
        auth.signOut();  // Sign the user out if their email isn't verified
      }
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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div className='Main'>
          <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={200} height={200} alt="Logo" />
          <div style={{flex:1}}>
            <p style={{color:'black',fontSize:24,marginBottom:0,textAlign:'left',marginLeft:-5}}>กรุณาใส่ User ในรูปแบบของอีเมล</p>
            <input type="email" className="input-field" placeholder="Email" onChange={(e) => setEmail(e.target.value)} autoFocus={true} required />
            <p style={{color:'black',fontSize:24,marginBottom:0,textAlign:'left',marginLeft:-5}}>กรุณาใส่ Password</p>
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="visibility-toggle"
                onClick={togglePasswordVisibility}
                style={{ color: 'black' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            <div className="forgotPass" onClick={forgotPassword}>forgot password?</div>
            <button type="submit" className="login-button" onClick={onLogin}>LOGIN</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Login;
