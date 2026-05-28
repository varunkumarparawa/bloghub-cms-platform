/**
 * User Service
 * API calls for user and authentication operations
 */

import api from './api';

/**
 * User Service Object
 * Contains all user-related API operations
 */
const userService = {
  /**
   * Register new user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile/update', profileData);
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Get all users (Super Admin only)
   */
  getAllUsers: async (page = 1, limit = 10, role = null) => {
    let url = `/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get user by ID (Super Admin only)
   */
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update user role (Super Admin only)
   */
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Delete user (Super Admin only)
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;
