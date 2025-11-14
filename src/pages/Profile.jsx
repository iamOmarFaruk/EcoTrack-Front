import { useState, useEffect } from 'react'
import SectionHeading from '../components/SectionHeading.jsx'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'
import { userApi } from '../services/api.js'
import toast from 'react-hot-toast'

export default function Profile() {
  const isLoading = useMinimumLoading(300)
  const { auth } = useAuth()
  const [userData, setUserData] = useState(null)
  const [fetchingUser, setFetchingUser] = useState(false)

  // Fetch current user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.user?.uid) return
      
      setFetchingUser(true)
      try {
        const response = await userApi.getById(auth.user.uid)
        console.log('/api/users/:id response:', response)
        console.log('userData photoURL:', response?.data?.user?.photoURL)
        console.log('userData full user object:', response?.data?.user)
        console.log('auth.user avatarUrl:', auth.user?.avatarUrl)
        setUserData(response?.data?.user || response)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        toast.error('Failed to load user data')
      } finally {
        setFetchingUser(false)
      }
    }

    fetchUserData()
  }, [auth.user?.uid])

  if (isLoading || fetchingUser) {
    return <EcoLoader />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading title="My Profile" subtitle="Your personal eco-journey dashboard" />
      
      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="text-center mb-8">
            {/* Use photoURL from database if available, fallback to auth user avatar */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center relative">
              {(() => {
                const imageUrl = userData?.photoURL || auth.user?.avatarUrl
                
                if (imageUrl) {
                  return (
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                      title={userData?.name || auth.user?.name || 'User'}
                    />
                  )
                } else {
                  return (
                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                      {(userData?.name || auth.user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )
                }
              })()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{userData?.name || auth.user?.name || 'Eco User'}</h2>
            <p className="text-gray-600">{userData?.email || auth.user?.email}</p>
            {userData?.joinedAt && (
              <p className="text-sm text-gray-500 mt-2">
                Member since {new Date(userData.joinedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">{userData?.stats?.challengesCompleted || 0}</div>
              <div className="text-sm text-emerald-600">Challenges Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{userData?.stats?.eventsAttended || 0}</div>
              <div className="text-sm text-blue-600">Events Attended</div>
            </div>
          </div>
          
          {userData?.stats && (
            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{userData.stats.challengesCreated || 0}</div>
                <div className="text-sm text-purple-600">Challenges Created</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{userData.totalPoints || 0}</div>
                <div className="text-sm text-yellow-600">Total Points</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-700">{userData.level || 1}</div>
                <div className="text-sm text-indigo-600">Level</div>
              </div>
            </div>
          )}
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🚀</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">More Features Coming Soon</h3>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're working hard to create an amazing profile experience for you. 
            This page will include your eco stats, achievements, and personalized dashboard.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            In Development
          </div>
        </div>
      </div>
    </div>
  )
}
