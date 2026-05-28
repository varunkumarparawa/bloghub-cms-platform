/**
 * Main Server File
 * Express server setup with middleware configuration
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import configuration
import { connectDatabase } from './config/database.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Set HTTP security headers
app.use(helmet());

// CORS - Enable cross-origin requests from frontend
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate Limiting - Prevent API abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Parse JSON request bodies
app.use(express.json({ limit: '50mb' }));

// Parse form-data request bodies
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Static serving of uploaded files
app.use('/uploads', express.static('uploads'));

// User routes
app.use('/api', userRoutes);

// Blog routes
app.use('/api/blogs', blogRoutes);

// Upload routes
app.use('/api/upload', uploadRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last middleware)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start server and connect to database
 */
const startServer = async () => {
  try {
    // Attempt to connect to MongoDB (non-blocking - server starts even if DB fails)
    connectDatabase().catch(err => {
      console.warn('⚠️  Starting server without database connection. Will retry...');
    });

    // Start Express server regardless of database connection status
    app.listen(PORT, () => {
      console.log(`
      ╔═══════════════════════════════════════╗
      ║   📝 Blog Platform API Server         ║
      ║   ✅ Server running successfully      ║
      ║   🔗 http://localhost:${PORT}           ║
      ║   🌍 Environment: ${NODE_ENV}          ║
      ╚═══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;
