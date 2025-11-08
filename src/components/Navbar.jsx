import { Link, NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/tips', label: 'Tips' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { auth, logout } = useAuth()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500" />
          <span className="text-lg font-semibold">EcoTrack</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium transition-colors hover:text-emerald-600',
                  isActive ? 'text-emerald-700' : 'text-slate-600'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!auth.isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm text-slate-700 hover:text-emerald-700">Login</Link>
              <Link to="/register" className="text-sm text-slate-700 hover:text-emerald-700">Register</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/my-activities" className="text-sm text-slate-700 hover:text-emerald-700">My Activities</Link>
              <button onClick={logout} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">Logout</button>
            </div>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div
        className={clsx(
          'border-b md:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="container grid gap-2 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-50',
                  isActive ? 'text-emerald-700' : 'text-slate-700'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 grid gap-1">
            {!auth.isLoggedIn ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-emerald-50">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-emerald-50">Register</Link>
              </>
            ) : (
              <>
                <Link to="/my-activities" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-emerald-50">My Activities</Link>
                <button onClick={() => { logout(); setOpen(false) }} className="rounded-md px-3 py-2 text-left text-sm hover:bg-emerald-50">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


