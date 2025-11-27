import axios from 'axios';
import { BACKEND_URL } from '../config/api';

const API_URL = `${BACKEND_URL}/api/social-media`;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with default config
const createApiInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
};

export const socialMediaService = {
  // Get all social media links
  getAllLinks: async () => {
    try {
      const api = createApiInstance();
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching social media links:', error);
      throw error.response?.data || error;
    }
  },

  // Get single social media link by platform
  getLinkByPlatform: async (platform) => {
    try {
      const api = createApiInstance();
      const response = await api.get(`/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${platform} link:`, error);
      throw error.response?.data || error;
    }
  },

  // Create or update social media link
  createOrUpdateLink: async (platform, url) => {
    try {
      const api = createApiInstance();
      const response = await api.post('/', { platform, url });
      return response.data;
    } catch (error) {
      console.error('Error creating/updating social media link:', error);
      throw error.response?.data || error;
    }
  },

  // Update social media link
  updateLink: async (id, linkData) => {
    try {
      const api = createApiInstance();
      const response = await api.put(`/${id}`, linkData);
      return response.data;
    } catch (error) {
      console.error('Error updating social media link:', error);
      throw error.response?.data || error;
    }
  },

  // Update multiple links at once
  updateMultipleLinks: async (linksData) => {
    try {
      const api = createApiInstance();
      const response = await api.post('/bulk-update', { links: linksData });
      return response.data;
    } catch (error) {
      console.error('Error updating social media links:', error);
      throw error.response?.data || error;
    }
  },

  // Delete social media link
  deleteLink: async (id) => {
    try {
      const api = createApiInstance();
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting social media link:', error);
      throw error.response?.data || error;
    }
  }
};

