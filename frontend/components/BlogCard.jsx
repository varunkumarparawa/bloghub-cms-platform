/**
 * Blog Card Component
 * Displays a blog post preview in listing pages
 */

import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/seo';

/**
 * BlogCard Component
 * Shows blog preview with title, excerpt, author, date
 * 
 * @param {Object} blog - Blog data
 */
export default function BlogCard({ blog }) {
  return (
    <article className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* Feature Image */}
      {blog.featureImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={blog.featureImage}
            alt={blog.title}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category/Tags */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${cat.toLowerCase()}`}
                className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
          <Link href={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {blog.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
          <div className="flex items-center gap-2">
            {blog.author?.profilePicture && (
              <Image
                src={blog.author.profilePicture}
                alt={blog.author.fullName}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{blog.author?.fullName}</p>
              <p className="text-xs">{formatDate(blog.publishedAt)}</p>
            </div>
          </div>

          {/* View Count */}
          <span className="text-gray-500">
            {blog.viewCount} views
          </span>
        </div>
      </div>
    </article>
  );
}
