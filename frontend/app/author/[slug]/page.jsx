import { blogAPI } from '@/lib/api'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

export const revalidate = 60 // Revalidate author page every minute

/**
 * Generate SEO metadata for Author pages dynamically
 */
export async function generateMetadata({ params }) {
  const authorSlug = decodeURIComponent(params.slug)
  const capitalizedName = authorSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return {
    title: `Articles by ${capitalizedName} | Blog Platform`,
    description: `Read all expert guides and developer insights written by ${capitalizedName} in our blog database.`,
  }
}

/**
 * AuthorPage Component (Server Component)
 * Resolves author profile and lists all articles published by them
 */
export default async function AuthorPage({ params }) {
  const { slug } = params
  const decodedSlug = decodeURIComponent(slug)
  let blogs = []
  let author = null
  let error = null

  try {
    const response = await blogAPI.getPublishedBlogs(1, 100)
    const allBlogs = response.data || []
    
    // Filter blogs where author name matches the slugified parameter
    blogs = allBlogs.filter(b => 
      b.author?.fullName?.toLowerCase().replace(/\s+/g, '-') === decodedSlug
    )

    if (blogs.length > 0) {
      author = blogs[0].author
    }
  } catch (err) {
    console.error('Failed to fetch author blogs:', err)
    error = 'Could not load author profile. Please try again later.'
  }

  // Capitalize name for fallback display
  const fallbackName = decodedSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 selection:bg-blue-500 selection:text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Breadcrumbs */}
        <div className="mb-8 text-sm text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-400 transition">Blog</Link>
          <span>/</span>
          <span className="text-slate-300">Author</span>
          <span>/</span>
          <span className="text-blue-400 font-semibold">{author?.fullName || fallbackName}</span>
        </div>

        {/* Author Bio Card */}
        {author ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-12 backdrop-blur shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            
            {author.profilePicture && (
              <img
                src={author.profilePicture}
                alt={author.fullName}
                className="w-24 h-24 rounded-full border border-slate-800 object-cover shadow-lg"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-3 inline-block">
                Verified Author
              </span>
              <h1 className="text-4xl font-extrabold text-white mb-3">{author.fullName}</h1>
              <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                {author.bio || 'Author has not provided a bio description yet.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400 justify-center md:justify-start">
                <span>📧 {author.email}</span>
                <span>📝 {blogs.length} articles published</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12 text-center text-slate-400">
            <h1 className="text-3xl font-extrabold text-white mb-2">{fallbackName}</h1>
            <p>No profile information available.</p>
          </div>
        )}

        <h2 className="text-2xl font-bold tracking-tight mb-8">Publications by this Author</h2>

        {/* Grid and list */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center text-slate-400">
            This author has not published any articles yet.
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
