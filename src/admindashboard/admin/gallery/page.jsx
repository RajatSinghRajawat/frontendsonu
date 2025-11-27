// GalleryManagement.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { galleryService } from '../../../services/galleryService';
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

// --- Form Component for Adding/Editing Gallery ---
const GalleryForm = ({ isEditing, currentGallery, onSave, onCancel }) => {
  const getInitialState = () => {
    if (currentGallery) {
      return {
        title: currentGallery.title || currentGallery.name || '',
        address: currentGallery.address || currentGallery.description || '',
        images: currentGallery.images || [], // All images for preview (URLs + new File previews)
        imageFiles: [], // Only new File objects to upload
        existingImages: currentGallery.images || [] // Original images from API
      };
    }
    return {
      title: '',
      address: '',
      images: [],
      imageFiles: [],
      existingImages: []
    };
  };

  const [formData, setFormData] = useState(() => getInitialState());
  const title = isEditing ? 'Edit Gallery' : 'Add New Gallery';

  // Update form data when currentGallery changes
  useEffect(() => {
    if (currentGallery) {
      setFormData({
        title: currentGallery.title || currentGallery.name || '',
        address: currentGallery.address || currentGallery.description || '',
        images: currentGallery.images || [],
        imageFiles: [],
        existingImages: currentGallery.images || []
      });
    } else {
      setFormData({
        title: '',
        address: '',
        images: [],
        imageFiles: [],
        existingImages: []
      });
    }
  }, [currentGallery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store File objects and create preview URLs
    const newImageFiles = [...formData.imageFiles];
    const newImagePreviews = [...formData.images]; // Keep existing previews
    
    files.forEach((file) => {
      newImageFiles.push(file);
      const imageUrl = URL.createObjectURL(file);
      newImagePreviews.push(imageUrl); // Add new preview to existing ones
    });

    setFormData(prev => ({ 
      ...prev, 
      images: newImagePreviews,
      imageFiles: newImageFiles,
      imageCount: newImagePreviews.length
    }));
    
    // Reset file input to allow selecting same file again
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newImageFiles = [...formData.imageFiles];
    const existingImages = formData.existingImages || [];
    
    // Check if removing an existing image (URL) or a new file preview
    const imageToRemove = newImages[index];
    const isExistingImage = existingImages.some(existing => existing === imageToRemove);
    
    // Remove from previews
    newImages.splice(index, 1);
    
    // If it's a new file (not in existing images), remove corresponding file
    if (!isExistingImage) {
      // Calculate which file index to remove
      // New files are added after existing images
      const existingCount = existingImages.length;
      const fileIndex = index - existingCount;
      if (fileIndex >= 0 && fileIndex < newImageFiles.length) {
        newImageFiles.splice(fileIndex, 1);
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      images: newImages,
      imageFiles: newImageFiles,
      imageCount: newImages.length
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      imageFiles: formData.imageFiles, // Send File objects
      imageCount: formData.images.length
    };
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gallery Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter gallery title"
              />
            </div>

            {/* Address/Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address/Location</label>
              <textarea 
                name="address" 
                rows="2"
                value={formData.address} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-sm sm:text-base dark:bg-gray-700 dark:text-gray-100"
                placeholder="Enter complete address or location"
              />
            </div>
            
            {/* Images Section - 3 images total */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Images ({formData.images?.length || 0})
              </h3>
              
              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {formData.images && formData.images.length > 0 ? (
                  formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="group relative">
                        <img 
                          src={image} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            e.target.src = '/placeholder.svg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-opacity shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
                    <span className="text-gray-400 text-xs">No images uploaded</span>
                  </div>
                )}
              </div>

              {/* File Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Images (Multiple images allowed)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                You can upload multiple images. All images will be displayed in the gallery.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t mt-4 border-gray-200 dark:border-gray-600">
              <button 
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition order-2 sm:order-1"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition order-1 sm:order-2"
              >
                {isEditing ? 'Update Gallery' : 'Save Gallery'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Stats Cards Component ---
const StatsCards = ({ galleries }) => {
  const totalGalleries = galleries.length;
  const totalImages = galleries.reduce((sum, g) => sum + g.imageCount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
      {/* Total Galleries */}
      <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Galleries</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{totalGalleries}</h3>
          </div>
          <div className="text-blue-500">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Total Images */}
      <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-3 sm:p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Images</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{totalImages}</h3>
          </div>
          <div className="text-green-500">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Gallery Card Component ---
const GalleryCard = ({ gallery, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = gallery.images || [];

  
  const hasImages = images.length > 0;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Slider */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 group">
        {hasImages ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={`${gallery.title} ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder.svg';
              }}
            />
            
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all z-10 shadow-lg"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all z-10 shadow-lg"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/40 px-2 py-1 rounded-full">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-6 h-2' 
                        : 'bg-white/60 hover:bg-white/80 w-2 h-2'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Images</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex-1 pr-2">
            {gallery.title}
          </h3>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
            {gallery.imageCount}/3
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
          {gallery.address}
        </p>

        <div className="flex space-x-2 pt-2 border-t border-gray-100 dark:border-gray-600">
          <button
            onClick={() => onEdit(gallery)}
            className="flex-1 bg-blue-600 text-white py-2 px-2 rounded text-xs font-medium hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(gallery.id)}
            className="flex-1 bg-red-600 text-white py-2 px-2 rounded text-xs font-medium hover:bg-red-700 transition"
          >
            Delete
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

// --- Main Gallery Management Content Component ---
const GalleryManagementContent = () => {
  const [galleries, setGalleries] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [theme] = useDarkMode();

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getAllGalleryItems();
      const galleriesData = response?.data || [];
      // Map API data and get image URLs
      const mappedGalleries = galleriesData.map(gallery => ({
        ...gallery,
        id: gallery._id || gallery.id,
        title: gallery.name || gallery.title,
        address: gallery.description || gallery.address,
        imageCount: Array.isArray(gallery.images) ? gallery.images.length : 0,
        images: galleryService.getImageUrls(gallery.images || [])
      }));
      setGalleries(mappedGalleries);
    } catch (error) {
      console.error('Error fetching galleries:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to load galleries';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleAddClick = () => {
    setEditingGallery(null);
    setIsFormVisible(true);
  };
  
  const handleEditClick = (gallery) => {
    setEditingGallery(gallery);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      await galleryService.deleteGalleryItem(itemToDelete);
      toast.success('Gallery deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchGalleries();
    } catch (error) {
      console.error('Error deleting gallery:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to delete gallery';
      toast.error(errorMessage);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleSave = async (newGalleryData) => {
    try {
      const formData = {
        name: newGalleryData.title || newGalleryData.name,
        description: newGalleryData.address || newGalleryData.description
      };

      // Only add images if there are new File objects to upload
      if (newGalleryData.imageFiles && newGalleryData.imageFiles.length > 0) {
        formData.images = newGalleryData.imageFiles.filter(img => img instanceof File);
      }

      // For new gallery, images are required
      if (!editingGallery && (!formData.images || formData.images.length === 0)) {
        toast.error('Please upload at least one image');
        return;
      }

      if (editingGallery) {
        // For update, only send images if new files are uploaded
        if (formData.images && formData.images.length > 0) {
          await galleryService.updateGalleryItem(editingGallery.id || editingGallery._id, formData);
        } else {
          // No new images, just update name and description
          await galleryService.updateGalleryItem(editingGallery.id || editingGallery._id, formData);
        }
        toast.success('Gallery updated successfully');
      } else {
        await galleryService.createGalleryItem(formData);
        toast.success('Gallery created successfully');
      }
      
      setIsFormVisible(false);
      setEditingGallery(null);
      fetchGalleries();
    } catch (error) {
      console.error('Error saving gallery:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to save gallery';
      toast.error(errorMessage);
    }
  };
  
  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingGallery(null);
  };

  return (
    <div className="p-3 sm:p-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Gallery Management</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage property galleries and images</p>
      </div>
      
      {/* Stats Cards */}
      <StatsCards galleries={galleries} />
      
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddClick}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base"
        >
          + Add New Gallery
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading galleries...</p>
          </div>
        ) : galleries.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No galleries yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating your first gallery</p>
            <button
              onClick={handleAddClick}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              Create Gallery
            </button>
          </div>
        ) : (
          galleries.map((gallery) => (
            <GalleryCard 
              key={gallery.id || gallery._id}
              gallery={gallery}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))
        )}
      </div>

      {/* Form Modal */}
      {isFormVisible && (
        <GalleryForm 
          isEditing={!!editingGallery} 
          currentGallery={editingGallery} 
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
        itemName="gallery"
      />
    </div>
  );
};

// --- Wrapper Component to apply Layout ---
const GalleryManagement = () => (
    <Layout>
        <GalleryManagementContent />
    </Layout>
);

export default GalleryManagement;