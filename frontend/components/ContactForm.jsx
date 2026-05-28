'use client'

import { useState } from 'react'

/**
 * ContactForm Component (Client Component)
 * Manages submit actions, input values, and success state
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate network latency
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1200)
  }

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-8 rounded-2xl text-center shadow-xl">
        <div className="text-5xl mb-4">✉️</div>
        <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
        <p className="text-slate-300 mb-6">Thank you for reaching out. We will get back to you within 24 hours.</p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition font-medium"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Your full name"
          required
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="What is this regarding?"
          required
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Write your message here..."
          rows="5"
          required
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
      >
        {submitting ? 'Sending Message...' : 'Send Message'}
      </button>
    </form>
  )
}
