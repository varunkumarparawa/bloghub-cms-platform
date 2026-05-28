/**
 * Blog Service
 * API calls for blog management operations
 */

import api from './api';

/**
 * Blog Service Object
 * Contains all blog-related API operations
 */
const blogService = {
  /**
   * Create new blog post
   */
  createBlog: async (blogData) => {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  /**
   * Get user's blogs (dashboard)
   */
  getMyBlogs: async (page = 1, limit = 10) => {
    const response = await api.get(`/blogs/author/my-blogs?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Get blog by ID (for editing)
   */
  getBlogById: async (blogId) => {
    const response = await api.get(`/blogs/${blogId}`);
    return response.data;
  },

  /**
   * Get blog by slug (published version)
   */
  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  /**
   * Update blog post
   */
  updateBlog: async (blogId, blogData) => {
    const response = await api.put(`/blogs/${blogId}`, blogData);
    return response.data;
  },

  /**
   * Publish blog (move from draft to published)
   */
  publishBlog: async (blogId) => {
    const response = await api.post(`/blogs/${blogId}/publish`);
    return response.data;
  },

  /**
   * Archive blog (hide from public)
   */
  archiveBlog: async (blogId) => {
    const response = await api.post(`/blogs/${blogId}/archive`);
    return response.data;
  },

  /**
   * Delete blog permanently
   */
  deleteBlog: async (blogId) => {
    const response = await api.delete(`/blogs/${blogId}`);
    return response.data;
  },

  /**
   * Get published blogs (public listing)
   */
  getPublishedBlogs: async (page = 1, limit = 10, category = null, tag = null) => {
    let url = `/blogs/published?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (tag) url += `&tag=${tag}`;
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Get all tags
   */
  getTags: async () => {
    const response = await api.get('/blogs/tags/all');
    return response.data;
  },

  /**
   * Search blogs
   */
  searchBlogs: async (keyword, page = 1, limit = 10) => {
    const response = await api.get(
      `/blogs/search?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get blogs by category
   */
  getBlogsByCategory: async (category, page = 1, limit = 10) => {
    const response = await api.get(
      `/blogs/category/${category}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Upload an image file
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default blogService;
