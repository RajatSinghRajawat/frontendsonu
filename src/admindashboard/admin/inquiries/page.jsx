"use client";

import React, { useState, useEffect } from 'react';
import {
  Search, Trash2, AlertCircle, CheckCircle, Clock, XCircle, X,
  Building, Package, Wrench, FileText, Eye, Phone, Filter, MapPin, DollarSign, Home
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Layout from "../../Layout";
import { inquiryService } from '../../../services/inquiryService';

const AdminInquiry = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // No dummy data - will fetch from API

  // Fetch inquiries from API
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryService.getAllInquiries();
      const inquiriesData = response?.data || [];
      // Add default status if not present
      const inquiriesWithStatus = inquiriesData.map(inq => ({
        ...inq,
        status: inq.status || 'New'
      }));
      setInquiries(inquiriesWithStatus);
    } catch (err) {
      console.error('Error loading inquiries:', err);
      const errorMessage = err?.message || err?.error || err?.response?.data?.message || 'Failed to load inquiries';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Delete inquiry
  const handleDelete = async () => {
    if (!inquiryToDelete) return;

    try {
      await inquiryService.deleteInquiry(inquiryToDelete);
      setInquiries(inquiries.filter(inquiry => inquiry._id !== inquiryToDelete));
      setShowDeleteModal(false);
      toast.success("Inquiry deleted successfully!");
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
      const errorMessage = err?.message || err?.error || err?.response?.data?.message || 'Failed to delete inquiry';
      toast.error(errorMessage);
    }
  };

  // Update inquiry status
  const handleStatusChange = async (id, newStatus) => {
    const originalInquiries = [...inquiries];
    
    // Optimistic UI update
    setInquiries(currentInquiries =>
      currentInquiries.map(inq =>
        inq._id === id ? { ...inq, status: newStatus } : inq
      )
    );
    
    toast.loading("Updating status...", { id: `status-update-${id}` });

    try {
      await inquiryService.updateInquiry(id, { status: newStatus });
      toast.success("Status updated successfully!", { id: `status-update-${id}` });
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert to original state on error
      setInquiries(originalInquiries);
      const errorMessage = err?.message || err?.error || err?.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage, { id: `status-update-${id}` });
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Confirmed':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
          icon: CheckCircle,
          dot: 'bg-emerald-500'
        };
      case 'Pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
          icon: Clock,
          dot: 'bg-amber-500'
        };
      case 'Rejected':
        return {
          color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
          icon: XCircle,
          dot: 'bg-red-500'
        };
      case 'New':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
          icon: AlertCircle,
          dot: 'bg-blue-500'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
          icon: AlertCircle,
          dot: 'bg-gray-500'
        };
    }
  };

  // Filter inquiries by search term and status
  const filteredInquiries = inquiries.filter(inquiry => {
    if (!inquiry) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      (inquiry.name || '').toLowerCase().includes(searchLower) ||
      (inquiry.email || '').toLowerCase().includes(searchLower) ||
      (inquiry.message || inquiry.description || '').toLowerCase().includes(searchLower) ||
      (inquiry.phone || inquiry.number || '').toLowerCase().includes(searchLower) ||
      (inquiry.propertyDetails?.name || inquiry.propertyDetails?.title || inquiry.propertyId?.name || '').toLowerCase().includes(searchLower) ||
      (inquiry.propertyDetails?.location || inquiry.propertyId?.location || '').toLowerCase().includes(searchLower)
    );

    const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = inquiries.reduce((acc, inquiry) => {
    if (inquiry && inquiry.status) {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
    }
    return acc;
  }, {});

  const LoadingCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div>
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this inquiry? This action cannot be undone.</p>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // View Modal Component
  const ViewModal = ({ inquiry, onClose }) => {
    if (!inquiry) return null;

    const statusConfig = getStatusConfig(inquiry.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Inquiry Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Header with Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg gap-3">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg mr-3 sm:mr-4">
                {inquiry.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{inquiry.name || 'Unknown'}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{inquiry.email || 'No email'}</p>
              </div>
            </div>
            <div className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${statusConfig.color} self-start sm:self-auto`}>
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${statusConfig.dot}`}></div>
              <StatusIcon size={10} className="mr-1 hidden sm:block" />
              {inquiry.status || "New"}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Property Information */}
            {(inquiry.propertyDetails || inquiry.propertyId) && (
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 flex items-center">
                  <Home size={14} className="mr-2 text-blue-600 flex-shrink-0" />
                  Property Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Home size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Property Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {inquiry.propertyDetails?.name || inquiry.propertyDetails?.title || inquiry.propertyId?.name || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <MapPin size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {inquiry.propertyDetails?.location || inquiry.propertyId?.location || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <DollarSign size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {inquiry.propertyDetails?.totalPrice || inquiry.propertyDetails?.price || inquiry.propertyId?.totalPrice 
                          ? `₹${(inquiry.propertyDetails?.totalPrice || inquiry.propertyDetails?.price || inquiry.propertyId?.totalPrice).toLocaleString('en-IN')}`
                          : 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Building size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {inquiry.propertyDetails?.category || inquiry.propertyDetails?.plotCategory || inquiry.propertyId?.category || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  {(inquiry.propertyDetails?.gaj || inquiry.propertyId?.Gaj || inquiry.propertyId?.gaj) && (
                    <div className="flex items-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FileText size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Size</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {inquiry.propertyDetails?.gaj || inquiry.propertyId?.Gaj || inquiry.propertyId?.gaj || 0} Gaj
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 gap-2 sm:gap-4">
                <div className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Building size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{inquiry.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Phone size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{inquiry.phone || inquiry.number || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <FileText size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{inquiry.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 flex items-center">
                <FileText size={14} className="mr-2 text-blue-600 flex-shrink-0" />
                Message
              </h3>
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  {inquiry.message || inquiry.description || 'No message provided.'}
                </p>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500 dark:text-gray-400 border-t dark:border-gray-600 pt-3 sm:pt-4 gap-1">
              <span>
                Submitted on {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : "N/A"}
              </span>
              <span>ID: {inquiry._id?.slice(-6) || 'N/A'}</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Filter Modal
  const MobileFilterModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-40 sm:hidden">
      <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter Inquiries</h3>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setShowMobileFilters(false);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              setStatusFilter('All');
              setShowMobileFilters(false);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen ">
        {/* Toaster for notifications */}
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
            },
          }}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteModal && <DeleteConfirmationModal />}

        {/* View Modal */}
        {selectedInquiry && (
          <ViewModal 
            inquiry={selectedInquiry} 
            onClose={() => setSelectedInquiry(null)} 
          />
        )}

        {/* Mobile Filter Modal */}
        {showMobileFilters && <MobileFilterModal />}

        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Inquiry Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                Manage and track all customer inquiries
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {[
              { label: 'Total', value: inquiries.length, color: 'bg-blue-500' },
              { label: 'New', value: statusCounts.New || 0, color: 'bg-blue-500' },
              { label: 'Pending', value: statusCounts.Pending || 0, color: 'bg-amber-500' },
              { label: 'Confirmed', value: statusCounts.Confirmed || 0, color: 'bg-emerald-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm">
                <div className="flex items-center">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${stat.color} mr-2 sm:mr-3`}></div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, company, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="sm:hidden flex items-center px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter size={16} className="mr-1" />
                  <span className="text-sm">Filter</span>
                </button>

                {/* Desktop Filter */}
                <div className="hidden sm:block">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 border cursor-pointer border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100"
                  >
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="grid gap-3 sm:gap-4">
                {[1, 2, 3].map(i => <LoadingCard key={i} />)}
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-12 text-center shadow-sm">
                <AlertCircle size={40} className="mx-auto text-gray-400 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No inquiries found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {searchTerm || statusFilter !== 'All' 
                    ? "Try adjusting your search criteria or filters" 
                    : "No inquiries have been submitted yet"}
                </p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => {
                if (!inquiry) return null;
                
                const statusConfig = getStatusConfig(inquiry.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={inquiry._id}
                    className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 mb-3 sm:mb-4 lg:mb-0">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg mr-2 sm:mr-3 md:mr-4">
                              {inquiry.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {inquiry.name || 'Unknown'}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                                {inquiry.email || 'No email provided'}
                              </p>
                            </div>
                          </div>
                          <div className={`flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${statusConfig.color} self-start sm:self-auto mt-1 sm:mt-0`}>
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${statusConfig.dot}`}></div>
                            <StatusIcon size={10} className="mr-1 hidden sm:block" />
                            {inquiry.status || "New"}
                          </div>
                        </div>

                        {/* Property Details Preview */}
                        {(inquiry.propertyDetails || inquiry.propertyId) && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-xs sm:text-sm">
                              <Home size={12} className="mr-2 text-blue-600" />
                              Property: {inquiry.propertyDetails?.name || inquiry.propertyDetails?.title || inquiry.propertyId?.name || 'Unknown'}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                              {inquiry.propertyDetails?.location || inquiry.propertyId?.location ? (
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                  <MapPin size={10} className="mr-1 text-blue-600" />
                                  <span className="truncate">{inquiry.propertyDetails?.location || inquiry.propertyId?.location}</span>
                                </div>
                              ) : null}
                              {(inquiry.propertyDetails?.totalPrice || inquiry.propertyDetails?.price || inquiry.propertyId?.totalPrice) ? (
                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                  <DollarSign size={10} className="mr-1 text-blue-600" />
                                  <span className="truncate">
                                    ₹{(inquiry.propertyDetails?.totalPrice || inquiry.propertyDetails?.price || inquiry.propertyId?.totalPrice).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Phone size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {inquiry.phone || inquiry.number || 'Not provided'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <FileText size={14} className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {inquiry.email || 'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Message Preview */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center text-xs sm:text-sm">
                            <FileText size={12} className="mr-2 text-blue-600" />
                            Message
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {inquiry.message || inquiry.description || 'No message provided.'}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 dark:text-gray-400 gap-1">
                          <span>
                            Submitted on {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : "N/A"}
                          </span>
                          <span>ID: {inquiry._id?.slice(-6) || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between lg:justify-end space-x-2 lg:ml-4 lg:pl-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-200 dark:border-gray-700 lg:flex-col lg:space-x-0 lg:space-y-2 lg:self-stretch">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-xs sm:text-sm lg:w-full lg:justify-center"
                          title="View Details"
                        >
                          <Eye size={14} className="mr-1 sm:mr-1.5" />
                          <span>View</span>
                        </button>
                        <select
                          className="px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 lg:w-full"
                          value={inquiry.status || "New"}
                          onChange={e => handleStatusChange(inquiry._id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button
                          className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-xs sm:text-sm lg:w-full lg:justify-center"
                          onClick={() => {
                            setInquiryToDelete(inquiry._id);
                            setShowDeleteModal(true);
                          }}
                          title="Delete Inquiry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminInquiry;