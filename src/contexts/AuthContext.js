// src/contexts/AuthContext.js
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
     
      if (response.ok) {
        // Store both user data and token
        const userData = {
          id: data.user._id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role
        };
        setUser(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);