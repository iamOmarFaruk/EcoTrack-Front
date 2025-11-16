import { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast.jsx'
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
import { authApi, challengeApi, eventApi } from '../services/api.js'

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
  const [userChallenges, setUserChallenges] = useState([])
  const [userEvents, setUserEvents] = useState([])
  const [userProfile, setUserProfile] = useState(null)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Reload user to ensure we have the latest profile data
        try {
          await firebaseUser.reload()
        } catch (reloadError) {
          console.log('Could not reload Firebase user, using cached data')
        }
        
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
        
        // Sync with backend - use /auth/me which auto-creates profile
        try {
          const response = await authApi.getMe()
          // response.data contains complete user data
          const userData = response?.data || response
          setUserProfile(userData)
          
          // Fetch user's joined challenges
          try {
            const challengesResponse = await challengeApi.getJoinedChallenges()
            let joinedChallenges = []
            
            // Handle different response structures
            if (Array.isArray(challengesResponse)) {
              joinedChallenges = challengesResponse.map(c => c._id || c.id)
            } else if (challengesResponse?.data && Array.isArray(challengesResponse.data)) {
              joinedChallenges = challengesResponse.data.map(c => c._id || c.id)
            } else if (challengesResponse?.challenges && Array.isArray(challengesResponse.challenges)) {
              joinedChallenges = challengesResponse.challenges.map(c => c._id || c.id)
            }
            
            setUserChallenges(joinedChallenges)
          } catch (challengesError) {
            // If fetching challenges fails, set empty array
            setUserChallenges([])
          }

          // Fetch user's joined events
          try {
            const eventsResponse = await eventApi.getMyJoined('upcoming')
            let joinedEvents = []
            
            // Handle different response structures
            // Backend always returns _id (MongoDB ObjectId)
            if (Array.isArray(eventsResponse)) {
              joinedEvents = eventsResponse.map(e => e._id)
            } else if (eventsResponse?.data?.events && Array.isArray(eventsResponse.data.events)) {
              joinedEvents = eventsResponse.data.events.map(e => e._id)
            } else if (eventsResponse?.events && Array.isArray(eventsResponse.events)) {
              joinedEvents = eventsResponse.events.map(e => e._id)
            }
            
            setUserEvents(joinedEvents)
          } catch (eventsError) {
            // If fetching events fails, set empty array
            setUserEvents([])
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          // Fallback to Firebase user info if backend fails
          setUserProfile({
            ...userInfo,
            displayName: userInfo.name,
            stats: {
              challengesCompleted: 0,
              challengesJoined: 0,
              eventsAttended: 0,
              tipsShared: 0,
              streak: 0,
              totalImpactPoints: 0
            },
            preferences: {
              privacy: 'public',
              notifications: {
                email: true,
                push: true,
                challenges: true,
                tips: true,
                events: true
              }
            },
            joinedAt: new Date().toISOString()
          })
        }
      } else {
        setUser(null)
        setUserProfile(null)
        setUserEvents([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(() => {
    async function login({ email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        showSuccess('Welcome back!')
        return userCredential.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        showError(err.message)
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
        
        // Force reload the user to ensure the profile update is reflected
        await userCredential.user.reload()
        
        // Get the updated token with the new profile data
        await userCredential.user.getIdToken(true)
        
        // Now register with backend - it will receive the updated Firebase user data
        try {
          const requestData = {
            displayName: name,
            photoURL: photoUrl || null
          }
          
          await authApi.register(requestData)
        } catch (mongoError) {
          // Don't throw the error - Firebase registration was successful
          // Profile will be auto-created on first /auth/me call with updated data
          console.log('Backend registration skipped, will auto-create on first access')
        }
        
        showSuccess('Account created successfully! Welcome to EcoTrack!')
        return userCredential.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        showError(err.message)
        throw err
      }
    }

    async function loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        
        // Backend will auto-create profile when /auth/me is called
        // No need to explicitly register - the /auth/me endpoint handles this
        showSuccess('Welcome back!')
        return result.user
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        showError(err.message)
        throw err
      }
    }

    async function logout() {
      try {
        await signOut(auth)
        showSuccess('You have been logged out.')
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        showError(err.message)
        throw err
      }
    }

    async function deleteAccount() {
      let backendDeleted = false
      
      try {
        // First delete the backend profile and data
        const { userApi } = await import('../services/api.js')
        await userApi.deleteProfile()
        backendDeleted = true
        
        // Then delete the Firebase user
        if (auth.currentUser) {
          await auth.currentUser.delete()
        }
        
        // Clear local state
        setUser(null)
        setUserProfile(null)
        setUserChallenges([])
        setUserEvents([])
        
        showSuccess('Your account has been deleted successfully.')
      } catch (error) {
        // If backend was deleted successfully but Firebase deletion failed,
        // still consider it success and just sign out
        if (backendDeleted) {
          try {
            await signOut(auth)
          } catch (signOutError) {
            // Ignore signout errors
          }
          
          // Clear local state
          setUser(null)
          setUserProfile(null)
          setUserChallenges([])
          setUserEvents([])
          
          showSuccess('Your account has been deleted successfully.')
          return
        }
        
        // Handle re-authentication requirement
        if (error.code === 'auth/requires-recent-login') {
          const err = new Error('For security reasons, please log out and log back in before deleting your account.')
          err.code = error.code
          showError(err.message)
          throw err
        }
        
        const err = new Error(error.message || 'Failed to delete account. Please try again.')
        err.code = error.code
        showError(err.message)
        throw err
      }
    }

    async function resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email)
        showSuccess('Password reset email sent! Check your inbox.')
      } catch (error) {
        const err = new Error(getFirebaseErrorMessage(error))
        err.code = error.code
        showError(err.message)
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
        const response = await challengeApi.join(challengeId)
        
        // Update state based on successful API call
        setUserChallenges((prev) => {
          const set = new Set(prev ?? [])
          set.add(challengeId)
          return Array.from(set)
        })
        
        // Optionally refresh user profile to get updated stats
        try {
          const meResponse = await authApi.getMe()
          const userData = meResponse?.data || meResponse
          setUserProfile(userData)
        } catch (profileError) {
          // Profile update is optional, don't throw error
        }
        
        return response
      } catch (error) {
        throw error
      }
    }

    async function leaveChallenge(challengeId) {
      try {
        const response = await challengeApi.leave(challengeId)
        
        // Update state based on successful API call
        setUserChallenges((prev) => {
          return (prev ?? []).filter(id => id !== challengeId)
        })
        
        // Optionally refresh user profile to get updated stats
        try {
          const meResponse = await authApi.getMe()
          const userData = meResponse?.data || meResponse
          setUserProfile(userData)
        } catch (profileError) {
          // Profile update is optional, don't throw error
        }
        
        return response
      } catch (error) {
        throw error
      }
    }

    async function joinEvent(eventId) {
      try {
        const response = await eventApi.join(eventId)
        
        // Update state based on successful API call
        setUserEvents((prev) => {
          const set = new Set(prev ?? [])
          set.add(eventId)
          return Array.from(set)
        })
        
        return response
      } catch (error) {
        throw error
      }
    }

    async function leaveEvent(eventId) {
      try {
        const response = await eventApi.leave(eventId)
        
        // Update state based on successful API call
        setUserEvents((prev) => {
          return (prev ?? []).filter(id => id !== eventId)
        })
        
        return response
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
        userEvents,
      },
      login, 
      register,
      loginWithGoogle,
      logout, 
      resetPassword,
      updateUserProfile,
      deleteAccount,
      joinChallenge,
      leaveChallenge,
      joinEvent,
      leaveEvent,
      getUserJoinedChallenges: async () => {
        try {
          const challengesResponse = await challengeApi.getJoinedChallenges()
          let joinedChallenges = []
          
          // Handle different response structures
          if (Array.isArray(challengesResponse)) {
            joinedChallenges = challengesResponse.map(c => c._id || c.id)
          } else if (challengesResponse?.data && Array.isArray(challengesResponse.data)) {
            joinedChallenges = challengesResponse.data.map(c => c._id || c.id)
          } else if (challengesResponse?.challenges && Array.isArray(challengesResponse.challenges)) {
            joinedChallenges = challengesResponse.challenges.map(c => c._id || c.id)
          }
          
          setUserChallenges(joinedChallenges)
          return joinedChallenges
        } catch (error) {
          setUserChallenges([])
          throw error
        }
      },
      getUserJoinedEvents: async () => {
        try {
          const eventsResponse = await eventApi.getMyJoined('upcoming')
          let joinedEvents = []
          
          // Handle different response structures
          // Backend always returns _id (MongoDB ObjectId)
          if (Array.isArray(eventsResponse)) {
            joinedEvents = eventsResponse.map(e => e._id)
          } else if (eventsResponse?.data?.events && Array.isArray(eventsResponse.data.events)) {
            joinedEvents = eventsResponse.data.events.map(e => e._id)
          } else if (eventsResponse?.events && Array.isArray(eventsResponse.events)) {
            joinedEvents = eventsResponse.events.map(e => e._id)
          }
          
          setUserEvents(joinedEvents)
          return joinedEvents
        } catch (error) {
          setUserEvents([])
          throw error
        }
      }
    }
  }, [user, loading, userChallenges, userEvents, userProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


