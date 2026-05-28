/**
 * Input Validation Middleware
 * Validates request data using Joi schema
 */

import Joi from 'joi';
import { formatErrorResponse } from '../utils/responseFormatter.js';
import { HTTP_STATUS } from '../constants/enums.js';

/**
 * Middleware factory to validate request data
 * Validates request body against provided Joi schema
 * 
 * @param {Object} schema - Joi validation schema
 * @returns {Function} - Middleware function
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    // Validate request body against schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Get all validation errors, not just first
      stripUnknown: true, // Remove unknown properties
    });

    // If validation failed, return error response
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatErrorResponse('Validation error', HTTP_STATUS.BAD_REQUEST, errors)
      );
    }

    // Attach validated data to request
    req.validatedBody = value;
    next();
  };
};

// Pre-defined validation schemas for common endpoints
export const validationSchemas = {
  // User registration validation
  userRegister: Joi.object({
    fullName: Joi.string().required().min(2).max(50).trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required().min(6).max(100),
  }),

  // User login validation
  userLogin: Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required(),
  }),

  // Blog creation/update validation
  createBlog: Joi.object({
    title: Joi.string().required().min(5).max(200).trim(),
    excerpt: Joi.string().required().max(160).trim(),
    content: Joi.string().required(),
    featureImage: Joi.string().allow(null, '').trim(),
    tags: Joi.array().items(Joi.string().trim()),
    categories: Joi.array().items(Joi.string().trim()),
    seo: Joi.object({
      metaTitle: Joi.string().allow('').max(60).trim(),
      metaDescription: Joi.string().allow('').max(160).trim(),
      canonicalUrl: Joi.string().allow(null, '').trim(),
      openGraph: Joi.object({
        title: Joi.string().allow(''),
        description: Joi.string().allow(''),
        image: Joi.string().allow(null, ''),
        type: Joi.string().allow(''),
      }),
      twitterCard: Joi.object({
        cardType: Joi.string().allow(''),
        title: Joi.string().allow(''),
        description: Joi.string().allow(''),
        image: Joi.string().allow(null, ''),
      }),
    }).default({}),
    internalLinks: Joi.array().items(
      Joi.object({
        title: Joi.string().allow(''),
        slug: Joi.string().allow(''),
      })
    ).default([]),
    externalLinks: Joi.array().items(
      Joi.object({
        title: Joi.string().allow(''),
        url: Joi.string().allow(null, ''),
      })
    ).default([]),
    faqSection: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      })
    ).default([]),
  }),

  // Update blog status
  updateBlogStatus: Joi.object({
    status: Joi.string().required().valid('draft', 'published', 'archived'),
  }),
};

export default {
  validateRequest,
  validationSchemas,
};
