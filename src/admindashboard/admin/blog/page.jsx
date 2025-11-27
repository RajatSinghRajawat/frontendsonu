"use client"

import React, { useState, useEffect } from 'react';
import Layout from "../../Layout";
import { blogService } from '../../../services/blogService';
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

// --- Blog Form Component ---
const BlogForm = ({ isEditing, currentBlog, onSave, onCancel }) => {
  const getInitialState = () => {
    if (currentBlog) {
      return {
        title: currentBlog.title || currentBlog.name || '',
        author: currentBlog.author || '',
        category: currentBlog.category || '',
        date: currentBlog.date || (currentBlog.createdAt ? new Date(currentBlog.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        excerpt: currentBlog.excerpt || currentBlog.description || '',
        fullContent: currentBlog.fullContent || currentBlog.content || '',
        featuredImage: currentBlog.featuredImage || (currentBlog.image ? blogService.getImageUrl(currentBlog.image) : ''),
        subHeadings: currentBlog.subHeadings && currentBlog.subHeadings.length > 0 ? currentBlog.subHeadings : [{ title: '', content: '' }],
        quotes: currentBlog.quotes && currentBlog.quotes.length > 0 ? currentBlog.quotes : [''],
        highlightPoints: currentBlog.highlightPoints && currentBlog.highlightPoints.length > 0 ? currentBlog.highlightPoints : ['']
      };
    }
    return {
      title: '',
      author: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      fullContent: '',
      featuredImage: '',
      subHeadings: [{ title: '', content: '' }],
      quotes: [''],
      highlightPoints: ['']
    };
  };

  const [formData, setFormData] = useState(() => getInitialState());
  const [imageFile, setImageFile] = useState(null);
  const title = isEditing ? 'Edit Blog Post' : 'Add New Blog Post';

  // Update form data when currentBlog changes
  useEffect(() => {
    if (currentBlog) {
      setFormData({
        title: currentBlog.title || currentBlog.name || '',
        author: currentBlog.author || '',
        category: currentBlog.category || '',
        date: currentBlog.date || (currentBlog.createdAt ? new Date(currentBlog.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        excerpt: currentBlog.excerpt || currentBlog.description || '',
        fullContent: currentBlog.fullContent || currentBlog.content || '',
        featuredImage: currentBlog.featuredImage || (currentBlog.image ? blogService.getImageUrl(currentBlog.image) : ''),
        subHeadings: currentBlog.subHeadings && currentBlog.subHeadings.length > 0 ? currentBlog.subHeadings : [{ title: '', content: '' }],
        quotes: currentBlog.quotes && currentBlog.quotes.length > 0 ? currentBlog.quotes : [''],
        highlightPoints: currentBlog.highlightPoints && currentBlog.highlightPoints.length > 0 ? currentBlog.highlightPoints : ['']
      });
      setImageFile(null);
    } else {
      setFormData({
        title: '',
        author: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        fullContent: '',
        featuredImage: '',
        subHeadings: [{ title: '', content: '' }],
        quotes: [''],
        highlightPoints: ['']
      });
      setImageFile(null);
    }
  }, [currentBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Featured Image Upload Handler
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, featuredImage: imageUrl }));
    }
  };

  const removeFeaturedImage = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, featuredImage: '' }));
  };

  // Dynamic Fields Handlers
  const handleSubHeadingChange = (index, field, value) => {
    const newSubHeadings = [...formData.subHeadings];
    newSubHeadings[index] = { ...newSubHeadings[index], [field]: value };
    setFormData(prev => ({ ...prev, subHeadings: newSubHeadings }));
  };

  const addSubHeading = () => {
    setFormData(prev => ({
      ...prev,
      subHeadings: [...prev.subHeadings, { title: '', content: '' }]
    }));
  };

  const removeSubHeading = (index) => {
    const newSubHeadings = formData.subHeadings.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, subHeadings: newSubHeadings }));
  };

  const handleQuoteChange = (index, value) => {
    const newQuotes = [...formData.quotes];
    newQuotes[index] = value;
    setFormData(prev => ({ ...prev, quotes: newQuotes }));
  };

  const addQuote = () => {
    setFormData(prev => ({
      ...prev,
      quotes: [...prev.quotes, '']
    }));
  };

  const removeQuote = (index) => {
    const newQuotes = formData.quotes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, quotes: newQuotes }));
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlightPoints];
    newHighlights[index] = value;
    setFormData(prev => ({ ...prev, highlightPoints: newHighlights }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlightPoints: [...prev.highlightPoints, '']
    }));
  };

  const removeHighlight = (index) => {
    const newHighlights = formData.highlightPoints.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, highlightPoints: newHighlights }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty values
    const finalData = {
      ...formData,
      subHeadings: formData.subHeadings.filter(sh => sh.title || sh.content),
      quotes: formData.quotes.filter(quote => quote.trim()),
      highlightPoints: formData.highlightPoints.filter(point => point.trim()),
      featuredImage: imageFile || formData.featuredImage // Use file if uploaded, otherwise use existing URL
    };
    
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl w-full max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700 mx-2 sm:mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-800 z-10">
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
        <div className="p-3 sm:p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author *</label>
                <input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Investment">Investment</option>
                  <option value="Technology">Technology</option>
                  <option value="Market Trends">Market Trends</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured Image {!isEditing && '*'}
              </label>
              {formData.featuredImage ? (
                <div className="relative inline-block">
                  <img 
                    src={formData.featuredImage} 
                    alt="Featured" 
                    className="w-full sm:w-64 h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    onError={(e) => {
                      e.target.src = '/placeholder.svg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeFeaturedImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : null}
              <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center ${formData.featuredImage ? 'mt-2' : ''}`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  required={!isEditing && !formData.featuredImage}
                  className="hidden"
                  id="featuredImage"
                />
                <label 
                  htmlFor="featuredImage"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex flex-col items-center"
                >
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{formData.featuredImage ? 'Change Image' : 'Click to upload featured image'}</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This image will be displayed as the main image for your blog post.
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt *</label>
              <textarea 
                name="excerpt" 
                rows="2"
                value={formData.excerpt} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the blog post"
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Content *</label>
              <textarea 
                name="fullContent" 
                rows="4"
                value={formData.fullContent} 
                onChange={handleChange} 
                required 
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Main content of the blog post"
              />
            </div>

            {/* Sub Headings */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub Headings</label>
                <button
                  type="button"
                  onClick={addSubHeading}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  + Add
                </button>
              </div>
              {formData.subHeadings.map((subHeading, index) => (
                <div key={index} className="grid grid-cols-1 gap-2 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    placeholder="Sub heading title"
                    value={subHeading.title}
                    onChange={(e) => handleSubHeadingChange(index, 'title', e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Sub heading content"
                      value={subHeading.content}
                      onChange={(e) => handleSubHeadingChange(index, 'content', e.target.value)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.subHeadings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubHeading(index)}
                        className="bg-red-600 text-white px-3 rounded hover:bg-red-700 flex items-center justify-center min-w-[2rem]"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quotes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quotes</label>
                <button
                  type="button"
                  onClick={addQuote}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  + Add
                </button>
              </div>
              {formData.quotes.map((quote, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter quote"
                    value={quote}
                    onChange={(e) => handleQuoteChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.quotes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuote(index)}
                      className="bg-red-600 text-white px-3 rounded hover:bg-red-700 flex items-center justify-center min-w-[2rem]"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Highlight Points */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Highlight Points</label>
                <button
                  type="button"
                  onClick={addHighlight}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  + Add
                </button>
              </div>
              {formData.highlightPoints.map((point, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter highlight point"
                    value={point}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.highlightPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="bg-red-600 text-white px-3 rounded hover:bg-red-700 flex items-center justify-center min-w-[2rem]"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
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
                {isEditing ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Blog Card Component ---
const BlogCard = ({ blog, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        {blog.featuredImage && (
          <div className="flex-shrink-0">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full sm:w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base line-clamp-2 flex-1">
              {blog.title}
            </h3>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 self-start">
              {blog.category}
            </span>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {blog.author}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {blog.date}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {blog.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onView(blog)}
              className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>
            <button
              onClick={() => onEdit(blog)}
              className="flex-1 sm:flex-none px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(blog.id || blog._id)}
              className="flex-1 sm:flex-none px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition flex items-center justify-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
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

// --- View Modal Component ---
const ViewModal = ({ blog, onClose }) => {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-xl w-full max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700 mx-2 sm:mx-4">
        <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Blog Post Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 sm:p-4 md:p-6 space-y-4 text-gray-700 dark:text-gray-300">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-4">
              <img 
                src={blog.featuredImage} 
                alt="Featured" 
                className="w-full h-48 sm:h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p><strong className="text-gray-900 dark:text-gray-100">Title:</strong> {blog.title}</p>
            <p><strong className="text-gray-900 dark:text-gray-100">Author:</strong> {blog.author}</p>
            <p><strong className="text-gray-900 dark:text-gray-100">Category:</strong> {blog.category}</p>
            <p><strong className="text-gray-900 dark:text-gray-100">Date:</strong> {blog.date}</p>
          </div>

          <div>
            <p><strong className="text-gray-900 dark:text-gray-100">Excerpt:</strong></p>
            <p className="text-gray-600 dark:text-gray-300">{blog.excerpt}</p>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Full Content:</p>
            <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">{blog.fullContent}</p>
          </div>
          
          {blog.subHeadings && blog.subHeadings.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Sub Headings:</p>
              <div className="space-y-3">
                {blog.subHeadings.map((sub, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{sub.title}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{sub.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {blog.quotes && blog.quotes.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Quotes:</p>
              <div className="space-y-2">
                {blog.quotes.map((quote, index) => (
                  <p key={index} className="italic border-l-4 border-green-500 pl-3 text-gray-600 dark:text-gray-300 text-sm">"{quote}"</p>
                ))}
              </div>
            </div>
          )}
          
          {blog.highlightPoints && blog.highlightPoints.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Highlight Points:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {blog.highlightPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end p-3 sm:p-4 md:p-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Blog Management Component ---
const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [theme] = useDarkMode();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs();
      const blogsData = response?.data || [];
      // Map API data to component format
      const mappedBlogs = blogsData.map(blog => ({
        ...blog,
        id: blog._id || blog.id,
        title: blog.name || blog.title,
        excerpt: blog.excerpt || blog.description || '',
        fullContent: blog.content || blog.fullContent || '',
        featuredImage: blog.image ? blogService.getImageUrl(blog.image) : (blog.featuredImage || '/placeholder.svg'),
        category: blog.category || '',
        date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : (blog.createdAt ? new Date(blog.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        subHeadings: blog.subHeadings || [],
        quotes: blog.quotes || [],
        highlightPoints: blog.highlightPoints || []
      }));
      setBlogs(mappedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to load blogs';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalBlogs = blogs.length;
  const categories = [...new Set(blogs.map(b => b.category))].length;

  // Handlers
  const handleAddClick = () => {
    setEditingBlog(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setIsFormVisible(true);
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      await blogService.deleteBlog(itemToDelete);
      toast.success('Blog deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to delete blog';
      toast.error(errorMessage);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
  };

  const handleSave = async (blogData) => {
    try {
      const formData = {
        name: blogData.title || blogData.name,
        author: blogData.author,
        description: blogData.excerpt || blogData.description,
        content: blogData.fullContent || blogData.content,
        category: blogData.category || '',
        date: blogData.date || new Date().toISOString().split('T')[0],
        excerpt: blogData.excerpt || blogData.description || '',
        subHeadings: blogData.subHeadings || [],
        quotes: blogData.quotes || [],
        highlightPoints: blogData.highlightPoints || []
      };

      // Handle image
      // If it's a File object, it will be sent as multipart file
      // If it's a string (URL), it will be sent as form field
      if (blogData.featuredImage instanceof File) {
        formData.image = blogData.featuredImage;
      } else if (blogData.featuredImage && typeof blogData.featuredImage === 'string') {
        // For existing images (URL string), extract the path if it's a full URL
        // Backend expects path like "filename.jpg"
        if (blogData.featuredImage.startsWith('http') || blogData.featuredImage.startsWith('/')) {
          // Extract path from URL if needed
          const urlParts = blogData.featuredImage.split('');
          formData.image = urlParts.length > 1 ? `${urlParts[1]}` : blogData.featuredImage;
        } else {
          formData.image = blogData.featuredImage;
        }
      }

      // Validate required fields for new blogs
      if (!editingBlog) {
        if (!formData.image || !(formData.image instanceof File)) {
          toast.error('Please upload a featured image');
          return;
        }
      }

      if (editingBlog) {
        await blogService.updateBlog(editingBlog.id || editingBlog._id, formData);
        toast.success('Blog updated successfully');
      } else {
        await blogService.createBlog(formData);
        toast.success('Blog created successfully');
      }
      
      setIsFormVisible(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      // Extract API error message
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to save blog';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingBlog(null);
  };

  return (
    <Layout>
      <div className="p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Blog Management</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Manage and create blog posts</p>
            </div>
            
            {/* Add Button */}
            <button
              onClick={handleAddClick}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition text-sm sm:text-base flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Blog
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Total Blogs</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{totalBlogs}</h3>
              </div>
              <div className="text-blue-500">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow border dark:border-gray-700 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Categories</p>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">{categories}</h3>
              </div>
              <div className="text-green-500">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div>
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first blog post to get started</p>
              <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Blog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs.map((blog) => (
                <BlogCard 
                  key={blog.id} 
                  blog={blog}
                  onView={handleView}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Form Modal */}
        {isFormVisible && (
          <BlogForm 
            isEditing={!!editingBlog}
            currentBlog={editingBlog}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* View Modal */}
        <ViewModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
        />
      </div>
    </Layout>
  );
};

export default BlogManagement;