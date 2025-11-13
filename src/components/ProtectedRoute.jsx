import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import EcoLoader from './EcoLoader.jsx'

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useAuth()
  const location = useLocation()
  
  // Show loading while checking authentication
  if (loading) {
    return <EcoLoader />
  }
  
  // Redirect to login if not authenticated
  if (!auth.isLoggedIn) {
    sessionStorage.setItem('redirectTo', location.pathname + location.search)
    return <Navigate to="/login" replace />
  }
  
  return children
}


