import { blogAPI } from '@/lib/api'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

export const revalidate = 60 // Revalidate tag pages every minute

/**
 * Generate SEO metadata for Tag pages dynamically
 */
export async function generateMetadata({ params }) {
  const tagName = decodeURIComponent(params.name)
  return {
    title: `Articles Tagged: #${tagName} | Blog Platform`,
    description: `Read all articles and developer insights tagged with #${tagName} in our blog database.`,
  }
}

/**
 * TagPage Component (Server Component)
 * Filters and lists published blogs containing the requested tag
 */
export default async function TagPage({ params }) {
  const { name } = params
  const decodedTag = decodeURIComponent(name)
  let blogs = []
  let error = null

  try {
    // FIX: Correctly query getPublishedBlogs using the tag parameter
    const response = await blogAPI.getPublishedBlogs(1, 100, null, decodedTag)
    blogs = response.data || []
  } catch (err) {
    console.error('Failed to fetch tag blogs:', err)
    error = 'Could not load tagged posts. Please try again later.'
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 selection:bg-blue-500 selection:text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="mb-8 text-sm text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-400 transition">Blog</Link>
          <span>/</span>
          <span className="text-slate-300">Tag</span>
          <span>/</span>
          <span className="text-blue-400 font-semibold">#{decodedTag}</span>
        </div>

        {/* Title */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-wider text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Tag Cloud
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Articles Tagged with: #{decodedTag}
          </h1>
          <p className="text-slate-400 mt-2">Discover content, resources, and articles filtered by this tag</p>
        </div>

        {/* Grid and list */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center text-slate-400">
            No published articles found matching this tag.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="hover:-translate-y-1.5 transition duration-300">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
