// ProfileManagement.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { authService } from '../../../services/authService';
import { BACKEND_URL } from '../../../config/api';
import { toast } from 'react-hot-toast';

// --- Theme Management Hook ---
const useDarkMode = () => {
    // Check localStorage or default to system preference/light
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
    
    // Effect to update localStorage and body class
    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove old theme class
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        
        // Add current theme class and save to localStorage
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
        
    }, [theme]);

    // Function to toggle between light and dark
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    return [theme, toggleTheme];
};


// No dummy data - will fetch from API

// --- 1. Update Profile Form Component (Styles Updated) ---
const UpdateProfileForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: formData.name
      };
      
      if (file) {
        updateData.profilePicture = file;
      }
      
      await authService.updateProfile(updateData);
      onSave(formData);
      toast.success('Profile updated successfully');
      // Refresh profile to get updated image URL
      if (file) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

  return (
    // DARK MODE STYLES APPLIED HERE
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">Update Profile Details 👤</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <img
            src={file ? URL.createObjectURL(file) : formData.profilePictureUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture (1 only)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            // DARK MODE INPUT STYLES
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-gray-400"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email is often disabled for security reasons.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

// --- 2. Change Password Component (Styles Updated) ---
const ChangePassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirmation do not match!');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    }
  };

  return (
    // DARK MODE STYLES APPLIED HERE
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">Change Password 🔒</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};


// --- Main Profile Management Content Component ---
const ProfileManagementContent = () => {
  const [profile, setProfile] = useState({ name: '', email: '', profilePictureUrl: '' });
  const [loading, setLoading] = useState(true);
  const [theme, toggleTheme] = useDarkMode();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      const profileData = response?.data || {};
      const profilePicturePath = profileData.profilePicture || '';
      const profilePictureUrl = profilePicturePath 
        ? (profilePicturePath.startsWith('http') 
          ? profilePicturePath 
          : `${BACKEND_URL}${profilePicturePath}`)
        : '';
      
      setProfile({
        name: profileData.name || '',
        email: profileData.email || '',
        profilePictureUrl: profilePictureUrl
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      const errorMessage = error?.message || error?.error || error?.response?.data?.message || 'Failed to load profile';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = (updatedData) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/admin/login';
  };

  return (
    // Apply background theme classes based on the theme state
    <div className="p-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
      
      {/* Header and Theme Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Profile Management ⚙️</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
            {/* Left Card: Update Profile */}
            <UpdateProfileForm profile={profile} onSave={handleProfileSave} />

            {/* Right Card: Change Password */}
            <ChangePassword />
          </div>
          
          {/* Logout Action */}
          <div className="flex justify-start">
            <button
              onClick={handleLogout}
              className="px-4 md:px-6 py-2 bg-gray-700 text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition text-sm md:text-base"
            >
              ➡️ Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// --- Wrapper Component to apply Layout ---
const ProfileManagement = () => (
    <Layout>
        <ProfileManagementContent />
    </Layout>
);

export default ProfileManagement;