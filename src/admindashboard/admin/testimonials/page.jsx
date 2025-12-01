// FeedbackManagement.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { feedbacksService } from '../../../services/feedbacksService';
import { toast } from 'react-hot-toast';

// --- Theme Management Hook ---
const useDarkMode = () => {
    const [theme] = useState(
        typeof window !== 'undefined' ? 
        (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        : 'light'
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove(theme === 'dark' ? 'light' : 'dark');
            root.classList.add(theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    return [theme]; 
};

// No dummy data - will fetch from API

// --- Star Rating Component ---
const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-500"> 
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-lg sm:text-xl ${i < rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}>
          ★
        </span>
      ))}
    </div>
  );
};

// --- Stats Cards Component ---
const StatsCards = ({ feedbacks }) => {
  const totalReviews = feedbacks.length;
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, t) => sum + t.rating, 0) / feedbacks.length).toFixed(1)
    : 0;
  const approvedReviews = feedbacks.filter(t => t.status === 'approved').length;
  const declinedReviews = feedbacks.filter(t => t.status === 'declined').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Reviews */}
      <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Reviews</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{totalReviews}</h3>
          </div>
          <div className="text-blue-500">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Avg Rating</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{averageRating}</h3>
          </div>
          <div className="text-amber-500">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Approved */}
      <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Approved</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{approvedReviews}</h3>
          </div>
          <div className="text-green-500">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Declined */}
      <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Declined</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{declinedReviews}</h3>
          </div>
          <div className="text-red-500">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Feedback Form Component ---
const FeedbackForm = ({ isEditing, currentFeedback, onSave, onCancel }) => {
  const getInitialState = () => {
    if (currentFeedback) {
      return {
        name: currentFeedback.name || '',
        email: currentFeedback.email || '',
        message: currentFeedback.message || '',
        rating: currentFeedback.rating || 5
      };
    }
    return {
      name: '',
      email: '',
      message: '',
      rating: 5
    };
  };

  const [formData, setFormData] = useState(() => getInitialState());

  // Update form data when currentFeedback changes
  useEffect(() => {
    if (currentFeedback) {
      setFormData({
        name: currentFeedback.name || '',
        email: currentFeedback.email || '',
        message: currentFeedback.message || '',
        rating: currentFeedback.rating || 5
      });
    } else {
      setFormData({
        name: '',
        email: '',
        message: '',
        rating: 5
      });
    }
  }, [currentFeedback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
            {isEditing ? 'Edit Feedback' : 'Add New Feedback'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating *</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter feedback message..."
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 space-y-reverse sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              {isEditing ? 'Update Feedback' : 'Create Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- View Modal Component ---
const ViewModal = ({ feedback, onClose, onStatusChange }) => {
  if (!feedback) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'declined': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'declined': return 'Declined';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Feedback Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Status Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                {getStatusText(feedback.status)}
              </span>
            </div>
            <select
              value={feedback.status}
              onChange={(e) => onStatusChange(feedback.id, e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm w-full sm:w-auto"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approve</option>
              <option value="declined">Decline</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
            <StarRating rating={feedback.rating || 0} />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">{feedback.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">{feedback.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created At</label>
              <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">
                {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID</label>
              <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">#{feedback.id}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {feedback.message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Delete Confirmation Modal Component ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName = 'item' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
            Confirm Deletion
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Are you sure you want to delete this {itemName}? This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Feedback Management Component ---
const FeedbackManagementContent = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [theme] = useDarkMode();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbacksService.getAllFeedbacksAdmin();
      const feedbacksData = response?.data || [];
      // Map API data to component format
      const mappedFeedbacks = feedbacksData.map(feedback => ({
        ...feedback,
        id: feedback._id || feedback.id,
        message: feedback.message || '',
        status: feedback.status || 'pending',
        date: feedback.createdAt ? new Date(feedback.createdAt).toISOString().split('T')[0] : feedback.date
      }));
      setFeedbacks(mappedFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to load feedbacks';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter feedbacks based on status
  const filteredFeedbacks = statusFilter === 'All' 
    ? feedbacks 
    : feedbacks.filter(feedback => feedback.status === statusFilter);

  // Update feedback status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await feedbacksService.updateFeedbackStatus(id, newStatus);
      setFeedbacks(feedbacks.map(feedback =>
        feedback.id === id ? { ...feedback, status: newStatus } : feedback
      ));
      setSelectedFeedback(null); // Close modal after status change
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating feedback status:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  // Delete feedback
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      await feedbacksService.deleteFeedback(itemToDelete);
      toast.success('Feedback deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to delete feedback';
      toast.error(errorMessage);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // Add feedback
  const handleAddClick = () => {
    setEditingFeedback(null);
    setIsFormVisible(true);
  };

  // Edit feedback
  const handleEditClick = (feedback) => {
    setEditingFeedback(feedback);
    setIsFormVisible(true);
  };

  // Save feedback
  const handleSave = async (feedbackData) => {
    try {
      const formData = {
        name: feedbackData.name,
        email: feedbackData.email,
        message: feedbackData.message,
        rating: Number(feedbackData.rating)
      };

      if (editingFeedback) {
        await feedbacksService.updateFeedback(editingFeedback.id || editingFeedback._id, formData);
        toast.success('Feedback updated successfully');
      } else {
        await feedbacksService.createFeedback(formData);
        toast.success('Feedback created successfully');
      }
      
      setIsFormVisible(false);
      setEditingFeedback(null);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error saving feedback:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to save feedback';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingFeedback(null);
  };

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Feedbacks Management</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage and moderate customer feedbacks</p>
            </div>
            <button
              onClick={handleAddClick}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Feedback
            </button>
          </div>
        </div>
      
      {/* Stats Cards */}
      <StatsCards feedbacks={feedbacks} />
      
      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedbacks
          </div>
        </div>
      </div>

      {/* Feedback List - Desktop Table & Mobile Cards */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading feedbacks...
                  </td>
                </tr>
              ) : filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No feedbacks found</p>
                      <p className="text-gray-500 dark:text-gray-400">Try changing your filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {feedback.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {feedback.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StarRating rating={feedback.rating} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      feedback.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {feedback.status === 'approved' ? 'Approved' : 
                       feedback.status === 'pending' ? 'Pending' : 'Declined'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {feedback.date}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(feedback)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(feedback.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading feedbacks...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No feedbacks found</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Try changing your filter criteria</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{feedback.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{feedback.email}</p>
                </div>
                <div className="text-right">
                  <StarRating rating={feedback.rating} />
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                    feedback.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {feedback.status === 'approved' ? 'Approved' : 
                     feedback.status === 'pending' ? 'Pending' : 'Declined'}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                  {feedback.message}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>Date: {feedback.date}</span>
                <span>ID: #{feedback.id}</span>
              </div>

              <div className="flex space-x-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                <button
                  onClick={() => setSelectedFeedback(feedback)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditClick(feedback)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(feedback.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* View Modal */}
      <ViewModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Form Modal */}
      {isFormVisible && (
        <FeedbackForm
          isEditing={!!editingFeedback}
          currentFeedback={editingFeedback}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName="feedback"
      />
      </div>
    </Layout>
  );
};

export default FeedbackManagementContent;