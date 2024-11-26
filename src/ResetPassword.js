import './App.css';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  // Extracting the oobCode from the query params
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Confirm the password reset with the oobCode token
    confirmPasswordReset(auth, resetToken, newPassword)
      .then(() => {
        alert('Password has been reset successfully.');
        navigate('/login'); // Redirect to the login page
      })
      .catch((error) => {
        alert('Error resetting password: ' + error.message);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className='Main'>
          <img
            src='https://i.postimg.cc/VLLwZdzX/PAM-logo.png'
            width={200}
            height={200}
            alt="Logo"
          />

          <p style={{ fontSize: 22, textAlign: 'left', color: '#343434', marginTop: 15, marginBottom: 5 }}>
            Reset Your Password
          </p>

          <input
            type="password"
            className="input-field"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Confirm New Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div>
            <button
              className="login-button"
              style={{ marginTop: 50 }}
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ResetPassword;
