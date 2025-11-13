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

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userChallenges, setUserChallenges] = useLocalStorage('eco_user_challenges', [])

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL || '',
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(() => {
    async function login({ email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
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
        return result.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        throw err
      }
    }

    async function logout() {
      try {
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

    function joinChallenge(challengeId) {
      setUserChallenges((prev) => {
        const set = new Set(prev ?? [])
        set.add(challengeId)
        return Array.from(set)
      })
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
      auth: {
        isLoggedIn: !!user,
        user,
        userChallenges,
      },
      login, 
      register,
      loginWithGoogle,
      logout, 
      resetPassword,
      updateUserProfile,
      joinChallenge 
    }
  }, [user, loading, userChallenges])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


