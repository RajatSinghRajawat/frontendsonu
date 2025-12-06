import api from '../config/api';

export const feedbacksService = {
  // Get feedback count
  getFeedbackCount: async () => {
    return await api.get('/feedbacks/count');
  },

  // Create feedback (public)
  createFeedback: async (feedbackData) => {
    return await api.post('/feedbacks', feedbackData);
  },

  // Get all approved feedbacks (public)
  getAllFeedbacks: async () => {
    return await api.get('/feedbacks');
  },

  // Get all feedbacks - Admin only
  getAllFeedbacksAdmin: async () => {
    return await api.get('/feedbacks/admin/all');
  },

  // Get feedback by ID
  getFeedbackById: async (id) => {
    return await api.get(`/feedbacks/${id}`);
  },

  // Update feedback
  updateFeedback: async (id, feedbackData) => {
    return await api.put(`/feedbacks/${id}`, feedbackData);
  },

  // Update feedback status - Admin only
  updateFeedbackStatus: async (id, status) => {
    return await api.put(`/feedbacks/${id}/status`, { status });
  },

  // Delete feedback
  deleteFeedback: async (id) => {
    return await api.delete(`/feedbacks/${id}`);
  },
};

