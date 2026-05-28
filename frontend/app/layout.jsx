import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '../styles/globals.css'

export const metadata = {
  title: 'Blog Platform - Your Source for Quality Content',
  description: 'Read quality blog posts on various topics including technology, lifestyle, and more.',
  keywords: 'blog, articles, technology, lifestyle',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
