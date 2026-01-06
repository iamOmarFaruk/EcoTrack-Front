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
  Settings,
  Trophy,
  Calendar,
  Lightbulb,
  MessageSquare,
  Layers,
  Search
} from 'lucide-react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

const navItems = [
  { to: '/control-panel/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & Stats' },
  { to: '/control-panel/challenges', label: 'Challenges', icon: Trophy, description: 'Manage challenges' },
  { to: '/control-panel/events', label: 'Events', icon: Calendar, description: 'Manage events' },
  { to: '/control-panel/tips', label: 'Tips', icon: Lightbulb, description: 'Manage tips' },
  { to: '/control-panel/testimonials', label: 'Testimonials', icon: MessageSquare, description: 'User reviews' },
  { to: '/control-panel/how-it-works', label: 'Platform Flow', icon: Wand2, description: 'Process steps' },
  { to: '/control-panel/footer', label: 'Footer Section', icon: Layers, description: 'Links & Socials' },
  { to: '/control-panel/users', label: 'Users', icon: Users, description: 'Accounts & roles' },
  { to: '/control-panel/activity', label: 'Activity', icon: ActivitySquare, description: 'Audit trail' }
]

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-light dark:bg-black text-text transition-colors duration-300 font-sans">
      <div className="flex">
        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 transition-all duration-300 transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="h-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col p-6 shadow-2xl lg:shadow-none">
            {/* Logo */}
            <div className="flex items-center justify-between pb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white shadow-lg shadow-primary/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">System</p>
                  <p className="text-xl font-bold text-heading tracking-tight">EcoTrack</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl text-text/50 hover:bg-muted transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 scrollbar-hide">
              <div className="pb-4">
                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text/30 dark:text-text/50">Main Menu</p>
                {navItems.slice(0, 1).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>

              <div className="pb-4">
                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text/30 dark:text-text/50">Management</p>
                {navItems.slice(1, 4).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>

              <div className="pb-4">
                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text/30 dark:text-text/50">Configuration</p>
                {navItems.slice(4, 7).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>

              <div className="pb-4">
                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text/30 dark:text-text/50">System</p>
                {navItems.slice(7).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>
            </nav>

            {/* Admin Profile */}
            <div className="mt-auto pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-danger hover:bg-danger/10 transition-all duration-200 border border-transparent hover:border-danger/20"
              >
                <LogOut size={18} />
                Logout Account
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-surface/50 text-text/80 shadow-sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50">
                  <Search size={14} className="text-text/40" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    className="bg-transparent border-none text-xs text-text focus:ring-0 w-32 md:w-48 placeholder:text-text/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <ThemeToggle />

                <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>

                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-heading leading-tight">{admin?.name || 'Administrator'}</p>
                    <p className="text-[11px] text-text/50 font-medium">{admin?.email}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-heading font-bold border border-zinc-300/50 dark:border-zinc-600/50 shadow-sm">
                    {admin?.name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl">
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

function SidebarLink({ item, onClick }) {
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) => clsx(
        'group flex items-center gap-4 rounded-xl px-3 py-3 text-sm transition-all duration-300 relative',
        isActive
          ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
          : 'text-text/70 dark:text-text/90 hover:bg-primary/5 hover:text-primary hover:translate-x-1'
      )}
    >
      {({ isActive }) => (
        <>
          <div className={clsx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
            isActive ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary/10'
          )}>
            <item.icon
              size={20}
              className={clsx(
                'transition-transform duration-300 group-hover:scale-110',
                isActive ? 'text-white' : 'text-text/40 group-hover:text-primary'
              )}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold tracking-tight truncate group-hover:text-primary transition-colors">
              {item.label}
            </span>
            <span className={clsx(
              "text-[10px] font-bold tracking-widest truncate transition-colors duration-300 uppercase",
              isActive ? "text-white/90" : "text-text/40 dark:text-text/60 group-hover:text-primary/70"
            )}>
              {item.description}
            </span>
          </div>

          <AnimatePresence>
            {isActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full -ml-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  )
}

