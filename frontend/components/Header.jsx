'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MdMenu, MdClose, MdSearch } from 'react-icons/md'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold text-blue-600">
            Blog Platform
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/blog" className="hover:text-blue-600 transition">Blog</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
            <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-600 hover:text-blue-600">
              <MdSearch size={24} />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600"
          >
            {menuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden mt-4 space-y-4 pb-4 border-t pt-4">
            <Link href="/" className="block hover:text-blue-600">Home</Link>
            <Link href="/blog" className="block hover:text-blue-600">Blog</Link>
            <Link href="/about" className="block hover:text-blue-600">About</Link>
            <Link href="/contact" className="block hover:text-blue-600">Contact</Link>
          </nav>
        )}

        {/* Search Bar */}
        {searchOpen && (
          <div className="mt-4 border-t pt-4">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}
      </div>
    </header>
  )
}
