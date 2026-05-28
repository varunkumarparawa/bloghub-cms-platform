/**
 * Authentication Middleware
 * Verifies JWT token and extracts user information
 */

import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatErrorResponse } from '../utils/responseFormatter.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/enums.js';

/**
 * Middleware to verify JWT token and authenticate user
 * Token should be in Authorization header: "Bearer <token>"
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticateToken = asyncHandler(async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7) // Remove 'Bearer ' prefix
      : null;

    // Check if token exists
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request for use in controllers
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Token verification failed
    if (error.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatErrorResponse('Token expired. Please login again.', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatErrorResponse(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED)
    );
  }
});

export default authenticateToken;
