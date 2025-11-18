import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Tenta carregar dados do Local Storage ao iniciar
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return { 
      token, 
      role, 
      isAuthenticated: !!token // true se o token existir
    };
  });

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuthData({ token, role, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthData({ token: null, role: null, isAuthenticated: false });
  };
  
  const isAdmin = authData.role === 'admin';

  return (
    <AuthContext.Provider value={{ authData, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);