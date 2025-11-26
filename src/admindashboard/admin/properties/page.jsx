"use client"

import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { propertiesService } from '../../../services/propertiesService';
import { toast } from 'react-hot-toast';

// --- Theme Management Hook ---
const useDarkMode = () => {
    const [theme, setTheme] = useState(
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

// --- Form Component for Adding/Editing Property ---
const PropertyForm = ({ isEditing, currentProperty, onSave, onCancel }) => {
  const initialState = currentProperty || {
    title: '',
    plotCategory: 'Residential Plot',
    pricePerGaj: '',
    gaj: '',
    totalPrice: '',
    location: '',
    shortDescription: '',
    features: '',
    images: { main: null, optional: [null, null, null, null] }
  };

  const [formData, setFormData] = useState(initialState);
  const [categories, setCategories] = useState(['Residential Plot', 'Commercial Plot', 'Industrial Plot']);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const title = isEditing ? 'Edit Property' : 'Add New Property';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'pricePerGaj' || name === 'gaj') {
        const price = parseFloat(updated.pricePerGaj) || 0;
        const gaj = parseFloat(updated.gaj) || 0;
        updated.totalPrice = (price * gaj).toString();
      }
      return updated;
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setFormData(prev => ({ ...prev, plotCategory: newCategory.trim() }));
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const handleImageChange = (e, type, index = 0) => {
      const file = e.target.files[0];
      if (!file) return;

      if (type === 'main') {
          setFormData((prev) => ({ ...prev, images: { ...prev.images, main: file } }));
      } else if (type === 'optional') {
          const newOptional = [...formData.images.optional];
          newOptional[index] = file;
          setFormData((prev) => ({ ...prev, images: { ...prev.images, optional: newOptional } }));
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{title}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

          {/* Property Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Plot Category */}
          <div className="md:col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plot Category</label>
            <div className="flex space-x-2">
              <select
                name="plotCategory"
                value={formData.plotCategory}
                onChange={handleChange}
                required
                className="mt-1 block flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="mt-1 px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition min-w-[40px]"
              >
                +
              </button>
            </div>
            
            {showAddCategory && (
              <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Price per Gaj */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price per Gaj</label>
            <input
              type="number"
              name="pricePerGaj"
              value={formData.pricePerGaj}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Gaj */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gaj</label>
            <input
              type="number"
              name="gaj"
              value={formData.gaj}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Total Price (Read-only) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Price</label>
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              readOnly
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-600"
            />
          </div>

          {/* Location */}
          <div className='md:col-span-2'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Description</label>
          <textarea
            name="shortDescription"
            rows="3"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Features (comma separated)</label>
          <textarea
            name="features"
            rows="2"
            value={formData.features}
            onChange={handleChange}
            placeholder="e.g., Clear title, Road access, Water & electricity nearby"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Images Section */}
        <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Images (1 Main + Max 4 Optional)</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {/* Main Image */}
            <div className="xs:col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'main')}
                required={!isEditing}
                className="mt-1 block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
            </div>
            {/* Optional Images */}
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Optional {index + 1}</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'optional', index)}
                  className="mt-1 block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-2 sm:file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-50 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-100 dark:hover:file:bg-gray-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 space-y-reverse sm:space-x-3 pt-3 sm:pt-4 border-t mt-3 sm:mt-4 border-gray-200 dark:border-gray-700">
          <button 
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition mb-2 sm:mb-0"
          >
            {isEditing ? 'Update Property' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Card Component ---
const PropertyCard = ({ property, onEdit, onDelete }) => {
  const imageCount = Array.isArray(property.images) ? property.images.length : (property.images || 0);
  const firstImage = Array.isArray(property.images) && property.images.length > 0 
    ? propertiesService.getImageUrl(property.images[0]) 
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      {firstImage && (
        <div className="mb-3">
          <img 
            src={firstImage} 
            alt={property.name || property.title}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => { e.target.src = `/placeholder.svg`; }}
          />
        </div>
      )} 
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base flex-1 mr-2 line-clamp-2">
          {property.name || property.title}
        </h3>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
          {property.category || property.plotCategory}
        </span>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Location:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100 text-right line-clamp-1 ml-2">{property.location}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Price/Gaj:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">₹{(property.pricePerGaj || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Gaj:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{property.Gaj || property.gaj}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Total:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">₹{(property.totalPrice || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Images:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{imageCount}</span>
        </div>
      </div>

    {/* Description Preview */}
    <div className="mb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
        {property.shortDescription || property.description || 'No description'}
      </p>
    </div>

    <div className="flex space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
      <button
        onClick={() => onEdit(property)}
        className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
      <button
        onClick={() => onDelete(property._id || property.id)}
        className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition flex items-center justify-center"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  </div>
  );
};

// --- Main Property Management Component ---
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

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [theme] = useDarkMode();

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesService.getAllProperties();
      const propertiesData = response?.data || [];
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to load properties';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from properties
  const categories = ['All', ...new Set(properties.map(p => p.category || p.plotCategory).filter(Boolean))];

  // Filter properties based on category
  const filteredProperties = categoryFilter === 'All' 
    ? properties 
    : properties.filter(p => (p.category || p.plotCategory) === categoryFilter);

  // Calculate stats
  const totalProperties = properties.length;
  
  // This month properties (assuming current month is January 2024 for demo)
  const thisMonthProperties = properties.filter(p => {
    const propDate = new Date(p.createdAt);
    return propDate.getMonth() === 0 && propDate.getFullYear() === 2024; // January 2024
  }).length;

  // New properties (last 7 days)
  const newProperties = properties.filter(p => {
    const propDate = new Date(p.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return propDate >= weekAgo;
  }).length;

  const residentialProperties = properties.filter(p => p.plotCategory === 'Residential Plot').length;
  const commercialProperties = properties.filter(p => p.plotCategory === 'Commercial Plot').length;
  const industrialProperties = properties.filter(p => p.plotCategory === 'Industrial Plot').length;

  const handleAddClick = () => {
    setEditingProperty(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (property) => {
    // Convert API property format to form format
    const formProperty = {
      id: property._id || property.id,
      title: property.name || property.title,
      plotCategory: property.category || property.plotCategory,
      pricePerGaj: property.pricePerGaj || 0,
      gaj: property.Gaj || property.gaj || 0,
      totalPrice: property.totalPrice || 0,
      location: property.location || '',
      shortDescription: property.shortDescription || property.description || '',
      features: Array.isArray(property.features) 
        ? property.features.join(', ') 
        : (property.features || ''),
      images: {
        main: null,
        optional: [null, null, null, null]
      },
      existingImages: property.images || []
    };
    setEditingProperty(formProperty);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      await propertiesService.deleteProperty(itemToDelete);
      toast.success('Property deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchProperties(); // Refresh list
    } catch (error) {
      console.error('Error deleting property:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to delete property';
      toast.error(errorMessage);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleSave = async (newPropertyData) => {
    try {
      // Prepare form data
      const formData = {
        name: newPropertyData.title || newPropertyData.name,
        category: newPropertyData.plotCategory || newPropertyData.category,
        pricePerGaj: parseFloat(newPropertyData.pricePerGaj) || 0,
        Gaj: parseFloat(newPropertyData.gaj) || 0,
        totalPrice: parseFloat(newPropertyData.totalPrice) || 0,
        location: newPropertyData.location,
        shortDescription: newPropertyData.shortDescription,
        features: typeof newPropertyData.features === 'string' 
          ? newPropertyData.features.split(',').map(f => f.trim()).filter(Boolean)
          : newPropertyData.features || []
      };

      // Handle images
      const imageFiles = [];
      if (newPropertyData.images?.main) {
        imageFiles.push(newPropertyData.images.main);
      }
      if (newPropertyData.images?.optional) {
        newPropertyData.images.optional.forEach(img => {
          if (img) imageFiles.push(img);
        });
      }
      formData.images = imageFiles;

      if (editingProperty) {
        // Update existing property
        await propertiesService.updateProperty(editingProperty._id || editingProperty.id, formData);
        toast.success('Property updated successfully');
      } else {
        // Create new property
        await propertiesService.createProperty(formData);
        toast.success('Property created successfully');
      }
      
      setIsFormVisible(false);
      setEditingProperty(null);
      fetchProperties(); // Refresh list
    } catch (error) {
      console.error('Error saving property:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to save property';
      toast.error(errorMessage);
    }
  };
  
  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingProperty(null);
  };

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Property Management 🏡</h1>
          
          {/* Add Property Button */}
          <button
            onClick={handleAddClick}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Property
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {/* Total Properties Card */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-lg p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Properties</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{totalProperties}</h3>
            </div>
            <div className="text-blue-500">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>

          {/* This Month Card */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-lg p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{thisMonthProperties}</h3>
            </div>
            <div className="text-green-500">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V3a.75.75 0 01.75-.75zM4 9.75A.75.75 0 014.75 9h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 9.75zm0 4a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 13.75zm0 4a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 17.75z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* New Properties Card */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-lg p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">New (Last 7 days)</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{newProperties}</h3>
            </div>
            <div className="text-purple-500">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Categories Summary Card */}
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-lg p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Categories</p>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{categories.length - 1}</h3>
            </div>
            <div className="text-orange-500">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v2.879a2.5 2.5 0 00.732 1.767l6.5 6.5a2.5 2.5 0 003.536 0l2.878-2.878a2.5 2.5 0 000-3.536l-6.5-6.5A2.5 2.5 0 008.38 3H5.5zM6 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 mb-4 sm:mb-6">
          <div className="w-full sm:w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Modal */}
        {isFormVisible && (
          <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
            <DialogContent className="max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto p-0 sm:p-0">
              <DialogHeader className="p-4 sm:p-6 pb-0">
                <DialogTitle className="text-lg sm:text-xl">{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
              </DialogHeader>
              <PropertyForm
                isEditing={!!editingProperty}
                currentProperty={editingProperty}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Property Cards Grid */}
        <div>
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No properties found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {categoryFilter !== 'All' 
                  ? `No properties found in ${categoryFilter} category` 
                  : "Get started by adding your first property"}
              </p>
              <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property._id || property.id} 
                  property={property}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setItemToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          itemName="property"
        />
      </div>
    </Layout>
  );
};

export default PropertyManagement;