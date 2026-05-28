/**
 * Constants
 * App-wide constants
 */

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  author: 'Author',
  viewer: 'Viewer',
};

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

export const STATUS_COLORS = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [10, 20, 50],
};

export default {
  USER_ROLES,
  ROLE_LABELS,
  BLOG_STATUS,
  STATUS_LABELS,
  STATUS_COLORS,
  PAGINATION,
};
