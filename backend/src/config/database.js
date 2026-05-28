/**
 * MongoDB Connection Configuration
 * Handles connection to MongoDB database with retry logic
 */

import mongoose from 'mongoose';
import dns from 'dns';

// Use Google DNS to bypass local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

let retryCount = 0;
let maxRetries = 10;
let retryDelay = 5000; // Start with 5 seconds

/**
 * Connect to MongoDB database with exponential backoff retry
 * @returns {Promise<void>}
 */
export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform';

    // Configure mongoose connection options
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 2,
    };

    console.log(` Attempting MongoDB connection (attempt ${retryCount + 1}/${maxRetries})...`);
    console.log(` Connecting to: ${mongoUri.replace(/:[^@]+@/, ':***@')}`);

    await mongoose.connect(mongoUri, connectionOptions);

    console.log(' MongoDB connected successfully!');
    retryCount = 0; // Reset retry counter on success
    retryDelay = 5000; // Reset delay

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log(' Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(' Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('  Mongoose disconnected from MongoDB');
    });

  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    
    retryCount++;
    
    if (retryCount < maxRetries) {
      console.log(` Retrying in ${retryDelay / 1000} seconds... (${retryCount}/${maxRetries})`);
      // Exponential backoff with max 60 second delay
      retryDelay = Math.min(retryDelay * 1.5, 60000);
      setTimeout(() => connectDatabase(), retryDelay);
    } else {
      console.warn('  Max retries reached. Server will operate without database.');
      console.log(' Hint: Check MongoDB Atlas cluster status and network access rules');
    }
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log(' MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

export default mongoose;
