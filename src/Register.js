//Register.js
import './App.css';
import React, { useState,useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from './Firebase/Config';
import { useNavigate } from 'react-router-dom';
import { IoEye, IoEyeOff } from 'react-icons/io5'; 
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';
import { hashPassword } from './hashPassword';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [level, setLevel] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const [currentUser,setCurrentUser] = useState(null)

    const levels = [
        // { label: 'Administrator', value: 0 },
        { label: 'Super Admin', value: 1 },
        { label: 'Admin', value: 2 },
        { label: 'User', value: 3 }
    ];

    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const verifyCompanyId = async () => {
        if (!companyId) {
            setErrorMessage("Company ID is required.");
            return false;
        }
        // Check for whitespace in companyId
        if (/\s/.test(companyId)) {
            setErrorMessage("Company ID cannot contain spaces.");
            return false;
        }

        // Proceed to check if the companyId is already in use
        return new Promise((resolve, reject) => {
            firestore.checkCompany(companyId, (exists) => {
                if (exists) {
                    setErrorMessage("Company ID is already in use.");
                    resolve(false);
                } else {
                    resolve(true); // companyId is valid and not in use
                }
            }, (error) => {
                console.error("Error checking company ID:", error);
                setErrorMessage("An error occurred while verifying the Company ID.");
                reject(false);
            });
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const isCompanyIdValid = await verifyCompanyId();
        if (!isCompanyIdValid) return;
    
        // Validate password and confirm password
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
    
        try {
            // Disable auth state change listener temporarily
            auth.disableAuthStateListener();  // New step to temporarily disable listener
    
            // Proceed with account creation
            const user = await auth.createAccount(email, password);  // Now this works with async/await!
    
            // Step 1: Account creation was successful, now add account data to Firestore
            const hashedPassword = await hashPassword(password); // Hash the password
    
            const accountData = {
                email,
                name,
                position,
                level: 1,
                password: hashedPassword
            };
    
            // Step 2: Add user to Firestore
            await firestore.addAccount(companyId, user.uid, accountData);

            auth.sendVerificationEmail(user, 
                () => alert('Verification email sent. Please check your inbox.'),
                (error) => console.error('Error sending verification email:', error)
            );
            
            // Step 3: Sign out the user immediately after account creation to prevent navigation to /home
            await auth.signOut();  // This will sign the user out and prevent automatic navigation to home
    
            // Step 4: Alert the user that the account was created
            alert('Account created successfully! Please log in.');
    
            // Step 5: Redirect to login page after successful sign out
            navigate('/'); // Ensure we navigate to the login page
        } catch (error) {
            console.error('Error creating account or adding to Firestore:', error);
            setErrorMessage('Error creating account, please try again.');
        } finally {
            // Re-enable the auth state change listener
            auth.enableAuthStateListener();  // Re-enable listener once everything is complete
        }
    };

    return (
    <div className="App">
        <header className="App-header">
            <div className='Main'>
            <h2 style={{color:'black',marginTop:-30,fontWeight:'bold'}}>Sign Up</h2>

            {/* Company ID */}
            <input
                type="text"
                className="input-field"
                placeholder="Company ID"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required
                style={{ marginBottom: '10px' }} // Add space between inputs
            />

            {/* Email */}
            <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginBottom: '10px' }} // Add space between inputs
            />

            {/* Password */}
            <div style={{ position: 'relative', marginBottom: '10px' }}> {/* Add space */}
                <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
                />
                <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
                >
                {showPassword ? <IoEyeOff size={24} /> : <IoEye size={24} />}
                </button>
            </div>

            {/* Confirm Password */}
            <div style={{ position: 'relative', marginBottom: '10px' }}> {/* Add space */}
                <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
                />
                <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
                >
                {showConfirmPassword ? <IoEyeOff size={24} /> : <IoEye size={24} />}
                </button>
            </div>

            {/* Name */}
            <input
                type="text"
                className="input-field"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ marginBottom: '10px' }} // Add space between inputs
            />

            {/* Position */}
            <input
                type="text"
                className="input-field"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                style={{ marginBottom: '10px' }} // Add space between inputs
            />

            {/* Level */}
            {/* <select
                className="input-field"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
                style={{ marginBottom: '10px' }} // Add space between inputs
            >
                <option value="" disabled>Select Level</option>
                {levels.map((levelOption) => (
                <option key={levelOption.value} value={levelOption.value}>
                    {levelOption.label}
                </option>
                ))}
            </select> */}

            {/* Error Message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            
            <button
                className="login-button"
                onClick={handleRegister}
                style={{ marginTop: 0 }}
            >
                Register
            </button>
            </div>
        </header>
    </div>
    );
};

export default Register;
