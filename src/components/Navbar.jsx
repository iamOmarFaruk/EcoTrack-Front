
import { Link, NavLink } from 'react-router-dom'
import { User, Activity, Calendar, Settings as SettingsIcon, LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import Logo from './Logo.jsx'
import Button from './ui/Button.jsx'
import ProfileAvatar from './ProfileAvatar.jsx'

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
  const { auth, logout, loading } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const userName = auth.user?.name || 'Eco User'

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        'fixed top-0 left-0 right-0 z-40 w-full border-b bg-surface/95 shadow-sm backdrop-blur transition-all duration-300'
      )}
    >
      <div
        className={clsx(
          'container flex items-center justify-between transition-all duration-300',
          isScrolled ? 'h-16' : 'h-20'
        )}
      >
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className={clsx('font-heading font-bold text-heading', isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl')}>
            EcoTrack
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'text-base font-heading font-semibold transition-colors hover:text-primary link-underline-sweep',
                  isActive ? 'text-primary link-underline-sweep--active' : 'text-heading'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : !auth.isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm text-heading hover:text-primary">Login</Link>
              <Button as={Link} to="/register">Register</Button>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className={clsx(
                  'flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors hover:bg-light',
                  profileOpen && 'bg-light'
                )}
              >
                <ProfileAvatar user={auth.user} size="md" />
                <span className="text-sm font-medium text-heading">{userName}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={clsx('h-4 w-4 text-text/70 transition-transform', profileOpen && 'rotate-180')}
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.187l3.71-3.955a.75.75 0 111.08 1.04l-4.243 4.52a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border bg-surface py-1 shadow-lg"
                >
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-heading transition-colors hover:bg-primary/10"
                    role="menuitem"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/my-activities"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-heading transition-colors hover:bg-primary/10"
                    role="menuitem"
                  >
                    <Activity className="h-4 w-4" />
                    <span>My Activities</span>
                  </Link>
                  <Link
                    to="/my-events"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-heading transition-colors hover:bg-primary/10"
                    role="menuitem"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>My Events</span>
                  </Link>
                  <hr className="my-1 border-border" />
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-heading transition-colors hover:bg-primary/10"
                    role="menuitem"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <div className="mt-1 border-t border-border p-1">
                    <button
                      onClick={() => {
                        logout()
                        setProfileOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-md bg-danger/5 px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => {
              if (theme === 'light') setTheme('dark')
              else if (theme === 'dark') setTheme('system')
              else setTheme('light')
            }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-heading transition-colors hover:bg-light hover:text-primary dark:hover:bg-primary/20"
            title={`Current theme: ${theme}`}
          >
            {theme === 'light' && <Sun className="h-4 w-4" />}
            {theme === 'dark' && <Moon className="h-4 w-4" />}
            {theme === 'system' && <Monitor className="h-4 w-4" />}
          </button>
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
                'absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded bg-heading transition-transform duration-300 ease-out',
                open ? 'translate-y-0 rotate-45' : '-translate-y-2 rotate-0'
              )}
            />
            <span
              className={clsx(
                'absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded bg-heading transition-all duration-300 ease-out',
                open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              )}
            />
            <span
              className={clsx(
                'absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded bg-heading transition-transform duration-300 ease-out',
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
                  'rounded-md px-3 py-2 text-base font-heading font-semibold transition-colors hover:bg-primary/10 mobile-menu-item',
                  open && 'mobile-menu-item--open',
                  isActive ? 'text-primary' : 'text-heading'
                )
              }
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 grid gap-1">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="text-sm text-text/80">Loading...</span>
              </div>
            ) : !auth.isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={clsx('rounded-md px-3 py-2 text-sm text-heading hover:bg-primary/10 mobile-menu-item', open && 'mobile-menu-item--open')}
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
                  className={clsx('flex items-center gap-2 rounded-md px-3 py-2 text-sm text-heading hover:bg-primary/10 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50}ms` }}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/my-activities"
                  onClick={() => setOpen(false)}
                  className={clsx('flex items-center gap-2 rounded-md px-3 py-2 text-sm text-heading hover:bg-primary/10 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 50}ms` }}
                >
                  <Activity className="h-4 w-4" />
                  <span>My Activities</span>
                </Link>
                <Link
                  to="/my-events"
                  onClick={() => setOpen(false)}
                  className={clsx('flex items-center gap-2 rounded-md px-3 py-2 text-sm text-heading hover:bg-primary/10 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 100}ms` }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>My Events</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className={clsx('flex items-center gap-2 rounded-md px-3 py-2 text-sm text-heading hover:bg-primary/10 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 150}ms` }}
                >
                  <SettingsIcon className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <div
                  className={clsx('mt-2 border-t border-border p-1 mobile-menu-item', open && 'mobile-menu-item--open')}
                  style={{ transitionDelay: `${navItems.length * 50 + 200}ms` }}
                >
                  <button
                    onClick={() => { logout(); setOpen(false) }}
                    className="flex w-full items-center gap-2 rounded-md bg-danger/5 px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
            <div
              className={clsx('mt-2 border-t border-border p-2 flex justify-center mobile-menu-item', open && 'mobile-menu-item--open')}
              style={{ transitionDelay: `${navItems.length * 50 + 250}ms` }}
            >
              <button
                onClick={() => {
                  if (theme === 'light') setTheme('dark')
                  else if (theme === 'dark') setTheme('system')
                  else setTheme('light')
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white dark:bg-black/20 border border-border text-heading shadow-sm"
              >
                {theme === 'light' && <><Sun className="h-4 w-4" /> Light Mode</>}
                {theme === 'dark' && <><Moon className="h-4 w-4" /> Dark Mode</>}
                {theme === 'system' && <><Monitor className="h-4 w-4" /> System</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
