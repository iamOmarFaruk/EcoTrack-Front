import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { fakeDelay } from '../utils/fakeDelay.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useLocalStorage('eco_auth', {
    isLoggedIn: false,
    user: null,
    userChallenges: [],
  })

  const value = useMemo(() => {
    async function login({ email, password }) {
      await fakeDelay(800)
      const valid = (email === 'admin@eco.com' && password === 'admin')
      if (!valid) {
        const err = new Error('Invalid credentials')
        err.code = 'INVALID_CREDENTIALS'
        throw err
      }
      setAuth({
        isLoggedIn: true,
        user: { name: 'Eco Admin', email: 'admin@eco.com', avatarUrl: '' },
        userChallenges: auth.userChallenges ?? [],
      })
      return true
    }

    function logout() {
      setAuth({
        isLoggedIn: false,
        user: null,
        userChallenges: [],
      })
    }

    function joinChallenge(challengeId) {
      setAuth((prev) => {
        const set = new Set(prev.userChallenges ?? [])
        set.add(challengeId)
        return { ...prev, userChallenges: Array.from(set) }
      })
    }

    return { auth, login, logout, joinChallenge }
  }, [auth, setAuth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


