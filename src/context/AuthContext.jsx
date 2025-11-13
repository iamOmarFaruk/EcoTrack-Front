import { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { authApi, challengeApi } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userChallenges, setUserChallenges] = useLocalStorage('eco_user_challenges', [])
  const [userProfile, setUserProfile] = useState(null)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userInfo = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL || '',
        }
        setUser(userInfo)
        
        // Sync with backend
        try {
          const backendProfile = await authApi.getProfile()
          setUserProfile(backendProfile)
        } catch (error) {
          console.warn('Failed to get backend profile:', error)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(() => {
    async function login({ email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        
        // Sync with backend
        try {
          await authApi.login({ email, firebaseUid: userCredential.user.uid })
        } catch (backendError) {
          console.warn('Backend login sync failed:', backendError)
        }
        
        return userCredential.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        throw err
      }
    }

    async function register({ name, email, password, photoUrl }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        
        // Update the user profile with display name and photo URL
        await updateProfile(userCredential.user, {
          displayName: name,
          photoURL: photoUrl || null,
        })

        // Register with backend
        try {
          await authApi.register({
            firebaseUid: userCredential.user.uid,
            email: userCredential.user.email,
            name: name,
            avatarUrl: photoUrl || null
          })
        } catch (backendError) {
          console.warn('Backend registration failed:', backendError)
        }
        
        return userCredential.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        throw err
      }
    }

    async function loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        
        // Register/login with backend
        try {
          await authApi.register({
            firebaseUid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName,
            avatarUrl: result.user.photoURL
          })
        } catch (backendError) {
          // If registration fails, try login
          try {
            await authApi.login({ email: result.user.email, firebaseUid: result.user.uid })
          } catch (loginError) {
            console.warn('Backend sync failed:', loginError)
          }
        }
        
        return result.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        throw err
      }
    }

    async function logout() {
      try {
        // Logout from backend first
        try {
          await authApi.logout()
        } catch (backendError) {
          console.warn('Backend logout failed:', backendError)
        }
        
        await signOut(auth)
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        throw err
      }
    }

    async function resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email)
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        throw err
      }
    }

    async function updateUserProfile({ displayName, photoURL }) {
      try {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: displayName || auth.currentUser.displayName,
            photoURL: photoURL || auth.currentUser.photoURL,
          })
          
          // Update local state
          setUser(prevUser => ({
            ...prevUser,
            name: displayName || prevUser.name,
            avatarUrl: photoURL || prevUser.avatarUrl,
          }))
        }
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        throw err
      }
    }

    async function joinChallenge(challengeId) {
      try {
        await challengeApi.join(challengeId)
        setUserChallenges((prev) => {
          const set = new Set(prev ?? [])
          set.add(challengeId)
          return Array.from(set)
        })
      } catch (error) {
        console.error('Failed to join challenge:', error)
        throw error
      }
    }

    async function leaveChallenge(challengeId) {
      try {
        await challengeApi.leave(challengeId)
        setUserChallenges((prev) => {
          return (prev ?? []).filter(id => id !== challengeId)
        })
      } catch (error) {
        console.error('Failed to leave challenge:', error)
        throw error
      }
    }

    function getFirebaseErrorMessage(error) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No account found with this email address.'
        case 'auth/wrong-password':
          return 'Incorrect password.'
        case 'auth/email-already-in-use':
          return 'An account already exists with this email address.'
        case 'auth/weak-password':
          return 'Password should be at least 6 characters long.'
        case 'auth/invalid-email':
          return 'Invalid email address.'
        case 'auth/user-disabled':
          return 'This account has been disabled.'
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later.'
        case 'auth/popup-closed-by-user':
          return 'Authentication cancelled.'
        case 'auth/cancelled-popup-request':
          return 'Authentication cancelled.'
        default:
          return error.message || 'An error occurred during authentication.'
      }
    }

    return { 
      user,
      loading,
      userProfile,
      auth: {
        isLoggedIn: !!user,
        user,
        userProfile,
        userChallenges,
      },
      login, 
      register,
      loginWithGoogle,
      logout, 
      resetPassword,
      updateUserProfile,
      joinChallenge,
      leaveChallenge
    }
  }, [user, loading, userChallenges, userProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


