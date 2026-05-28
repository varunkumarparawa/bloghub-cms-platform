/**
 * Error Handling Middleware
 * Centralized error handler for all application errors
 */

import { formatErrorResponse } from '../utils/responseFormatter.js';
import { HTTP_STATUS } from '../constants/enums.js';

/**
 * Global error handling middleware
 * Should be used as the last middleware in Express app
 * 
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (error, req, res, next) => {
  console.error('❌ Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Default error status and message
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error. Please try again later.';
  let errors = null;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation error';
    errors = Object.values(error.errors).map(err => err.message);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(error.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token has expired';
  }

  // Custom error with statusCode
  if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Send error response
  res.status(statusCode).json(
    formatErrorResponse(message, statusCode, errors)
  );
};

/**
 * 404 Not Found middleware
 * Should be used before error handler
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json(
    formatErrorResponse(
      `Route ${req.originalUrl} not found`,
      HTTP_STATUS.NOT_FOUND
    )
  );
};

export default {
  errorHandler,
  notFoundHandler,
};
