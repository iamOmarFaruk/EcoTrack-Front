import SectionHeading from '../components/SectionHeading.jsx'

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeading title="Settings" subtitle="Customize your experience" />
      
      <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-emerald-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We're working on exciting new settings and customization options. 
            Check back soon for updates!
          </p>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>🌱 Stay tuned for more eco-friendly features</p>
        </div>
      </div>
    </div>
  )
}
