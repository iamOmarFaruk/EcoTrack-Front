import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import LazyEventCard from '../components/LazyEventCard.jsx'
import { EventCardSkeleton } from '../components/Skeleton.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { defaultImages } from '../config/env.js'
import { useAuth } from '../context/AuthContext.jsx'
import { showError } from '../utils/toast.jsx'
import { useEvents } from '../hooks/queries'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'

export default function Events() {
  useDocumentTitle('Events')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [sortBy, setSortBy] = useState('date')

  const filters = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 9,
      sortBy,
      order: 'asc'
    }
    if (statusFilter !== 'all') params.status = statusFilter
    if (searchQuery.trim()) params.search = searchQuery.trim()
    return params
  }, [currentPage, statusFilter, sortBy, searchQuery])

  const { data: events = [], isLoading: loading, error } = useEvents(filters)

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
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-danger/10">
              <svg className="h-8 w-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">Failed to load events</h3>
          <p className="text-text/70 mb-6">{error.message || 'There was an issue connecting to the server.'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const handleSearch = (e) => {
    e.preventDefault()
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

  return (
    <div className="space-y-8">
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

      {/* Content Section */}
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Eco-Friendly Events</h2>
            <p className="mt-1 text-sm sm:text-base text-text/80">
              Discover and participate in eco-friendly events near you
            </p>
          </div>
          <Button
            onClick={handleCreateEvent}
            className="bg-primary hover:bg-primary whitespace-nowrap"
          >
            + Create Event
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-surface p-4 rounded-lg border border-border space-y-4" style={{ display: 'none' }}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, location, or organizer..."
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button type="submit">Search</Button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="createdAt">Recently Added</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>
          </div>
        </div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={loading ? 'loading' : 'loaded'}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={`skeleton-${i}`} variants={itemVariants}>
                <EventCardSkeleton />
              </motion.div>
            ))
          ) : events.length > 0 ? (
            events.map((event) => (
              <motion.div key={event._id || event.id} variants={itemVariants}>
                <LazyEventCard event={event} />
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="col-span-full py-16 px-4">
              <div className="bg-surface rounded-xl p-12 border border-border dashed text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl opacity-50">🌍</span>
                </div>
                <h3 className="text-2xl font-bold text-heading mb-4">No events found</h3>
                <p className="text-lg text-text/70 mb-8 max-w-2xl mx-auto">
                  {searchQuery ? 'We couldn\'t find any events matching your search criteria.' : 'Be the first to create an eco-friendly event and lead the way in your community!'}
                </p>
                {user && (
                  <Button onClick={handleCreateEvent} className="bg-primary hover:bg-primary">
                    Create First Event
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}


