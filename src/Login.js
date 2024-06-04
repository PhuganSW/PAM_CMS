import './App.css';
import React, { useState,useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from './Firebase/Config';
import { useNavigate } from 'react-router-dom';
import auth from './Firebase/Auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser,setCurrentUser] = useState(null)

  const loginSuc=(user)=>{
    console.log(user)
    setCurrentUser(user)
    navigate("/home");
  }

  const loginUnsuc=(err1,err2)=>{
    alert(err1+": "+err2);
  }

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    auth.signin(email,password,loginSuc,loginUnsuc)
  };

  // Define the forgotPassword function
  const forgotPassword = () => {
    // Implement forgot password logic here
    alert('Forgot password functionality not implemented yet');
  };

  const suc=(user)=>{
    if (user) {
      setCurrentUser(user)
      navigate("/home")
      console.log(user)
    }
  }

  useEffect(() => {
    auth.checksignin(suc);
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <div className='Main'>
          <img src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png' width={200} height={200} alt="Logo" />
          <form onSubmit={onLogin}>
            <input type="email" style={{marginTop:10}} className="input-field" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
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
