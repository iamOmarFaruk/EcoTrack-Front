import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { eventApi } from '../services/api.js'
import LazyEventCard from '../components/LazyEventCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { defaultImages } from '../config/env.js'
import { useAuth } from '../context/AuthContext.jsx'
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast.jsx'

export default function Events() {
  useDocumentTitle('Events')
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, sortBy])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const filters = {
        page: currentPage,
        limit: 9,
        sortBy,
        order: 'asc'
      }

      if (statusFilter !== 'all') {
        filters.status = statusFilter
      }

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim()
      }

      const response = await eventApi.getAll(filters)
      const data = response?.data || response

      setEvents(data?.events || [])
      setPagination(data?.pagination || null)
    } catch (error) {
      console.error('Error fetching events:', error)
      showError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchEvents()
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
            <p className="mt-1 text-sm sm:text-base text-slate-600">
              Discover and participate in eco-friendly events near you
            </p>
          </div>
          <Button
            onClick={handleCreateEvent}
            className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
          >
            + Create Event
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4" style={{ display: 'none' }}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, location, or organizer..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Button type="submit">Search</Button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="createdAt">Recently Added</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <EcoLoader />
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🌍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No events found</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              {searchQuery ? 'Try adjusting your search or filters.' : 'Be the first to create an eco-friendly event!'}
            </p>
            {user && (
              <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-700">
                Create First Event
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <LazyEventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage}
                    variant="outline"
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-slate-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={!pagination.hasNextPage}
                    variant="outline"
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
                <p className="text-sm text-slate-500">
                  Showing {events.length} of {pagination.totalEvents} events
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


