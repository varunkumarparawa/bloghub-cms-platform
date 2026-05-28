/**
 * Application-wide Constants and Enumerations
 * Used across controllers, services, and middleware
 */

// User Roles - Define what each user can do in the system
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  VIEWER: 'viewer',
};

// Account Status - Tracks whether a user account is active or not
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Blog Status - Determines visibility and publish state of blogs
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

// Error Messages - Standardized error messages for consistent API responses
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access. Please login.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'Email already registered.',
  INTERNAL_SERVER_ERROR: 'Internal server error. Please try again later.',
  INVALID_TOKEN: 'Invalid or expired token.',
  INVALID_INPUT: 'Invalid input provided.',
  BLOG_NOT_FOUND: 'Blog post not found.',
  USER_NOT_FOUND: 'User not found.',
};

// Success Messages - Standardized success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  BLOG_CREATED: 'Blog created successfully.',
  BLOG_UPDATED: 'Blog updated successfully.',
  BLOG_DELETED: 'Blog deleted successfully.',
  BLOG_PUBLISHED: 'Blog published successfully.',
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
};

// HTTP Status Codes - Standard codes used in responses
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Role Permissions - Define what each role can do
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: {
    canManageUsers: true,
    canManageBlogs: true,
    canManageSEO: true,
    canManageSettings: true,
    canDeleteBlogs: true,
    canDeleteUsers: true,
    canPublishBlogs: true,
    canEditAnyBlog: true,
  },
  [USER_ROLES.EDITOR]: {
    canManageUsers: false,
    canManageBlogs: true,
    canManageSEO: true,
    canManageSettings: false,
    canDeleteBlogs: true,
    canDeleteUsers: false,
    canPublishBlogs: true,
    canEditAnyBlog: true,
  },
  [USER_ROLES.AUTHOR]: {
    canManageUsers: false,
    canManageBlogs: true,
    canManageSEO: false,
    canManageSettings: false,
    canDeleteBlogs: true,
    canDeleteUsers: false,
    canPublishBlogs: false,
    canEditAnyBlog: false,
  },
  [USER_ROLES.VIEWER]: {
    canManageUsers: false,
    canManageBlogs: false,
    canManageSEO: false,
    canManageSettings: false,
    canDeleteBlogs: false,
    canDeleteUsers: false,
    canPublishBlogs: false,
    canEditAnyBlog: false,
  },
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Token Constants
export const TOKEN_TYPES = {
  ACCESS_TOKEN: 'access',
  REFRESH_TOKEN: 'refresh',
};
