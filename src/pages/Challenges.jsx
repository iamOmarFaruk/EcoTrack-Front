import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { defaultImages } from '../config/env'
import { useChallenges } from '../hooks/queries'

export default function Challenges() {
  useDocumentTitle('Challenges')
  const { auth } = useAuth()
  const [category, setCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')

  // Build query filters
  const filters = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 12,
      sortBy,
      order
    }
    if (searchQuery) params.search = searchQuery
    if (category !== 'All') params.category = category
    return params
  }, [currentPage, category, searchQuery, sortBy, order])

  // Fetch challenges
  const {
    data: challenges = [],
    isLoading: loading,
    error
  } = useChallenges(filters)

  // Use dummy pagination for now since API wrapper might not return it in normalized data
  // If we need real pagination, we'd need useQuery to return the whole response object, not just data array
  // For now, infinite scroll or simple "Load More" might be better with useInfiniteQuery, 
  // but sticking to existing structure:
  const pagination = {
    page: currentPage,
    pages: 1, // Placeholder until hook returns metadata
    total: challenges.length
  }

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
          <div className="mb-6 p-4 rounded-full bg-danger/15">
            <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-heading mb-2">
            {error.type === 'no-data' ? 'No Challenges Available' : 'Unable to Load Challenges'}
          </h3>
          <p className="text-text/80 mb-6 max-w-md">
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
              <p className="mt-1 text-sm sm:text-base text-heading">Find and join challenges that match your interests.</p>
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
                className="w-full rounded-md border border-border pl-10 pr-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'left 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px 16px'
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-heading whitespace-nowrap">Category</label>
              <select
                className="flex-1 sm:flex-initial rounded-md border pl-3 pr-8 py-2 text-sm min-w-0 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface appearance-none"
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
              <label className="text-sm text-heading whitespace-nowrap">Sort by</label>
              <select
                className="flex-1 sm:flex-initial rounded-md border pl-3 pr-8 py-2 text-sm min-w-0 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-surface appearance-none"
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
              <div className="mb-4 p-3 rounded-full bg-muted">
                <svg className="w-6 h-6 text-text/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-heading mb-2">No challenges found</h3>
              <p className="text-text/80 mb-4">
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
            <span className="px-4 py-2 text-heading">
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


