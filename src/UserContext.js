// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId') || null);
  const [loading, setLoading] = useState(true);  // Set loading to true initially

  useEffect(() => {
    // Listen for Firebase authentication changes
    const unsubscribe = auth.checksignin((user) => {
      if (user) {
        setCurrentUser(user);  // Set user if authenticated
        const storedCompanyId = localStorage.getItem('companyId');
        if (storedCompanyId) {
          setCompanyId(storedCompanyId);  // Retrieve companyId from localStorage
        }
      } else {
        setCurrentUser(null);  // Clear user state if not authenticated
        setCompanyId(null);    // Clear companyId if not authenticated
      }
      setLoading(false);  // Stop loading after the check is complete
    });

    return () => {
      // Ensure unsubscribe is called on component unmount
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, companyId, setCompanyId, loading }}>
      {children}
    </UserContext.Provider>
  );
};
