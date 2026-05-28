/**
 * User Service
 * Contains business logic for user management
 * Handles authentication, user CRUD operations, and password management
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { USER_ROLES, ACCOUNT_STATUS } from '../constants/enums.js';

/**
 * User Service Class
 * Encapsulates all user-related business logic
 */
class UserService {
  /**
   * Register a new user
   * Creates user account with provided credentials
   * 
   * @param {Object} userData - User registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password (will be hashed)
   * @param {string} userData.role - User's role (default: VIEWER)
   * @returns {Promise<Object>} - Created user object (without password)
   */
  async registerUser(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const user = new User({
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role || USER_ROLES.VIEWER,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
    });

    // Save user to database
    await user.save();

    // Return user without password
    return user.toJSON();
  }

  /**
   * Login user and generate JWT token
   * Authenticates user and returns access token
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} - User data and access token
   */
  async loginUser(email, password) {
    // Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (user.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
      throw new Error('Account is not active');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toJSON(),
      token,
    };
  }

  /**
   * Generate JWT access token
   * 
   * @param {Object} payload - Token payload data
   * @returns {string} - JWT token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '7d',
    });
  }

  /**
   * Get user by ID
   * 
   * @param {string} userId - MongoDB user ID
   * @returns {Promise<Object>} - User object
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  /**
   * Get all users with pagination
   * Only accessible by Super Admin
   * 
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @param {string} role - Filter by role (optional)
   * @returns {Promise<Object>} - Paginated user list
   */
  async getAllUsers(page = 1, limit = 10, role = null) {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = role ? { role } : {};

    // Fetch users and total count
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .select('-password')
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return {
      users: users.map(user => user.toJSON()),
      total,
      page,
      limit,
    };
  }

  /**
   * Update user information
   * 
   * @param {string} userId - MongoDB user ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated user object
   */
  async updateUser(userId, updateData) {
    // Only allow specific fields to be updated
    const allowedFields = ['fullName', 'bio', 'profilePicture', 'accountStatus'];
    const filteredData = {};

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    // Update user
    const user = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Update user role (Super Admin only)
   * 
   * @param {string} userId - MongoDB user ID
   * @param {string} newRole - New role to assign
   * @returns {Promise<Object>} - Updated user object
   */
  async updateUserRole(userId, newRole) {
    // Validate role
    if (!Object.values(USER_ROLES).includes(newRole)) {
      throw new Error('Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Delete user account (Super Admin only)
   * 
   * @param {string} userId - MongoDB user ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
  }

  /**
   * Change user password
   * 
   * @param {string} userId - MongoDB user ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Updated user object
   */
  async changePassword(userId, oldPassword, newPassword) {
    // Fetch user with password field
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValid = await user.comparePassword(oldPassword);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return user.toJSON();
  }
}

// Export single instance of UserService
export default new UserService();
