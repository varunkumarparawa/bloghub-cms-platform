/**
 * Authorization Middleware
 * Checks if user has required role to access protected routes
 */

import { HTTP_STATUS, ERROR_MESSAGES, ROLE_PERMISSIONS } from '../constants/enums.js';
import { formatErrorResponse } from '../utils/responseFormatter.js';

/**
 * Middleware factory to check if user has required role
 * 
 * @param {string|Array} allowedRoles - Single role or array of allowed roles
 * @returns {Function} - Middleware function
 */
export const authorizeRole = (allowedRoles) => {
  // Convert single role to array for consistent processing
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // Check if user exists (should be set by authenticateToken middleware)
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        formatErrorResponse(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
      );
    }

    next();
  };
};

/**
 * Middleware to check specific permissions
 * 
 * @param {string} permission - Permission to check (e.g., 'canManageUsers')
 * @returns {Function} - Middleware function
 */
export const checkPermission = (permission) => {
  return (req, res, next) => {
    // Verify user exists
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // Get permissions for user's role
    const userPermissions = ROLE_PERMISSIONS[req.user.role];

    // Check if user has the required permission
    if (!userPermissions || !userPermissions[permission]) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        formatErrorResponse(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
      );
    }

    next();
  };
};

export default {
  authorizeRole,
  checkPermission,
};
