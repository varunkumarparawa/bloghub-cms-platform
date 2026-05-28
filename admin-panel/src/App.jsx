import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import BlogList from './pages/BlogList'
import BlogEditor from './pages/BlogEditor'
import UserList from './pages/UserList'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <Layout>
                <BlogList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/blog/new"
          element={
            <ProtectedRoute>
              <Layout>
                <BlogEditor />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/blog/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <BlogEditor />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole="super_admin">
              <Layout>
                <UserList />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
