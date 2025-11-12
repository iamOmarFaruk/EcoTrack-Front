import { Outlet, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container flex flex-1 gap-6 py-8 pt-24">
        <aside className="hidden w-60 shrink-0 rounded-lg border p-4 md:block">
          <nav className="grid gap-2 text-sm">
            <Link className="rounded-md px-3 py-2 hover:bg-slate-50" to="/my-activities">My Activities</Link>
            <Link className="rounded-md px-3 py-2 hover:bg-slate-50" to="/profile">Profile</Link>
            <Link className="rounded-md px-3 py-2 hover:bg-slate-50" to="/settings">Settings</Link>
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


