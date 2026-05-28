/**
 * User Controller
 * Handles HTTP requests for user-related endpoints
 * Calls UserService for business logic
 */

import { asyncHandler } from '../utils/asyncHandler.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/responseFormatter.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/enums.js';
import UserService from '../services/UserService.js';

/**
 * User Controller Class
 * Handles all user-related HTTP requests
 */
class UserController {
  /**
   * POST /api/auth/register
   * Register a new user account
   */
  registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.validatedBody;

    try {
      // Call UserService to register user
      const user = await UserService.registerUser({
        fullName,
        email,
        password,
      });

      // Return success response
      return res.status(HTTP_STATUS.CREATED).json(
        formatSuccessResponse(
          user,
          SUCCESS_MESSAGES.USER_CREATED,
          HTTP_STATUS.CREATED
        )
      );
    } catch (error) {
      // Handle duplicate email
      if (error.message.includes('already registered')) {
        return res.status(HTTP_STATUS.CONFLICT).json(
          formatErrorResponse(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT)
        );
      }

      throw error;
    }
  });

  /**
   * POST /api/auth/login
   * Authenticate user and return JWT token
   */
  loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.validatedBody;

    try {
      // Call UserService to authenticate user
      const { user, token } = await UserService.loginUser(email, password);

      // Return success response with token
      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          {
            user,
            token,
            expiresIn: '7d',
          },
          SUCCESS_MESSAGES.LOGIN_SUCCESS,
          HTTP_STATUS.OK
        )
      );
    } catch (error) {
      // Handle invalid credentials
      if (error.message.includes('Invalid') || error.message.includes('not active')) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(
          formatErrorResponse(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED)
        );
      }

      throw error;
    }
  });

  /**
   * GET /api/users/profile
   * Get authenticated user's profile
   */
  getCurrentUser = asyncHandler(async (req, res) => {
    // Extract user info from JWT token (set by auth middleware)
    const user = await UserService.getUserById(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(user, 'User profile fetched successfully')
    );
  });

  /**
   * GET /api/users
   * Get all users (Super Admin only)
   */
  getAllUsers = asyncHandler(async (req, res) => {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role || null;

    // Call UserService to fetch users
    const result = await UserService.getAllUsers(page, limit, role);

    return res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(
        result.users,
        'Users fetched successfully',
        HTTP_STATUS.OK
      )
    );
  });

  /**
   * GET /api/users/:userId
   * Get specific user details (Super Admin only)
   */
  getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await UserService.getUserById(userId);
      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(user, 'User fetched successfully')
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * PUT /api/users/profile/update
   * Update current user's profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { fullName, bio, profilePicture } = req.body;

    try {
      const updatedUser = await UserService.updateUser(userId, {
        fullName,
        bio,
        profilePicture,
      });

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          updatedUser,
          SUCCESS_MESSAGES.USER_UPDATED
        )
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * PUT /api/users/:userId/role
   * Update user's role (Super Admin only)
   */
  updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    try {
      const updatedUser = await UserService.updateUserRole(userId, role);
      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          updatedUser,
          'User role updated successfully'
        )
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      if (error.message.includes('Invalid role')) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          formatErrorResponse('Invalid role provided', HTTP_STATUS.BAD_REQUEST)
        );
      }

      throw error;
    }
  });

  /**
   * DELETE /api/users/:userId
   * Delete user account (Super Admin only)
   */
  deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
      await UserService.deleteUser(userId);
      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(null, SUCCESS_MESSAGES.USER_DELETED)
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      throw error;
    }
  });

  /**
   * POST /api/auth/change-password
   * Change user's password
   */
  changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    try {
      const updatedUser = await UserService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      return res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(
          updatedUser,
          'Password changed successfully'
        )
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          formatErrorResponse(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        );
      }

      if (error.message.includes('incorrect')) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          formatErrorResponse('Current password is incorrect', HTTP_STATUS.BAD_REQUEST)
        );
      }

      throw error;
    }
  });
}

// Export controller instance
export default new UserController();
