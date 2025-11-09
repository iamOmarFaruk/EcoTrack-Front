import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`container flex-1 pb-8 ${isHome ? 'pt-0' : 'pt-8'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}


