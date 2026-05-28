import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Header() {
  const { user } = useAuthStore()
  const location = useLocation()

  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path === '/blogs') return 'My Blogs'
    if (path === '/blog/new') return 'Create Article'
    if (path.includes('/blog/')) return 'Edit Article'
    if (path === '/users') return 'Users'
    return 'Blog Hub'
  }

  return (
    <header className="bg-slate-900/50 backdrop-blur border-b border-slate-700/50 sticky top-0 z-30">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              {getBreadcrumb()}
            </p>
            <h2 className="text-lg font-semibold text-white mt-1">
              Welcome back, <span className="text-blue-400">{user?.fullName || 'User'}</span>
            </h2>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <span className="text-xs text-slate-400">Role:</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                user?.role === 'super_admin' ? 'bg-purple-600/30 text-purple-200' :
                user?.role === 'editor' ? 'bg-blue-600/30 text-blue-200' :
                user?.role === 'author' ? 'bg-green-600/30 text-green-200' :
                'bg-slate-600/30 text-slate-200'
              }`}>
                {user?.role?.toUpperCase().replace('_', ' ') || 'VIEWER'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
