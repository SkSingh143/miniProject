import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user data on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Assuming the backend has an endpoint to get current user details
          const response = await axiosClient.get(API_ENDPOINTS.AUTH.ME);
          
          
          setUser(response.data.user);
        } catch (error) {
          console.error("Failed to load user", error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
      
      
      const { token: newToken, role: userData } = response.data;
      
      // Save to local storage
      localStorage.setItem('token', newToken);
      localStorage.setItem('userRole', userData);
      
      // Update state
      setToken(newToken);
      setUser(response.data);
      
      return response;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};