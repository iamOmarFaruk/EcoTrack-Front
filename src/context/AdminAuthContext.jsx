import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../config/firebase.js'
import { showError, showSuccess } from '../utils/toast.jsx'

const AdminAuthContext = createContext(null)

const hasAdminAccess = (claims) => Boolean(claims?.admin || claims?.role === 'admin')

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAdmin(null)
        setLoading(false)
        return
      }

      try {
        const tokenResult = await firebaseUser.getIdTokenResult(true)
        if (!hasAdminAccess(tokenResult?.claims)) {
          setAdmin(null)
          setLoading(false)
          return
        }

        setAdmin({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Admin',
          role: 'admin'
        })
      } catch (error) {
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(() => ({
    admin,
    loading,
    isAuthenticated: Boolean(admin),

    async login({ email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const tokenResult = await userCredential.user.getIdTokenResult(true)

        if (!hasAdminAccess(tokenResult?.claims)) {
          await signOut(auth)
          throw new Error('This account does not have admin access.')
        }

        const adminData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName || 'Admin',
          role: 'admin'
        }

        setAdmin(adminData)
        showSuccess('Welcome back, admin!')
        return { admin: adminData }
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await signOut(auth)
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
