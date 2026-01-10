import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Menu,
  X,
  Lightbulb,
  LogOut
} from 'lucide-react'
import clsx from 'clsx'
import { Player } from '@lordicon/react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import userIcon from '../assets/lordicon/user.json'
import activityIcon from '../assets/lordicon/activity.json'
import calendarIcon from '../assets/lordicon/calendar.json'
import tipsIcon from '../assets/lordicon/tips.json'
import settingsIcon from '../assets/lordicon/computer.json'
import { showConfirmation } from '../utils/toast.jsx'

/**
 * DashboardLayout - A professional layout for user account pages.
 * Features a glassmorphism sidebar, Lucide outline icons, and responsive design.
 */
export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    {
      to: '/profile',
      label: 'Profile',
      description: 'Your eco-stats & overview',
      lordIcon: userIcon
    },
    {
      to: '/my-activities',
      label: 'My Challenges',
      description: 'Track your challenges',
      lordIcon: activityIcon
    },
    {
      to: '/my-events',
      label: 'My Events',
      description: 'Events you create or join',
      lordIcon: calendarIcon
    },
    {
      to: '/my-tips',
      label: 'My Tips',
      description: 'Manage your eco-tips',
      lordIcon: tipsIcon
    },
    {
      to: '/settings',
      label: 'Settings',
      description: 'Account & preferences',
      lordIcon: settingsIcon
    }
  ]

  const handleLogout = (onDone) => {
    showConfirmation({
      title: 'Log out',
      message: "You're about to log out. You can sign back in anytime.",
      confirmText: 'Log out',
      cancelText: 'Stay',
      type: 'warning',
      onConfirm: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        if (onDone) onDone()
        navigate('/')
      }
    })
  }

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
                className="fixed inset-y-0 left-0 z-50 w-72 bg-surface shadow-2xl md:hidden flex flex-col"
              >
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-heading">Menu</span>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="rounded-full p-2 hover:bg-light transition-colors"
                      aria-label="Close menu"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
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
                        <SidebarLordIcon icon={item.lordIcon} isActive={location.pathname === item.to} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Mobile Footer Actions */}
                <div className="p-6 border-t border-border/50 space-y-3">
                  {/* Logout Button */}
                  <button
                    onClick={() => handleLogout(() => setIsSidebarOpen(false))}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-danger hover:bg-danger/90 transition-all duration-300 border border-danger/30 shadow-sm"
                  >
                    <LogOut size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    <span className="tracking-wide">Logout</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="sticky top-28 hidden h-fit w-72 shrink-0 rounded-2xl border border-border bg-surface/80 backdrop-blur-md md:block relative">
          <div className="relative p-4 overflow-hidden">
            <div className="mb-6 px-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text/40 whitespace-nowrap">Account</h2>
            </div>

            {/* Navigation Items */}
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
                    <SidebarLordIcon
                      icon={item.lordIcon}
                      isActive={isActive}
                      className={clsx(
                        'rounded-lg transition-all duration-300',
                        isActive
                          ? 'bg-primary text-surface shadow-sm shadow-primary/20'
                          : 'bg-light text-text/50 group-hover:bg-primary/10 group-hover:text-primary',
                        isActive ? '-rotate-12' : 'group-hover:-rotate-12'
                      )}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={clsx('text-sm font-semibold transition-colors', isActive ? 'text-primary' : 'text-heading')}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-text/50 transition-colors truncate">{item.description}</span>
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

            {/* Pro Tip - Hidden when collapsed */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 p-4 border border-primary/10"
            >
              <div className="flex items-center gap-2 text-primary/80">
                <Lightbulb size={14} strokeWidth={2.5} />
                <p className="text-xs font-bold uppercase tracking-wider">Pro Tip</p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-text/60">
                Complete weekly challenges to level up your eco-rank faster!
              </p>
            </motion.div>

            {/* Logout Button */}
            <div className="mt-6 pt-4 border-t border-danger/10">
              <button
                onClick={() => handleLogout()}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-white bg-danger hover:bg-danger/90 transition-all duration-300 border border-danger/30 shadow-sm"
              >
                <div className="flex items-center justify-center">
                  <LogOut size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
                <span className="tracking-wide">Logout</span>
              </button>
            </div>
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

function SidebarLordIcon({ icon, isActive, className }) {
  const playerRef = useRef(null)

  useEffect(() => {
    playerRef.current?.goToFirstFrame()
  }, [icon])

  const handleMouseEnter = () => {
    playerRef.current?.playFromBeginning()
  }

  const handleMouseLeave = () => {
    playerRef.current?.goToFirstFrame()
  }

  return (
    <div
      className={clsx('flex h-10 w-10 items-center justify-center', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Player
        ref={playerRef}
        icon={icon}
        size={22}
        colorize={isActive ? '#ffffff' : '#10b981'}
      />
    </div>
  )
}
