import { blogAPI } from '@/lib/api'
import { generateSEOMetaTags, createArticleSchema, createFAQSchema } from '@/lib/seo'
import StructuredData from '@/components/StructuredData'
import TableOfContents from '@/components/TableOfContents'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60 // Revalidate article page every 60 seconds

/**
 * Dynamic SEO Metadata Generator (Server Side)
 * Exposes meta tags, canonical URL, Open Graph, and Twitter Cards to search engine crawlers
 */
export async function generateMetadata({ params }) {
  const { slug } = params
  try {
    const response = await blogAPI.getBlogBySlug(slug)
    const blog = response.data?.blog
    if (!blog) return {}

    const title = blog.seo?.metaTitle || `${blog.title} | Blog Platform`
    const description = blog.seo?.metaDescription || blog.excerpt
    const canonical = blog.seo?.canonicalUrl || `http://localhost:3000/blog/${slug}`
    const image = blog.featureImage || ''

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title: blog.seo?.openGraph?.title || title,
        description: blog.seo?.openGraph?.description || description,
        images: [
          {
            url: blog.seo?.openGraph?.image || image,
          },
        ],
        type: blog.seo?.openGraph?.type || 'article',
      },
      twitter: {
        card: blog.seo?.twitterCard?.cardType || 'summary_large_image',
        title: blog.seo?.twitterCard?.title || title,
        description: blog.seo?.twitterCard?.description || description,
        images: [blog.seo?.twitterCard?.image || image],
      },
    }
  } catch (error) {
    console.error('generateMetadata error for slug:', slug, error)
    return {}
  }
}

/**
 * BlogDetailPage Component (Server Component)
 * Fetches blog content, sets structured data, and displays content
 */
export default async function BlogDetailPage({ params }) {
  const { slug } = params
  let blog = null
  let relatedBlogs = []

  try {
    const response = await blogAPI.getBlogBySlug(slug)
    blog = response.data?.blog
    relatedBlogs = response.data?.relatedBlogs || []
  } catch (error) {
    console.error('Error fetching blog details:', error)
  }

  // Trigger Next.js 404 page if blog is missing
  if (!blog) {
    notFound()
  }

  // Create article schema and FAQ schema (JSON-LD)
  const articleSchema = createArticleSchema(blog)
  const faqSchema = blog.faqSection && blog.faqSection.length > 0 
    ? createFAQSchema(blog.faqSection) 
    : null

  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 selection:bg-blue-500 selection:text-white">
      {/* Injected Structured Data (JSON-LD) */}
      {articleSchema && <StructuredData schema={articleSchema} />}
      {faqSchema && <StructuredData schema={faqSchema} />}

      <article className="container mx-auto px-6 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 text-sm text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-400 transition">Blog</Link>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-xs">{blog.title}</span>
        </div>

        {/* Hero Area */}
        <div className="max-w-4xl mb-12">
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {blog.categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/category/${cat}`}
                  className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500/20 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
            {blog.title}
          </h1>

          {/* Author and Date Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 pb-8 border-b border-slate-900">
            <div className="flex items-center gap-2">
              {blog.author?.profilePicture && (
                <img
                  src={blog.author.profilePicture}
                  alt={blog.author.fullName}
                  className="w-10 h-10 rounded-full border border-slate-800 object-cover"
                />
              )}
              <span>By <strong className="text-white hover:text-blue-400 transition"><Link href={`/author/${blog.author?.fullName?.toLowerCase().replace(/\s+/g, '-')}`}>{blog.author?.fullName}</Link></strong></span>
            </div>
            <div className="flex items-center gap-1">
              <span>📅 {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div>
              <span>👁 {blog.viewCount || 0} views</span>
            </div>
          </div>
        </div>

        {/* Main Double Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area (8/12) */}
          <div className="lg:col-span-8">
            {/* Main Feature Image */}
            {blog.featureImage && (
              <div className="relative rounded-3xl overflow-hidden border border-slate-900 mb-12 shadow-2xl">
                <img
                  src={blog.featureImage}
                  alt={blog.title}
                  className="w-full h-[450px] object-cover hover:scale-102 transition duration-500"
                />
              </div>
            )}

            {/* Excerpt Block */}
            <div className="border-l-4 border-blue-500 pl-6 mb-10 text-xl text-slate-300 font-medium leading-relaxed italic bg-blue-500/5 py-4 pr-4 rounded-r-xl">
              {blog.excerpt}
            </div>

            {/* Main Article Content */}
            <div
              className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed space-y-6 mb-12 blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-900">
                <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-sm font-medium transition text-slate-300 hover:text-white"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Accordion */}
            {blog.faqSection && blog.faqSection.length > 0 && (
              <div className="mt-16 pt-12 border-t border-slate-900">
                <h3 className="text-3xl font-extrabold tracking-tight mb-8">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {blog.faqSection.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group border border-slate-800 bg-slate-900/30 rounded-2xl p-6 transition duration-300 open:bg-slate-900/50"
                    >
                      <summary className="font-semibold text-lg cursor-pointer select-none list-none flex items-center justify-between text-white hover:text-blue-400 transition">
                        <span>{faq.question}</span>
                        <span className="text-slate-500 group-open:rotate-180 transition-transform duration-300">&darr;</span>
                      </summary>
                      <p className="mt-4 text-slate-300 leading-relaxed pl-2 border-l-2 border-slate-800">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar Area (4/12) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              {/* Table of Contents Component */}
              {blog.tableOfContents && blog.tableOfContents.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <TableOfContents toc={blog.tableOfContents} className="bg-transparent! border-none!" />
                </div>
              )}

              {/* Related/Internal Links Section */}
              {blog.internalLinks && blog.internalLinks.length > 0 && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
                    🔗 Related Articles
                  </h3>
                  <div className="space-y-3">
                    {blog.internalLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={`/blog/${link.slug}`}
                        className="block text-blue-400 hover:text-blue-300 font-medium text-sm leading-snug hover:underline transition"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* External References */}
              {blog.externalLinks && blog.externalLinks.length > 0 && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3 flex items-center gap-2">
                    🌍 External References
                  </h3>
                  <div className="space-y-3">
                    {blog.externalLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-emerald-400 hover:text-emerald-300 font-medium text-sm leading-snug hover:underline transition"
                      >
                        {link.title} &rarr;
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs Block */}
      {relatedBlogs.length > 0 && (
        <section className="mt-24 pt-16 border-t border-slate-900 bg-slate-900/10">
          <div className="container mx-auto px-6 max-w-6xl">
            <h3 className="text-2xl font-bold mb-8 text-white">Recommended Reads</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relBlog) => (
                <div key={relBlog._id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-5 hover:-translate-y-1 transition duration-300">
                  {relBlog.featureImage && (
                    <img src={relBlog.featureImage} alt={relBlog.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                  )}
                  <h4 className="font-bold text-lg text-white mb-2 leading-snug line-clamp-2 hover:text-blue-400 transition">
                    <Link href={`/blog/${relBlog.slug}`}>{relBlog.title}</Link>
                  </h4>
                  <p className="text-slate-400 text-sm line-clamp-2">{relBlog.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
