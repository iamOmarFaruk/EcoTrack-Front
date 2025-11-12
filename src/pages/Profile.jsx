import SectionHeading from '../components/SectionHeading.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

export default function Profile() {
  const isLoading = useMinimumLoading(300)

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading title="My Profile" subtitle="Your personal eco-journey dashboard" />
      
      <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👤</span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Profile Page Coming Soon</h3>
        
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          We're working hard to create an amazing profile experience for you. 
          This page will include your eco stats, achievements, and personalized dashboard.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          I will make it later
        </div>
      </div>
    </div>
  )
}
