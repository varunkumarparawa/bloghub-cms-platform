import Link from 'next/link'
import { blogAPI } from '@/lib/api'
import BlogCard from '@/components/BlogCard'

export const revalidate = 60 // Revalidate every minute

/**
 * HomePage Component (Server Component)
 * Fetches featured and latest posts during server rendering
 */
export default async function HomePage() {
  let featured = []
  let latest = []
  let error = null

  try {
    const response = await blogAPI.getPublishedBlogs(1, 6)
    const blogs = response.data || []
    featured = blogs.slice(0, 3)
    latest = blogs.slice(3, 6)
  } catch (err) {
    console.error('Error fetching blogs on server:', err)
    error = 'Failed to load content. Please try again later.'
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Hero Section with Vibrant Modern Gradient & Micro-animations */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 inline-block">
            ✨ Welcome to the Future of Content
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
            Insights, Stories & Deep Dives
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover beautifully written articles on technology, software architecture, databases, and SEO optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-0.5 transition duration-200 text-center"
            >
              Explore All Articles
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-semibold backdrop-blur transition text-center"
            >
              About Our Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blogs - Premium Glassmorphism Cards */}
      <section className="py-24 border-t border-slate-900 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Featured Insights</h2>
              <p className="text-slate-400 mt-2">Curated articles chosen for their outstanding quality and impact</p>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition">
              View all posts &rarr;
            </Link>
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
              {error}
            </div>
          ) : featured.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-slate-400">
              No featured articles found. Start seeding some!
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((blog) => (
                <div key={blog._id} className="hover:-translate-y-1.5 transition duration-300">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Blogs */}
      {latest.length > 0 && (
        <section className="py-24 border-t border-slate-900 bg-slate-900/20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-extrabold tracking-tight mb-12">Latest Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {latest.map((blog) => (
                <div key={blog._id} className="hover:-translate-y-1.5 transition duration-300">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium CTA Newsletter Form with Glassmorphism */}
      <section className="py-24 border-t border-slate-900 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Stay Ahead of the Curve</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Get notified immediately about new publications, programming guides, and SEO trends. No spam ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-5 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex-1 transition"
                required
              />
              <button className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg transition duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
