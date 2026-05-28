/**
 * Table of Contents Component
 * Auto-generated from blog content
 */

'use client';

import Link from 'next/link';

/**
 * TableOfContents Component
 * Displays hierarchical table of contents
 * 
 * @param {Array} toc - Table of contents array
 * @param {string} className - Additional CSS classes
 */
export default function TableOfContents({ toc, className = '' }) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <nav className={`bg-slate-900/40 border border-slate-800 rounded-2xl p-6 ${className}`}>
      <h2 className="text-lg font-bold text-white mb-4">
        Table of Contents
      </h2>
      
      <ul className="space-y-2.5">
        {toc.map((item, index) => (
          <li key={index}>
            <a
              href={`#${item.slug}`}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
            >
              {item.text}
            </a>

            {/* Nested items (H3) */}
            {item.children && item.children.length > 0 && (
              <ul className="ml-4 mt-2 space-y-1.5 border-l border-slate-800 pl-3">
                {item.children.map((child, childIndex) => (
                  <li key={childIndex}>
                    <a
                      href={`#${child.slug}`}
                      className="text-sm text-slate-400 hover:text-blue-400 hover:underline transition-colors block"
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
