/**
 * Authentication Store (Zustand)
 * Global state management for authentication
 */

import { create } from 'zustand';

/**
 * Auth Store
 * Manages user authentication state across the app
 */
export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  /**
   * Set authentication after login
   * Stores token in localStorage and updates state
   */
  setAuth: (user, token) => {
    localStorage.setItem('authToken', token);
    set({
      user,
      token,
      isAuthenticated: true,
      error: null,
    });
  },

  /**
   * Logout user
   * Clears token and user state
   */
  logout: () => {
    localStorage.removeItem('authToken');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Set error message
   */
  setError: (error) => set({ error }),

  /**
   * Check if user has a specific role
   */
  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (roles) => {
    const { user } = get();
    return user && roles.includes(user.role);
  },

  /**
   * Check if user is admin (Super Admin or Editor)
   */
  isAdmin: () => {
    const { user } = get();
    return user && ['super_admin', 'editor'].includes(user.role);
  },

  /**
   * Update user profile in store
   */
  updateUser: (updatedUserData) => {
    set(state => ({
      user: { ...state.user, ...updatedUserData }
    }));
  },

  /**
   * Get current token
   */
  getToken: () => get().token,

  /**
   * Get current user
   */
  getUser: () => get().user,
}));

export default useAuthStore;
