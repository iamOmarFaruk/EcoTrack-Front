import { Outlet, NavLink } from 'react-router-dom'
import { Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from '@lordicon/react'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

// Import all lordicon animations
//import legacyHomeIcon from '../assets/lordicon/legacy-home.json'

import computer from '../assets/lordicon/computer.json'
import puzzle from '../assets/lordicon/puzzle.json'
import calendar from '../assets/lordicon/calendar.json'
import tips from '../assets/lordicon/tips.json'
import testimonials from '../assets/lordicon/testimonials.json'
import howworks from "../assets/lordicon/how-works.json";
import footer from '../assets/lordicon/footer.json'
import user from '../assets/lordicon/user.json'
import activity from '../assets/lordicon/activity.json'

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
    lordIcon: puzzle,
  },
  {
    to: "/control-panel/events",
    label: "Events",
    icon: Calendar,
    description: "Manage events",
    lordIcon: calendar,
  },
  {
    to: "/control-panel/tips",
    label: "Tips",
    icon: Lightbulb,
    description: "Manage tips",
    lordIcon: tips,
  },
  {
    to: "/control-panel/testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    description: "User reviews",
    lordIcon: testimonials,
  },
  {
    to: "/control-panel/how-it-works",
    label: "How It Works",
    icon: Wand2,
    description: "Process steps",
    lordIcon: howworks,
  },
  {
    to: "/control-panel/footer",
    label: "Footer Section",
    icon: Layers,
    description: "Links & Socials",
    lordIcon: footer,
  },
  {
    to: "/control-panel/users",
    label: "Users",
    icon: Users,
    description: "Accounts & roles",
    lordIcon: user,
  },
  {
    to: "/control-panel/activity",
    label: "Activity",
    icon: ActivitySquare,
    description: "Audit trail",
    lordIcon: activity,
  },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [animateItems, setAnimateItems] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  
  // Check if we're on desktop on mount and when window resizes
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Check on mount
    checkIfDesktop();
    
    // Add resize listener
    window.addEventListener('resize', checkIfDesktop);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, [])
  
  // Trigger initial menu items animation on component mount for desktop view
  useEffect(() => {
    if (isDesktop) {
      // Delay animation slightly to let the page load properly
      const timer = setTimeout(() => {
        setAnimateItems(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isDesktop]);
  
  // Trigger menu items animation when sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      // Small delay to ensure sidebar animation starts first
      const timer = setTimeout(() => {
        setAnimateItems(true);
      }, 100);
      return () => clearTimeout(timer);
    } else if (!isDesktop) {
      // Only reset animation state on mobile when sidebar closes
      setAnimateItems(false);
    }
  }, [sidebarOpen, isDesktop])

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
          'fixed inset-y-0 left-0 z-50 transition-all duration-300 transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:w-24 w-72' : 'w-72'
        )}>
          <div
            className={clsx(
              "h-full bg-gradient-to-b from-white/95 via-white/90 to-white/95 dark:from-zinc-950/95 dark:via-zinc-950/90 dark:to-zinc-950/95 backdrop-blur-3xl border-r border-zinc-200/30 dark:border-zinc-800/30 flex flex-col shadow-2xl shadow-black/5 dark:shadow-black/20 lg:shadow-none",
              sidebarCollapsed ? "lg:px-4 lg:py-5 p-5" : "p-5"
            )}
          >
            {/* Logo */}
            <div className="flex items-center justify-between pb-6">
              <div className={clsx(
                "flex items-center gap-3 transition-all duration-300",
                sidebarCollapsed && "lg:flex-1 lg:justify-center"
              )}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-emerald-500 to-teal-500 text-white shadow-xl shadow-primary/25 ring-1 ring-white/20">
                  <ShieldCheck size={22} className="drop-shadow-sm" />
                </div>
                <div className={clsx(
                  "transition-all duration-300",
                  sidebarCollapsed && "lg:hidden"
                )}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/70">System</p>
                  <p className="text-lg font-bold text-heading tracking-tight">EcoTrack</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={clsx(
                    "hidden lg:flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-text/60 hover:text-primary hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20 group",
                    sidebarCollapsed && "lg:px-2"
                  )}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight size={16} className="transition-transform duration-300 group-hover:scale-110" />
                  ) : (
                    <>
                      <ChevronLeft size={16} className="transition-transform duration-300 group-hover:scale-110" />
                      <span>Collapse</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-xl text-text/50 hover:bg-muted/50 hover:text-text transition-all duration-200"
                  aria-label="Close sidebar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-visible pr-1 scrollbar-hide">
              <div className="pb-3">
                <p className={clsx(
                  "px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50 transition-all duration-300",
                  sidebarCollapsed && "lg:hidden"
                )}>Main Menu</p>
                {navItems.slice(0, 1).map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={animateItems || window.innerWidth >= 1024 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                  >
                    <SidebarLink item={item} onClick={() => setSidebarOpen(false)} isCollapsed={sidebarCollapsed} />
                  </motion.div>
                ))}
              </div>

              <div className="pb-3">
                <p className={clsx(
                  "px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50 transition-all duration-300",
                  sidebarCollapsed && "lg:hidden"
                )}>Management</p>
                {navItems.slice(1, 4).map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={animateItems || isDesktop ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 + (index * 0.1),
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                  >
                    <SidebarLink item={item} onClick={() => setSidebarOpen(false)} isCollapsed={sidebarCollapsed} />
                  </motion.div>
                ))}
              </div>

              <div className="pb-3">
                <p className={clsx(
                  "px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50 transition-all duration-300",
                  sidebarCollapsed && "lg:hidden"
                )}>Configuration</p>
                {navItems.slice(4, 7).map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={animateItems || isDesktop ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.4 + (index * 0.1),
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                  >
                    <SidebarLink item={item} onClick={() => setSidebarOpen(false)} isCollapsed={sidebarCollapsed} />
                  </motion.div>
                ))}
              </div>

              <div className="pb-3">
                <p className={clsx(
                  "px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text/40 dark:text-text/50 transition-all duration-300",
                  sidebarCollapsed && "lg:hidden"
                )}>System</p>
                {navItems.slice(7).map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={animateItems || isDesktop ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.7 + (index * 0.1),
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }}
                  >
                    <SidebarLink item={item} onClick={() => setSidebarOpen(false)} isCollapsed={sidebarCollapsed} />
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Admin Profile */}
            <div className="mt-auto pt-4 border-t border-zinc-200/30 dark:border-zinc-800/30">
              <button
                onClick={logout}
                className={clsx(
                  "w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold text-white bg-danger shadow-sm transition-all duration-300 group hover:bg-danger/90 hover:shadow-danger/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black",
                  sidebarCollapsed ? "lg:px-2 gap-0" : "gap-2 px-4"
                )}
                title={sidebarCollapsed ? "Logout Account" : ""}
              >
                <LogOut size={16} className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-px" />
                <span className={clsx(
                  "transition-all duration-300",
                  sidebarCollapsed && "lg:hidden"
                )}>Logout Account</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className={clsx(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-24" : "lg:ml-72"
        )}>
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
                {/* <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                  <Search size={14} className="text-text/40" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    className="bg-transparent border-none text-xs text-text focus:ring-0 w-32 md:w-48 placeholder:text-text/30"
                  />
                </div> */}
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

function SidebarLink({ item, onClick, isCollapsed }) {
  const playerRef = useRef(null)
  const linkRef = useRef(null)
  const navLinkRef = useRef(null)
  const iconRef = useRef(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })

  // Ensure the icon renders its first frame once loaded
  useEffect(() => {
    playerRef.current?.goToFirstFrame()
  }, [item.lordIcon])

  // Play animation on hover
  const updateTooltipPos = () => {
    const anchorEl = (isCollapsed && iconRef.current)
      ? iconRef.current
      : (navLinkRef.current || linkRef.current)
    if (!anchorEl) return
    const rect = anchorEl.getBoundingClientRect()
    const tooltipGap = 12
    const tooltipXOffset = 10
    const tooltipYOffset = -20
    const rawTop = rect.top + rect.height / 2
    const clampedTop = Math.max(16, Math.min(window.innerHeight - 16, rawTop + tooltipYOffset))
    setTooltipPos({
      top: clampedTop,
      left: rect.right + tooltipGap + tooltipXOffset
    })
  }

  const handleMouseEnter = () => {
    if (playerRef.current) {
      playerRef.current.playFromBeginning()
    }
    if (isCollapsed) {
      updateTooltipPos()
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    playerRef.current?.goToFirstFrame()
    setShowTooltip(false)
  }

  useEffect(() => {
    if (!showTooltip) return
    const handleScroll = () => updateTooltipPos()
    const handleResize = () => updateTooltipPos()
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [showTooltip])

  useEffect(() => {
    if (!showTooltip || !isCollapsed) return
    let rafId = 0
    const tick = () => {
      updateTooltipPos()
      rafId = window.requestAnimationFrame(tick)
    }
    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [showTooltip, isCollapsed])

  return (
    <div className={clsx('relative', isCollapsed && 'lg:w-fit lg:mx-auto')} ref={linkRef}>
      <NavLink
        ref={navLinkRef}
        to={item.to}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={({ isActive }) => clsx(
          'flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-300 relative group mb-1',
          isCollapsed
            ? 'gap-0 lg:h-14 lg:w-14 lg:justify-center lg:rounded-full lg:px-0 lg:py-0'
            : 'gap-3',
          isActive
            ? 'bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/25'
            : 'text-text/70 dark:text-text/80 hover:bg-primary/10 hover:text-primary'
        )}
      >
        {({ isActive }) => (
	          <>
	            {/* Lordicon animated icon */}
	            <div
                ref={iconRef}
	              className={clsx(
	                'relative flex h-7 w-7 shrink-0 items-center justify-center',
	                isCollapsed && 'lg:h-9 lg:w-9 lg:-translate-y-px'
	              )}
	            >
              <Player
                ref={playerRef}
                icon={item.lordIcon}
                size={isCollapsed ? 30 : 26}
                colorize={isActive ? '#ffffff' : '#10b981'}
                onReady={() => playerRef.current?.goToFirstFrame()}
              />
            </div>

            {/* Text Content */}
            <div className={clsx(
              "flex flex-col min-w-0 flex-1 transition-all duration-300",
              isCollapsed && "lg:hidden"
            )}>
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
              {isActive && !isCollapsed && (
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

      {/* Tooltip - Only shown when collapsed on desktop */}
      {createPortal(
        <AnimatePresence>
          {showTooltip && isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              style={{ top: tooltipPos.top, left: tooltipPos.left }}
              className="hidden lg:block fixed -translate-y-1/2 z-[9999] pointer-events-none drop-shadow-xl"
            >
              <div className="bg-white/95 dark:bg-zinc-950/95 text-zinc-900 dark:text-zinc-100 px-3 py-2 rounded-lg shadow-xl border border-zinc-200/70 dark:border-zinc-800/70 backdrop-blur-xl">
                <p className="text-sm font-semibold whitespace-nowrap">{item.label}</p>
                <p className="text-[10px] opacity-80 whitespace-nowrap">{item.description}</p>
              </div>
              {/* Arrow */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 bg-white/95 dark:bg-zinc-950/95 border-l border-b border-zinc-200/70 dark:border-zinc-800/70"></div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
} 
