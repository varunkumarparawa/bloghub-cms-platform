/**
 * Blog Routes
 * Defines all blog-related API endpoints
 * Routes: /api/blogs
 */

import express from 'express';
import BlogController from '../controllers/BlogController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole, checkPermission } from '../middleware/authorize.js';
import { validateRequest, validationSchemas } from '../middleware/validation.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

/**
 * Public Routes (No authentication required)
 */

// GET /api/blogs/published
// Get all published blogs with pagination and filters
router.get('/published', BlogController.getPublishedBlogs);

// GET /api/blogs/slug/:slug
// Get blog post by URL slug with related posts
router.get('/slug/:slug', BlogController.getBlogBySlug);

// GET /api/blogs/category/:category
// Get all published blogs in specific category
router.get('/category/:category', BlogController.getBlogsByCategory);

// GET /api/blogs/tags/all
// Get all unique tags with blog count
router.get('/tags/all', BlogController.getAllTags);

// GET /api/blogs/search
// Search blogs by keyword across title, content, tags
router.get('/search', BlogController.searchBlogs);

/**
 * Protected Routes (Authentication required)
 */

// POST /api/blogs
// Create new blog post (Author, Editor, Super Admin)
router.post(
  '/',
  authenticateToken,
  authorizeRole([USER_ROLES.AUTHOR, USER_ROLES.EDITOR, USER_ROLES.SUPER_ADMIN]),
  validateRequest(validationSchemas.createBlog),
  BlogController.createBlog
);

// GET /api/blogs/author/my-blogs
// Get current user's blogs (for dashboard)
router.get(
  '/author/my-blogs',
  authenticateToken,
  authorizeRole([USER_ROLES.AUTHOR, USER_ROLES.EDITOR, USER_ROLES.SUPER_ADMIN]),
  BlogController.getMyBlogs
);

// GET /api/blogs/:blogId
// Get blog by MongoDB ID (for admin dashboard)
router.get(
  '/:blogId',
  authenticateToken,
  authorizeRole([USER_ROLES.EDITOR, USER_ROLES.SUPER_ADMIN]),
  BlogController.getBlogById
);

// PUT /api/blogs/:blogId
// Update blog post (Author can update own, Editor/SuperAdmin can update any)
router.put(
  '/:blogId',
  authenticateToken,
  authorizeRole([USER_ROLES.AUTHOR, USER_ROLES.EDITOR, USER_ROLES.SUPER_ADMIN]),
  validateRequest(validationSchemas.createBlog),
  BlogController.updateBlog
);

// POST /api/blogs/:blogId/publish
// Publish blog (move from draft to published)
router.post(
  '/:blogId/publish',
  authenticateToken,
  authorizeRole([USER_ROLES.EDITOR, USER_ROLES.SUPER_ADMIN]),
  BlogController.publishBlog
);

// POST /api/blogs/:blogId/archive
// Archive blog post (hide from public)
router.post(
  '/:blogId/archive',
  authenticateToken,
  authorizeRole([USER_ROLES.EDITOR, USER_ROLES.SUPER_ADMIN]),
  BlogController.archiveBlog
);

// DELETE /api/blogs/:blogId
// Delete blog permanently (Editor, Super Admin only)
router.delete(
  '/:blogId',
  authenticateToken,
  authorizeRole([USER_ROLES.EDITOR, USER_ROLES.SUPER_ADMIN]),
  BlogController.deleteBlog
);

export default router;
