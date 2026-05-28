import { blogAPI } from '@/lib/api'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

export const revalidate = 60 // Revalidate category pages every minute

/**
 * Generate SEO metadata for Category pages dynamically
 */
export async function generateMetadata({ params }) {
  const categoryName = decodeURIComponent(params.name)
  return {
    title: `Articles in Category: ${categoryName} | Blog Platform`,
    description: `Read all expert tutorials and guides related to ${categoryName} in our blog database.`,
  }
}

/**
 * CategoryPage Component (Server Component)
 * Renders list of published blogs under the specified category
 */
export default async function CategoryPage({ params }) {
  const { name } = params
  const decodedCategory = decodeURIComponent(name)
  let blogs = []
  let error = null

  try {
    const response = await blogAPI.getBlogsByCategory(decodedCategory, 1, 100)
    blogs = response.data || []
  } catch (err) {
    console.error('Failed to fetch category blogs:', err)
    error = 'Could not load category posts. Please try again later.'
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
          <span className="text-slate-300">Category</span>
          <span>/</span>
          <span className="text-blue-400 font-semibold">{decodedCategory}</span>
        </div>

        {/* Title */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-wider text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Category Folder
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
            Articles filed under: {decodedCategory}
          </h1>
          <p className="text-slate-400 mt-2">Browse programming guides and posts specifically tagged with this category</p>
        </div>

        {/* Grid and list */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center text-slate-400">
            No published articles have been registered under this category yet.
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
