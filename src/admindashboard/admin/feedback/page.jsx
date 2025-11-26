// FeedbackManagement.jsx
"use client"

import React, { useState, useEffect } from 'react';
import Layout from "../../Layout";

// --- Theme Management Hook (Required for applying dark class to root element) ---
const useDarkMode = () => {
    // Check localStorage or default to system preference/light
    const [theme] = useState(
        localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );

    // Effect to update localStorage and body class
    useEffect(() => {
        const root = window.document.documentElement;

        // Ensure the root element has the correct theme class
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);

    }, [theme]);

    // Only returning the theme state
    return [theme];
};


// --- Dummy Data (इसे आपके API से बदला जाएगा) ---
const initialFeedbacks = [
  {
    id: 201,
    name: 'Ravi Kumar',
    email: 'info@luxuryestates.com',
    rating: '5',
    message: 'Excellent service and very professional team. Highly recommended!',
    date: '2025-11-12',
  },
  {
    id: 202,
    name: 'Priya Patel',
    email: 'info@luxuryestates.com',
    rating: '4',
    message: 'Good experience overall, but could improve response time.',
    date: '2025-11-11',
  },
  {
    id: 203,
    name: 'Amit Singh',
    email: 'info@luxuryestates.com',
    rating: '3',
    message: 'Average service. Needs more attention to detail.',
    date: '2025-11-10',
  },
];

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

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [selectedFeedback, setSelectedFeedback] = useState(null); // View Modal के लिए
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [theme] = useDarkMode(); // Initialize theme logic

  // --- Actions ---

  // Feedback Delete Handler
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    // API call to delete the feedback would go here
    console.log(`Deleting feedback with ID: ${itemToDelete}`);
    setFeedbacks(feedbacks.filter((feedback) => feedback.id !== itemToDelete));
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Feedback View Handler (Modal)
  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
  };

  // --- Components for Rendering ---

  // 1. View Modal Component (Dark Mode Styles Applied)
  const ViewModal = ({ feedback, onClose }) => {
    if (!feedback) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 m-4 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600">Feedback Details</h2>

          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p><strong>Name:</strong> {feedback.name}</p>
            <p><strong>Email:</strong> {feedback.email}</p>
            <p><strong>Rating:</strong> {feedback.rating}/5</p>
            <p><strong>Date:</strong> {feedback.date}</p>
            {/* Message Box */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Message:</p>
              <p className="whitespace-pre-wrap">{feedback.message}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 2. Main Table (Dark Mode Styles Applied)
  // Calculate stats
  const totalFeedback = feedbacks.length;
  const averageRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + parseInt(f.rating), 0) / feedbacks.length).toFixed(1) : 0;

  return (
    <Layout>
      {/* Apply main background to the content area */}
      <div className="p-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Feedback Management 💬</h1>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Feedback</p>
              <h3 className="text-xl md:text-2xl font-bold">{totalFeedback}</h3>
            </div>
            <div className="text-amber-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl md:rounded-2xl p-3 md:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
              <h3 className="text-xl md:text-2xl font-bold">{averageRating}/5</h3>
            </div>
            <div className="text-yellow-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Feedback Table Container */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{feedback.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{feedback.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{feedback.rating}/5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">{feedback.message}</td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(feedback)}
                        className="text-blue-500 hover:text-blue-400 mr-3 text-sm font-semibold dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteClick(feedback.id)}
                        className="text-red-500 hover:text-red-400 text-sm font-semibold dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {feedbacks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          No feedback found.
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Modal Render */}
        {selectedFeedback && (
          <ViewModal
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
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

export default FeedbackManagement;
