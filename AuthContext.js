
// src/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setToken(storedToken || '');
    setRole(storedRole || '');
    setIsAuthenticated(!!storedToken);
  }, []);

  const login = (receivedToken, userRole) => {
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('role', userRole);
    setToken(receivedToken);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setRole('');
    setIsAuthenticated(false);
  };

  // isAdmin = true if role is "ADMIN"
  const isAdmin = role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, role, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Optional helper to use context in any component
export const useAuth = () => useContext(AuthContext);