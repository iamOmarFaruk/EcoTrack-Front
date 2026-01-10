import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { adminApi } from '../services/adminApi.js'
import { showError, showSuccess } from '../utils/toast.jsx'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function bootstrap() {
      try {
        // Try to fetch admin info using httpOnly cookie
        const response = await adminApi.me()
        setAdmin(response?.data?.admin || response.admin)
      } catch (error) {
        // No valid session
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  const value = useMemo(() => ({
    admin,
    loading,
    isAuthenticated: Boolean(admin),

    async login({ email, password }) {
      try {
        const response = await adminApi.login({ email, password })
        const data = response?.data || response
        setAdmin(data?.admin)
        showSuccess('Welcome back, admin!')
        return data
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await adminApi.logout()
        setAdmin(null)
        showSuccess('Signed out of control panel')
      } catch (error) {
        // Clear state anyway
        setAdmin(null)
        showError('Logout failed, but cleared local session')
      }
    }
  }), [admin, loading])

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
