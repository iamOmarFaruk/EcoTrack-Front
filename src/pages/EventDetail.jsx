import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { eventApi } from '../services/api.js'
import { formatDate } from '../utils/formatDate.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import NotFound from './NotFound.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { showSuccess, showError, showDeleteConfirmation } from '../utils/toast.jsx'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, joinEvent, leaveEvent, auth } = useAuth()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  useDocumentTitle(event ? event.title : 'Event Details')

  useEffect(() => {
    fetchEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await eventApi.getById(id)
      const eventData = response?.data?.event || response?.event || response
      
      if (!eventData) {
        setNotFound(true)
        return
      }
      
      setEvent(eventData)
    } catch (error) {
      console.error('Error fetching event:', error)
      if (error.status === 404) {
        setNotFound(true)
      } else {
        showError('Failed to load event')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleJoinEvent = async () => {
    if (!user) {
      showError('Please log in to join this event')
      navigate('/login')
      return
    }

    setIsJoining(true)
    try {
      const eventId = event._id || event.id
      await joinEvent(eventId)
      showSuccess(`Successfully joined "${event.title}"!`)
      // Refresh event data
      await fetchEvent()
    } catch (error) {
      showError(error.message || 'Failed to join event')
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveEvent = async () => {
    setIsLeaving(true)
    try {
      const eventId = event._id || event.id
      await leaveEvent(eventId)
      showSuccess(`You have left "${event.title}"`)
      // Refresh event data
      await fetchEvent()
    } catch (error) {
      showError(error.message || 'Failed to leave event')
    } finally {
      setIsLeaving(false)
    }
  }

  const handleEditEvent = () => {
    navigate(`/events/${event.id || event._id}/edit`)
  }

  const handleDeleteEvent = async () => {
    showDeleteConfirmation({
      itemName: 'Event',
      onConfirm: async () => {
        setIsDeleting(true)
        try {
          await eventApi.delete(event.id || event._id)
          showSuccess('Event deleted successfully')
          navigate('/events/my-events')
        } catch (error) {
          showError(error.message || 'Failed to delete event')
          setIsDeleting(false)
        }
      }
    })
  }

  const handleGoBack = () => {
    navigate('/events')
  }

  if (loading) {
    return <EcoLoader />
  }

  if (notFound || !event) {
    return <NotFound />
  }

  const progressPercentage = Math.round((event.registeredParticipants / event.capacity) * 100)
  const spotsRemaining = event.capacity - event.registeredParticipants
  const isCreator = user && event.createdBy === user.uid
  
  // Use backend's isJoined field if available, otherwise check userEvents array
  const eventId = event._id || event.id
  const isJoined = event.isJoined ?? auth?.userEvents?.includes(eventId)
  
  const isFull = progressPercentage >= 100
  const isCancelled = event.status === 'cancelled'
  const isPast = new Date(event.date) < new Date()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title={event.title}
          subtitle={`${formatDate(event.date)} • ${event.location}`}
          backgroundImage={event.image}
          height="large"
          overlayIntensity="medium"
        />
      </div>

      {/* Back Button */}
      <div>
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="mb-6"
        >
          ← All Events
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-semibold">About This Event</h2>
              <p className="text-slate-700 leading-relaxed">
                {event.detailedDescription}
              </p>
            </CardContent>
          </Card>

          {/* Requirements & Benefits */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Requirements</h3>
                <p className="text-sm text-slate-700">
                  {event.requirements}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">What You'll Get</h3>
                <p className="text-sm text-slate-700">
                  {event.benefits}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Info Sidebar */}
        <div className="space-y-6">
          {/* Join Event Card or Creator Controls */}
          {isCreator ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-900">Event Management</h3>
                  <p className="text-sm text-green-700 mt-1">
                    You are the organizer of this event
                  </p>
                </div>
                
                {/* Capacity Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Participants</span>
                    <span className="font-medium">
                      {event.registeredParticipants} / {event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 text-center">
                    {spotsRemaining} spots remaining
                  </p>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={handleEditEvent}
                  >
                    Edit Event
                  </Button>
                  <Button 
                    variant="danger"
                    className="w-full bg-red-600 hover:bg-red-700 text-white" 
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Event'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-900">
                    {isJoined ? 'You\'re Registered!' : 'Join This Event'}
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    {isJoined ? 'See you at the event!' : 'Be part of the change in your community'}
                  </p>
                </div>
                
                {/* Status Badges */}
                {(isCancelled || isPast) && (
                  <div className="text-center">
                    {isCancelled && (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Event Cancelled
                      </span>
                    )}
                    {isPast && !isCancelled && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        Event Ended
                      </span>
                    )}
                  </div>
                )}
                
                {/* Capacity Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Participants</span>
                    <span className="font-medium">
                      {event.registeredParticipants} / {event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 text-center">
                    {spotsRemaining} spots remaining
                  </p>
                </div>

                {isJoined ? (
                  <Button 
                    variant="destructive"
                    className="w-full" 
                    onClick={handleLeaveEvent}
                    disabled={isLeaving || isPast}
                  >
                    {isLeaving ? 'Leaving...' : 'Leave Event'}
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={handleJoinEvent}
                    disabled={isFull || isCancelled || isPast || isJoining}
                  >
                    {isJoining ? 'Joining...' : isFull ? 'Event Full' : isCancelled ? 'Event Cancelled' : isPast ? 'Event Ended' : 'Join This Event'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Event Information Card */}
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Event Information</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Date</span>
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Location</span>
                  <span className="font-medium">{event.location}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-medium">{event.duration}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Organizer</span>
                  <span className="font-medium">{event.organizer}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}