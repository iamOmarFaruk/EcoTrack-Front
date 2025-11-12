import SectionHeading from '../components/SectionHeading.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

export default function MyActivities() {
  const isLoading = useMinimumLoading(300)

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeading title="My Activities" subtitle="Track your eco-friendly journey and achievements" />
      
      <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🌱</span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">My Activities Coming Soon</h3>
        
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          We're developing an amazing activity tracking system for you. 
          This page will include your challenges, achievements, environmental impact, and progress analytics.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          I will make it later
        </div>
      </div>
    </div>
  )
}
