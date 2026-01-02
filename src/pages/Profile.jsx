import { useMemo } from 'react'
import SectionHeading from '../components/SectionHeading.jsx'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { useUserProfile } from '../hooks/queries'

export default function Profile() {
  const { auth } = useAuth()

  const {
    data: userData,
    isLoading
  } = useUserProfile()

  if (isLoading) {
    return <EcoLoader />
  }

  // Fallback to auth user if profile data is missing/loading but we have auth
  const displayUser = userData || (auth.user ? {
    displayName: auth.user.name,
    email: auth.user.email,
    photoURL: auth.user.avatarUrl,
    ...userData // merge any partial data
  } : null)

  // Create a safe user object to render
  const safeUserData = displayUser || {}; (userData || {}) // Ensure we have an object


  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading
        badge="Your Dashboard"
        title="My Profile"
        subtitle="Your personal eco-journey dashboard"
      />

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="bg-surface rounded-xl p-8 border border-border shadow-sm">
          <div className="text-center mb-8">
            {/* Use photoURL from database if available, fallback to auth user avatar */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-primary/15 flex items-center justify-center relative">
              {(() => {
                // Priority: auth.user (Firebase) > userData (database) for most up-to-date info
                const imageUrl = auth.user?.avatarUrl || userData?.photoURL
                const displayName = auth.user?.name || userData?.displayName || 'User'

                if (imageUrl) {
                  return (
                    <div
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                      title={displayName}
                    />
                  )
                } else {
                  return (
                    <div className="w-full h-full bg-primary/100 flex items-center justify-center text-surface text-2xl font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )
                }
              })()}
            </div>
            <h2 className="text-2xl font-bold text-heading">{auth.user?.name || userData?.displayName || 'Eco User'}</h2>
            <p className="text-text/80">{auth.user?.email || userData?.email}</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-text/70">
              {userData?.membershipDuration && (
                <span>Member for {userData.membershipDuration}</span>
              )}
              {userData?.rank && (
                <span className="px-3 py-1 bg-gradient-to-r from-primary/15 to-secondary/15 text-primary rounded-full font-medium">
                  {userData.rank}
                </span>
              )}
            </div>
          </div>

          {/* Badges Section */}
          {userData?.badges && userData.badges.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-heading mb-3">Badges Earned</h3>
              <div className="flex flex-wrap gap-3">
                {userData.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full shadow-sm border border-yellow-200"
                    title={badge.category}
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-sm font-medium text-text">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coming Soon Card */}
        <div className="bg-surface rounded-xl p-8 border border-border shadow-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🚀</span>
          </div>

          <h3 className="text-xl font-bold text-heading mb-4">More Features Coming Soon</h3>

          <p className="text-text/80 mb-6 max-w-2xl mx-auto">
            We're working hard to create an amazing profile experience for you.
            This page will include your eco stats, achievements, and personalized dashboard.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 text-primary rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-primary/100 rounded-full animate-pulse"></span>
            In Development
          </div>
        </div>
      </div>
    </div>
  )
}
