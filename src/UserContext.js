// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId') || null);
  const [userData, setUserData] = useState(null); // Store Firestore user data
  const [loading, setLoading] = useState(true);  // Set loading to true initially
  const [newLeaveRequests, setNewLeaveRequests] = useState(false);
  const [newOtRequests, setNewOtRequests] = useState(false);

  useEffect(() => {

    // const timeoutId = setTimeout(() => {
    //   // Reset state after 1 minute if still loading
    //   if (loading) {
    //     setLoading(false);
    //     setCurrentUser(null);
    //     setCompanyId(null);
    //   }
    // }, 60000); // 1 minute timeout (60000 ms)
    // Listen for Firebase authentication changes
    const unsubscribe = auth.checksignin((user) => {
      if (user) {
        //clearTimeout(timeoutId);
        setCurrentUser(user);  // Set user if authenticated
        const storedCompanyId = localStorage.getItem('companyId');
        if (storedCompanyId) {
          setCompanyId(storedCompanyId);  // Retrieve companyId from localStorage

          firestore.getAccount(storedCompanyId, user.uid, (accountData) => {
            setUserData(accountData); // Store Firestore user data
            setLoading(false);  // Stop loading after data is fetched
          }, () => {
            console.error("Error fetching user data from Firestore");
            setLoading(false); // Stop loading even if there's an error
          });
        }
      } else {
        setCurrentUser(null);  // Clear user state if not authenticated
        setCompanyId(null);    // Clear companyId if not authenticated
        setUserData(null);    // Clear Firestore user data
        setLoading(false); 
      }
      // setLoading(false);  // Stop loading after the check is complete
    });

    return () => {
      // Ensure unsubscribe is called on component unmount
      if (unsubscribe) unsubscribe();
      //clearTimeout(timeoutId);
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, companyId, setCompanyId,userData, setUserData,
                                   loading, newLeaveRequests, setNewLeaveRequests, newOtRequests, setNewOtRequests }}>
      {children}
    </UserContext.Provider>
  );
};
