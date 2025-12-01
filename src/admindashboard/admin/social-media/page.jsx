"use client"

import React, { useState, useEffect } from "react"
import { Save, X, Trash2, Upload, User, PlusCircle, Loader2 } from "lucide-react"
import Layout from "../../Layout"
import { teamService } from "../../../services/teamService"
import { BACKEND_URL } from "../../../config/api"
import { toast } from "react-hot-toast"

export default function TeamManagement() {
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // New team member form state
  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    imagePreview: null,
    imageFile: null
  });

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamService.getAllTeamMembers();
      if (response) {
        setTeamMembers(response.data);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError(err.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = async () => {
    if (!newMember.name || !newMember.designation) {
      alert("Please fill in all required fields");
      return;
    }

    if (!newMember.imageFile) {
      alert("Please upload a profile picture");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const memberData = {
        name: newMember.name,
        designation: newMember.designation,
        image: newMember.imageFile
      };

      const response = await teamService.createTeamMember(memberData);
      
      if (response.success) {
        // Add new member to the list
        setTeamMembers([response.data, ...teamMembers]);
        // Reset form
        setNewMember({ name: "", designation: "", imagePreview: null, imageFile: null });
        setShowTeamForm(false);
        alert("Team member added successfully!");
      }
    } catch (err) {
      console.error("Error adding team member:", err);
      setError(err.message || "Failed to add team member");
      alert(err.message || "Failed to add team member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveTeamMember = async (id) => {
    if (!confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      setError(null);
      const response = await teamService.deleteTeamMember(id);
      
      if (response.success) {
        setTeamMembers(teamMembers.filter(member => member._id !== id));
        alert("Team member removed successfully!");
      }
    } catch (err) {
      console.error("Error removing team member:", err);
      setError(err.message || "Failed to remove team member");
      alert(err.message || "Failed to remove team member");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewMember(prev => ({ 
          ...prev, 
          imagePreview: e.target.result,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800">
        <div className="space-y-4 md:space-y-6 p-3 md:p-6 lg:p-8">
          {/* ---- Team Management Section ---- */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 shadow-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">
                  Team Members
                </h2>
                <button
                  onClick={() => setShowTeamForm(true)}
                  className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto text-sm md:text-base"
                >
                  <PlusCircle size={16} className="flex-shrink-0" />
                  <span>Add Member</span>
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</p>
                  <button
                    onClick={fetchTeamMembers}
                    className="text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => {
                    const imageUrl = member.image ? `${BACKEND_URL}${member.image}` : "/placeholder-user.jpg"
                    console.log(`Admin - Member ${member.name} - Image:`, imageUrl)
                    
                    return (
                      <div key={member._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={imageUrl}
                            alt={member.name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0 bg-gray-200"
                            onError={(e) => { 
                              console.log(`Admin - Image load failed for ${member.name}`)
                              e.target.src = "/placeholder-user.jpg" 
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm md:text-base truncate">
                              {member.name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                              {member.designation}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTeamMember(member._id)}
                          className="p-1 md:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 ml-2"
                        >
                          <Trash2 size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    )
                  })}
                  
                  {teamMembers.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <User size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No team members added yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---- Team Member Form Popup ---- */}
        {showTeamForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3 md:p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Add Team Member
              </h3>
              
              <div className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                      {newMember.imagePreview ? (
                        <img src={newMember.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm md:text-base">
                      <Upload size={16} className="flex-shrink-0" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                {/* Designation Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMember.designation}
                    onChange={(e) => setNewMember(prev => ({ ...prev, designation: e.target.value }))}
                    placeholder="Enter designation"
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-6">
                <button
                  onClick={handleAddTeamMember}
                  disabled={!newMember.name || !newMember.designation || !newMember.imageFile || submitting}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-1 text-sm md:text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="flex-shrink-0 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} className="flex-shrink-0" />
                      <span>Add Member</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowTeamForm(false);
                    setNewMember({ name: "", designation: "", imagePreview: null, imageFile: null });
                  }}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-1 text-sm md:text-base"
                >
                  <X size={16} className="flex-shrink-0" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}