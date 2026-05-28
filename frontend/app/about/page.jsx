import Link from 'next/link'

export const metadata = {
  title: 'About Our Mission & Team | Blog Platform',
  description: 'Learn about our passion for content creation, expert software engineering guides, and search engine optimization insights.',
}

/**
 * AboutPage Component (Server Component)
 * Provides statically compiled about information with meta configurations
 */
export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-24 selection:bg-blue-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
          About Blog Platform
        </h1>

        <div className="space-y-12">
          {/* Our Mission */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Our Mission</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Blog Platform is a high-performance content engine built to share quality insights, guides, and engineering tutorials from talented authors globally. We believe in high readability, lightning-fast rendering speeds, and pristine search engine optimization.
            </p>
          </section>

          {/* What We Offer */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-4 text-slate-300 text-lg">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-2xl">✓</span>
                <span>High-Quality Engineering Posts</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-2xl">✓</span>
                <span>Expert Schema (JSON-LD) injection</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-2xl">✓</span>
                <span>Role-Based Access Control</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-2xl">✓</span>
                <span>Optimized Table of Contents</span>
              </div>
            </div>
          </section>

          {/* Our Developer Culture */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Our Developer Culture</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              We care deeply about clean code, scalable service layers, automated sitemaps, and elegant responsive design systems. Our software stack includes Next.js App Router, Express controllers, and MongoDB models.
            </p>
          </section>

          {/* Contact CTA */}
          <section className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-3xl p-8 backdrop-blur shadow-xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Get In Touch</h2>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              Have questions, collaboration proposals, or feedback? We'd love to connect with you!
            </p>
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg transition duration-200 inline-block"
            >
              Contact Our Team
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
