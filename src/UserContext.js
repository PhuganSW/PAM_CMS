// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import auth from './Firebase/Auth';
import firestore from './Firebase/Firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkUser, setCheckUser] = useState(false);
  const [account, setAccount] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.checksignin((user) => {
      if (user && companyId) {
        setCurrentUser(user);
        firestore.getAccount(companyId, user.uid, (data) => {
          setCheckUser(true);
          setAccount(data)
        }, () => alert("Not Found user!!"));
      }
      setLoading(false); // Stop loading when auth state is determined
    });
    return unsubscribe;
  }, [companyId]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, companyId, setCompanyId, loading, checkUser,account }}>
      {children}
    </UserContext.Provider>
  );
};
