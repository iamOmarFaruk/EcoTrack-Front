import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Add padding-top to account for fixed navbar (h-16) */}
      <main className={`container flex-1 ${isHome ? 'pt-16 pb-0' : 'pt-24 pb-8'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}


