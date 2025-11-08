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
  const [isHidden, setIsHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY || 0

    const handleScroll = () => {
      const currentY = window.scrollY || 0
      setIsScrolled(currentY > 2)

      const scrollingDown = currentY > lastScrollYRef.current
      const shouldHide = scrollingDown && currentY > 80
      setIsHidden(shouldHide && !open)

      lastScrollYRef.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [open])

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 w-full border-b backdrop-blur transition-transform duration-300 ease-out',
        isScrolled ? 'bg-white/80 shadow-sm' : 'bg-white/60',
        isHidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div
        className={clsx(
          'container flex items-center justify-between transition-all duration-300',
          isScrolled ? 'h-14' : 'h-16'
        )}
      >
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-semibold text-slate-900">EcoTrack</span>
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
            <div className="flex items-center gap-3">
              <Link to="/my-activities" className="text-sm text-slate-900 hover:text-emerald-800">My Activities</Link>
              <button onClick={logout} className="rounded-md border px-3 py-1.5 text-sm text-slate-900 hover:bg-slate-50">Logout</button>
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
                  to="/my-activities"
                  onClick={() => setOpen(false)}
                  className={clsx('rounded-md px-3 py-2 text-sm text-slate-900 hover:bg-emerald-50 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50}ms` }}
                >
                  My Activities
                </Link>
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className={clsx('rounded-md px-3 py-2 text-left text-sm text-slate-900 hover:bg-emerald-50 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 50}ms` }}
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


