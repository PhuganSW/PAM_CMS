import './App.css';
import React, { useState,useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from './Firebase/Config';
import { useNavigate } from 'react-router-dom';
import auth from './Firebase/Auth';

const ForgotPass = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser,setCurrentUser] = useState(null)

    const resetPass = () => {
        auth.resetPassword(
          email,
          () => {
            alert("Check your email for reset password instructions.");
            navigate("/login_company");
          },
          (error) => {
            alert("Error resetting password: " + error.message);
          }
        );
      };


    return (
    <div className="App">
        <header className="App-header">
        <div className='Main'>
            <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={200} height={200} alt="Logo" />
            
            <p style={{fontSize:22,textAlign:'left',color:'#343434',marginTop:15,marginBottom:5}}>กรอก E-mail เพื่อรีเซ็ตรหัสผ่าน</p>
            <input type="email" className="input-field" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            
            <div>
            <button  className="login-button" style={{marginTop:50,}} onClick={resetPass}>Send</button>
            </div>
        </div>
        </header>
    </div>
    );
};

export default ForgotPass;
