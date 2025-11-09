import { Link } from 'react-router-dom'
import { Github, Twitter, Mail } from 'lucide-react'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="bg-emerald-700 text-emerald-50">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <span className="text-lg font-semibold tracking-tight">EcoTrack</span>
          </div>
          <p className="text-sm text-emerald-50/90">
            Track eco habits, join challenges, and grow a greener community.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-emerald-50/90">Quick links</p>
          <nav className="grid gap-1 text-sm">
            <Link to="/about" className="text-emerald-50/90 hover:text-white">About</Link>
            <Link to="/contact" className="text-emerald-50/90 hover:text-white">Contact</Link>
          </nav>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-emerald-50/90">Social</p>
          <div className="flex items-center gap-3 text-emerald-50/90">
            <a href="#" aria-label="GitHub" className="hover:text-white"><Github className="h-5 w-5" /></a>
            <a href="#" aria-label="X (Twitter)" className="hover:text-white"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="Email" className="hover:text-white"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-600/50 py-4">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-emerald-100/80 md:flex-row">
          <span>© {new Date().getFullYear()} EcoTrack</span>
        </div>
      </div>
    </footer>
  )
}


