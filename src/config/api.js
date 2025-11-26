import axios from 'axios';
import Cookies from 'js-cookie';

// Backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://backendsonu-1.onrender.com';
// API Base URL - append /api to backend URL
const API_BASE_URL = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        Cookies.remove('authToken');
        localStorage.removeItem('authToken');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
      
      return Promise.reject({
        message: data?.message || 'An error occurred',
        error: data?.error || error.message,
        status,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        error: error.message,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: 'An unexpected error occurred',
        error: error.message,
      });
    }
  }
);

export default api;
export { API_BASE_URL, BACKEND_URL };

