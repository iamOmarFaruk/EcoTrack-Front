import { Outlet, NavLink } from 'react-router-dom'
import { Suspense, useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  Users,
  Wand2,
  ActivitySquare,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Settings
} from 'lucide-react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

const navItems = [
  { to: '/control-panel/dashboard', label: 'Overview', icon: LayoutDashboard, description: 'Stats & charts' },
  { to: '/control-panel/content', label: 'Content', icon: Wand2, description: 'Testimonials & footer' },
  { to: '/control-panel/moderation', label: 'Publishing', icon: FileText, description: 'Publish / Unpublish' },
  { to: '/control-panel/users', label: 'Users', icon: Users, description: 'Accounts & roles' },
  { to: '/control-panel/activity', label: 'Activity', icon: ActivitySquare, description: 'Audit trail' }
]

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-light dark:bg-dark text-text transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={clsx(
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-surface dark:bg-surface/95 px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-text/50">EcoTrack</p>
                <p className="text-lg font-semibold text-heading">Control Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text/60 hover:text-text">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => clsx(
                  'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-text/70 hover:bg-muted hover:text-heading'
                )}
              >
                <div className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-all',
                  ({ isActive }) => isActive ? 'bg-white/20' : 'bg-muted group-hover:bg-white/50 dark:group-hover:bg-white/10'
                )}>
                  <item.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{item.label}</span>
                  <span className={clsx(
                    "text-[11px] uppercase tracking-wide",
                    ({ isActive }) => isActive ? "text-white/70" : "text-text/40"
                  )}>{item.description}</span>
                </div>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Settings size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-heading">Security Mode</p>
                <p className="text-xs text-text/50">Routes behind admin token</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-surface/80 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden rounded-lg border border-border bg-surface p-2 text-text/80"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-primary font-bold">Admin</p>
                <h1 className="text-xl md:text-2xl font-bold leading-tight text-heading">Full Control Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />

              <div className="h-8 w-px bg-border hidden sm:block"></div>

              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-heading">{admin?.name || 'Administrator'}</p>
                <p className="text-xs text-text/50">{admin?.email}</p>
              </div>
              <Button variant="ghost" onClick={logout} className="flex items-center gap-2 text-danger hover:bg-danger/10 hover:text-danger">
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-muted/30 px-4 py-6 sm:px-8">
            <div className="mx-auto max-w-7xl">
              <Suspense fallback={<EcoLoader />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
