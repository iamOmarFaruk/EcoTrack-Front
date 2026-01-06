import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { adminApi, setAdminToken } from '../services/adminApi.js'
import { showError, showSuccess } from '../utils/toast.jsx'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('eco-admin-token') : null))
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false)
        return
      }

      setAdminToken(token)
      try {
        const response = await adminApi.me()
        setAdmin(response?.data?.admin || response.admin)
      } catch (error) {
        console.error('Admin session invalid', error)
        setAdmin(null)
        setToken(null)
        setAdminToken(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [token])

  const value = useMemo(() => ({
    admin,
    loading,
    isAuthenticated: Boolean(admin && token),
    token,
    async login({ email, password }) {
      try {
        const response = await adminApi.login({ email, password })
        const data = response?.data || response
        if (data?.token) {
          setToken(data.token)
          setAdminToken(data.token)
        }
        setAdmin(data?.admin)
        showSuccess('Welcome back, admin!')
        return data
      } catch (error) {
        showError(error.message || 'Failed to login as admin')
        throw error
      }
    },
    logout() {
      setAdmin(null)
      setToken(null)
      setAdminToken(null)
      showSuccess('Signed out of control panel')
    }
  }), [admin, loading, token])

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
