import SectionHeading from '../components/SectionHeading.jsx'

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeading title="Settings" subtitle="Customize your experience" />
      
      {/* Coming Soon Card */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🚀</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4">More Features Coming Soon</h3>
        
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          We're working hard to bring you powerful settings and customization options. 
          Stay tuned for updates!
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          In Development
        </div>
      </div>
    </div>
  )
}
