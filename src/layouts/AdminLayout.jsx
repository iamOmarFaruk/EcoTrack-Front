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
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import EcoLoader from '../components/EcoLoader.jsx'

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-black text-white">
      <div className="flex min-h-screen bg-black/30 backdrop-blur">
        {/* Sidebar */}
        <aside className={clsx(
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-black/60 px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <div className="flex items-center justify-between pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">EcoTrack</p>
                <p className="text-lg font-semibold">Control Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
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
                  isActive ? 'bg-white/10 text-white shadow-[0_10px_40px_-12px_rgba(16,185,129,0.7)]' : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                <div className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all',
                  'group-hover:border-emerald-400/40'
                )}>
                  <item.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-[11px] uppercase tracking-wide text-white/40">{item.description}</span>
                </div>
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <Settings size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Security Mode</p>
                <p className="text-xs text-white/50">Routes behind admin token</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden rounded-lg border border-white/10 bg-white/5 p-2 text-white/80"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Admin</p>
                <h1 className="text-2xl font-bold leading-tight">Full Control Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">{admin?.name || 'Administrator'}</p>
                <p className="text-xs text-white/50">{admin?.email}</p>
              </div>
              <Button variant="ghost" onClick={logout} className="flex items-center gap-2 text-white hover:bg-white/10">
                <LogOut size={16} /> Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-6">
            <Suspense fallback={<EcoLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
