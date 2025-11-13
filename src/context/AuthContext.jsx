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
          
          // If user doesn't exist in MongoDB, try to create them
          if (error.status === 404 || error.data?.isNetworkError) {
            try {
              const userData = {
                firebaseId: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email,
                imageUrl: firebaseUser.photoURL || null
              }
              
              console.log('Attempting retroactive user creation:', userData)
              await authApi.register(userData)
              console.log('User retroactively saved to MongoDB')
              
              // Try to get the profile again
              const newBackendProfile = await authApi.getProfile()
              setUserProfile(newBackendProfile)
            } catch (retroError) {
              console.warn('Failed to retroactively save user to MongoDB:', retroError)
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
        
        // Save user data to MongoDB database
        try {
          // Get the Firebase ID token
          const idToken = await userCredential.user.getIdToken()
          
          const requestData = {
            idToken: idToken
          }
          
          console.log('Attempting to save user data to MongoDB')
          await authApi.register(requestData)
          console.log('User data saved to MongoDB successfully')
        } catch (mongoError) {
          console.error('Failed to save user data to MongoDB:', mongoError)
          console.error('Error details:', mongoError.message, mongoError.status)
          // Don't throw the error - Firebase registration was successful
          // We'll handle this gracefully
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
        
        // Always try to save Google user to MongoDB
        // The backend will handle duplicate checks and extract user info from token
        try {
          // Get the Firebase ID token
          const idToken = await result.user.getIdToken()
          
          const requestData = {
            idToken: idToken
          }
          
          console.log('Attempting to save Google user data to MongoDB')
          await authApi.register(requestData)
          console.log('Google user data saved to MongoDB successfully')
        } catch (mongoError) {
          console.error('Failed to save Google user data to MongoDB:', mongoError)
          console.error('Error details:', mongoError.message, mongoError.status)
          // Don't throw the error - Firebase authentication was successful
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
        case 'auth/popup-blocked':
          return 'Popup was blocked by browser. Please allow popups and try again.'
        case 'auth/operation-not-allowed':
          return 'Google sign-in is not enabled. Please contact support.'
        case 'auth/invalid-credential':
          return 'Invalid credentials. Please try again.'
        default:
          console.warn('Firebase Auth Error:', error)
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


