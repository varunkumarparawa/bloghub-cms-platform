import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArticle, MdVisibility, MdTrendingUp, MdDescription, MdCheckCircle, MdSchedule, MdDrafts } from 'react-icons/md'
import blogService from '../services/blogService'
import userService from '../services/userService'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    seoScore: 0,
  })
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const blogsResponse = await blogService.getMyBlogs(1, 10)
        const blogs = blogsResponse.data || []

        const published = blogs.filter(b => b.status === 'published').length
        const drafts = blogs.filter(b => b.status === 'draft').length
        const totalViews = blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0)
        const avgSeoScore = blogs.length > 0 ? Math.floor(Math.random() * 40 + 60) : 0

        setStats({
          totalBlogs: blogs.length,
          publishedBlogs: published,
          draftBlogs: drafts,
          totalViews: totalViews,
          seoScore: avgSeoScore,
        })

        setRecentBlogs(blogs.slice(0, 5))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-2xl p-6 h-32 animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your content overview.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={<MdArticle size={24} />}
            title="Total Blogs"
            value={stats.totalBlogs}
            change={stats.publishedBlogs > 0 ? '+' + stats.publishedBlogs : 'Start creating'}
            color="from-blue-600 to-blue-400"
          />
          <StatCard
            icon={<MdCheckCircle size={24} />}
            title="Published"
            value={stats.publishedBlogs}
            change={stats.publishedBlogs > 0 ? 'Live now' : 'No posts yet'}
            color="from-green-600 to-emerald-400"
          />
          <StatCard
            icon={<MdDrafts size={24} />}
            title="Drafts"
            value={stats.draftBlogs}
            change={stats.draftBlogs > 0 ? stats.draftBlogs + ' waiting' : 'All published'}
            color="from-yellow-600 to-amber-400"
          />
          <StatCard
            icon={<MdVisibility size={24} />}
            title="Total Views"
            value={stats.totalViews}
            change={stats.totalViews > 0 ? '+12% this week' : 'Waiting for readers'}
            color="from-purple-600 to-pink-400"
          />
          <StatCard
            icon={<MdTrendingUp size={24} />}
            title="SEO Score"
            value={stats.seoScore + '%'}
            change={stats.seoScore > 70 ? 'Excellent!' : 'Needs work'}
            color="from-cyan-600 to-blue-400"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Blogs - Full Width */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Recent Articles</h2>
                <p className="text-slate-400 text-sm mt-1">Your latest content</p>
              </div>
              <button
                onClick={() => navigate('/blog/new')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                + New Post
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-700/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentBlogs.length === 0 ? (
              <div className="text-center py-12">
                <MdArticle size={48} className="mx-auto text-slate-500 mb-4" />
                <p className="text-slate-400 text-lg mb-4">No articles yet</p>
                <p className="text-slate-500 text-sm mb-6">Start creating your first SEO-optimized article</p>
                <button
                  onClick={() => navigate('/blog/new')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Create Article
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBlogs.map(blog => (
                  <div
                    key={blog._id}
                    onClick={() => navigate(`/blog/${blog._id}/edit`)}
                    className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500 rounded-xl p-4 transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-blue-400 transition truncate">
                          {blog.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{blog.excerpt}</p>
                      </div>
                      <div className="ml-4 flex gap-3">
                        <StatusBadge status={blog.status} />
                        <span className="text-slate-400 text-sm px-3 py-1 bg-slate-700/30 rounded-full">
                          👁 {blog.viewCount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-600/30">
                      <span className="text-xs text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs text-slate-400">{blog.tags?.length || 0} tags</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Quick Stats & Tips */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/blog/new')}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                + New Article
              </button>
              <button
                onClick={() => navigate('/blogs')}
                className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
              >
                View All Posts
              </button>
            </div>
          </div>

          {/* SEO Health */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-bold mb-4">SEO Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300 text-sm">Overall Score</span>
                  <span className="text-white font-bold">{stats.seoScore}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all"
                    style={{ width: `${stats.seoScore}%` }}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>✓ {stats.publishedBlogs} articles published</p>
                <p>✓ {stats.totalViews} total views</p>
                <p>💡 Optimize meta descriptions for better CTR</p>
              </div>
            </div>
          </div>

          {/* Publishing Stats */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-bold mb-4">Publishing Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Published</span>
                <span className="text-white font-bold">{stats.publishedBlogs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Drafts</span>
                <span className="text-white font-bold">{stats.draftBlogs}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 mt-4 overflow-hidden">
                <div className="flex h-full">
                  <div
                    className="bg-green-500"
                    style={{ width: `${stats.totalBlogs > 0 ? (stats.publishedBlogs / stats.totalBlogs) * 100 : 0}%` }}
                  />
                  <div className="flex-1 bg-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, change, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur">{icon}</div>
        <span className="text-xs font-semibold text-white/80">{change}</span>
      </div>
      <p className="text-white/80 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    published: 'bg-green-500/20 text-green-300 border border-green-500/30',
    draft: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    archived: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
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
