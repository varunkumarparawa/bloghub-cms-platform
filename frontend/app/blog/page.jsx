import Link from 'next/link'
import { blogAPI } from '@/lib/api'
import BlogCard from '@/components/BlogCard'

export const revalidate = 0 // Ensure search results are dynamic and real-time

export const metadata = {
  title: 'All Articles & Tutorials | Blog Platform',
  description: 'Search and read our comprehensive tutorials, programming guides, and tech insights. All posts are SEO-friendly and written by experts.',
}

/**
 * BlogListPage Component (Server Component)
 * Dynamically renders based on searchParams (search keyword and page number)
 * Fully server-side rendered for best indexability
 */
export default async function BlogListPage({ searchParams }) {
  const query = searchParams?.search || ''
  const page = parseInt(searchParams?.page) || 1
  const limit = 9

  let blogs = []
  let totalPages = 1
  let loadingError = null

  try {
    // Call standard search or list API depending on search query existence
    const response = query
      ? await blogAPI.searchBlogs(query, page, limit)
      : await blogAPI.getPublishedBlogs(page, limit)

    blogs = response.data || []
    totalPages = response.pagination?.totalPages || 1
  } catch (err) {
    console.error('Failed to fetch blogs on server:', err)
    loadingError = 'Could not load posts. Please try again.'
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 selection:bg-blue-500 selection:text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Our Article Hub
          </h1>
          <p className="text-slate-400">
            Browse through all our articles, search specific terms, and refine your search results.
          </p>
        </div>

        {/* Search Input using native HTML Form for instant zero-JS submit */}
        <form action="/blog" method="GET" className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={query}
              placeholder="Search articles by title, content, or tag..."
              className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition shadow-xl text-lg pr-16"
            />
            <button
              type="submit"
              className="absolute right-3 top-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-sm"
            >
              Search
            </button>
          </div>
          {query && (
            <p className="text-sm text-slate-500 mt-3 text-center">
              Showing results for &ldquo;<span className="text-blue-400 font-semibold">{query}</span>&rdquo; &bull;{' '}
              <Link href="/blog" className="text-blue-500 hover:underline">
                Clear search
              </Link>
            </p>
          )}
        </form>

        {/* Grid and listings */}
        {loadingError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
            {loadingError}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
            <p className="text-slate-400 text-lg mb-4">No matching posts found.</p>
            <Link href="/blog" className="text-blue-500 hover:underline">
              View all posts
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {blogs.map((blog) => (
                <div key={blog._id} className="hover:-translate-y-1.5 transition duration-300">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}${query ? `&search=${encodeURIComponent(query)}` : ''}`}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 transition"
                  >
                    &larr; Prev
                  </Link>
                )}

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNumber = i + 1
                    const isActive = page === pageNumber
                    return (
                      <Link
                        key={pageNumber}
                        href={`/blog?page=${pageNumber}${query ? `&search=${encodeURIComponent(query)}` : ''}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    )
                  })}
                </div>

                {page < totalPages && (
                  <Link
                    href={`/blog?page=${page + 1}${query ? `&search=${encodeURIComponent(query)}` : ''}`}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-800 transition"
                  >
                    Next &rarr;
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
