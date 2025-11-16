import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import { challengeApi } from '../services/api.js'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { defaultImages } from '../config/env'
import toast from 'react-hot-toast'

export default function Challenges() {
  useDocumentTitle('Challenges')
  const { auth } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('All')
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build query parameters
        const params = {
          page: currentPage,
          limit: 12,
          sortBy,
          order
        }
        
        if (searchQuery) params.search = searchQuery
        if (category !== 'All') params.category = category
        
        const response = await challengeApi.getAll(params)
        
        // Handle new API response structure
        let challengesData = []
        let paginationData = null
        
        if (response && response.data) {
          challengesData = response.data
          paginationData = response.pagination
        } else if (Array.isArray(response)) {
          challengesData = response
        }

        // Check if we have any challenges
        if (challengesData.length === 0 && currentPage === 1) {
          setError({ type: 'no-data', message: 'No challenges available at the moment. Check back later for new environmental challenges!' })
          setChallenges([])
          setPagination(null)
          return
        }

        // Transform API data to match component expectations
        const transformedChallenges = challengesData.map(challenge => ({
          _id: challenge.id || challenge._id,
          slug: challenge.slug || '', // Store slug for SEO-friendly URLs
          title: challenge.title || 'No data',
          description: challenge.shortDescription || challenge.description || 'No data',
          category: challenge.category || 'No data',
          duration: challenge.duration || 'No data',
          startDate: challenge.startDate || 'No data',
          endDate: challenge.endDate || 'No data',
          status: challenge.status || 'active',
          imageUrl: challenge.image || challenge.imageUrl || 'No data',
          participants: challenge.registeredParticipants ?? (Array.isArray(challenge.participants) ? challenge.participants.length : challenge.participants) ?? 0,
          impactMetric: challenge.impact || challenge.impactMetric || 'No data',
          co2Saved: challenge.co2Saved || null,
          featured: challenge.featured || false,
          isJoined: challenge.isJoined || false,
          isCreator: challenge.isCreator || false
        }))
        
        setChallenges(transformedChallenges)
        setPagination(paginationData)
      } catch (error) {
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
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [currentPage, category, searchQuery, sortBy, order])

  // Define valid categories based on backend API
  const categories = useMemo(
    () => ['All', 'Food', 'Waste Reduction', 'Energy Conservation', 'Water', 'Community'],
    []
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
            backgroundImage={defaultImages.challengesHero}
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
          backgroundImage={defaultImages.challengesHero}
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Browse Challenges</h2>
              <p className="mt-1 text-sm sm:text-base text-slate-900">Find and join challenges that match your interests.</p>
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

          {/* Filters - Hidden for now */}
          {/* <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'left 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px 16px'
                }}
              />
            </div>
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
                onChange={(e) => {
                  setCategory(e.target.value)
                  setCurrentPage(1)
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-900 whitespace-nowrap">Sort by</label>
              <select
                className="flex-1 sm:flex-initial rounded-md border pl-3 pr-8 py-2 text-sm min-w-0 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 8px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px 16px'
                }}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="createdAt">Newest</option>
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
                <option value="participants">Most Popular</option>
              </select>
            </div>
          </div> */}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.length > 0 ? (
            challenges.map((c) => (
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
                {category === 'All' && !searchQuery
                  ? 'No challenges are currently available.'
                  : `No challenges found matching your filters.`
                }
              </p>
              <Button
                onClick={() => {
                  setCategory('All')
                  setSearchQuery('')
                }}
                variant="outline"
                className="text-sm"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-slate-900">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= pagination.pages}
              variant="outline"
              className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


