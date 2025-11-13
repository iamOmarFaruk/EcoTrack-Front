import { useState, useEffect } from 'react'
import { challengeApi } from '../services/api.js'
import { mockChallenges } from '../data/mockChallenges.js'

export default function TestAPI() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        setUsingMockData(false)
        
        // Fetch data from your backend
        const response = await challengeApi.getAll()
        console.log('API Response:', response)
        
        // Check if we got valid data
        if (response && (Array.isArray(response) || Array.isArray(response.challenges))) {
          setData(response)
        } else {
          console.warn('API returned unexpected format:', response)
          setData(mockChallenges)
          setUsingMockData(true)
          setError('API returned unexpected format, showing mock data')
        }
      } catch (err) {
        console.error('API Error:', err)
        setError(`${err.message} (Status: ${err.status || 'Unknown'})`)
        // Use mock data as fallback
        setData(mockChallenges)
        setUsingMockData(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Backend API</h1>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
          <span>Loading data from http://localhost:5001/api/challenges...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Backend API</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h2 className="text-red-800 font-semibold">Error fetching data:</h2>
          <p className="text-red-700 mt-1">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure your backend is running on http://localhost:5001
          </p>
        </div>
        
        {usingMockData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-yellow-800 font-semibold">Using Mock Data</h2>
            <p className="text-yellow-700 mt-1">
              Displaying demo data since the backend API is not available.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Backend API Data</h1>
      
      {usingMockData ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-yellow-800 font-semibold">⚠️ Using Mock Data</h2>
          <p className="text-yellow-700 mt-1">
            Backend API not available. Displaying demo data from: <code className="bg-yellow-100 px-2 py-1 rounded">mockChallenges.js</code>
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-green-800 font-semibold">✅ Connected to Backend</h2>
          <p className="text-green-700 mt-1">
            Data fetched from: <code className="bg-green-100 px-2 py-1 rounded">http://localhost:5001/api/challenges</code>
          </p>
        </div>
      )}
      
      {/* Raw JSON Display */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Raw JSON Response:</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {/* Formatted Display */}
      {Array.isArray(data) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Challenges Found: {data.length}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((challenge, index) => (
              <div key={challenge._id || challenge.id || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{challenge.category}</p>
                <p className="text-sm text-gray-700 mb-3">{challenge.description}</p>
                
                {challenge.imageUrl && (
                  <img 
                    src={challenge.imageUrl} 
                    alt={challenge.title}
                    className="w-full h-32 object-cover rounded mb-2"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Duration: {challenge.duration}</div>
                  <div>Target: {challenge.target}</div>
                  {challenge.participants !== undefined && (
                    <div>Participants: {challenge.participants}</div>
                  )}
                  {challenge.createdAt && (
                    <div>Created: {new Date(challenge.createdAt).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Handle case where API returns { challenges: [...] } */}
      {data && !Array.isArray(data) && data.challenges && Array.isArray(data.challenges) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Challenges Found: {data.challenges.length}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.challenges.map((challenge, index) => (
              <div key={challenge._id || challenge.id || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{challenge.category}</p>
                <p className="text-sm text-gray-700 mb-3">{challenge.description}</p>
                
                {challenge.imageUrl && (
                  <img 
                    src={challenge.imageUrl} 
                    alt={challenge.title}
                    className="w-full h-32 object-cover rounded mb-2"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Duration: {challenge.duration}</div>
                  <div>Target: {challenge.target}</div>
                  {challenge.participants !== undefined && (
                    <div>Participants: {challenge.participants}</div>
                  )}
                  {challenge.createdAt && (
                    <div>Created: {new Date(challenge.createdAt).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If data is not an array, show object properties */}
      {data && !Array.isArray(data) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Data Properties:</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="mb-2">
                <span className="font-medium">{key}:</span> {' '}
                <span className="text-gray-700">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}