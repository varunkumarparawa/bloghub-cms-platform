# Blog Platform - Local Setup Guide

## Overview

This project is a full-stack blog management platform built using Node.js, Express.js, MongoDB, React.js, and Next.js. It includes role-based authentication, SEO-friendly blog publishing, and a modern admin dashboard for content management.

---

# Prerequisites

Before running the project locally, make sure you have the following installed:

* Node.js (v18 or above)
* Git
* MongoDB Atlas account (Free tier supported)

---

# Project Structure

```text
blog-platform/
├── backend/          # Express.js API server
├── admin-panel/      # React admin dashboard
├── frontend/         # Next.js public frontend
├── README.md
└── SETUP.md
```

---

# Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
cd blog-platform
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend
npm install
cd ..
```

### Admin Panel

```bash
cd admin-panel
npm install
cd ..
```

### Frontend

```bash
cd frontend
npm install
cd ..
```

---

# MongoDB Configuration

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Copy your MongoDB connection string

Example format:

```env
mongodb+srv://username:password@cluster.mongodb.net/blog-platform
```

---

# Environment Variables

## Backend `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

---

## Admin Panel `admin-panel/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Blog Platform Admin
```

---

## Frontend `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Blog Platform
```

---

# Database Seeding

To populate the database with sample users and blog data:

```bash
cd backend
node seed.js
cd ..
```

---

# Demo Credentials

| Role        | Email                                                     | Password      |
| ----------- | --------------------------------------------------------- | ------------- |
| Super Admin | [admin@blogplatform.com](mailto:admin@blogplatform.com)   | Admin@123456  |
| Editor      | [editor@blogplatform.com](mailto:editor@blogplatform.com) | Editor@123456 |
| Author      | [author@blogplatform.com](mailto:author@blogplatform.com) | Author@123456 |
| Viewer      | [test@blogplatform.com](mailto:test@blogplatform.com)     | Test@123456   |

---

# Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Start Admin Panel

```bash
cd admin-panel
npm run dev
```

Admin panel runs on:

```text
http://localhost:5173
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Application Features

## Backend Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* Blog CRUD APIs
* SEO metadata support
* Slug-based routing
* Input validation
* Protected routes
* Error handling middleware

---

## Admin Panel Features

* Secure login system
* Role-based dashboard rendering
* Blog editor with SEO fields
* Draft and publish workflow
* User management
* Responsive dashboard UI

---

## Frontend Features

* SEO-optimized blog pages
* Dynamic routing with slugs
* Server-side rendering
* Category and tag pages
* Search and filtering
* Responsive blog layout

---

# API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

---

## Public Blog APIs

```http
GET /api/blogs/published
GET /api/blogs/slug/:slug
GET /api/blogs/category/:category
```

---

## Protected Blog APIs

```http
POST /api/blogs
PUT /api/blogs/:id
DELETE /api/blogs/:id
```

---

# Troubleshooting

## MongoDB Connection Issues

* Verify MongoDB URI
* Check database user permissions
* Add IP address to Atlas whitelist

---

## API Errors

* Ensure backend server is running
* Verify frontend API URLs
* Check `.env` configuration

---

## Port Conflicts

If ports are already in use:

* Backend → change `PORT`
* Frontend/Admin → auto-select available ports

---

# Deployment

Recommended platforms:

| Service     | Platform         |
| ----------- | ---------------- |
| Backend     | Render / Railway |
| Admin Panel | Vercel / Netlify |
| Frontend    | Vercel           |
| Database    | MongoDB Atlas    |

---

# Developed By

Varun Kumar

