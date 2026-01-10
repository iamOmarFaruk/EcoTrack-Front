import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import EcoLoader from './EcoLoader.jsx'

export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return <EcoLoader />
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('adminRedirect', location.pathname + location.search)
    return <Navigate to="/control-panel" replace />
  }

  return children
}
