# Backend API Documentation

Complete API documentation for the Blog Platform Backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## User Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully.",
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "accountStatus": "active",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful.",
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "viewer"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "7d"
  }
}
```

### Get Current User Profile
**GET** `/users/profile`

Get authenticated user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "author",
    "accountStatus": "active",
    "bio": "Full stack developer",
    "profilePicture": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### Update Profile
**PUT** `/users/profile/update`

Update current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Updated",
  "bio": "Updated bio",
  "profilePicture": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "_id": "user_id",
    "fullName": "John Updated",
    "email": "john@example.com",
    "bio": "Updated bio",
    "profilePicture": "https://example.com/new-avatar.jpg"
  }
}
```

### Change Password
**POST** `/auth/change-password`

Change user's password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "oldPassword": "old_password_123",
  "newPassword": "new_password_456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get All Users (Super Admin Only)
**GET** `/users?page=1&limit=10&role=author`

Get list of all users with pagination and optional role filter.

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Super Admin

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `role` (optional) - Filter by role

**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "author",
      "accountStatus": "active",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Update User Role (Super Admin Only)
**PUT** `/users/:userId/role`

Update a user's role.

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Super Admin

**Request Body:**
```json
{
  "role": "editor"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully"
}
```

### Delete User (Super Admin Only)
**DELETE** `/users/:userId`

Delete a user account.

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Super Admin

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully."
}
```

---

## Blog Endpoints

### Create Blog
**POST** `/blogs`

Create a new blog post.

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Author, Editor, Super Admin

**Request Body:**
```json
{
  "title": "Complete Guide to Full Stack Development",
  "excerpt": "Learn full stack development with this comprehensive guide",
  "content": "<h2>Introduction</h2><p>Full stack development...</p>",
  "featureImage": "https://example.com/image.jpg",
  "tags": ["full-stack", "development", "web"],
  "categories": ["Web Development"],
  "seo": {
    "metaTitle": "Full Stack Development Guide 2024",
    "metaDescription": "Learn full stack development with this complete guide",
    "canonicalUrl": "https://example.com/blog/full-stack-guide",
    "openGraph": {
      "title": "Full Stack Development Guide",
      "description": "Complete guide to full stack development",
      "image": "https://example.com/og-image.jpg"
    },
    "twitterCard": {
      "cardType": "summary_large_image",
      "title": "Full Stack Development",
      "description": "Learn full stack development"
    }
  },
  "internalLinks": [
    {
      "title": "React Basics",
      "slug": "react-basics"
    }
  ],
  "externalLinks": [
    {
      "title": "MDN Web Docs",
      "url": "https://developer.mozilla.org"
    }
  ],
  "faqSection": [
    {
      "question": "What is full stack development?",
      "answer": "Full stack development refers to..."
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Blog created successfully.",
  "data": {
    "_id": "blog_id",
    "title": "Complete Guide to Full Stack Development",
    "slug": "complete-guide-to-full-stack-development",
    "excerpt": "Learn full stack development...",
    "content": "<h2>Introduction</h2>...",
    "tableOfContents": [
      {
        "level": 2,
        "text": "Introduction",
        "id": "introduction",
        "slug": "introduction",
        "children": []
      }
    ],
    "author": {
      "_id": "user_id",
      "fullName": "John Doe"
    },
    "status": "draft",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### Get Published Blogs
**GET** `/blogs/published?page=1&limit=10&category=Web%20Development&tag=javascript`

Get all published blogs with pagination and optional filters.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `category` (optional) - Filter by category
- `tag` (optional) - Filter by tag

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "_id": "blog_id",
      "title": "Complete Guide to Full Stack Development",
      "slug": "complete-guide-to-full-stack-development",
      "excerpt": "Learn full stack development...",
      "featureImage": "https://example.com/image.jpg",
      "tags": ["full-stack", "development"],
      "categories": ["Web Development"],
      "author": {
        "fullName": "John Doe",
        "profilePicture": "https://example.com/avatar.jpg"
      },
      "publishedAt": "2024-01-01T12:00:00Z",
      "viewCount": 150
    }
  ],
  "pagination": {
    "total": 25,
    "currentPage": 1,
    "totalPages": 3,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Blog by Slug
**GET** `/blogs/slug/:slug`

Get a specific blog post by its URL slug (public endpoint).

**Response (200):**
```json
{
  "success": true,
  "message": "Blog fetched successfully",
  "data": {
    "blog": {
      "_id": "blog_id",
      "title": "Complete Guide to Full Stack Development",
      "slug": "complete-guide-to-full-stack-development",
      "excerpt": "Learn full stack development...",
      "content": "<h2>Introduction</h2>...",
      "featureImage": "https://example.com/image.jpg",
      "tags": ["full-stack", "development"],
      "categories": ["Web Development"],
      "author": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "bio": "Full stack developer"
      },
      "tableOfContents": [...],
      "faqSection": [...],
      "internalLinks": [...],
      "externalLinks": [...],
      "seo": {...},
      "viewCount": 150,
      "publishedAt": "2024-01-01T12:00:00Z"
    },
    "relatedBlogs": [
      {
        "title": "React Basics",
        "slug": "react-basics",
        "excerpt": "Learn React fundamentals..."
      }
    ]
  }
}
```

### Update Blog
**PUT** `/blogs/:blogId`

Update an existing blog post.

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Author (own blogs), Editor, Super Admin

**Request Body:** Same as Create Blog

**Response (200):**
```json
{
  "success": true,
  "message": "Blog updated successfully.",
  "data": {
    "_id": "blog_id",
    "title": "Updated Title",
    ...
  }
}
```

### Publish Blog
**POST** `/blogs/:blogId/publish`

Publish a blog post (move from draft to published).

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Editor, Super Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Blog published successfully.",
  "data": {
    "_id": "blog_id",
    "status": "published",
    "publishedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Archive Blog
**POST** `/blogs/:blogId/archive`

Archive a blog post (hide from public).

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Editor, Super Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Blog archived successfully.",
  "data": {
    "_id": "blog_id",
    "status": "archived"
  }
}
```

### Delete Blog
**DELETE** `/blogs/:blogId`

Delete a blog post permanently.

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Editor, Super Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Blog deleted successfully."
}
```

### Get My Blogs (Dashboard)
**GET** `/blogs/author/my-blogs?page=1&limit=10`

Get current user's blogs (includes drafts).

**Headers:** `Authorization: Bearer <token>`  
**Requires Role:** Author, Editor, Super Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Your blogs fetched successfully",
  "data": [
    {
      "_id": "blog_id",
      "title": "My First Blog",
      "slug": "my-first-blog",
      "status": "draft",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### Get All Tags
**GET** `/blogs/tags/all`

Get all unique tags with blog count (public).

**Response (200):**
```json
{
  "success": true,
  "message": "Tags fetched successfully",
  "data": [
    {
      "name": "javascript",
      "count": 15
    },
    {
      "name": "web-development",
      "count": 12
    }
  ]
}
```

### Search Blogs
**GET** `/blogs/search?keyword=javascript&page=1&limit=10`

Search blogs by keyword.

**Query Parameters:**
- `keyword` (required) - Search keyword
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response (200):**
```json
{
  "success": true,
  "message": "Search results for \"javascript\"",
  "data": [
    {
      "title": "JavaScript Basics",
      "slug": "javascript-basics",
      "excerpt": "Learn JavaScript from scratch..."
    }
  ],
  "pagination": {...}
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized access. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Blog post not found."
}
```

### 409 Conflict
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error. Please try again later."
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- **Default:** 100 requests per 15 minutes per IP
- **Rate Limit Info:** Included in response headers

Exceeding the limit returns:
```
HTTP 429 Too Many Requests
```

---

## Success Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {...},
  "timestamp": "2024-01-01T12:00:00Z"
}
```

For paginated responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": [...],
  "pagination": {
    "total": 100,
    "currentPage": 1,
    "totalPages": 10,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Testing with Postman

1. Import the API endpoints into Postman
2. Set base URL: `http://localhost:5000/api`
3. For protected endpoints, add Authorization header after login:
   - Key: `Authorization`
   - Value: `Bearer <token_from_login_response>`

---

## Environment Variables

Required `.env` variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

