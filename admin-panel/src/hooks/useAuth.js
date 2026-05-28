/**
 * Authentication Hook
 * Custom hook for authentication operations
 */

import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import userService from '../services/userService';
import toast from 'react-hot-toast';

/**
 * useAuth Hook
 * Provides authentication functions and state
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    setAuth,
    logout,
    user,
    token,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    updateUser,
  } = useAuthStore();

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await userService.login(email, password);
      setAuth(response.data.user, response.data.token);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (fullName, email, password) => {
    try {
      setIsLoading(true);
      const response = await userService.register({
        fullName,
        email,
        password,
      });
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  /**
   * Update profile
   */
  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      const response = await userService.updateProfile(profileData);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Change password
   */
  const changePassword = async (oldPassword, newPassword) => {
    try {
      setIsLoading(true);
      await userService.changePassword(oldPassword, newPassword);
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,

    // Methods
    login,
    register,
    logout: handleLogout,
    updateProfile,
    changePassword,

    // Checks
    hasRole,
    hasAnyRole,
    isAdmin,
  };
};

export default useAuth;
