import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      const result = await authService.login(username, password, role);
      if (result.success) {
        setUser(result.user);
        return result.user;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        return result.user;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const setUserData = (userData) => {
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    // Update state
    setUser(userData);
    // Force update all components
    window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData }));
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    setUserData,
    refreshUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isOrganizer: user?.role === 'ORGANIZER',
    isParticipant: user?.role === 'PARTICIPANT'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};