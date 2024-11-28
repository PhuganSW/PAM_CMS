//AdminContext.js
import React, { createContext, useState, useEffect } from 'react';
import adminAuth from './Firebase/AdminAuth'; // Use the new AdminAuth file
import firestore from './Firebase/Firestore';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('userData')) || null);
  const [currentAdmin, setCurrentAdmin] = useState(() => JSON.parse(localStorage.getItem('adminData')) || null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    const isAdminMode = localStorage.getItem('isAdminMode') === 'true';

    // หากอยู่ใน User Mode ไม่โหลดข้อมูล Admin
    if (isAdminMode) {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
       const storedAdmin = JSON.parse(localStorage.getItem('adminData'));
      if (storedAdmin) {
        setCurrentAdmin(storedAdmin);
        setLoadingAdmin(false);
      } else {
        setLoadingAdmin(false);
      }

      const unsubscribe = adminAuth.checksignin((user) => {
        if (user) {
          firestore.getAdminUser('adminPAM', user.uid, (accountData) => {
            localStorage.setItem('adminData', JSON.stringify(accountData));
            setCurrentAdmin(accountData);
            setLoadingAdmin(false);
          }, () => handleLogout(false));
        } else {
          handleLogout(false);
        }
      });

      return () => unsubscribe && unsubscribe();
    } else {
      setLoadingAdmin(false);
    }
  }, []);

  const handleLogout = (clearAll = true) => {
    if (clearAll) {
      setCurrentAdmin(null);
      localStorage.removeItem('adminData');
      setLoadingAdmin(false);
    }
  };

  return (
    <AdminContext.Provider value={{ currentAdmin, setCurrentAdmin, loadingAdmin, setLoadingAdmin ,handleLogout,
                                  currentUser,setCurrentUser, }}>
      {children}
    </AdminContext.Provider>
  );
};

