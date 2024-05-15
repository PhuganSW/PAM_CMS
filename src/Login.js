import './App.css';
import React, { useState,useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase/Config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser,setCurrentUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user)
        navigate("/home")
        console.log(user)
      }
    })
  }, []);

  const onLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in
      const user = userCredential.user;
      setCurrentUser(user)
      navigate("/home");
      console.log(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      alert(errorMessage); // Show the error message to the user
    }
  };

  // Define the forgotPassword function
  const forgotPassword = () => {
    // Implement forgot password logic here
    alert('Forgot password functionality not implemented yet');
  };

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
