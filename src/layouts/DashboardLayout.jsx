import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { to: '/my-activities', label: 'My Activities' },
    { to: '/events/my-events', label: 'My Events' },
    { to: '/profile', label: 'Profile' },
    { to: '/settings', label: 'Settings' }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex flex-1 gap-6 py-4 pt-20 md:py-8 md:pt-24">
        {/* Mobile Navigation Toggle */}
        <div className="mb-4 md:hidden">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex w-full items-center justify-between rounded-lg border bg-white p-3 text-sm font-medium shadow-sm"
          >
            <span>Dashboard Menu</span>
            <svg
              className={clsx('h-4 w-4 transition-transform', mobileNavOpen && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={clsx(
            'mt-2 overflow-hidden transition-all duration-300 ease-in-out',
            mobileNavOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          )}>
            <nav className="grid gap-1 rounded-lg border bg-white p-2 text-sm shadow-sm">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  className={clsx(
                    'rounded-md px-3 py-2 transition-colors',
                    location.pathname === item.to
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                  to={item.to}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden w-60 shrink-0 rounded-lg border p-4 md:block">
          <nav className="grid gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.to}
                className={clsx(
                  'rounded-md px-3 py-2 transition-colors',
                  location.pathname === item.to
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'hover:bg-slate-50 text-slate-700'
                )}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}


