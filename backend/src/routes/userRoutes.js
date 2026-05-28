/**
 * User Routes
 * Defines all user-related API endpoints
 * Routes: /api/auth, /api/users
 */

import express from 'express';
import UserController from '../controllers/UserController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRole, checkPermission } from '../middleware/authorize.js';
import { validateRequest, validationSchemas } from '../middleware/validation.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

/**
 * Authentication Routes (Public - no auth required)
 */

// POST /api/auth/register
// Create new user account
router.post(
  '/auth/register',
  validateRequest(validationSchemas.userRegister),
  UserController.registerUser
);

// POST /api/auth/login
// Authenticate user and get JWT token
router.post(
  '/auth/login',
  validateRequest(validationSchemas.userLogin),
  UserController.loginUser
);

/**
 * Protected Routes (Authentication required)
 */

// GET /api/users/profile
// Get current authenticated user's profile
router.get(
  '/users/profile',
  authenticateToken,
  UserController.getCurrentUser
);

// PUT /api/users/profile/update
// Update current user's profile information
router.put(
  '/users/profile/update',
  authenticateToken,
  UserController.updateProfile
);

// POST /api/auth/change-password
// Change user's password
router.post(
  '/auth/change-password',
  authenticateToken,
  UserController.changePassword
);

/**
 * Super Admin Only Routes
 * Only accessible by users with SUPER_ADMIN role
 */

// GET /api/users
// Get all users in the system
router.get(
  '/users',
  authenticateToken,
  authorizeRole(USER_ROLES.SUPER_ADMIN),
  UserController.getAllUsers
);

// GET /api/users/:userId
// Get specific user's details
router.get(
  '/users/:userId',
  authenticateToken,
  authorizeRole(USER_ROLES.SUPER_ADMIN),
  UserController.getUserById
);

// PUT /api/users/:userId/role
// Update user's role (change permissions)
router.put(
  '/users/:userId/role',
  authenticateToken,
  authorizeRole(USER_ROLES.SUPER_ADMIN),
  UserController.updateUserRole
);

// DELETE /api/users/:userId
// Delete user account from system
router.delete(
  '/users/:userId',
  authenticateToken,
  authorizeRole(USER_ROLES.SUPER_ADMIN),
  UserController.deleteUser
);

export default router;
