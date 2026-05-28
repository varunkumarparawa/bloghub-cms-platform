# Blog Platform Admin Dashboard

React-based admin dashboard for managing blog content, users, and SEO settings.

## Features

✅ **Blog Management**
- Create, edit, publish, and delete blogs
- Draft and published status management
- SEO metadata editor
- Rich text editor for content
- Auto-generated table of contents
- Feature image upload
- Tags and categories management

✅ **User Management** (Super Admin Only)
- View all users
- Manage user roles
- Activate/deactivate accounts
- User profile viewing

✅ **SEO Management**
- Meta title and description editor
- Open Graph tags
- Twitter Card configuration
- Structured data (JSON-LD) support
- Canonical URL settings

✅ **Dashboard Analytics**
- Blog statistics
- Recent activities
- User statistics

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update VITE_API_URL in .env
```

## Development

```bash
# Start development server
npm run dev

# Server runs at http://localhost:5173
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm preview
```

## Project Structure

```
src/
├── components/         # Reusable React components
│   ├── Sidebar/       # Navigation sidebar
│   ├── Header/        # Top header
│   ├── BlogEditor/    # Blog creation/editing
│   └── ...
├── pages/             # Page components
│   ├── Dashboard/     # Main dashboard
│   ├── Blogs/         # Blog management
│   ├── Users/         # User management
│   └── ...
├── hooks/             # Custom React hooks
│   └── useAuth.js    # Authentication hook
├── store/             # Zustand state management
│   └── authStore.js  # Auth state
├── services/          # API service calls
│   ├── api.js        # Axios instance
│   ├── blogService.js
│   └── userService.js
├── utils/             # Utility functions
│   ├── constants.js  # App constants
│   └── helpers.js    # Helper functions
├── styles/            # Global styles
└── App.jsx           # Main app component
```

## Authentication

- Login required for all dashboard pages
- JWT token stored in localStorage
- Auto-logout on token expiry
- Protected routes with role-based access

## API Integration

Admin panel communicates with backend API:
- Base URL: `http://localhost:5000/api` (from .env)
- All requests include JWT token in header
- Centralized error handling

## Role-Based Access

- **Super Admin** - Full access to all features
- **Editor** - Blog and category management
- **Author** - Own blog management only
- **Viewer** - Read-only access (limited dashboard)

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Quill** - Rich text editor
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Blog Platform Admin
```

## Key Pages

### Dashboard (`/dashboard`)
- Overview of platform statistics
- Recent blogs and activities
- User statistics

### Blogs (`/blogs`)
- List of all blogs (by role)
- Create new blog
- Edit existing blog
- Delete blog
- Publish/Archive blog
- SEO preview

### Blog Editor (`/blogs/create`)
- Title, excerpt, content editor
- Feature image upload
- Tags and categories
- SEO metadata form
- Table of contents preview
- FAQ section editor

### Users (`/users`) - Super Admin Only
- List all users
- Change user roles
- View user details
- Deactivate/activate accounts

### Settings (`/settings`)
- Profile management
- Password change
- Notification preferences

## Security Features

- JWT authentication
- Protected routes
- CSRF protection
- Input sanitization
- Secure password change form

## Best Practices

- Component composition and reusability
- Custom hooks for shared logic
- Centralized API calls
- Error handling and user feedback
- Responsive design
- Accessibility considerations

## Performance Optimization

- Code splitting with React Router
- Lazy loading of components
- Image optimization
- Caching API responses
- Debounced search and filters

## Notes

- Requires backend API running on `http://localhost:5000`
- Modern browser with ES6+ support
- Node.js 14+ for development

