import api from '../config/api';

export const teamService = {
  // Get all team members
  getAllTeamMembers: async () => {
    console.log("getAllTeamMembers");
    return await api.get('/team');
  },

  // Get team member by ID
  getTeamMemberById: async (id) => {
    return await api.get(`/team/${id}`);
  },

  // Create new team member (requires auth)
  createTeamMember: async (memberData) => {
    const formData = new FormData();
    
    // Append text fields
    formData.append('name', memberData.name);
    formData.append('designation', memberData.designation);
    
    // Append image file if exists
    if (memberData.image instanceof File) {
      formData.append('image', memberData.image);
    }

    return await api.post('/team', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update team member (requires auth)
  updateTeamMember: async (id, memberData) => {
    const formData = new FormData();
    
    // Append text fields if they exist
    if (memberData.name) formData.append('name', memberData.name);
    if (memberData.designation) formData.append('designation', memberData.designation);
    
    // Append image file if exists
    if (memberData.image instanceof File) {
      formData.append('image', memberData.image);
    }

    return await api.put(`/team/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete team member (requires auth)
  deleteTeamMember: async (id) => {
    return await api.delete(`/team/${id}`);
  },
};

