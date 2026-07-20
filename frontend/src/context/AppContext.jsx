import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('@Barbearia:user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        return {
          name: userData.nome,
          email: userData.email,
          role: userData.role,
          id: userData.id,
          token: userData.token || ''
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (userData) => {
    if (userData && userData.email) {
      setCurrentUser({
        name: userData.nome,
        email: userData.email,
        role: userData.role,
        id: userData.id || userData._id,
        token: userData.token
      });
      localStorage.setItem('@Barbearia:user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('@Barbearia:user');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
