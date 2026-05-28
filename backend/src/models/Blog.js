/**
 * Blog Model
 * Stores blog post content and metadata including SEO information
 */

import mongoose from 'mongoose';
import { BLOG_STATUS } from '../constants/enums.js';

/**
 * SEO Object Schema
 * Contains SEO-specific metadata for blog posts
 */
const seoSchema = new mongoose.Schema({
  // Page title (max 60 characters for best display in search results)
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title must not exceed 60 characters'],
    trim: true,
  },

  // Meta description (120-160 characters optimal for search results)
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description must not exceed 160 characters'],
    trim: true,
  },

  // Canonical URL - indicates the preferred version of the page
  canonicalUrl: {
    type: String,
    trim: true,
  },

  // Open Graph metadata for social media sharing
  openGraph: {
    title: String,
    description: String,
    image: String,
    type: { type: String, default: 'article' },
  },

  // Twitter Card metadata for Twitter sharing
  twitterCard: {
    cardType: { type: String, default: 'summary_large_image' },
    title: String,
    description: String,
    image: String,
  },

  // JSON-LD structured data for search engine understanding
  structuredData: mongoose.Schema.Types.Mixed,
});

/**
 * FAQ Object Schema
 * Stores Frequently Asked Questions in QA format
 */
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
});

/**
 * Blog Schema - Main document structure for blog posts
 */
const blogSchema = new mongoose.Schema(
  {
    // Blog post title (H1 heading)
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },

    // SEO-friendly URL slug (automatically generated from title)
    // Example: "complete-guide-to-full-stack-development-2026"
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // Add index for faster queries
    },

    // Brief summary of blog content (50-160 characters)
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      maxlength: [160, 'Excerpt must not exceed 160 characters'],
      trim: true,
    },

    // Main blog content (can be HTML or Markdown)
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },

    // Feature image URL (blog thumbnail/cover image)
    featureImage: {
      type: String,
      default: null,
    },

    // SEO metadata object
    seo: seoSchema,

    // Tags for categorizing and searching blogs
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Categories the blog belongs to
    categories: [
      {
        type: String,
        trim: true,
      },
    ],

    // FAQ section for this blog (array of Q&A pairs)
    faqSection: [faqSchema],

    // Internal links to related blogs (SEO best practice)
    internalLinks: [
      {
        title: String,
        slug: String,
      },
    ],

    // External links referenced in the blog
    externalLinks: [
      {
        title: String,
        url: String,
      },
    ],

    // Author reference - links to User model
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    // Blog status (draft, published, archived)
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
      default: BLOG_STATUS.DRAFT,
    },

    // When the blog was published (null if still draft)
    publishedAt: {
      type: Date,
      default: null,
    },

    // Auto-generated table of contents from headings
    tableOfContents: [
      {
        level: Number,
        text: String,
        id: String,
        slug: String,
        children: [
          {
            text: String,
            id: String,
            slug: String,
          },
        ],
      },
    ],

    // View count for analytics
    viewCount: {
      type: Number,
      default: 0,
    },

    // When the blog was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // When the blog was last modified
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ slug: 1 });

// Populate author details when querying blogs
blogSchema.pre(/^find/, function () {
  this.populate({
    path: 'author',
    select: 'fullName email profilePicture bio',
  });
});

// Create and export Blog model
const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
