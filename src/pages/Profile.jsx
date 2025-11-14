import { useState, useEffect } from 'react'
import SectionHeading from '../components/SectionHeading.jsx'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'
import { authApi } from '../services/api.js'
import toast from 'react-hot-toast'

export default function Profile() {
  const isLoading = useMinimumLoading(300)
  const { auth } = useAuth()
  const [userData, setUserData] = useState(null)
  const [fetchingUser, setFetchingUser] = useState(false)

  // Fetch current user data from database using /auth/me endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.user?.uid) return
      
      setFetchingUser(true)
      try {
        const response = await authApi.getMe()
        // response.data contains complete user data with stats, badges, rank
        const userData = response?.data || response
        setUserData(userData)
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
                      title={userData?.displayName || auth.user?.name || 'User'}
                    />
                  )
                } else {
                  return (
                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                      {(userData?.displayName || auth.user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )
                }
              })()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{userData?.displayName || auth.user?.name || 'Eco User'}</h2>
            <p className="text-gray-600">{userData?.email || auth.user?.email}</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-500">
              {userData?.membershipDuration && (
                <span>Member for {userData.membershipDuration}</span>
              )}
              {userData?.rank && (
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-medium">
                  {userData.rank}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">{userData?.stats?.challengesCompleted || 0}</div>
              <div className="text-sm text-emerald-600">Challenges Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{userData?.stats?.challengesJoined || 0}</div>
              <div className="text-sm text-blue-600">Challenges Joined</div>
            </div>
          </div>
          
          {userData?.stats && (
            <div className="grid gap-4 md:grid-cols-4 mt-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{userData.stats.eventsAttended || 0}</div>
                <div className="text-sm text-purple-600">Events Attended</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">{userData.stats.totalImpactPoints || 0}</div>
                <div className="text-sm text-yellow-600">Impact Points</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">{userData.stats.streak || 0}</div>
                <div className="text-sm text-orange-600">Day Streak 🔥</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-700">{userData.stats.tipsShared || 0}</div>
                <div className="text-sm text-pink-600">Tips Shared</div>
              </div>
            </div>
          )}
          
          {/* Badges Section */}
          {userData?.badges && userData.badges.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Badges Earned</h3>
              <div className="flex flex-wrap gap-3">
                {userData.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-yellow-200"
                    title={badge.category}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Next Rank Progress */}
          {userData?.nextRank && (
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Next Rank: {userData.nextRank.rank}</h3>
                <span className="text-sm text-gray-600">{userData.nextRank.pointsNeeded} points needed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, ((userData.stats?.totalImpactPoints || 0) / ((userData.stats?.totalImpactPoints || 0) + userData.nextRank.pointsNeeded)) * 100)}%` 
                  }}
                />
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
