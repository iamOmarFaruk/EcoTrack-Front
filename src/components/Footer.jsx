import { Link } from 'react-router-dom'
import { SiGithub, SiX } from 'react-icons/si'
import { RiMailLine } from 'react-icons/ri'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="bg-emerald-700 text-emerald-50">
      <div className="container grid gap-8 py-8 sm:py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="text-base sm:text-lg font-semibold tracking-tight">EcoTrack</span>
          </div>
          <p className="text-sm text-emerald-50/90">
            Track eco habits, join challenges, and grow a greener community.
          </p>
          <div className="flex items-center gap-3 text-emerald-50/90">
            <a href="#" aria-label="GitHub" className="hover:text-white transition-colors"><SiGithub size={18} /></a>
            <a href="#" aria-label="X" className="hover:text-white transition-colors"><SiX size={18} /></a>
            <a href="#" aria-label="Email" className="hover:text-white transition-colors"><RiMailLine size={18} /></a>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-bold text-emerald-50/90">Quick links</p>
          <nav className="grid gap-1 text-sm">
            <Link to="/" className="text-emerald-50/90 hover:text-white hover:underline underline-offset-4 transition-colors">Home</Link>
            <Link to="/challenges" className="text-emerald-50/90 hover:text-white hover:underline underline-offset-4 transition-colors">Challenges</Link>
            <Link to="/tips" className="text-emerald-50/90 hover:text-white hover:underline underline-offset-4 transition-colors">Tips</Link>
            <Link to="/events" className="text-emerald-50/90 hover:text-white hover:underline underline-offset-4 transition-colors">Events</Link>
            <Link to="/about" className="text-emerald-50/90 hover:text-white hover:underline underline-offset-4 transition-colors">About</Link>
            <Link to="/contact" className="text-emerald-50/90 hover:text-white hover:underline underline-offset-4 transition-colors">Contact</Link>
          </nav>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-bold text-emerald-50/90">Legal notice</p>
          <div className="text-xs sm:text-sm text-emerald-50/90">
            <p>We use essential session cookies to operate EcoTrack. Consent resets when you close your browser. No personal data is stored or sold.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-600/50 py-4">
        <div className="container flex items-center justify-center text-xs text-emerald-100/80">
          <span className="text-center">© {new Date().getFullYear()} EcoTrack</span>
        </div>
      </div>
    </footer>
  )
}


