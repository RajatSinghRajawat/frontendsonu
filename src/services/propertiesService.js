import api from '../config/api';
import { BACKEND_URL } from '../config/api';

export const propertiesService = {
  // Get property count
  getPropertyCount: async () => {
    return await api.get('/properties/count');
  },

  // Get all properties with optional filters
  getAllProperties: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';
    
    return await api.get(url);
  },

  // Get property by ID
  getPropertyById: async (id) => {
    return await api.get(`/properties/${id}`);
  },

  // Create new property (requires auth)
  createProperty: async (propertyData) => {
    const formData = new FormData();
    
    // Append all property fields
    Object.keys(propertyData).forEach((key) => {
      if (key === 'images') {
        // Handle multiple images
        if (Array.isArray(propertyData.images)) {
          propertyData.images.forEach((image) => {
            if (image) formData.append('images', image);
          });
        }
      } else if (key === 'features') {
        // Handle features array
        if (Array.isArray(propertyData.features)) {
          formData.append('features', JSON.stringify(propertyData.features));
        } else {
          formData.append('features', propertyData.features);
        }
      } else if (propertyData[key] !== null && propertyData[key] !== undefined) {
        formData.append(key, propertyData[key]);
      }
    });

    return await api.post('/properties/createProperty', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update property (requires auth)
  updateProperty: async (id, propertyData) => {
    const formData = new FormData();
    
    Object.keys(propertyData).forEach((key) => {
      if (key === 'images') {
        if (Array.isArray(propertyData.images)) {
          propertyData.images.forEach((image) => {
            if (image) formData.append('images', image);
          });
        }
      } else if (key === 'features') {
        if (Array.isArray(propertyData.features)) {
          formData.append('features', JSON.stringify(propertyData.features));
        } else {
          formData.append('features', propertyData.features);
        }
      } else if (propertyData[key] !== null && propertyData[key] !== undefined) {
        formData.append(key, propertyData[key]);
      }
    });

    return await api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete property (requires auth)
  deleteProperty: async (id) => {
    return await api.delete(`/properties/${id}`);
  },

  // Helper: Get image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    // Ensure imagePath is a string
    const imagePathStr = typeof imagePath === 'string' ? imagePath : String(imagePath);
    if (!imagePathStr || imagePathStr === 'null' || imagePathStr === 'undefined') {
      return "/placeholder.svg";
    }
    // If already full URL, return as is
    if (imagePathStr.startsWith('http://') || imagePathStr.startsWith('https://')) {
      return imagePathStr;
    }
    // If starts with /, use BACKEND_URL directly
    if (imagePathStr.startsWith('/')) {
      return `${BACKEND_URL}${imagePathStr}`;
    }
    // If it's just a filename, add / and BACKEND_URL
    return `${BACKEND_URL}/${imagePathStr}`;
  },
};

