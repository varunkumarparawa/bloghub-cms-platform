import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdEdit, MdDelete, MdAdd, MdVisibility, MdMoreVert, MdFileOpen } from 'react-icons/md'
import blogService from '../services/blogService'
import toast from 'react-hot-toast'

export default function BlogList() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBlogs()
  }, [page, filter])

  const fetchBlogs = async () => {
    try {
      const response = await blogService.getMyBlogs(page, 10)
      let data = response.data || []
      
      if (filter !== 'all') {
        data = data.filter(b => b.status === filter)
      }
      
      setBlogs(data)
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this blog? This action cannot be undone.')) return

    try {
      await blogService.deleteBlog(blogId)
      toast.success('Blog deleted successfully')
      fetchBlogs()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog')
    }
  }

  const SkeletonRow = () => (
    <div className="h-20 bg-slate-700/30 rounded-xl animate-pulse" />
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Articles</h1>
            <p className="text-slate-400">Manage and publish your content</p>
          </div>
          <button
            onClick={() => navigate('/blog/new')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition font-medium"
          >
            <MdAdd size={20} />
            New Article
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3">
          {[
            { value: 'all', label: 'All Articles', icon: '📄' },
            { value: 'published', label: 'Published', icon: '✓' },
            { value: 'draft', label: 'Drafts', icon: '📝' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => { setFilter(tab.value); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                filter === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-white text-xl font-bold mb-2">No articles yet</h3>
            <p className="text-slate-400 mb-6">
              {filter === 'all'
                ? 'Start creating your first SEO-optimized article'
                : `No ${filter} articles found`}
            </p>
            <button
              onClick={() => navigate('/blog/new')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Create Article
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {blogs.map(blog => (
                  <tr
                    key={blog._id}
                    className="hover:bg-slate-700/20 transition group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="pt-1">
                          <div className="text-sm font-semibold text-white line-clamp-1 group-hover:text-blue-400 transition">
                            {blog.title}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-1">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MdVisibility size={16} />
                        {blog.viewCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {blog.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                            {tag}
                          </span>
                        ))}
                        {blog.tags?.length > 2 && (
                          <span className="px-2 py-1 text-xs text-slate-400">+{blog.tags.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/blog/edit/${blog._id}`)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition"
                          title="Edit"
                        >
                          <MdEdit size={18} />
                        </button>
                        {blog.status === 'published' && (
                          <a
                            href={`http://localhost:3000/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition"
                            title="View"
                          >
                            <MdFileOpen size={18} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition"
                          title="Delete"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-700/50 px-6 py-4 flex justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    published: 'bg-green-600/20 text-green-300 border border-green-500/30',
    draft: 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30',
    archived: 'bg-gray-600/20 text-gray-300 border border-gray-500/30',
  }

  const labels = {
    published: '✓ Published',
    draft: '📝 Draft',
    archived: '📦 Archived',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  )
}
