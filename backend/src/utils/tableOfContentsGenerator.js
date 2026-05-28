/**
 * Table of Contents Generator
 * Automatically generates TOC from blog content headings (H2, H3)
 */

/**
 * Extract headings from HTML or Markdown content
 * Supports both HTML (<h2>, <h3>) and Markdown (##, ###) formats
 * 
 * @param {string} content - Blog content in HTML or Markdown
 * @returns {Array} - Array of heading objects
 */
export const generateTableOfContents = (content) => {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const headings = [];
  
  // Match both HTML headings and Markdown headings
  const patterns = [
    // HTML: <h2 id="...">...</h2> or <h2>...</h2>
    /<h([2-3])[^>]*>([^<]+)<\/h[2-3]>/gi,
    // Markdown: ## or ###
    /^(#{2,3})\s+(.+)$/gm,
  ];

  // First, handle HTML headings
  const htmlMatches = content.matchAll(/<h([2-3])[^>]*id="([^"]*)"[^>]*>([^<]+)<\/h[2-3]>/gi);
  for (const match of htmlMatches) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].trim();
    
    headings.push({
      level,
      text,
      id,
      slug: text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
    });
  }

  // Handle HTML headings without ID
  const htmlMatches2 = content.matchAll(/<h([2-3])[^>]*>([^<]+)<\/h[2-3]>/gi);
  for (const match of htmlMatches2) {
    const level = parseInt(match[1]);
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    
    // Avoid duplicates
    if (!headings.find(h => h.id === id)) {
      headings.push({
        level,
        text,
        id,
        slug: id,
      });
    }
  }

  // Handle Markdown headings
  const mdMatches = content.matchAll(/^(#{2,3})\s+(.+)$/gm);
  for (const match of mdMatches) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    
    // Avoid duplicates
    if (!headings.find(h => h.id === id)) {
      headings.push({
        level,
        text,
        id,
        slug: id,
      });
    }
  }

  return headings;
};

/**
 * Format table of contents in nested structure
 * Creates hierarchical TOC for rendering
 * 
 * @param {Array} headings - Array of heading objects
 * @returns {Array} - Formatted TOC with nesting
 */
export const formatTableOfContents = (headings) => {
  if (!headings || headings.length === 0) {
    return [];
  }

  const toc = [];
  let currentLevel2 = null;

  headings.forEach((heading) => {
    if (heading.level === 2) {
      currentLevel2 = {
        text: heading.text,
        id: heading.id,
        slug: heading.slug,
        children: [],
      };
      toc.push(currentLevel2);
    } else if (heading.level === 3 && currentLevel2) {
      currentLevel2.children.push({
        text: heading.text,
        id: heading.id,
        slug: heading.slug,
      });
    }
  });

  return toc;
};

export default {
  generateTableOfContents,
  formatTableOfContents,
};
