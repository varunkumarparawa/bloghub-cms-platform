/**
 * Upload Routes
 * Handles file uploading using multer middleware
 * Route: /api/upload
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.js';
import { HTTP_STATUS } from '../constants/enums.js';
import { formatSuccessResponse, formatErrorResponse } from '../utils/responseFormatter.js';

const router = express.Router();

// Ensure uploads folder exists in working directory
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configure storage engine
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

/**
 * File filter to restrict uploads to images only
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WEBP) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * POST /api/upload
 * Upload feature image
 */
router.post('/', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(formatErrorResponse('No file uploaded', HTTP_STATUS.BAD_REQUEST));
    }

    // Generate full external URL for the statically served file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    return res.status(HTTP_STATUS.OK).json(
      formatSuccessResponse(
        {
          url: fileUrl,
          filename: req.file.filename,
        },
        'Image uploaded successfully'
      )
    );
  } catch (error) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(formatErrorResponse(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
});

/**
 * Error handling middleware for Multer errors
 */
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json(formatErrorResponse(`Multer error: ${error.message}`, HTTP_STATUS.BAD_REQUEST));
  }
  return res
    .status(HTTP_STATUS.BAD_REQUEST)
    .json(formatErrorResponse(error.message, HTTP_STATUS.BAD_REQUEST));
});

export default router;
