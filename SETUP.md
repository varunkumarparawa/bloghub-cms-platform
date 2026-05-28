# Blog Platform - Local Setup Guide

## 🚀 Quick Start

This is a full-stack blog management platform built with Node.js, Express, MongoDB, React, and Next.js.

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Git** for version control

### Project Structure
```
blog-platform/
├── backend/          # Express.js API server (Port 5000)
├── admin-panel/      # React admin dashboard (Port 5173/5174)
├── frontend/         # Next.js public blog (Port 3000/3001)
├── package.json      # Root dependencies
└── README.md         # Project documentation
```

---

## 📋 Installation Steps

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd blog-platform
```

### 2. Install Dependencies
Install dependencies for all three services:

```bash
# Backend dependencies
cd backend
npm install
cd ..

# Admin panel dependencies
cd admin-panel
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 3. MongoDB Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user with credentials:
   - Username: `blogadmin`
   - Password: `BlogAdmin@123` (or your choice)
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blog-platform`)

### 4. Environment Configuration

#### Backend `.backend/.env`:
```env
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://blogadmin:BlogAdmin%40123@cluster0.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174
```

#### Admin Panel `admin-panel/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Blog Platform Admin
```

#### Frontend `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Blog Platform
```

---

## 🗄️ Database Seeding

Populate the database with test data:

```bash
cd backend
node seed.js
cd ..
```

### Test Credentials (After Seeding):
| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@blogplatform.com | Admin@123456 |
| Editor | editor@blogplatform.com | Editor@123456 |
| Author | author@blogplatform.com | Author@123456 |
| Viewer | test@blogplatform.com | Test@123456 |

---

## ▶️ Running the Project

### Option 1: Run All Services in Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Admin Panel:**
```bash
cd admin-panel
npm run dev
# Runs on http://localhost:5173 (or 5174 if port in use)
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000 (or 3001 if port in use)
```

### Option 2: Run with NPM Scripts from Root

```bash
# Install root dependencies first
npm install

# Run all services
npm run dev
```

---

## 🧪 Testing the Platform

### 1. **Backend API Testing**
- Test health: `curl http://localhost:5000/api/health`
- View API docs: Check `backend/API_DOCUMENTATION.md`

### 2. **Admin Login**
- Navigate to: http://localhost:5174 (or 5173)
- Login with: `admin@blogplatform.com` / `Admin@123456`
- Create, edit, and publish blog posts

### 3. **Frontend Blog Viewing**
- Navigate to: http://localhost:3001 (or 3000)
- Browse published blogs
- Search and filter by category/tags
- View blog details with SEO metadata

### 4. **Full Integration Test**
```bash
# 1. Login to admin panel
# 2. Create new blog post
# 3. Publish it
# 4. View on frontend at /blog page
# 5. Click blog to read full content
```

---

## 📁 Project Features

### Backend (Express.js + MongoDB)
✅ JWT Authentication & Authorization  
✅ Role-Based Access Control (RBAC)  
✅ Blog CRUD operations  
✅ SEO metadata management  
✅ View count tracking  
✅ Search & filtering  
✅ User management  
✅ Input validation & error handling  

### Admin Panel (React + Vite)
✅ Responsive dashboard  
✅ Blog editor with rich text  
✅ User management interface  
✅ Real-time form validation  
✅ Toast notifications  
✅ Protected routes  

### Frontend (Next.js)
✅ Server-side rendering (SSR)  
✅ Static generation (SSG)  
✅ SEO optimization  
✅ Responsive design  
✅ Blog search & filtering  
✅ Category & tag pages  
✅ Markdown rendering  
✅ Code syntax highlighting  

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (add `0.0.0.0/0` for development)
- Verify database user credentials

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Admin: Vite will auto-use next available port
- Frontend: Next.js will auto-use next available port

### CORS Errors
- Verify `CORS_ORIGIN` includes your frontend URLs
- Restart backend after changing `.env`

### API Calls Failing
- Check backend is running: `curl http://localhost:5000/api/health`
- Verify API URLs in frontend configs match backend port
- Check browser console for detailed errors

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Blogs (Public)
- `GET /api/blogs/published` - Get published blogs
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `GET /api/blogs/category/:category` - Get blogs by category
- `GET /api/blogs/tags/all` - Get all tags

### Blogs (Protected)
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `PUT /api/blogs/:id/publish` - Publish blog

### Users (Protected)
- `GET /api/users/profile` - Get current user
- `POST /api/users/change-password` - Change password

---

## 🚀 Deployment Ready

The project is ready for deployment to:
- **Backend**: Heroku, Railway, Render
- **Admin Panel**: Vercel, Netlify
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas (already configured)

For deployment guides, see individual README files in each service folder.

---

## 📝 License

This project is open source and available under the MIT License.

---

## 💡 Support

For issues or questions:
1. Check troubleshooting section above
2. Review individual service README files
3. Check backend API documentation
4. Create GitHub issue with details

---

**Happy blogging! 🚀**
