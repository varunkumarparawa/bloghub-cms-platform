import { Link, useLocation } from 'react-router-dom'
import { MdDashboard, MdArticle, MdPeople, MdLogout, MdSettings, MdTrendingUp, MdBookmark } from 'react-icons/md'
import { useAuthStore } from '../store/authStore'

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const isSuperAdmin = user?.role === 'super_admin'
  const isEditor = user?.role === 'editor'
  const isAuthor = user?.role === 'author'

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const NavLink = ({ to, icon: Icon, label, badge }) => (
    <Link
      to={to}
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive(to)
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </div>
      {badge && <span className="px-2 py-1 bg-red-500 text-xs text-white rounded-full">{badge}</span>}
    </Link>
  )

  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col shadow-2xl border-r border-slate-700/50">
      {/* Logo & Branding */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg">
            <MdArticle size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">BlogHub</h1>
            <p className="text-xs text-slate-400">CMS Platform</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
          <p className="text-xs text-slate-400 mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'User'}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              user?.role === 'super_admin' ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' :
              user?.role === 'editor' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/30' :
              user?.role === 'author' ? 'bg-green-600/30 text-green-200 border border-green-500/30' :
              'bg-slate-600/30 text-slate-200 border border-slate-500/30'
            }`}>
              {user?.role?.replace('_', ' ').toUpperCase() || 'VIEWER'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Main Navigation */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">Main</p>
          <NavLink to="/" icon={MdDashboard} label="Dashboard" />
        </div>

        {/* Content Management */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">Content</p>
          <NavLink to="/blogs" icon={MdArticle} label="My Blogs" />
          <NavLink to="/blog/new" icon={MdBookmark} label="New Article" />
          {(isSuperAdmin || isEditor) && (
            <NavLink to="/blogs?status=draft" icon={MdTrendingUp} label="All Content" />
          )}
        </div>

        {/* Admin Section */}
        {(isSuperAdmin || isEditor) && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">Administration</p>
            {isSuperAdmin && <NavLink to="/users" icon={MdPeople} label="Users" />}
            {isSuperAdmin && <NavLink to="/settings" icon={MdSettings} label="Settings" />}
          </div>
        )}

        {/* Analytics Section */}
        {(isSuperAdmin || isEditor) && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">Analytics</p>
            <div className="px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <div className="text-xs">
                <p className="text-slate-400 mb-2">Content Stats</p>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Published:</span>
                    <span className="font-semibold">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Views:</span>
                    <span className="font-semibold">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all shadow-lg hover:shadow-red-600/30"
        >
          <MdLogout size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Help Section */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <p className="text-xs text-slate-500 text-center">Need help? Check the docs</p>
      </div>
    </div>
  )
}
