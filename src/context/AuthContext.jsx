import { createContext, useContext, useMemo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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

// Helper function to hash email for Gravatar
async function hashEmail(email) {
  const encoder = new TextEncoder()
  const data = encoder.encode(email.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userChallenges, setUserChallenges] = useLocalStorage('eco_user_challenges', [])
  const [userProfile, setUserProfile] = useState(null)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ensure we capture Google photoURL properly, with fallback to generic Google avatar
        let avatarUrl = firebaseUser.photoURL || ''
        
        // If no photoURL but it's a Google account, try to construct a basic avatar
        if (!avatarUrl && firebaseUser.providerData.some(provider => provider.providerId === 'google.com')) {
          // Use Google's default avatar service with the user's email
          const email = firebaseUser.email
          if (email) {
            // Use Gravatar as fallback which often has Google profile pictures
            const emailHash = await hashEmail(email)
            avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=80`
          }
        }
        
        const userInfo = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          avatarUrl: avatarUrl,
        }
        setUser(userInfo)
        
        // Sync with backend
        try {
          const backendProfile = await authApi.getProfile()
          setUserProfile(backendProfile)
        } catch (error) {
          
          // If user doesn't exist in MongoDB, try to create them
          if (error.status === 404 || error.data?.isNetworkError) {
            try {
              const userData = {
                firebaseId: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email,
                imageUrl: avatarUrl || null
              }
              
              await authApi.register(userData)
              
              // Try to get the profile again
              const newBackendProfile = await authApi.getProfile()
              setUserProfile(newBackendProfile)
            } catch (retroError) {
              // Fallback to Firebase user info if all else fails
              setUserProfile({
                ...userInfo,
                id: userInfo.uid,
                joinedChallenges: [],
                createdChallenges: [],
                completedChallenges: [],
                totalPoints: 0,
                level: 1,
                joinedAt: new Date().toISOString(),
                preferences: {
                  notifications: true,
                  privacy: 'public'
                },
                stats: {
                  challengesCompleted: 0,
                  challengesJoined: 0,
                  challengesCreated: 0,
                  totalPoints: 0
                }
              })
            }
          } else {
            // Other errors - use fallback profile
            setUserProfile({
              ...userInfo,
              id: userInfo.uid,
              joinedChallenges: [],
              createdChallenges: [],
              completedChallenges: [],
              totalPoints: 0,
              level: 1,
              joinedAt: new Date().toISOString(),
              preferences: {
                notifications: true,
                privacy: 'public'
              },
              stats: {
                challengesCompleted: 0,
                challengesJoined: 0,
                challengesCreated: 0,
                totalPoints: 0
              }
            })
          }
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
        toast.success('Welcome back!')
        return userCredential.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        toast.error(err.message)
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
        
        // Save user data to MongoDB database
        try {
          // Get the Firebase ID token
          const idToken = await userCredential.user.getIdToken()
          
          const requestData = {
            idToken: idToken
          }
          
          await authApi.register(requestData)
        } catch (mongoError) {
          // Don't throw the error - Firebase registration was successful
          // We'll handle this gracefully
        }
        
        toast.success('Account created successfully! Welcome to EcoTrack!')
        return userCredential.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        toast.error(err.message)
        throw err
      }
    }

    async function loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        
        // Always try to save Google user to MongoDB
        // The backend will handle duplicate checks and extract user info from token
        try {
          // Get the Firebase ID token
          const idToken = await result.user.getIdToken()
          
          const requestData = {
            idToken: idToken
          }
          
          await authApi.register(requestData)
        } catch (mongoError) {
          // Don't throw the error - Firebase authentication was successful
        }
        
        toast.success('Welcome back!')
        return result.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        toast.error(err.message)
        throw err
      }
    }

    async function logout() {
      try {
        await signOut(auth)
        toast.success('You have been logged out.')
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        toast.error(err.message)
        throw err
      }
    }

    async function resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email)
        toast.success('Password reset email sent! Check your inbox.')
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        toast.error(err.message)
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
        case 'auth/popup-blocked':
          return 'Popup was blocked by browser. Please allow popups and try again.'
        case 'auth/operation-not-allowed':
          return 'Google sign-in is not enabled. Please contact support.'
        case 'auth/invalid-credential':
          return 'Invalid credentials. Please try again.'
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


