import api from '../config/api';
import { BACKEND_URL } from '../config/api';

export const galleryService = {
  // Get all gallery items
  getAllGalleryItems: async () => {
    return await api.get('/gallery');
  },

  // Get gallery item by ID
  getGalleryItemById: async (id) => {
    return await api.get(`/gallery/${id}`);
  },

  // Create gallery item
  createGalleryItem: async (galleryData) => {
    const formData = new FormData();
    
    formData.append('name', galleryData.name);
    formData.append('description', galleryData.description || '');
    
    // Handle multiple images (max 10)
    if (galleryData.images && Array.isArray(galleryData.images)) {
      galleryData.images.forEach((image) => {
        if (image) formData.append('images', image);
      });
    }

    return await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update gallery item
  updateGalleryItem: async (id, galleryData) => {
    const formData = new FormData();
    
    Object.keys(galleryData).forEach((key) => {
      if (key === 'images') {
        if (Array.isArray(galleryData.images)) {
          galleryData.images.forEach((image) => {
            if (image) formData.append('images', image);
          });
        }
      } else if (galleryData[key] !== null && galleryData[key] !== undefined) {
        formData.append(key, galleryData[key]);
      }
    });

    return await api.put(`/gallery/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete gallery item
  deleteGalleryItem: async (id) => {
    return await api.delete(`/gallery/${id}`);
  },

  // Helper: Get image URLs
  getImageUrls: (imagePaths) => {
    if (!imagePaths || !Array.isArray(imagePaths)) return [];
    return imagePaths.map((path) => {
      if (!path) return "/placeholder.svg";
      // Ensure path is a string
      const pathStr = typeof path === 'string' ? path : String(path);
      if (!pathStr || pathStr === 'null' || pathStr === 'undefined') {
        return "/placeholder.svg";
      }
      // If already full URL, return as is
      if (pathStr.startsWith('http')) {
        return pathStr;
      }
      // If starts with , use BACKEND_URL
      if (pathStr.startsWith('')) {
        return `${BACKEND_URL}${pathStr}`;
      }
      // If it's just a filename, add 
      if (pathStr.startsWith('/')) {
        return `${BACKEND_URL}${pathStr}`;
      }
      // Build URL with BACKEND_URL
      return `${BACKEND_URL}${pathStr}`;
    }).filter(Boolean);
  },
};

