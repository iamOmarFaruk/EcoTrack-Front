import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Activity,
  Calendar,
  Settings as SettingsIcon,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import clsx from 'clsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import EcoLoader from '../components/EcoLoader.jsx'

/**
 * DashboardLayout - A professional layout for user account pages.
 * Features a glassmorphism sidebar, Lucide outline icons, and responsive design.
 */
export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    {
      to: '/profile',
      label: 'Profile',
      icon: User,
      description: 'Your eco-stats & overview'
    },
    {
      to: '/my-activities',
      label: 'My Activities',
      icon: Activity,
      description: 'Track your challenges'
    },
    {
      to: '/events/my-events',
      label: 'My Events',
      icon: Calendar,
      description: 'Events you create or join'
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: SettingsIcon,
      description: 'Account & preferences'
    }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-light/30 dark:bg-dark/50">
      <Navbar />

      <div className="container mx-auto flex flex-1 gap-8 py-8 pt-24 md:pt-28">

        {/* Mobile Navigation Toggle - Floating Style */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-surface shadow-lg transition-transform active:scale-90 md:hidden"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm md:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-surface p-6 shadow-2xl md:hidden"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xl font-bold text-heading">Menu</span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="rounded-full p-2 hover:bg-light"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsSidebarOpen(false)}
                      className={clsx(
                        'flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200',
                        location.pathname === item.to
                          ? 'bg-primary text-surface shadow-md shadow-primary/20'
                          : 'text-text hover:bg-light'
                      )}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar - Left Aligned & Refined */}
        <aside className="sticky top-28 hidden h-fit w-64 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-md md:block lg:w-72">
          <div className="mb-6 px-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text/40">Account</h2>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={clsx(
                    'group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text/70 hover:bg-light hover:text-text'
                  )}
                >
                  <div className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-lg transition-colors group-hover:bg-primary/10',
                    isActive ? 'bg-primary text-surface' : 'bg-light text-text/50 group-hover:text-primary'
                  )}>
                    <item.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className={clsx('text-sm font-semibold', isActive ? 'text-primary' : 'text-heading')}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-text/50">{item.description}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute right-3 text-primary"
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 p-4 border border-primary/10">
            <p className="text-xs font-medium text-primary/80">Pro Tip</p>
            <p className="mt-1 text-[11px] leading-relaxed text-text/60">
              Complete weekly challenges to level up your eco-rank faster!
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1">
          <Suspense fallback={<EcoLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  )
}


