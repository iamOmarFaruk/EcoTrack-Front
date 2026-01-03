import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import { ChallengeCardSkeleton } from '../components/Skeleton.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import FilterSidebar from '../components/FilterSidebar.jsx'
import { defaultImages } from '../config/env'
import { useChallenges } from '../hooks/queries'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'

export default function Challenges() {
  useDocumentTitle('Challenges')
  const { auth } = useAuth()

  // Filter State
  const [filterState, setFilterState] = useState({
    category: 'All',
    search: '',
    sortBy: 'createdAt', // Default to Newest
    order: 'desc',
    status: '', // All statuses by default
    featured: false
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Build query filters
  const filters = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 12,
      sortBy: filterState.sortBy,
      order: filterState.order
    }
    if (filterState.search) params.search = filterState.search
    if (filterState.category !== 'All') params.category = filterState.category
    if (filterState.status) params.status = filterState.status
    if (filterState.featured) params.featured = true

    return params
  }, [currentPage, filterState])

  // Fetch challenges
  const {
    data: challenges = [],
    isLoading: loading,
    error
  } = useChallenges(filters)

  // Debug logs
  // console.log('[Challenges Page] Filters:', filters)
  // console.log('[Challenges Page] Loading:', loading)
  // console.log('[Challenges Page] Challenges:', challenges)
  if (error) console.error('[Challenges Page] Error:', error)

  // Determine pagination (Placeholder logic as useChallenges returns array currently)
  const pagination = {
    page: currentPage,
    pages: 1, // Placeholder
    total: challenges.length
  }

  // Define valid categories based on backend API
  const categories = useMemo(
    () => ['All', 'Food', 'Waste Reduction', 'Energy Conservation', 'Water', 'Community'],
    []
  )

  const handleSetFilter = (key, value) => {
    setFilterState(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilterState({
      category: 'All',
      search: '',
      sortBy: 'createdAt',
      order: 'desc',
      status: '',
      featured: false
    })
    setCurrentPage(1)
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
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
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

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <FilterSidebar
              filters={filterState}
              setFilter={handleSetFilter}
              clearFilters={clearFilters}
              categories={categories}
            />
          </div>
        </aside>

        {/* Main Content Area (Right) */}
        <div className="lg:col-span-9 space-y-6">

          {/* Header & Mobile Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-1">
            <div>
              <h2 className="text-2xl font-bold text-heading">Browse Challenges</h2>
              <p className="mt-1 text-text">Find and join challenges that match your interests.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </Button>

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

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="bg-surface rounded-xl border border-border p-4 mb-6 shadow-sm">
                  <FilterSidebar
                    filters={filterState}
                    setFilter={handleSetFilter}
                    clearFilters={clearFilters}
                    categories={categories}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="text-sm text-text/50 mb-2 px-1">
            Showing {challenges.length} challenges
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-skeletons"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div key={`skeleton-${i}`} variants={itemVariants}>
                    <ChallengeCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : challenges.length > 0 ? (
              <motion.div
                key={`challenges-grid-${challenges.length}-${filterState.category}-${filterState.search}-${filterState.sortBy}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {challenges.map((c) => (
                  <motion.div key={c._id || c.id} variants={itemVariants}>
                    <LazyChallengeCard challenge={c} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full py-12"
              >
                <div className="bg-surface rounded-xl p-12 border border-border dashed text-center max-w-2xl mx-auto">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-full bg-primary/5">
                      <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">No matches found</h3>
                  <p className="text-text/70 mb-6">
                    We couldn't find any challenges matching your current filters.
                    Try adjusting your search or categories.
                  </p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-heading font-medium">
                Page {pagination.page}
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
    </div>
  )
}
