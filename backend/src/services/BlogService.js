/**
 * Blog Service
 * Contains business logic for blog management
 * Handles blog CRUD operations, SEO, publishing, and content management
 */

import Blog from '../models/Blog.js';
import { BLOG_STATUS } from '../constants/enums.js';
import { generateSlug, generateUniqueSlug } from '../utils/slugGenerator.js';
import {
  generateTableOfContents,
  formatTableOfContents,
} from '../utils/tableOfContentsGenerator.js';

/**
 * Blog Service Class
 * Encapsulates all blog-related business logic
 */
class BlogService {
  /**
   * Create a new blog post
   * Generates slug, TOC, and initializes SEO fields
   * 
   * @param {Object} blogData - Blog creation data
   * @param {string} blogData.title - Blog title
   * @param {string} blogData.excerpt - Blog excerpt
   * @param {string} blogData.content - Blog content (HTML/Markdown)
   * @param {string} authorId - Author's user ID
   * @returns {Promise<Object>} - Created blog object
   */
  async createBlog(blogData, authorId) {
    // Generate slug from title
    let slug = generateSlug(blogData.title);

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      // Generate unique slug if duplicate exists
      slug = generateUniqueSlug(blogData.title);
    }

    // Generate table of contents from content
    const headings = generateTableOfContents(blogData.content);
    const tableOfContents = formatTableOfContents(headings);

    // Create blog object
    const blog = new Blog({
      title: blogData.title,
      slug,
      excerpt: blogData.excerpt,
      content: blogData.content,
      featureImage: blogData.featureImage || null,
      tags: blogData.tags || [],
      categories: blogData.categories || [],
      seo: blogData.seo || {},
      faqSection: blogData.faqSection || [],
      internalLinks: blogData.internalLinks || [],
      externalLinks: blogData.externalLinks || [],
      author: authorId,
      tableOfContents,
      status: BLOG_STATUS.DRAFT, // New blogs are draft by default
    });

    // Save blog to database
    await blog.save();

    // Populate author details before returning
    await blog.populate('author', 'fullName email profilePicture');

    return blog.toObject();
  }

  /**
   * Get blog by slug
   * Increments view count and fetches related blogs
   * 
   * @param {string} slug - Blog URL slug
   * @returns {Promise<Object>} - Blog object with related blogs
   */
  async getBlogBySlug(slug) {
    // Increment view count
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'fullName email profilePicture bio');

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Fetch related blogs (same tags)
    const relatedBlogs = await Blog.find({
      tags: { $in: blog.tags },
      _id: { $ne: blog._id },
      status: BLOG_STATUS.PUBLISHED,
    })
      .limit(3)
      .select('title slug excerpt featureImage');

    return {
      blog: blog.toObject(),
      relatedBlogs,
    };
  }

  /**
   * Get all published blogs with pagination
   * Used for frontend blog listing
   * 
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {string} category - Filter by category (optional)
   * @param {string} tag - Filter by tag (optional)
   * @returns {Promise<Object>} - Paginated blog list
   */
  async getPublishedBlogs(page = 1, limit = 10, category = null, tag = null) {
    const skip = (page - 1) * limit;

    // Build filter for published blogs
    const filter = { status: BLOG_STATUS.PUBLISHED };

    if (category) {
      filter.categories = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    // Fetch blogs
    const blogs = await Blog.find(filter)
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt featureImage tags categories author publishedAt viewCount')
      .populate('author', 'fullName email profilePicture')
      .sort({ publishedAt: -1 });

    const total = await Blog.countDocuments(filter);

    return {
      blogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all blogs by author (admin dashboard)
   * Shows all blogs regardless of status
   * 
   * @param {string} authorId - Author's user ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - Paginated author's blogs
   */
  async getBlogsByAuthor(authorId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ author: authorId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments({ author: authorId });

    return {
      blogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update blog post
   * Regenerates slug and TOC if content changed
   * 
   * @param {string} blogId - Blog MongoDB ID
   * @param {Object} updateData - Data to update
   * @param {string} authorId - Author's user ID (for authorization)
   * @returns {Promise<Object>} - Updated blog object
   */
  async updateBlog(blogId, updateData, authorId) {
    // Check blog ownership or admin status
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }

    // Allow update only if user is author or admin
    const isAuthor = blog.author.toString() === authorId.toString();
    if (!isAuthor) {
      throw new Error('Unauthorized to update this blog');
    }

    // If title changed, regenerate slug
    if (updateData.title && updateData.title !== blog.title) {
      let newSlug = generateSlug(updateData.title);

      // Check for slug uniqueness
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: blogId } });
      if (existingBlog) {
        newSlug = generateUniqueSlug(updateData.title);
      }

      updateData.slug = newSlug;
    }

    // If content changed, regenerate TOC
    if (updateData.content && updateData.content !== blog.content) {
      const headings = generateTableOfContents(updateData.content);
      updateData.tableOfContents = formatTableOfContents(headings);
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    }).populate('author', 'fullName email profilePicture');

    return updatedBlog.toObject();
  }

  /**
   * Publish blog post
   * Moves blog from draft to published status
   * 
   * @param {string} blogId - Blog MongoDB ID
   * @returns {Promise<Object>} - Published blog object
   */
  async publishBlog(blogId) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        status: BLOG_STATUS.PUBLISHED,
        publishedAt: new Date(),
      },
      { new: true }
    ).populate('author', 'fullName email profilePicture');

    if (!blog) {
      throw new Error('Blog not found');
    }

    return blog.toObject();
  }

  /**
   * Archive blog post
   * Moves blog to archived status (hidden from public)
   * 
   * @param {string} blogId - Blog MongoDB ID
   * @returns {Promise<Object>} - Archived blog object
   */
  async archiveBlog(blogId) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status: BLOG_STATUS.ARCHIVED },
      { new: true }
    );

    if (!blog) {
      throw new Error('Blog not found');
    }

    return blog.toObject();
  }

  /**
   * Delete blog post (Super Admin or Editor)
   * 
   * @param {string} blogId - Blog MongoDB ID
   * @returns {Promise<void>}
   */
  async deleteBlog(blogId) {
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      throw new Error('Blog not found');
    }
  }

  /**
   * Get blog by ID (for admin dashboard)
   * 
   * @param {string} blogId - Blog MongoDB ID
   * @returns {Promise<Object>} - Blog object
   */
  async getBlogById(blogId) {
    const blog = await Blog.findById(blogId).populate(
      'author',
      'fullName email profilePicture'
    );

    if (!blog) {
      throw new Error('Blog not found');
    }

    return blog.toObject();
  }

  /**
   * Get blogs by category
   * Used for category pages on frontend
   * 
   * @param {string} category - Category name
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - Paginated blogs in category
   */
  async getBlogsByCategory(category, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({
      categories: category,
      status: BLOG_STATUS.PUBLISHED,
    })
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt featureImage tags author publishedAt')
      .populate('author', 'fullName email profilePicture')
      .sort({ publishedAt: -1 });

    const total = await Blog.countDocuments({
      categories: category,
      status: BLOG_STATUS.PUBLISHED,
    });

    return {
      blogs,
      total,
      page,
      limit,
      category,
    };
  }

  /**
   * Get all unique tags with count
   * Used for tag cloud on frontend
   * 
   * @returns {Promise<Array>} - Array of tags with blog count
   */
  async getAllTags() {
    const tags = await Blog.aggregate([
      { $match: { status: BLOG_STATUS.PUBLISHED } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return tags.map(tag => ({
      name: tag._id,
      count: tag.count,
    }));
  }

  /**
   * Search blogs by keyword
   * Searches in title, excerpt, and content
   * 
   * @param {string} keyword - Search keyword
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} - Search results
   */
  async searchBlogs(keyword, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(keyword, 'i');

    const blogs = await Blog.find({
      status: BLOG_STATUS.PUBLISHED,
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ],
    })
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt featureImage author publishedAt')
      .populate('author', 'fullName email profilePicture')
      .sort({ publishedAt: -1 });

    const total = await Blog.countDocuments({
      status: BLOG_STATUS.PUBLISHED,
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ],
    });

    return {
      blogs,
      total,
      page,
      limit,
      keyword,
    };
  }
}

// Export single instance of BlogService
export default new BlogService();
