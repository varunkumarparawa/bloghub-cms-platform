/**
 * Slug Generator Utility
 * Converts blog titles into SEO-friendly URLs
 */

import slugify from 'slugify';

/**
 * Generate SEO-friendly slug from title
 * Example: "Complete Guide to Full Stack Development" -> "complete-guide-to-full-stack-development"
 * 
 * @param {string} title - The blog title
 * @returns {string} - SEO-friendly slug
 */
export const generateSlug = (title) => {
  if (!title || typeof title !== 'string') {
    throw new Error('Title must be a non-empty string');
  }

  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * Generate unique slug with timestamp
 * Used when original slug already exists in database
 * 
 * @param {string} title - The blog title
 * @returns {string} - Unique slug with timestamp
 */
export const generateUniqueSlug = (title) => {
  const baseSlug = generateSlug(title);
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `${baseSlug}-${timestamp}`;
};

export default generateSlug;
