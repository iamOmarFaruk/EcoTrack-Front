import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import EcoLoader from '../components/EcoLoader.jsx'

export default function PublicLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname)
  const isEventDetail = /^\/events\/[^/]+$/.test(location.pathname) && location.pathname !== '/events/add'
  const isChallengeDetail = /^\/challenges\/[^/]+$/.test(location.pathname) && location.pathname !== '/challenges/add'

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && <Navbar />}
      <main className={`flex-1 ${!isAuthPage ? (isHome ? 'pt-16' : 'pt-24') : ''} ${!isAuthPage && (isHome || location.pathname === '/about' || location.pathname === '/contact') ? 'pb-0' : (!isAuthPage ? 'pb-8' : '')} ${!isAuthPage && !isEventDetail && !isChallengeDetail ? 'container' : ''}`}>
        <Suspense fallback={<EcoLoader />}>
          <Outlet />
        </Suspense>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}


