import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Our Support & Sales Team | Blog Platform',
  description: 'Reach out to the Blog Platform support team. Get in touch with our authors, editors, and technical staff. We respond within 24 hours.',
}

/**
 * ContactPage Component (Server Component)
 * Provides static contact info and renders the interactive client-side ContactForm
 */
export default function ContactPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-24 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 inline-block">
            📬 We are here to help
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent mb-4">
            Contact Our Team
          </h1>
          <p className="text-slate-400 text-lg">
            Have a question about roles, sitemaps, or publishing? Send us a message and we'll reply shortly.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-start">
          {/* Left Column - Contact Form (7/12) */}
          <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur shadow-2xl">
            <ContactForm />
          </div>

          {/* Right Column - Info (5/12) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur shadow-xl">
              <h3 className="text-lg font-bold text-white mb-3">📍 Address Info</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                123 Advanced Agentic Coding Avenue,<br />
                Silicon Valley, CA 94043
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur shadow-xl">
              <h3 className="text-lg font-bold text-white mb-3">📧 Email & Phone</h3>
              <div className="text-slate-400 text-sm space-y-2">
                <p>Support: <a href="mailto:support@blogplatform.com" className="text-blue-400 hover:underline">support@blogplatform.com</a></p>
                <p>Media: <a href="mailto:press@blogplatform.com" className="text-blue-400 hover:underline">press@blogplatform.com</a></p>
                <p>Phone: +1 (555) 019-2834</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-6 backdrop-blur shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2">⚡ Quick Note</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                If you are a writer looking for editor permissions, please verify your email in the Admin Panel or contact your Super Admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
