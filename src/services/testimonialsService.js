import api from '../config/api';
import { BACKEND_URL } from '../config/api';

export const testimonialsService = {
  // Get testimonial count
  getTestimonialCount: async () => {
    return await api.get('/testimonials/count');
  },

  // Get all testimonials
  getAllTestimonials: async () => {
    return await api.get('/testimonials');
  },

  // Get testimonial by ID
  getTestimonialById: async (id) => {
    return await api.get(`/testimonials/${id}`);
  },

  // Create testimonial
  createTestimonial: async (testimonialData) => {
    const formData = new FormData();
    
    formData.append('name', testimonialData.name);
    formData.append('title', testimonialData.title);
    formData.append('text', testimonialData.text);
    formData.append('rating', testimonialData.rating);
    if (testimonialData.image) {
      formData.append('image', testimonialData.image);
    }

    return await api.post('/testimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update testimonial
  updateTestimonial: async (id, testimonialData) => {
    const formData = new FormData();
    
    Object.keys(testimonialData).forEach((key) => {
      if (key === 'image' && testimonialData.image) {
        formData.append('image', testimonialData.image);
      } else if (testimonialData[key] !== null && testimonialData[key] !== undefined) {
        formData.append(key, testimonialData[key]);
      }
    });

    return await api.put(`/testimonials/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete testimonial
  deleteTestimonial: async (id) => {
    return await api.delete(`/testimonials/${id}`);
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

