// ContactManagement.jsx
"use client"

import React, { useState, useEffect } from 'react';
import Layout from "../../Layout";
import { contactService } from '../../../services/contactService';
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

// No dummy data - will fetch from API

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [theme] = useDarkMode();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllContacts();
      const contactsData = response?.data || [];
      // Add default status if not present
      const contactsWithStatus = contactsData.map(contact => ({
        ...contact,
        id: contact._id || contact.id,
        status: contact.status || 'New',
        date: contact.createdAt ? new Date(contact.createdAt).toISOString().split('T')[0] : contact.date
      }));
      setContacts(contactsWithStatus);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to load contacts';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter contacts based on status
  const filteredContacts = statusFilter === 'All' 
    ? contacts 
    : contacts.filter(contact => contact.status === statusFilter);

  // Contact Delete Handler
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      await contactService.deleteContact(itemToDelete);
      toast.success('Contact deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to delete contact';
      toast.error(errorMessage);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // Update contact status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await contactService.updateContact(id, { status: newStatus });
      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, status: newStatus } : contact
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating contact status:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  // Calculate stats
  const totalContacts = contacts.length;
  const newContacts = contacts.filter(c => c.status === 'New').length;
  const contactedContacts = contacts.filter(c => c.status === 'Contacted').length;
  const rejectedContacts = contacts.filter(c => c.status === 'Rejected').length;

  // View Modal Component
  const ViewModal = ({ contact, onClose, onStatusChange }) => {
    if (!contact) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        case 'Contacted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Contact Message Details</h2>
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </div>
              <select
                value={contact.status}
                onChange={(e) => onStatusChange(contact.id, e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm w-full sm:w-auto"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">{contact.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base break-all">{contact.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">{contact.number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">{contact.date}</p>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <p className="text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base">{contact.subject}</p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {contact.message}
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

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Contact Management</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage and track all customer inquiries and messages</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Total Contacts */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Contacts</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{totalContacts}</h3>
              </div>
              <div className="text-blue-500">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* New Contacts */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">New</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{newContacts}</h3>
              </div>
              <div className="text-green-500">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Contacted */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Contacted</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{contactedContacts}</h3>
              </div>
              <div className="text-amber-500">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{rejectedContacts}</h3>
              </div>
              <div className="text-red-500">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
          </div>
        </div>

        {/* Contact Table Container - Mobile Cards & Desktop Table */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Loading contacts...
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No contacts found</p>
                        <p className="text-gray-500 dark:text-gray-400">Try changing your filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {contact.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                      {contact.subject}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {contact.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {contact.number}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        contact.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        contact.status === 'Contacted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteClick(contact.id)}
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
                <p className="text-gray-500 dark:text-gray-400">Loading contacts...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No contacts found</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Try changing your filter criteria</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
              <div key={contact.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{contact.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{contact.email}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    contact.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    contact.status === 'Contacted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {contact.status}
                  </span>
                </div>
                
                <div className="space-y-1 mb-3">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <span className="font-medium">Subject:</span> {contact.subject}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <span className="font-medium">Phone:</span> {contact.number}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    <span className="font-medium">Date:</span> {contact.date}
                  </p>
                </div>

                <div className="flex space-x-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
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
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusChange={handleStatusChange}
        />
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          itemName="contact"
        />
      </div>
    </Layout>
  );
};

export default ContactManagement;