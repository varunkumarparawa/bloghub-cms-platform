/**
 * Response Formatter Utility
 * Creates standardized API responses for consistency
 */

/**
 * Format successful API response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Formatted response
 */
export const formatSuccessResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format error API response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Detailed error information
 * @returns {Object} - Formatted error response
 */
export const formatErrorResponse = (message, statusCode = 500, errors = null) => {
  return {
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format paginated response
 * @param {Array} data - Array of items
 * @param {number} total - Total items count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Success message
 * @returns {Object} - Formatted paginated response
 */
export const formatPaginatedResponse = (
  data,
  total,
  page,
  limit,
  message = 'Success'
) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
};

export default {
  formatSuccessResponse,
  formatErrorResponse,
  formatPaginatedResponse,
};
