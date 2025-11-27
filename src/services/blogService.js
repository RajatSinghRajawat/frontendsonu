import api from '../config/api';
import { BACKEND_URL } from '../config/api';

export const blogService = {
  // Get all blogs
  getAllBlogs: async () => {
    return await api.get('/blog');
  },

  // Get blog by ID
  getBlogById: async (id) => {
    return await api.get(`/blog/${id}`);
  },

  // Create new blog (requires auth)
  createBlog: async (blogData) => {
    const formData = new FormData();
    
    // Required fields
    formData.append('name', blogData.name || blogData.title || '');
    formData.append('author', blogData.author || '');
    formData.append('description', blogData.description || blogData.excerpt || '');
    formData.append('content', blogData.content || blogData.fullContent || '');
    
    // Optional fields
    if (blogData.category) {
      formData.append('category', blogData.category);
    }
    if (blogData.date) {
      formData.append('date', blogData.date);
    }
    if (blogData.excerpt) {
      formData.append('excerpt', blogData.excerpt);
    }
    
    // Arrays - convert to JSON strings
    if (blogData.subHeadings && Array.isArray(blogData.subHeadings)) {
      formData.append('subHeadings', JSON.stringify(blogData.subHeadings));
    }
    if (blogData.quotes && Array.isArray(blogData.quotes)) {
      formData.append('quotes', JSON.stringify(blogData.quotes));
    }
    if (blogData.highlightPoints && Array.isArray(blogData.highlightPoints)) {
      formData.append('highlightPoints', JSON.stringify(blogData.highlightPoints));
    }
    
    // Image file
    if (blogData.image && blogData.image instanceof File) {
      formData.append('image', blogData.image);
    } else if (blogData.image) {
      formData.append('image', blogData.image);
    }

    return await api.post('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update blog (requires auth)
  updateBlog: async (id, blogData) => {
    const formData = new FormData();
    
    // Map frontend fields to backend fields
    if (blogData.name || blogData.title) {
      formData.append('name', blogData.name || blogData.title);
    }
    if (blogData.author) {
      formData.append('author', blogData.author);
    }
    if (blogData.description || blogData.excerpt) {
      formData.append('description', blogData.description || blogData.excerpt);
    }
    if (blogData.content || blogData.fullContent) {
      formData.append('content', blogData.content || blogData.fullContent);
    }
    if (blogData.category) {
      formData.append('category', blogData.category);
    }
    if (blogData.date) {
      formData.append('date', blogData.date);
    }
    if (blogData.excerpt) {
      formData.append('excerpt', blogData.excerpt);
    }
    
    // Arrays - convert to JSON strings
    if (blogData.subHeadings && Array.isArray(blogData.subHeadings)) {
      formData.append('subHeadings', JSON.stringify(blogData.subHeadings));
    }
    if (blogData.quotes && Array.isArray(blogData.quotes)) {
      formData.append('quotes', JSON.stringify(blogData.quotes));
    }
    if (blogData.highlightPoints && Array.isArray(blogData.highlightPoints)) {
      formData.append('highlightPoints', JSON.stringify(blogData.highlightPoints));
    }
    
    // Image file
    if (blogData.image && blogData.image instanceof File) {
      formData.append('image', blogData.image);
    } else if (blogData.image) {
      formData.append('image', blogData.image);
    }

    return await api.put(`/blog/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete blog (requires auth)
  deleteBlog: async (id) => {
    return await api.delete(`/blog/${id}`);
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

