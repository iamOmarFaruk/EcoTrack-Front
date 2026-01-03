import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import LazyEventCard from '../components/LazyEventCard.jsx'
import { EventCardSkeleton } from '../components/Skeleton.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import EventFilterSidebar from '../components/EventFilterSidebar.jsx'
import { defaultImages } from '../config/env.js'
import { useAuth } from '../context/AuthContext.jsx'
import { showError } from '../utils/toast.jsx'
import { useEvents } from '../hooks/queries'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'

export default function Events() {
  useDocumentTitle('Events')
  const navigate = useNavigate()
  const { user, auth } = useAuth()

  // Filter State
  const [filterState, setFilterState] = useState({
    category: 'All',
    search: '',
    sortBy: 'date',
    order: 'asc',
    status: 'active',
    availability: 'all',
    dateRange: 'all'
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filters = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 12, // Increased for grid layout
      sortBy: filterState.sortBy,
      order: filterState.order
    }
    if (filterState.status && filterState.status !== 'all') params.status = filterState.status
    if (filterState.category && filterState.category !== 'All') params.category = filterState.category
    if (filterState.availability && filterState.availability !== 'all') params.availability = filterState.availability
    if (filterState.dateRange && filterState.dateRange !== 'all') params.dateRange = filterState.dateRange
    if (filterState.search.trim()) params.search = filterState.search.trim()

    return params
  }, [currentPage, filterState])

  const { data: events = [], isLoading: loading, error } = useEvents(filters)

  const categories = useMemo(
    () => ['All', 'Tree Planting', 'Waste Management', 'Ocean Cleanup', 'Solar & Energy', 'Community Workshop', 'Sustainable Gardening', 'Other'],
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
      sortBy: 'date',
      order: 'asc',
      status: 'active',
      availability: 'all',
      dateRange: 'all'
    })
    setCurrentPage(1)
  }

  const handleCreateEvent = () => {
    if (!user) {
      showError('Please log in to create an event')
      navigate('/login')
      return
    }
    navigate('/events/add')
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="full-bleed -mt-8">
          <SubpageHero
            title="Eco Events"
            subtitle="Join community events and connect with like-minded environmental advocates"
            backgroundImage={defaultImages.eventsHero}
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
            Unable to Load Events
          </h3>
          <p className="text-text/80 mb-6 max-w-md">
            {error.message || 'There was an issue connecting to the server.'}
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
          title="Eco Events"
          subtitle="Join community events and connect with like-minded environmental advocates"
          backgroundImage={defaultImages.eventsHero}
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            <EventFilterSidebar
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
              <h2 className="text-2xl font-bold text-heading">Eco-Friendly Events</h2>
              <p className="mt-1 text-text">Discover and participate in eco-friendly events near you</p>
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

              <Button
                onClick={handleCreateEvent}
                className="bg-primary hover:bg-primary whitespace-nowrap flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Event
              </Button>
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
                  <EventFilterSidebar
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
            Showing {events.length} events
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
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={`skeleton-${i}`} variants={itemVariants}>
                    <EventCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="events-content"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {events.map((event) => (
                  <motion.div key={event._id || event.id} variants={itemVariants}>
                    <LazyEventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && events.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 px-4"
            >
              <div className="bg-surface rounded-xl p-12 border border-border dashed text-center max-w-2xl mx-auto">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-primary/5">
                    <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-heading mb-3">No events found</h3>
                <p className="text-text/70 mb-8 max-w-md mx-auto">
                  {filterState.search
                    ? `We couldn't find any events matching "${filterState.search}". Try a different search term.`
                    : 'We couldn\'t find any events matching your current filters. Try adjusting them to see more results!'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                  {user && (
                    <Button onClick={handleCreateEvent} className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create First Event
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}


