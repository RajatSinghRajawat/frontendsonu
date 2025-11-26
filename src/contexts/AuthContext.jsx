import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getProfile();
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      if (response.data?.user && response.data?.token) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true, user: response.data.user };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      const message = error?.message || error?.error || error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      if (response.data?.user && response.data?.token) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return { success: true, user: response.data.user };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      const message = error.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback(async (profileData) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(profileData);
      if (response.data) {
        setUser(response.data);
        toast.success('Profile updated successfully!');
        return { success: true, user: response.data };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      const message = error?.message || error?.error || error?.response?.data?.message || 'Update failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

