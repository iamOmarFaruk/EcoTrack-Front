import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { eventApi } from '../services/api.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { defaultImages } from '../config/env.js'
import { formatDate } from '../utils/formatDate.js'
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast.jsx'

export default function MyEvents() {
  useDocumentTitle('My Events')
  const navigate = useNavigate()
  
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('created') // created or joined

  useEffect(() => {
    if (activeTab === 'created') {
      fetchMyEvents()
    } else {
      fetchJoinedEvents()
    }
  }, [activeTab])

  const fetchMyEvents = async () => {
    try {
      setLoading(true)
      const response = await eventApi.getMyEvents()
      const data = response?.data || response
      
      setEvents(data?.events || [])
      setStats(data?.stats || null)
    } catch (error) {
      console.error('Error fetching my events:', error)
      showError('Failed to load your events')
    } finally {
      setLoading(false)
    }
  }

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true)
      const response = await eventApi.getMyJoined('upcoming')
      const data = response?.data || response
      
      setEvents(data?.events || [])
      // Stats structure might be different for joined events
      setStats({
        total: data?.total || 0,
        upcoming: data?.upcoming || 0,
        past: data?.past || 0
      })
    } catch (error) {
      console.error('Error fetching joined events:', error)
      showError('Failed to load joined events')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = () => {
    navigate('/events/add')
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-gray-100 text-gray-700'
    }
    return badges[status] || badges.active
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'created'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Events I Created
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'joined'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Events I Joined
        </button>
      </div>

      {/* Stats Section - Only for created events */}
      {activeTab === 'created' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.active || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Active Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.completed || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.cancelled || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Cancelled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalParticipants || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Total Participants</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <EcoLoader />
      ) : events.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📅</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {activeTab === 'created' ? 'No events created yet' : 'No events joined yet'}
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {activeTab === 'created' 
              ? 'Start creating eco-friendly events and bring your community together!' 
              : 'Browse available events and join the ones that interest you!'}
          </p>
          {activeTab === 'created' ? (
            <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-700">
              Create Your First Event
            </Button>
          ) : (
            <Button onClick={() => navigate('/events')} className="bg-green-600 hover:bg-green-700">
              Browse Events
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event._id || event.id} className="h-full">
              <CardContent className="flex h-full flex-col">
                {/* Event Image */}
                {event.image && (
                  <div className="h-48 -mt-4 -mx-4 mb-4 bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Status Badge */}
                <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusBadge(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>

                {/* Date & Location */}
                <p className="text-sm text-slate-600 mb-2">
                  📅 {formatDate(event.date)}
                </p>
                <p className="text-sm text-slate-600 mb-3">
                  📍 {event.location}
                </p>

                {/* Description */}
                <p className="text-sm text-slate-700 line-clamp-2 mb-4 flex-grow">
                  {event.description}
                </p>

                {/* Participants Info */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Participants</span>
                    <span className="font-medium">
                      {event.registeredParticipants} / {event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round((event.registeredParticipants / event.capacity) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/events/${event.id || event._id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  {activeTab === 'created' && (
                    <Link
                      to={`/events/${event.id || event._id}/edit`}
                      className="flex-1"
                    >
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Button (for joined events tab) */}
      {activeTab === 'joined' && events.length > 0 && (
        <div className="text-center pt-4">
          <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-700">
            Create Your Own Event
          </Button>
        </div>
      )}
    </div>
  )
}
