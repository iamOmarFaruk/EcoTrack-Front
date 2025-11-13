import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import { challengeApi } from '../services/api.js'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import toast from 'react-hot-toast'

export default function Challenges() {
  useDocumentTitle('Challenges')
  const { auth } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('All')

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await challengeApi.getAll()
        let challengesData = []
        
        // Handle different response structures
        if (Array.isArray(response)) {
          challengesData = response
        } else if (response && Array.isArray(response.challenges)) {
          challengesData = response.challenges
        } else if (response && response.data && Array.isArray(response.data.challenges)) {
          challengesData = response.data.challenges
        } else {
          console.warn('API returned unexpected format:', response)
          throw new Error('Invalid response format from server')
        }

        // Check if we have any challenges
        if (challengesData.length === 0) {
          setError({ type: 'no-data', message: 'No challenges available at the moment. Check back later for new environmental challenges!' })
          setChallenges([])
          return
        }

        // Transform API data to match component expectations
        const transformedChallenges = challengesData.map(challenge => ({
          _id: challenge._id || challenge.id,
          title: challenge.title,
          description: challenge.description,
          category: formatCategory(challenge.category),
          difficulty: challenge.difficultyLevel,
          duration: challenge.duration,
          carbonImpact: challenge.carbonImpact,
          isActive: challenge.isActive,
          startDate: challenge.startDate,
          endDate: challenge.endDate,
          goals: challenge.goals || [],
          tips: challenge.tips || [],
          rewards: challenge.rewards || { points: 0, badges: [] },
          // Add missing fields with defaults
          participants: Math.floor(Math.random() * 1000) + 100, // TODO: Get real participant count from API
          imageUrl: getImageForCategory(challenge.category),
          impactMetric: getImpactMetricForCategory(challenge.category),
          createdAt: challenge.createdAt,
          updatedAt: challenge.updatedAt
        }))
        
        setChallenges(transformedChallenges)
      } catch (error) {
        console.error('Error fetching challenges:', error)
        
        // Set specific error messages based on error type
        if (error.status === 0) {
          setError({ 
            type: 'network', 
            message: 'Unable to connect to the server. Please check your internet connection and try again.' 
          })
        } else if (error.status === 404) {
          setError({ 
            type: 'backend', 
            message: 'Challenge service is currently unavailable. Our team is working to resolve this issue.' 
          })
        } else if (error.status === 500) {
          setError({ 
            type: 'server', 
            message: 'Server error occurred while loading challenges. Please try again in a few minutes.' 
          })
        } else {
          setError({ 
            type: 'general', 
            message: 'Failed to load challenges. Please refresh the page or try again later.' 
          })
        }
        setChallenges([])
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  // Helper function to format category names
  const formatCategory = (category) => {
    if (!category) return 'General'
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  // Helper function to get appropriate image for category
  const getImageForCategory = (category) => {
    const categoryImages = {
      'waste-reduction': 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1200&auto=format&fit=crop',
      'energy-conservation': 'https://images.unsplash.com/photo-1498146831523-fbe41acdc5ad?q=80&w=1200&auto=format&fit=crop',
      'food': 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop',
      'water': 'https://images.unsplash.com/photo-1521207418485-99c705420785?q=80&w=1200&auto=format&fit=crop',
      'community': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
      'transportation': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop'
    }
    return categoryImages[category] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop'
  }

  // Helper function to get impact metric for category
  const getImpactMetricForCategory = (category) => {
    const impactMetrics = {
      'waste-reduction': 'Plastic items avoided',
      'energy-conservation': 'kWh saved',
      'food': 'CO₂ reduced',
      'water': 'Liters saved',
      'community': 'Impact points',
      'transportation': 'CO₂ saved'
    }
    return impactMetrics[category] || 'Environmental impact'
  }

  const categories = useMemo(
    () => ['All', ...Array.from(new Set((challenges ?? []).map((c) => c.category)))],
    [challenges]
  )
  
  const filtered = useMemo(
    () => (category === 'All' ? challenges ?? [] : (challenges ?? []).filter((c) => c.category === category)),
    [challenges, category]
  )

  if (loading) {
    return <EcoLoader />
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="full-bleed -mt-8">
          <SubpageHero
            title="Eco Challenges"
            subtitle="Join our community challenges and make a positive impact on the environment"
            backgroundImage="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop"
            height="medium"
            overlayIntensity="medium"
          />
        </div>

        {/* Error Message */}
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-6 p-4 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {error.type === 'no-data' ? 'No Challenges Available' : 'Unable to Load Challenges'}
          </h3>
          <p className="text-slate-600 mb-6 max-w-md">
            {error.message}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </Button>
          {auth.isLoggedIn && error.type === 'no-data' && (
            <div className="mt-4">
              <Button
                as={Link}
                to="/challenges/add"
                variant="outline"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create the First Challenge
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title="Eco Challenges"
          subtitle="Join our community challenges and make a positive impact on the environment"
          backgroundImage="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop"
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Browse Challenges</h2>
            <p className="mt-1 text-sm sm:text-base text-slate-900">Find and join challenges that match your interests.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-900 whitespace-nowrap">Category</label>
              <select
                className="flex-1 sm:flex-initial rounded-md border pl-3 pr-8 py-2 text-sm min-w-0 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 8px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px 16px'
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {auth.isLoggedIn && (
              <Button
                as={Link}
                to="/challenges/add"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Challenge
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <LazyChallengeCard key={c._id} challenge={c} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="mb-4 p-3 rounded-full bg-slate-100">
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No challenges found</h3>
              <p className="text-slate-600 mb-4">
                {category === 'All' 
                  ? 'No challenges are currently available.'
                  : `No challenges found in the "${category}" category.`
                }
              </p>
              <Button
                onClick={() => setCategory('All')}
                variant="outline"
                className="text-sm"
              >
                View All Categories
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


