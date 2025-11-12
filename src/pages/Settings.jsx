import SectionHeading from '../components/SectionHeading.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

export default function Settings() {
  const isLoading = useMinimumLoading(300)

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading title="Settings" subtitle="Customize your EcoTrack experience" />
      
      <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚙️</span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Settings Coming Soon</h3>
        
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          We're building comprehensive settings and customization options for your EcoTrack experience. 
          This page will include preferences, notifications, privacy controls, and much more.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          I will make it later
        </div>
      </div>
    </div>
  )
}
