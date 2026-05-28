/**
 * Structured Data Component
 * Renders JSON-LD schema markup in the head
 */

/**
 * StructuredData Component
 * Renders script tag with JSON-LD schema
 * 
 * @param {Object} schema - Schema object
 */
export default function StructuredData({ schema }) {
  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
