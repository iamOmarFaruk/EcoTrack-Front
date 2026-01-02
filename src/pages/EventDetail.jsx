import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { formatDate } from '../utils/formatDate.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import NotFound from './NotFound.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { showConfirmation } from '../utils/toast.jsx'
import { useEvent, useEventMutations } from '../hooks/queries'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, auth } = useAuth()

  const {
    data: event,
    isLoading: loading,
    error
  } = useEvent(id)

  const { joinEvent, leaveEvent, deleteEvent } = useEventMutations()
  const isJoining = joinEvent.isPending
  const isLeaving = leaveEvent.isPending
  const isDeleting = deleteEvent.isPending

  useDocumentTitle(event ? event.title : 'Event Details')

  const handleJoinEvent = () => {
    if (!user) {
      navigate('/login')
      return
    }
    joinEvent.mutate(event._id)
  }

  const handleLeaveEvent = () => {
    leaveEvent.mutate(event._id)
  }

  const handleDeleteEvent = () => {
    const hasParticipants = event.registeredParticipants > 0
    showConfirmation({
      title: 'Delete Event',
      message: hasParticipants
        ? `This event has ${event.registeredParticipants} registered participant${event.registeredParticipants > 1 ? 's' : ''}. If you delete it, the event will be cancelled and all participants will be notified. This action cannot be undone.`
        : 'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: hasParticipants ? 'Cancel Event' : 'Delete',
      cancelText: 'Go Back',
      type: 'danger',
      onConfirm: () => {
        deleteEvent.mutate(event._id, {
          onSuccess: () => navigate('/events')
        })
      }
    })
  }

  const handleEditEvent = () => {
    const identifier = event.slug || event._id
    navigate(`/events/${identifier}/edit`)
  }

  const handleGoBack = () => {
    navigate('/events')
  }

  if (loading) {
    return <EcoLoader />
  }

  if (error || !event) {
    return <NotFound />
  }

  // Calculate progress and status
  const progressPercentage = Math.round((event.registeredParticipants / event.capacity) * 100)
  const spotsRemaining = event.capacity - event.registeredParticipants
  const isCreator = user && event.createdBy === user.uid

  // Checking join status using the event data itself or fallback
  const isJoined = event.isJoined ?? auth?.userEvents?.includes(event._id)
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
              <p className="text-text leading-relaxed">
                {event.detailedDescription}
              </p>
            </CardContent>
          </Card>

          {/* Requirements & Benefits */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold text-heading">Requirements</h3>
                <p className="text-sm text-text">
                  {event.requirements}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold text-heading">What You'll Get</h3>
                <p className="text-sm text-text">
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
            <Card className="border-primary bg-primary/10">
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">Event Management</h3>
                  <p className="text-sm text-primary mt-1">
                    You are the organizer of this event
                  </p>
                </div>

                {/* Capacity Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text/80">Participants</span>
                    <span className="font-medium">
                      {event.registeredParticipants} / {event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-primary text-center">
                    {spotsRemaining} spots remaining
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary"
                    onClick={handleEditEvent}
                  >
                    Edit Event
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full bg-danger hover:bg-danger text-surface"
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Event'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary bg-primary/10">
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">
                    {isJoined ? 'You\'re Registered!' : 'Join This Event'}
                  </h3>
                  <p className="text-sm text-primary mt-1">
                    {isJoined ? 'See you at the event!' : 'Be part of the change in your community'}
                  </p>
                </div>

                {/* Status Badges */}
                {(isCancelled || isPast) && (
                  <div className="text-center">
                    {isCancelled && (
                      <span className="inline-block px-3 py-1 bg-danger/15 text-danger rounded-full text-sm font-medium">
                        Event Cancelled
                      </span>
                    )}
                    {isPast && !isCancelled && (
                      <span className="inline-block px-3 py-1 bg-muted text-text rounded-full text-sm font-medium">
                        Event Ended
                      </span>
                    )}
                  </div>
                )}

                {/* Capacity Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text/80">Participants</span>
                    <span className="font-medium">
                      {event.registeredParticipants} / {event.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-primary text-center">
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
                    className="w-full bg-primary hover:bg-primary"
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
                  <span className="text-text/80">Date</span>
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text/80">Location</span>
                  <span className="font-medium">{event.location}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text/80">Duration</span>
                  <span className="font-medium">{event.duration}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-text/80">Organizer</span>
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