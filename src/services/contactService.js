import api from '../config/api';

export const contactService = {
  // Create contact (public)
  createContact: async (contactData) => {
    return await api.post('/contact', contactData);
  },

  // Get all contacts (public)
  getAllContacts: async () => {
    return await api.get('/contact');
  },

  // Get contact by ID (public)
  getContactById: async (id) => {
    return await api.get(`/contact/${id}`);
  },

  // Update contact (public)
  updateContact: async (id, contactData) => {
    return await api.put(`/contact/${id}`, contactData);
  },

  // Delete contact (public)
  deleteContact: async (id) => {
    return await api.delete(`/contact/${id}`);
  },
};

