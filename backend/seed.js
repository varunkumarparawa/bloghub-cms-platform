/**
 * Database Seeding Script
 * Populates MongoDB with sample data for testing
 * Run: node seed.js
 */

import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Blog from './src/models/Blog.js';

// Use Google DNS to bypass local DNS issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-platform';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📍 Connecting to:', MONGODB_URI.replace(/:[^@]+@/, ':***@'));

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create test users
    const users = await User.create([
      {
        fullName: 'Admin User',
        email: 'admin@blogplatform.com',
        password: 'Admin@123456',
        role: 'super_admin',
      },
      {
        fullName: 'Editor User',
        email: 'editor@blogplatform.com',
        password: 'Editor@123456',
        role: 'editor',
      },
      {
        fullName: 'Author User',
        email: 'author@blogplatform.com',
        password: 'Author@123456',
        role: 'author',
      },
      {
        fullName: 'Test User',
        email: 'test@blogplatform.com',
        password: 'Test@123456',
        role: 'viewer',
      },
    ]);

    console.log('👥 Created 4 test users');

    // Create test blogs
    const blogs = await Blog.create([
      {
        title: 'Getting Started with Node.js',
        slug: 'getting-started-with-nodejs',
        content:
          '<p>Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows you to build fast and scalable server applications.</p><p>In this tutorial, we\'ll explore the basics of Node.js and build your first application.</p>',
        excerpt: 'Learn the fundamentals of Node.js development',
        author: users[0]._id,
        status: 'published',
        category: 'Technology',
        tags: ['nodejs', 'javascript', 'backend'],
        seo: {
          metaTitle: 'Getting Started with Node.js - Complete Guide',
          metaDescription: 'Learn Node.js basics, setup, and build your first application. Perfect for beginners.',
          keywords: 'nodejs, javascript, backend, server',
          canonical: 'https://blog.example.com/getting-started-with-nodejs',
          openGraph: {
            title: 'Getting Started with Node.js',
            description: 'Complete guide to Node.js for beginners',
            type: 'article',
          },
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Getting Started with Node.js',
            description: 'Learn Node.js basics',
          },
        },
        tableOfContents: [
          { id: 'intro', title: 'Introduction', level: 1 },
          { id: 'setup', title: 'Setup & Installation', level: 1 },
          { id: 'basics', title: 'Basic Concepts', level: 1 },
        ],
        views: 250,
        likes: 42,
      },
      {
        title: 'React Hooks Explained',
        slug: 'react-hooks-explained',
        content:
          '<p>React Hooks revolutionized how we write React components by introducing functional components with state and side effects.</p><p>Learn about useState, useEffect, and custom hooks.</p>',
        excerpt: 'Master React Hooks with practical examples',
        author: users[1]._id,
        status: 'published',
        category: 'Technology',
        tags: ['react', 'javascript', 'frontend', 'hooks'],
        seo: {
          metaTitle: 'React Hooks Explained - Complete Guide',
          metaDescription: 'Comprehensive guide to React Hooks. Learn useState, useEffect, and build custom hooks.',
          keywords: 'react, hooks, javascript, frontend',
        },
        views: 420,
        likes: 78,
      },
      {
        title: 'MongoDB Best Practices',
        slug: 'mongodb-best-practices',
        content:
          '<p>MongoDB is a popular NoSQL database. Here are the best practices for designing efficient MongoDB schemas and queries.</p>',
        excerpt: 'Learn database design patterns for MongoDB',
        author: users[2]._id,
        status: 'published',
        category: 'Database',
        tags: ['mongodb', 'database', 'nosql'],
        views: 180,
        likes: 35,
      },
      {
        title: 'Web Performance Optimization',
        slug: 'web-performance-optimization',
        content:
          '<p>Website speed is critical for user experience and SEO. Learn techniques to optimize your web application performance.</p>',
        excerpt: 'Improve your website speed and performance',
        author: users[0]._id,
        status: 'draft',
        category: 'Performance',
        tags: ['performance', 'optimization', 'web'],
      },
    ]);

    console.log('📝 Created 4 test blogs (3 published, 1 draft)');

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('🔐 Test Credentials:');
    console.log('  Super Admin: admin@blogplatform.com / Admin@123456');
    console.log('  Editor:      editor@blogplatform.com / Editor@123456');
    console.log('  Author:      author@blogplatform.com / Author@123456');
    console.log('  User:        test@blogplatform.com / Test@123456\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.log('💡 Make sure MongoDB is running and MONGODB_URI is correct in .env');
    process.exit(1);
  }
};

seedDatabase();
