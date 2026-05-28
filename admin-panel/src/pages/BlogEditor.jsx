import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import { MdCheckCircle, MdDescription, MdSearch, MdVisibility } from 'react-icons/md'
import blogService from '../services/blogService'
import toast from 'react-hot-toast'
import 'react-quill/dist/quill.snow.css'

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!!id)
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categories: [],
    tags: [],
    featureImage: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      canonical: '',
    },
  })

  useEffect(() => {
    if (id) fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlogById(id)
      if (response && response.data) {
        setFormData(prev => ({
          ...prev,
          ...response.data,
          seo: { ...prev.seo, ...(response.data.seo || {}) },
          tags: response.data.tags || [],
          categories: response.data.categories || [],
        }))
      }
    } catch (error) {
      toast.error('Failed to fetch blog')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSEOChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [name]: value }
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const toastId = toast.loading('Uploading image...')
    try {
      const response = await blogService.uploadImage(file)
      if (response && response.data && response.data.url) {
        setFormData(prev => ({ ...prev, featureImage: response.data.url }))
        toast.success('Image uploaded successfully', { id: toastId })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image', { id: toastId })
    }
  }

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let savedBlog = null
      if (id) {
        const response = await blogService.updateBlog(id, formData)
        savedBlog = response.data
        toast.success('Blog updated successfully')
      } else {
        const response = await blogService.createBlog(formData)
        savedBlog = response.data
        toast.success('Blog created successfully')
      }

      if (publish && savedBlog) {
        await blogService.publishBlog(id || savedBlog._id)
        toast.success('Blog published successfully')
      }

      navigate('/blogs')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save blog')
    } finally {
      setSubmitting(false)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
  }

  const slug = generateSlug(formData.title)
  const metaTitleLength = formData.seo.metaTitle.length
  const metaDescLength = formData.seo.metaDescription.length
  const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-white text-xl">Loading article...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {showPreview ? 'Article Preview' : id ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {showPreview ? 'See how your article will look when published' : 'Write, optimize, and publish your content'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                showPreview
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-white'
              }`}
            >
              <MdVisibility size={18} />
              {showPreview ? 'Back to Editor' : 'Preview'}
            </button>
            <button
              onClick={() => navigate('/blogs')}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {showPreview ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <style>{`
              .preview-content h1 { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #ffffff; line-height: 1.2; }
              .preview-content h2 { font-size: 1.75rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.75rem; color: #f8fafc; line-height: 1.3; }
              .preview-content h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #f1f5f9; }
              .preview-content p { margin-bottom: 1.25rem; color: #cbd5e1; line-height: 1.8; font-size: 1.125rem; }
              .preview-content ul { list-style-type: disc; padding-left: 1.75rem; margin-bottom: 1.25rem; color: #cbd5e1; }
              .preview-content ol { list-style-type: decimal; padding-left: 1.75rem; margin-bottom: 1.25rem; color: #cbd5e1; }
              .preview-content li { margin-bottom: 0.5rem; line-height: 1.7; font-size: 1.125rem; }
              .preview-content blockquote { border-left: 4px solid #3b82f6; padding-left: 1.25rem; font-style: italic; color: #94a3b8; margin: 1.5rem 0; background: rgba(59, 130, 246, 0.05); padding-top: 0.5rem; padding-bottom: 0.5rem; border-radius: 0 0.5rem 0.5rem 0; }
              .preview-content a { color: #60a5fa; text-decoration: underline; transition: color 0.2s; }
              .preview-content a:hover { color: #93c5fd; }
              .preview-content pre { background-color: #0f172a; border: 1px solid rgba(255,255,255,0.1); padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.95rem; margin: 1.5rem 0; color: #e2e8f0; }
              .preview-content code { background-color: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.9em; color: #f43f5e; }
              .preview-content pre code { background-color: transparent; padding: 0; border-radius: 0; font-size: inherit; color: inherit; }
              .preview-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; }
            `}</style>
            
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-8 animate-fadeIn">
              {/* Header Meta */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.categories.length > 0 ? (
                    formData.categories.map((cat, idx) => (
                      <span key={idx} className="px-3.5 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="px-3.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                      Uncategorized
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {formData.title || 'Untitled Post'}
                </h1>
                
                {formData.excerpt && (
                  <p className="text-xl text-slate-300 font-medium italic border-l-4 border-blue-500 pl-4 py-1 leading-relaxed">
                    {formData.excerpt}
                  </p>
                )}
                
                {/* Author Info */}
                <div className="flex flex-wrap items-center gap-4 py-5 border-y border-slate-800 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                      YA
                    </div>
                    <span className="font-semibold text-slate-300">You (Author)</span>
                  </div>
                  <span className="hidden sm:inline text-slate-700">•</span>
                  <span>{wordCount} words</span>
                  <span className="hidden sm:inline text-slate-700">•</span>
                  <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                </div>
              </div>

              {/* Feature Image */}
              {formData.featureImage ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-850">
                  <img src={formData.featureImage} alt={formData.title} className="w-full object-cover max-h-[480px]" />
                </div>
              ) : (
                <div className="rounded-2xl py-16 text-center bg-slate-800/20 border border-dashed border-slate-700/60 text-slate-500 text-lg flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl">🖼️</span>
                  <span>No feature image uploaded yet</span>
                </div>
              )}

              {/* Main Content */}
              <div className="preview-content pt-4">
                {formData.content ? (
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                ) : (
                  <p className="text-slate-500 italic text-center py-8">Write some content in the editor to see it here...</p>
                )}
              </div>

              {/* Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-800">
                  {formData.tags.map((tag, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 bg-slate-800/80 border border-slate-700/50 text-slate-300 text-sm rounded-xl hover:bg-slate-700 transition">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Action Floating Bar */}
            <div className="bg-slate-900/90 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="text-slate-400 text-sm text-center sm:text-left">
                <span className="text-emerald-400 font-semibold mr-1">✓ Preview Mode</span>
                Is this post ready to go live?
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition text-sm border border-slate-700"
                >
                  Back to Edit
                </button>
                <button
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={submitting}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition text-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={submitting}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-medium transition text-sm disabled:opacity-50 shadow-lg shadow-emerald-950/40"
                >
                  {submitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Editor (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                <label className="block text-sm font-semibold text-white mb-2">Article Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <p className="text-xs text-slate-400 mt-2">Slug: <span className="text-blue-400 font-mono">{slug || 'auto-generated'}</span></p>
              </div>

              {/* Excerpt */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                <label className="block text-sm font-semibold text-white mb-2">Excerpt</label>
                <div className="relative">
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Write a compelling summary (120-160 characters)..."
                    rows="3"
                    maxLength="160"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                  <p className={`text-xs mt-2 ${formData.excerpt.length > 160 ? 'text-red-400' : 'text-slate-400'}`}>
                    {formData.excerpt.length}/160 characters
                  </p>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                <label className="block text-sm font-semibold text-white mb-3">Article Content</label>
                <ReactQuill
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['blockquote', 'code-block'],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                  className="bg-slate-900 text-white rounded-lg"
                />
                <p className="text-xs text-slate-400 mt-3">📊 {wordCount} words</p>
              </div>

              {/* Tags & Categories */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-2">Tags</label>
                  <input
                    type="text"
                    placeholder="seo, javascript, react"
                    value={formData.tags.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <p className="text-xs text-slate-400 mt-2">{formData.tags.length} tags</p>
                </div>
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-2">Categories</label>
                  <input
                    type="text"
                    placeholder="Web Dev, SEO"
                    value={formData.categories.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, categories: e.target.value.split(',').map(c => c.trim()).filter(c => c) }))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <p className="text-xs text-slate-400 mt-2">{formData.categories.length} categories</p>
                </div>
              </div>
            </div>

            {/* Right Column - SEO Sidebar (1/3) */}
            <div className="lg:col-span-1">
              {/* Sticky Container */}
              <div className="sticky top-32 space-y-6">
                {/* Feature Image Upload */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-3">Feature Image</label>
                  {formData.featureImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-600/30 mb-4 bg-slate-800">
                      <img src={formData.featureImage} alt="Feature preview" className="w-full h-40 object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featureImage: '' }))}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition shadow flex items-center justify-center w-8 h-8"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-600/50 hover:border-blue-500 rounded-lg p-6 text-center cursor-pointer transition relative group mb-4 bg-slate-800/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-4xl mb-2 text-slate-500 group-hover:text-blue-500 transition">🖼️</div>
                      <p className="text-sm font-medium text-slate-300">Click to Upload Image</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    type="text"
                    name="featureImage"
                    value={formData.featureImage}
                    onChange={handleChange}
                    placeholder="Or paste an image URL..."
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                  />
                </div>

                {/* SEO Preview Card */}
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-400/20 border border-blue-500/30 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <MdSearch size={18} />
                    Google Preview
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                    <p className="text-blue-400 font-semibold">{formData.seo.metaTitle || 'Your page title'}</p>
                    <p className="text-green-400 font-mono text-xs">{slug || 'your-url'}</p>
                    <p className="text-slate-300 line-clamp-2">{formData.seo.metaDescription || 'Your meta description will appear here'}</p>
                  </div>
                </div>

                {/* Meta Title */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-2">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.seo.metaTitle}
                    onChange={handleSEOChange}
                    placeholder="60 characters max"
                    maxLength="60"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <div className="flex justify-between mt-2">
                    <p className={`text-xs ${metaTitleLength > 60 ? 'text-red-400' : metaTitleLength > 50 ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {metaTitleLength}/60 characters
                    </p>
                    <span className={metaTitleLength >= 50 && metaTitleLength <= 60 ? 'text-green-400' : 'text-slate-400'}>
                      {metaTitleLength >= 50 && metaTitleLength <= 60 ? '✓ Good' : '○ Ideal: 50-60'}
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-2">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={formData.seo.metaDescription}
                    onChange={handleSEOChange}
                    placeholder="150-160 characters"
                    rows="3"
                    maxLength="160"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <p className={`text-xs ${metaDescLength > 160 ? 'text-red-400' : metaDescLength > 150 ? 'text-yellow-400' : 'text-slate-400'}`}>
                      {metaDescLength}/160 characters
                    </p>
                    <span className={metaDescLength >= 150 && metaDescLength <= 160 ? 'text-green-400' : 'text-slate-400'}>
                      {metaDescLength >= 150 && metaDescLength <= 160 ? '✓ Excellent' : '○ Target: 150-160'}
                    </span>
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <label className="block text-sm font-semibold text-white mb-2">Keywords</label>
                  <input
                    type="text"
                    placeholder="keyword, seo, optimization"
                    value={formData.seo.keywords}
                    onChange={handleSEOChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Publishing Actions */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition disabled:opacity-50 animate-pulse-once"
                  >
                    <MdDescription className="inline mr-2" size={18} />
                    {submitting ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-50 shadow-lg shadow-emerald-950/20"
                  >
                    <MdCheckCircle className="inline mr-2" size={18} />
                    {submitting ? 'Publishing...' : 'Publish'}
                  </button>
                </div>

                {/* SEO Score */}
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
                  <h4 className="text-white font-bold mb-3">SEO Score</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>✓ {metaTitleLength > 0 ? '✓' : '○'} Meta title added</p>
                    <p>{metaDescLength > 140 ? '✓' : '○'} Description optimized</p>
                    <p>{wordCount > 300 ? '✓' : '○'} Content quality ({wordCount} words)</p>
                    <p>{formData.tags.length > 0 ? '✓' : '○'} Tags added</p>
                  </div>
                  <div className="mt-4 w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (metaTitleLength > 0 ? 25 : 0) +
                          (metaDescLength > 140 ? 25 : 0) +
                          (wordCount > 300 ? 25 : 0) +
                          (formData.tags.length > 0 ? 25 : 0)
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
