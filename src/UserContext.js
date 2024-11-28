// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('userData')) || null);
  const [currentAdmin, setCurrentAdmin] = useState(() => JSON.parse(localStorage.getItem('adminData')) || null);
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId') || null);
  const [userData, setUserData] = useState(null); // Store Firestore user data
  const [loading, setLoading] = useState(true);  // Set loading to true initially
  const [newLeaveRequests, setNewLeaveRequests] = useState(false);
  const [newOtRequests, setNewOtRequests] = useState(false);

  useEffect(() => {
    const isAdminMode = localStorage.getItem('isAdminMode') === 'true';

    // หากอยู่ใน Admin Mode ไม่โหลดข้อมูล User
    if (!isAdminMode) {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      const storedAdmin = JSON.parse(localStorage.getItem('adminData'));
      if (storedUser) {
        setCurrentUser(storedUser);
        setLoading(false);
      } else {
        setLoading(false);
      }

      const unsubscribe = auth.checksignin((user) => {
        if (user) {
          const storedCompanyId = localStorage.getItem('companyId');
          if (storedCompanyId) {
            firestore.getAccount(storedCompanyId, user.uid, (accountData) => {
              localStorage.setItem('userData', JSON.stringify(accountData));
              setCurrentUser(accountData);
              setLoading(false);
            }, () => handleLogout(false));
          } else {
            handleLogout(false);
          }
        } else {
          handleLogout(false);
        }
      });

      return () => unsubscribe && unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);


  const handleLogout = (clearAll = true) => {
    if (clearAll) {
      setCurrentUser(null);
      setCompanyId(null);
      localStorage.removeItem('companyId');
      localStorage.removeItem('userData');
      setLoading(false)
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, companyId, setCompanyId,userData, setUserData,
                                   loading,setLoading, newLeaveRequests, setNewLeaveRequests, newOtRequests, setNewOtRequests, handleLogout,
                                   currentAdmin,setCurrentAdmin, }}>
      {children}
    </UserContext.Provider>
  );
};
