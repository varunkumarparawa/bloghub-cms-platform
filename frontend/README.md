# Blog Platform Frontend

Next.js-based SEO-optimized frontend for displaying blog content.

## Features

✅ **SEO Optimization**
- Dynamic meta tags and Open Graph
- Server-side rendering (SSR)
- Static site generation (SSG)
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt

✅ **Blog Display**
- Blog listing with pagination
- Blog detail pages with rich content
- Category pages
- Tag pages
- Related posts recommendation
- Author pages

✅ **Static Pages**
- Home page
- About page
- Contact page
- Privacy & Terms

✅ **Performance**
- Image optimization
- Code splitting
- Fast page load
- CDN-ready

✅ **UX/Design**
- Responsive layout
- Dark mode support
- Fast navigation
- Accessible components

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update environment variables
```

## Development

```bash
# Start development server
npm run dev

# Server runs at http://localhost:3001
```

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Export static site (optional)
npm run export
```

## Project Structure

```
app/
├── page.jsx              # Home page
├── layout.jsx            # Root layout
├── blog/
│   ├── page.jsx         # Blog listing
│   └── [slug]/
│       └── page.jsx     # Blog detail page
├── category/
│   └── [name]/
│       └── page.jsx     # Category page
├── tag/
│   └── [name]/
│       └── page.jsx     # Tag page
├── author/
│   └── [slug]/
│       └── page.jsx     # Author page
├── about/
│   └── page.jsx         # About page
└── contact/
    └── page.jsx         # Contact page

components/
├── BlogCard.jsx         # Blog listing card
├── BlogContent.jsx      # Blog content display
├── TableOfContents.jsx  # Auto TOC
├── StructuredData.jsx   # Schema markup
└── SEOHead.jsx          # SEO component

lib/
├── api.js               # API calls
├── seo.js               # SEO utilities
└── helpers.js           # Utility functions

styles/
├── globals.css          # Global styles
└── themes.css           # Theme styles
```

## SEO Features Implemented

### Meta Tags
- Title tags (60 chars optimal)
- Meta descriptions (150-160 chars)
- Canonical URLs
- Language tags

### Open Graph Tags
- og:title
- og:description
- og:image
- og:type (article)
- og:url

### Twitter Cards
- twitter:card
- twitter:title
- twitter:description
- twitter:image

### Structured Data
- BlogPosting schema
- Article schema
- Author schema
- BreadcrumbList schema
- FAQPage schema

### Technical SEO
- XML Sitemap
- Robots.txt
- Fast page load (Core Web Vitals)
- Mobile-friendly design
- SSL/HTTPS
- Clean URLs

## API Integration

Frontend communicates with backend API:
- Base URL: `http://localhost:5000/api` (from .env)
- Fetches published blogs and content
- Increments blog view count

## Page Generation

### Dynamic Pages
- Blog detail pages
- Category pages
- Tag pages
- Author pages

### Static Pages
- Home
- About
- Contact
- Privacy
- Terms of Service

## Performance Optimization

- **Image Optimization** - Next.js Image component
- **Font Optimization** - Google Fonts optimization
- **Code Splitting** - Automatic route-based splitting
- **Cache Strategy** - ISR (Incremental Static Regeneration)
- **Bundle Size** - Tree shaking and minification

## Deployment

The frontend is optimized for deployment on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Traditional servers with Node.js

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME=Blog Platform
```

## Technologies Used

- **Next.js 14** - React framework with SSR/SSG
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Next SEO** - SEO optimization
- **Zustand** - State management

## Key Pages

### Home (`/`)
- Featured blogs
- Latest posts
- Popular tags
- SEO optimized

### Blog Listing (`/blog`)
- All published blogs
- Pagination
- Search and filtering
- Meta tags

### Blog Detail (`/blog/[slug]`)
- Full blog content
- Author information
- Related posts
- Comments section (optional)
- Structured data

### Category (`/category/[name]`)
- Blogs by category
- Category description
- Pagination

### Tag (`/tag/[name]`)
- Blogs by tag
- Tag listing

### Author (`/author/[slug]`)
- Author bio
- Author's blogs
- Author's social links

## SEO Best Practices Implemented

✅ Semantic HTML
✅ Fast loading pages
✅ Mobile-first design
✅ Accessibility (WCAG)
✅ Proper heading hierarchy
✅ Image alt text
✅ Internal linking
✅ Breadcrumbs
✅ Schema markup
✅ Sitemap & robots.txt

## Performance Metrics

- **FCP** (First Contentful Paint) < 1.8s
- **LCP** (Largest Contentful Paint) < 2.5s
- **CLS** (Cumulative Layout Shift) < 0.1
- **TTL** (Time to Interactive) < 3.8s

## Testing

```bash
# Run lighthouse
npx lighthouse http://localhost:3001

# SEO audit
Use Google Search Console
```

## Notes

- Requires backend API running on `http://localhost:5000`
- Modern browser with ES6+ support
- Node.js 16+ for development
- Images should be under 100KB for optimal performance

