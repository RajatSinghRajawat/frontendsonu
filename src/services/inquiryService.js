import api from '../config/api';

export const inquiryService = {
  // Create inquiry (public)
  createInquiry: async (inquiryData) => {
    return await api.post('/inquiry/createInquiry', inquiryData);
  },

  // Get all inquiries (public)
  getAllInquiries: async () => {
    return await api.get('/inquiry');
  },

  // Get inquiry by ID (public)
  getInquiryById: async (id) => {
    return await api.get(`/inquiry/getInquiryById/${id}`);
  },

  // Update inquiry (public)
  updateInquiry: async (id, inquiryData) => {
    return await api.put(`/inquiry/updateInquiry/${id}`, inquiryData);
  },

  // Delete inquiry (public)
  deleteInquiry: async (id) => {
    return await api.delete(`/inquiry/deleteInquiry/${id}`);
  },
};

