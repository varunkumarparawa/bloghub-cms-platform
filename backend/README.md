# Blog Platform Backend API

Backend API server for the blog management system built with Node.js, Express, and MongoDB.

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files (database)
│   ├── constants/        # App-wide constants (roles, status, messages)
│   ├── controllers/      # HTTP request handlers
│   ├── middleware/       # Express middleware (auth, validation, error)
│   ├── models/           # MongoDB schemas (User, Blog)
│   ├── routes/           # API routes definitions
│   ├── services/         # Business logic layer
│   ├── utils/            # Utility functions (slugs, response formatting)
│   └── server.js         # Main server entry point
├── package.json          # Dependencies and scripts
└── .env.example          # Environment variables template
```

## Installation

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Update .env with your MongoDB connection and other settings
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints Overview

### Authentication & Users (`/api`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /users/profile` - Get current user profile
- `PUT /users/profile/update` - Update profile
- `POST /auth/change-password` - Change password

### Blogs (`/api/blogs`)
- `GET /published` - Get published blogs (public)
- `GET /slug/:slug` - Get blog by slug (public)
- `GET /category/:category` - Get blogs by category (public)
- `GET /tags/all` - Get all tags (public)
- `GET /search` - Search blogs (public)
- `POST /` - Create new blog (Author+)
- `GET /author/my-blogs` - Get user's blogs
- `PUT /:blogId` - Update blog (Author+)
- `POST /:blogId/publish` - Publish blog (Editor+)
- `DELETE /:blogId` - Delete blog (Editor+)

## Architecture

### Service-Controller-Model Pattern

1. **Models** - Define MongoDB schemas (User, Blog)
2. **Services** - Contain business logic and database operations
3. **Controllers** - Handle HTTP requests and responses
4. **Routes** - Define API endpoints and middleware
5. **Middleware** - Handle authentication, validation, errors

### Authentication

- JWT-based authentication
- Tokens in Authorization header: `Bearer <token>`
- Token expires in 7 days (configurable in .env)

### Authorization

4 User Roles with different permissions:
- **Super Admin** - Full system access
- **Editor** - Manage all blogs, publish content
- **Author** - Create and manage own blogs
- **Viewer** - Read-only access

## SEO Features

Each blog post includes:
- Meta title & description
- Canonical URL
- Open Graph tags (social media)
- Twitter Card tags
- Structured data (JSON-LD)
- Auto-generated table of contents
- SEO-friendly URL slugs
- Related posts recommendations

## Key Features

✅ JWT Authentication with bcrypt password hashing
✅ Role-Based Access Control (RBAC)
✅ Blog CRUD with draft/publish system
✅ Full SEO optimization support
✅ Auto-generated table of contents
✅ Blog search and filtering
✅ User management (Super Admin)
✅ Comprehensive error handling
✅ Input validation with Joi
✅ Rate limiting for API protection
✅ CORS support for frontend integration

## Environment Variables

See `.env.example` for all required variables:
- MongoDB connection string
- JWT secrets and expiry times
- CORS origins
- Rate limiting configuration
- Admin credentials

## Error Handling

Centralized error handler with standardized response format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": null,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Code Quality

- Clean, readable code with clear naming
- Comprehensive comments explaining logic
- Separation of concerns (service/controller/model)
- Reusable utility functions
- Consistent error handling
- Production-ready security practices

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Joi** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin support
- **Rate Limiting** - API protection

## License

MIT
