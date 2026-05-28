import Link from 'next/link'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Blog Platform</h3>
            <p className="text-gray-400">
              Your source for quality content and insights. Read, learn, and grow with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-400">
              <Link href="/" className="block hover:text-white transition">Home</Link>
              <Link href="/blog" className="block hover:text-white transition">Blog</Link>
              <Link href="/about" className="block hover:text-white transition">About</Link>
              <Link href="/contact" className="block hover:text-white transition">Contact</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <div className="space-y-2 text-gray-400">
              <Link href="/category/technology" className="block hover:text-white transition">Technology</Link>
              <Link href="/category/lifestyle" className="block hover:text-white transition">Lifestyle</Link>
              <Link href="/category/business" className="block hover:text-white transition">Business</Link>
              <Link href="/category/travel" className="block hover:text-white transition">Travel</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <MdEmail size={18} />
                <a href="mailto:contact@blogplatform.com" className="hover:text-white transition">
                  contact@blogplatform.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MdPhone size={18} />
                <a href="tel:+1234567890" className="hover:text-white transition">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MdLocationOn size={18} />
                <span>123 Blog Street, City, State</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 py-8">
          {/* Social Links */}
          <div className="text-center mb-6">
            <div className="flex justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-400">
            <p>&copy; {currentYear} Blog Platform. All rights reserved.</p>
            <div className="mt-4 space-x-6 text-sm">
              <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
