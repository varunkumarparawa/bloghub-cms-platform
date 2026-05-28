/**
 * SEO Utilities
 * Helper functions for SEO optimization
 */

/**
 * Generate SEO meta tags
 * @param {Object} seoData - SEO data from blog
 * @returns {Object} - Meta tags object
 */
export const generateSEOMetaTags = (seoData) => {
  if (!seoData) return {};

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    canonical: seoData.canonicalUrl,
  };
};

/**
 * Generate Open Graph tags for social media
 * @param {Object} ogData - Open Graph data
 * @returns {Object} - OG tags
 */
export const generateOpenGraphTags = (ogData) => {
  if (!ogData) return {};

  return {
    'og:title': ogData.title,
    'og:description': ogData.description,
    'og:image': ogData.image,
    'og:type': ogData.type || 'article',
  };
};

/**
 * Generate Twitter Card tags
 * @param {Object} twitterData - Twitter card data
 * @returns {Object} - Twitter tags
 */
export const generateTwitterCardTags = (twitterData) => {
  if (!twitterData) return {};

  return {
    'twitter:card': twitterData.cardType || 'summary_large_image',
    'twitter:title': twitterData.title,
    'twitter:description': twitterData.description,
    'twitter:image': twitterData.image,
  };
};

/**
 * Create JSON-LD structured data for article
 * @param {Object} blog - Blog post data
 * @returns {Object} - JSON-LD object
 */
export const createArticleSchema = (blog) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featureImage,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: blog.author.fullName,
      email: blog.author.email,
      image: blog.author.profilePicture,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Blog Platform',
    },
  };
};

/**
 * Create FAQ schema from FAQ section
 * @param {Array} faqs - FAQ array
 * @returns {Object} - FAQ schema
 */
export const createFAQSchema = (faqs) => {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Create breadcrumb schema
 * @param {Array} breadcrumbs - Breadcrumb items
 * @returns {Object} - Breadcrumb schema
 */
export const createBreadcrumbSchema = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Generate reading time estimate
 * @param {string} content - HTML content
 * @returns {number} - Minutes to read
 */
export const getReadingTime = (content) => {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Estimate 200 words per minute
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
};

/**
 * Format date for display
 * @param {string} date - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

export default {
  generateSEOMetaTags,
  generateOpenGraphTags,
  generateTwitterCardTags,
  createArticleSchema,
  createFAQSchema,
  createBreadcrumbSchema,
  getReadingTime,
  formatDate,
};
