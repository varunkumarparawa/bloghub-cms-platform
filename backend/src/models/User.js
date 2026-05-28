/**
 * User Model
 * Stores user information including authentication and role data
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { USER_ROLES, ACCOUNT_STATUS } from '../constants/enums.js';

/**
 * User Schema - Defines the structure of user documents in MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    // User's full name
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },

    // User's email - unique identifier for authentication
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    // Hashed password for authentication
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },

    // User role determining what actions they can perform
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.VIEWER,
      required: true,
    },

    // User account status (active, inactive, suspended)
    accountStatus: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
    },

    // User avatar or profile picture URL
    profilePicture: {
      type: String,
      default: null,
    },

    // User bio or short description
    bio: {
      type: String,
      maxlength: [500, 'Bio must not exceed 500 characters'],
      default: '',
    },

    // Track if email is verified
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // When the user account was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // When the user account was last updated
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving user
 * Called automatically when password is modified
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare provided password with stored hashed password
 * Used during login authentication
 * 
 * @param {string} providedPassword - Password provided by user
 * @returns {boolean} - True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (providedPassword) {
  return await bcryptjs.compare(providedPassword, this.password);
};

/**
 * Get user data without sensitive information
 * @returns {Object} - User object without password and sensitive fields
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Create and export User model
const User = mongoose.model('User', userSchema);
export default User;
