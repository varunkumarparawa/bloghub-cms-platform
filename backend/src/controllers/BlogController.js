/**
 * Blog Controller
 * Handles HTTP requests for blog-related endpoints
 * Calls BlogService for business logic
 */

import { asyncHandler } from '../utils/asyncHandler.js';
import { formatSuccessResponse, formatErrorResponse, formatPaginatedResponse } from '../utils/responseFormatter.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/enums.js';
import BlogService from '../services/BlogService.js';

/**
 * Blog Controller Class
 * Handles all blog-related HTTP requests
 */
class BlogController {
  /**
   * POST /api/blogs
   * Create a new blog post
   */
  createBlog = asyncHandler(async (req, res) => {
    const authorId = req.user.userId;
    const blogData = req.validatedBody;

    try {
      // Call BlogService to create blog
      const blog = await BlogService.createBlog(blogData, authorId);

      return res.status(HTTP_STATUS.CREATED).json(
        formatSuccessResponse(
          blog,
          SUCCESS_MESSAGES.BLOG_CREATED,
          HTTP_STATUS.CREATED
        )
      );
    } catch (error) {
      throw error;
    }
  });

  /**
   * GET /api/blogs/published
   * Get all published blogs with pagination
   * Public endpoint (no auth required)
   */
  getPublishedBlogs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    const tag = req.query.tag || null;

    try {
      const result = await BlogService.getPublishedBlogs(page, limit, category, tag);

      return res.status(HTTP_STATUS.OK).json(
        formatPaginatedResponse(
          result.blogs,
          result.total,
          page,
          limit,
          'Published blogs fetched successfully'
        )
      );
    } catch (error) {
      throw error;
    }
  });

  /**
   * GET /api/blogs/slug/:slug
   * Get blog by slug with related blogs
   * Public endpoint (no auth required)
   */
  getBlogBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    try {
      const result = await BlogService.getBlogBySlug(slug);

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          result,
          'Blog fetched successfully'
        )
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * GET /api/blogs/:blogId
   * Get blog by ID (for admin dashboard)
   */
  getBlogById = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    try {
      const blog = await BlogService.getBlogById(blogId);

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(blog, 'Blog fetched successfully')
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * GET /api/blogs/author/my-blogs
   * Get current user's blogs (Author, Editor dashboard)
   */
  getMyBlogs = asyncHandler(async (req, res) => {
    const authorId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const result = await BlogService.getBlogsByAuthor(authorId, page, limit);

      return res.status(HTTP_STATUS.OK).json(
        formatPaginatedResponse(
          result.blogs,
          result.total,
          page,
          limit,
          'Your blogs fetched successfully'
        )
      );
    } catch (error) {
      throw error;
    }
  });

  /**
   * PUT /api/blogs/:blogId
   * Update blog post
   */
  updateBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const authorId = req.user.userId;
    const updateData = req.validatedBody;

    try {
      const updatedBlog = await BlogService.updateBlog(blogId, updateData, authorId);

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          updatedBlog,
          SUCCESS_MESSAGES.BLOG_UPDATED
        )
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      if (error.message.includes('Unauthorized')) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          formatErrorResponse(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
        );
      }

      throw error;
    }
  });

  /**
   * POST /api/blogs/:blogId/publish
   * Publish blog post (move from draft to published)
   */
  publishBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    try {
      const publishedBlog = await BlogService.publishBlog(blogId);

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          publishedBlog,
          SUCCESS_MESSAGES.BLOG_PUBLISHED
        )
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * POST /api/blogs/:blogId/archive
   * Archive blog post (hide from public)
   */
  archiveBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    try {
      const archivedBlog = await BlogService.archiveBlog(blogId);

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          archivedBlog,
          'Blog archived successfully'
        )
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * DELETE /api/blogs/:blogId
   * Delete blog post permanently
   */
  deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    try {
      await BlogService.deleteBlog(blogId);

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(null, SUCCESS_MESSAGES.BLOG_DELETED)
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.BLOG_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * GET /api/blogs/category/:category
   * Get blogs by category (public)
   */
  getBlogsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      const result = await BlogService.getBlogsByCategory(category, page, limit);

      return res.status(HTTP_STATUS.OK).json(
        formatPaginatedResponse(
          result.blogs,
          result.total,
          page,
          limit,
          `Blogs in ${category} fetched successfully`
        )
      );
    } catch (error) {
      throw error;
    }
  });

  /**
   * GET /api/blogs/tags/all
   * Get all unique tags with blog count (public)
   */
  getAllTags = asyncHandler(async (req, res) => {
    try {
      const tags = await BlogService.getAllTags();

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(tags, 'Tags fetched successfully')
      );
    } catch (error) {
      throw error;
    }
  });

  /**
   * GET /api/blogs/search
   * Search blogs by keyword (public)
   */
  searchBlogs = asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate keyword
    if (!keyword || keyword.trim().length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatErrorResponse('Search keyword is required', HTTP_STATUS.BAD_REQUEST)
      );
    }

    try {
      const result = await BlogService.searchBlogs(keyword, page, limit);

      return res.status(HTTP_STATUS.OK).json(
        formatPaginatedResponse(
          result.blogs,
          result.total,
          page,
          limit,
          `Search results for "${keyword}"`
        )
      );
    } catch (error) {
      throw error;
    }
  });
}

// Export controller instance
export default new BlogController();
