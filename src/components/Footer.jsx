import { Link } from 'react-router-dom'
import { Github, Twitter, Mail } from 'lucide-react'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container grid gap-6 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-semibold">EcoTrack</span>
          </div>
          <p className="text-sm text-slate-900">
            Track eco habits, join challenges, and grow a greener community.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Quick Links</p>
          <nav className="grid gap-1 text-sm">
            <Link to="/about" className="text-slate-900 hover:text-emerald-700">About</Link>
            <Link to="/contact" className="text-slate-900 hover:text-emerald-700">Contact</Link>
            <Link to="/challenges" className="text-slate-900 hover:text-emerald-700">Challenges</Link>
          </nav>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Follow</p>
          <div className="flex items-center gap-3 text-slate-900">
            <a href="#" aria-label="GitHub" className="hover:text-emerald-700"><Github className="h-5 w-5" /></a>
            <a href="#" aria-label="X (Twitter)" className="hover:text-emerald-700"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="Email" className="hover:text-emerald-700"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t py-4">
        <div className="container text-center text-xs text-slate-500">
          © 2025 EcoTrack
        </div>
      </div>
    </footer>
  )
}


