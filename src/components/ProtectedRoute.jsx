import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { auth } = useAuth()
  const location = useLocation()
  if (!auth.isLoggedIn) {
    sessionStorage.setItem('redirectTo', location.pathname + location.search)
    return <Navigate to="/login" replace />
  }
  return children
}


