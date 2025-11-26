import api from '../config/api';
import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'authToken';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data?.token) {
      Cookies.set(AUTH_TOKEN_KEY, response.data.token, { expires: 7 });
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    }
    return response;
  },

  // Register new admin
  registerAdmin: async (adminData) => {
    const response = await api.post('/admin/register', adminData);
    if (response.data?.token) {
      Cookies.set(AUTH_TOKEN_KEY, response.data.token, { expires: 7 });
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    }
    return response;
  },

  // Login user (admin)
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    if (response.data?.token) {
      Cookies.set(AUTH_TOKEN_KEY, response.data.token, { expires: 7 });
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    }
    return response;
  },

  // Get current user profile (admin)
  getProfile: async () => {
    return await api.get('/admin/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const formData = new FormData();
    
    Object.keys(profileData).forEach((key) => {
      if (key === 'profilePicture' && profileData.profilePicture instanceof File) {
        formData.append('profilePicture', profileData.profilePicture);
      } else if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });

    return await api.put('/admin/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return await api.put('/admin/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Get all users (Admin only)
  getAllUsers: async () => {
    return await api.get('/auth/users');
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    return await api.delete(`/auth/users/${userId}`);
  },

  // Logout - clear token
  logout: () => {
    Cookies.remove(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Get token
  getToken: () => {
    return Cookies.get(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authService.getToken();
  },
};

