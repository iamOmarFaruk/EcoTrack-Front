import { Outlet, NavLink } from 'react-router-dom'
import { Suspense, useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Wand2,
  ActivitySquare,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Trophy,
  Calendar,
  Lightbulb,
  MessageSquare,
  Layers,
  Search
} from 'lucide-react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '@lordicon/react'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

// Import all lordicon animations
//import legacyHomeIcon from '../assets/lordicon/legacy-home.json'
import morphAccountIcon from '../assets/lordicon/morph-account.json'
import calendarIcon from '../assets/lordicon/calendar.json'
import lightbulbIcon from '../assets/lordicon/lightbulb.json'
import layersIcon from '../assets/lordicon/layers.json'
import activityIcon from '../assets/lordicon/activity.json'
import messageIcon from '../assets/lordicon/message.json'
import trophyIcon from '../assets/lordicon/trophy.json'
import workflowIcon from '../assets/lordicon/workflow.json'
import computer from '../assets/lordicon/computer.json'

// Menu items with logical Lordicon assignments
const navItems = [
  {
    to: "/control-panel/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & Stats",
    lordIcon: computer,
  },
  {
    to: "/control-panel/challenges",
    label: "Challenges",
    icon: Trophy,
    description: "Manage challenges",
    lordIcon: trophyIcon,
  },
  {
    to: "/control-panel/events",
    label: "Events",
    icon: Calendar,
    description: "Manage events",
    lordIcon: calendarIcon,
  },
  {
    to: "/control-panel/tips",
    label: "Tips",
    icon: Lightbulb,
    description: "Manage tips",
    lordIcon: lightbulbIcon,
  },
  {
    to: "/control-panel/testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    description: "User reviews",
    lordIcon: messageIcon,
  },
  {
    to: "/control-panel/how-it-works",
    label: "Platform Flow",
    icon: Wand2,
    description: "Process steps",
    lordIcon: workflowIcon,
  },
  {
    to: "/control-panel/footer",
    label: "Footer Section",
    icon: Layers,
    description: "Links & Socials",
    lordIcon: layersIcon,
  },
  {
    to: "/control-panel/users",
    label: "Users",
    icon: Users,
    description: "Accounts & roles",
    lordIcon: morphAccountIcon,
  },
  {
    to: "/control-panel/activity",
    label: "Activity",
    icon: ActivitySquare,
    description: "Audit trail",
    lordIcon: activityIcon,
  },
];

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
          <div className="h-full bg-gradient-to-b from-white/95 via-white/90 to-white/95 dark:from-zinc-950/95 dark:via-zinc-950/90 dark:to-zinc-950/95 backdrop-blur-3xl border-r border-zinc-200/30 dark:border-zinc-800/30 flex flex-col p-5 shadow-2xl shadow-black/5 dark:shadow-black/20 lg:shadow-none">
            {/* Logo */}
            <div className="flex items-center justify-between pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-emerald-500 to-teal-500 text-white shadow-xl shadow-primary/25 ring-1 ring-white/20">
                  <ShieldCheck size={22} className="drop-shadow-sm" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/70">System</p>
                  <p className="text-lg font-bold text-heading tracking-tight">EcoTrack</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl text-text/50 hover:bg-muted/50 hover:text-text transition-all duration-200"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-hide">
              <div className="pb-3">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50">Main Menu</p>
                {navItems.slice(0, 1).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>

              <div className="pb-3">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50">Management</p>
                {navItems.slice(1, 4).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>

              <div className="pb-3">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50">Configuration</p>
                {navItems.slice(4, 7).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>

              <div className="pb-3">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50">System</p>
                {navItems.slice(7).map((item) => (
                  <SidebarLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>
            </nav>

            {/* Admin Profile */}
            <div className="mt-auto pt-4 border-t border-zinc-200/30 dark:border-zinc-800/30">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-danger hover:bg-danger/10 transition-all duration-300 border border-transparent hover:border-danger/20 group"
              >
                <LogOut size={16} className="transition-transform duration-300 group-hover:scale-110" />
                Logout Account
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-zinc-200/30 dark:border-zinc-800/30 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-surface/60 text-text/80 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={18} className="transition-transform duration-300 group-hover:scale-110" />
                </button>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
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
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-heading font-bold border border-zinc-300/50 dark:border-zinc-600/50 shadow-sm">
                    {admin?.name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
            <div className="max-w-[1600px]">
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
  const playerRef = useRef(null)

  // Ensure the icon renders its first frame once loaded
  useEffect(() => {
    playerRef.current?.goToFirstFrame()
  }, [item.lordIcon])

  // Play animation on hover
  const handleMouseEnter = () => {
    if (playerRef.current) {
      playerRef.current.playFromBeginning()
    }
  }

  const handleMouseLeave = () => {
    playerRef.current?.goToFirstFrame()
  }

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 relative group mb-1',
        isActive
          ? 'bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/25'
          : 'text-text/70 dark:text-text/80 hover:bg-primary/10 hover:text-primary'
      )}
    >
      {({ isActive }) => (
        <>
          {/* Lordicon animated icon */}
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
            <Player
              ref={playerRef}
              icon={item.lordIcon}
              size={26}
              colorize={isActive ? '#ffffff' : '#10b981'}
              onReady={() => playerRef.current?.goToFirstFrame()}
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className={clsx(
              'font-semibold tracking-tight truncate transition-colors text-[13px]',
              isActive ? 'text-white' : 'group-hover:text-primary'
            )}>
              {item.label}
            </span>
            <span className={clsx(
              "text-[9px] font-medium tracking-wider truncate transition-colors uppercase",
              isActive ? "text-white/80" : "text-text/40 dark:text-text/50 group-hover:text-primary/60"
            )}>
              {item.description}
            </span>
          </div>

          {/* Active Indicator */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full -ml-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  )
} 
