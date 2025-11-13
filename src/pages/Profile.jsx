import SectionHeading from '../components/SectionHeading.jsx'
import ProfileAvatar from '../components/ProfileAvatar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

export default function Profile() {
  const isLoading = useMinimumLoading(300)
  const { auth } = useAuth()

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading title="My Profile" subtitle="Your personal eco-journey dashboard" />
      
      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="text-center mb-8">
            <ProfileAvatar user={auth.user} size="2xl" className="justify-center mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">{auth.user?.name || 'Eco User'}</h2>
            <p className="text-gray-600">{auth.user?.email}</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-700">0</div>
              <div className="text-sm text-emerald-600">Challenges Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">0</div>
              <div className="text-sm text-blue-600">Events Attended</div>
            </div>
          </div>
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
