import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function getSessionToken() {
  return sessionStorage.getItem('token');
}
function getSessionRole() {
  return sessionStorage.getItem('role');
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getSessionToken());
  const [role, setRole] = useState(getSessionRole());

  const login = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('role', newRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 