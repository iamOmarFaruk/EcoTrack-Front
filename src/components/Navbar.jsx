import { Link, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'
import Button from './ui/Button.jsx'

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
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const userName = auth.user?.name || 'Eco User'
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Simple scroll handler
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 80) {
        // Always show at top
        setShow(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setShow(false)
      } else {
        // Scrolling up - show
        setShow(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setProfileOpen(false)
    }
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 w-full border-b bg-white/95 shadow-sm backdrop-blur transition-transform duration-300',
        show ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="text-base sm:text-lg font-semibold text-slate-900">EcoTrack</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-bold transition-colors hover:text-emerald-700 link-underline-sweep',
                  isActive ? 'text-emerald-800 link-underline-sweep--active' : 'text-slate-900'
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
              <Link to="/login" className="text-sm text-slate-900 hover:text-emerald-800">Login</Link>
              <Button as={Link} to="/register">Register</Button>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className={clsx(
                  'flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors hover:bg-slate-50',
                  profileOpen && 'bg-slate-50'
                )}
              >
                {auth.user?.avatarUrl ? (
                  <img
                    src={auth.user.avatarUrl}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold uppercase text-white">
                    {userInitials}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-900">{userName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={clsx('h-4 w-4 text-slate-500 transition-transform', profileOpen && 'rotate-180')}
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.955a.75.75 0 111.08 1.04l-4.243 4.52a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border bg-white py-1 shadow-lg"
                >
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-900 hover:bg-emerald-50"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-activities"
                    onClick={() => setProfileOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-900 hover:bg-emerald-50"
                    role="menuitem"
                  >
                    My Activities
                  </Link>
                  <button
                    onClick={() => { logout(); setProfileOpen(false) }}
                    className="block w-full px-3 py-2 text-left text-sm text-slate-900 hover:bg-emerald-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <div className="relative h-5 w-5" aria-hidden="true">
            <span
              className={clsx(
                'absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded bg-slate-900 transition-transform duration-300 ease-out',
                open ? 'translate-y-0 rotate-45' : '-translate-y-2 rotate-0'
              )}
            />
            <span
              className={clsx(
                'absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded bg-slate-900 transition-all duration-300 ease-out',
                open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              )}
            />
            <span
              className={clsx(
                'absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded bg-slate-900 transition-transform duration-300 ease-out',
                open ? 'translate-y-0 -rotate-45' : 'translate-y-2 rotate-0'
              )}
            />
          </div>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={clsx(
          'border-b md:hidden mobile-menu',
          open ? 'mobile-menu--open' : 'mobile-menu--closed'
        )}
      >
        <div className="container grid gap-2 py-3">
          {navItems.map((item, idx) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-emerald-50 mobile-menu-item',
                  open && 'mobile-menu-item--open',
                  isActive ? 'text-emerald-800' : 'text-slate-900'
                )
              }
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 grid gap-1">
            {!auth.isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={clsx('rounded-md px-3 py-2 text-sm text-slate-900 hover:bg-emerald-50 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50}ms` }}
                >
                  Login
                </Link>
                <Button
                  as={Link}
                  to="/register"
                  onClick={() => setOpen(false)}
                  className={clsx('w-full mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 50}ms` }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={clsx('rounded-md px-3 py-2 text-sm text-slate-900 hover:bg-emerald-50 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50}ms` }}
                >
                  Profile
                </Link>
                <Link
                  to="/my-activities"
                  onClick={() => setOpen(false)}
                  className={clsx('rounded-md px-3 py-2 text-sm text-slate-900 hover:bg-emerald-50 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 50}ms` }}
                >
                  My Activities
                </Link>
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className={clsx('rounded-md px-3 py-2 text-left text-sm text-slate-900 hover:bg-emerald-50 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 100}ms` }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


