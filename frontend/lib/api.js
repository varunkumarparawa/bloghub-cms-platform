/**
 * API Client (Frontend)
 * Axios instance for making requests to backend API
 */

import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Blog API Operations
 */
export const blogAPI = {
  // Get all published blogs
  getPublishedBlogs: async (page = 1, limit = 10, category = null, tag = null) => {
    let url = `/blogs/published?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (tag) url += `&tag=${tag}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get blog by slug
  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  // Get blogs by category
  getBlogsByCategory: async (category, page = 1, limit = 10) => {
    const response = await api.get(
      `/blogs/category/${category}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get all tags
  getTags: async () => {
    const response = await api.get('/blogs/tags/all');
    return response.data;
  },

  // Search blogs
  searchBlogs: async (keyword, page = 1, limit = 10) => {
    const response = await api.get(
      `/blogs/search?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default api;
