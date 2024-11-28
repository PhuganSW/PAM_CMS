//Login.js
import './App.css';
import React, { useState,useEffect, useContext  } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from './Firebase/Config';
import { useNavigate } from 'react-router-dom';
import adminAuth from './Firebase/AdminAuth';
import firestore from './Firebase/Firestore';
import { AdminContext } from './AdminContext';
import { Tune } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Icons for visibility


const LoginAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [currentUser,setCurrentUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const { setCurrentAdmin, setLoadingAdmin } = useContext(AdminContext);

  const allowedTestEmails = ['admin.miscible@pam.com','sisira.w@miscible.com','hr.miscible@pam.com','admin.demo@pam.com']

  const getAccountS = (data) => {
    if (data) {
      // Save companyId to local storage to persist across refreshes
      console.log(data);
      setLoadingAdmin(false); // Stop the loading state
      setCurrentAdmin(data); // Set current admin state after successful account retrieval
      localStorage.setItem('adminData', JSON.stringify(data));
      localStorage.setItem('isAdminMode', 'true');
      navigate("/approve_plan"); // Only navigate if account is found
    } else {
      getAccountUn();
    }
  };

  const getAccountUn = () => {
    //setCurrentUser(null);
    setLoadingAdmin(false);
    alert("Account: Not Found user!!");
  }

  const loginSuc = (user) => {
    // if (user) {
    //   const userEmail = user.email.toLowerCase();
    //   if (user.emailVerified || allowedTestEmails.includes(userEmail)) {
    //     //setCurrentUser(user);
    //     firestore.getAccount("adminPAM", user.uid, getAccountS, getAccountUn);
    //   } else {
    //     // If the email isn't verified, and it's not in the allowed list, alert the user
    //     alert("Please verify your email address before logging in.");
    //     auth.signOut();  // Sign the user out if their email isn't verified
    //   }
    // } else {
    //   alert("Login: Not Found user!!");
    // }
    if (user) {
      firestore.getAdminUser("adminPAM", user.uid, getAccountS, getAccountUn);
    } else {
      alert("Login: Not Found user!!");
      setLoadingAdmin(false);
    }
  }

  const loginUnsuc = (err1, err2) => {
    console.log(err1 + ": " + err2);
    alert("email or password is wrong!!");
    setLoadingAdmin(false);
  }

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoadingAdmin(false);
    adminAuth.signin(email, password, loginSuc, loginUnsuc);
  };

  // Define the forgotPassword function
  const forgotPassword = () => {
    navigate('/forgot_password')
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const user = localStorage.getItem("adminData")
    if (user) {
      //firestore.getAccount(companyId,user.id,(data)=>console.log(data),(e)=>console.log(e))
      console.log('Admin Home:',user)
      navigate('/approve_plan');
    }
    
  }, [navigate]);


  return (
    <div className="App">
      <header className="App-header">
        <div className='Main'>
          <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={200} height={200} alt="Logo" />
          <form onSubmit={onLogin}>
          <div style={{flex:1}}>
            <p style={{color:'black',fontSize:24,marginBottom:0,textAlign:'left',marginLeft:-5}}>Admin User</p>
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
            {/* <div className="forgotPass" onClick={forgotPassword}>forgot password?</div> */}
            <button style={{marginTop:20}} type="submit" className="login-button">LOGIN</button>
          </div>
          </form>
        </div>
      </header>
    </div>
  );
};

export default LoginAdmin;
