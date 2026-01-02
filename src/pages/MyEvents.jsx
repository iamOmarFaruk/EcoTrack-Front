import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { formatDate } from '../utils/formatDate.js'
import { useMyEvents, useMyJoinedEvents } from '../hooks/queries'

export default function MyEvents() {
  useDocumentTitle('My Events')
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('created') // created or joined

  const {
    data: createdData = { events: [], stats: null },
    isLoading: loadingCreated
  } = useMyEvents()

  const {
    data: joinedData = { events: [], stats: null },
    isLoading: loadingJoined
  } = useMyJoinedEvents('upcoming')

  const loading = activeTab === 'created' ? loadingCreated : loadingJoined
  const events = activeTab === 'created' ? createdData.events : joinedData.events
  const stats = activeTab === 'created' ? createdData.stats : joinedData.stats

  const handleCreateEvent = () => {
    navigate('/events/add')
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-primary/15 text-primary',
      cancelled: 'bg-danger/15 text-danger',
      completed: 'bg-muted text-text'
    }
    return badges[status] || badges.active
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'created'
              ? 'bg-primary text-surface'
              : 'bg-surface text-text/80 border border-border hover:bg-light'
            }`}
        >
          Events I Created
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === 'joined'
              ? 'bg-primary text-surface'
              : 'bg-surface text-text/80 border border-border hover:bg-light'
            }`}
        >
          Events I Joined
        </button>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activeTab === 'created' ? (
            <>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.active || 0}</div>
                  <div className="text-sm text-text/80 mt-1">Active Events</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-secondary">{stats.completed || 0}</div>
                  <div className="text-sm text-text/80 mt-1">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-danger">{stats.cancelled || 0}</div>
                  <div className="text-sm text-text/80 mt-1">Cancelled</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-secondary">{stats.totalParticipants || 0}</div>
                  <div className="text-sm text-text/80 mt-1">Total Participants</div>
                </CardContent>
              </Card>
            </>
          ) : (
            // Stats for joined events
            <>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.upcoming || 0}</div>
                  <div className="text-sm text-text/80 mt-1">Upcoming</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-secondary">{stats.past || 0}</div>
                  <div className="text-sm text-text/80 mt-1">Past Events</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-text">{stats.total || 0}</div>
                  <div className="text-sm text-text/80 mt-1">Total Joined</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <EcoLoader />
      ) : events.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 border border-border shadow-sm text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/15 to-primary/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📅</span>
          </div>
          <h3 className="text-2xl font-bold text-heading mb-4">
            {activeTab === 'created' ? 'No events created yet' : 'No events joined yet'}
          </h3>
          <p className="text-lg text-text/80 mb-6 max-w-2xl mx-auto">
            {activeTab === 'created'
              ? 'Start creating eco-friendly events and bring your community together!'
              : 'Browse available events and join the ones that interest you!'}
          </p>
          {activeTab === 'created' ? (
            <Button onClick={handleCreateEvent} className="bg-primary hover:bg-primary">
              Create Your First Event
            </Button>
          ) : (
            <Button onClick={() => navigate('/events')} className="bg-primary hover:bg-primary">
              Browse Events
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            // Use slug for SEO-friendly URLs, fallback to _id
            const identifier = event.slug || event._id
            return (
              <Card key={event._id} className="h-full">
                <CardContent className="flex h-full flex-col">
                  {/* Event Image */}
                  {event.image && (
                    <div className="h-48 -mt-4 -mx-4 mb-4 bg-muted rounded-t-lg overflow-hidden">
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
                  <p className="text-sm text-text/80 mb-2">
                    📅 {formatDate(event.date)}
                  </p>
                  <p className="text-sm text-text/80 mb-3">
                    📍 {event.location}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-text line-clamp-2 mb-4 flex-grow">
                    {event.description}
                  </p>

                  {/* Participants Info */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text/80">Participants</span>
                      <span className="font-medium">
                        {event.registeredParticipants} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round((event.registeredParticipants / event.capacity) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/events/${identifier}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {activeTab === 'created' && (
                      <Link
                        to={`/events/${identifier}/edit`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-secondary hover:bg-secondary">
                          Edit
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create Event Button (for joined events tab) */}
      {activeTab === 'joined' && events.length > 0 && (
        <div className="text-center pt-4">
          <Button onClick={handleCreateEvent} className="bg-primary hover:bg-primary">
            Create Your Own Event
          </Button>
        </div>
      )}
    </div>
  )
}
