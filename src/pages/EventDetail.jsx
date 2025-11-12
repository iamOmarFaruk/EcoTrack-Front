import { useParams, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockEvents } from '../data/mockEvents.js'
import { formatDate } from '../utils/formatDate.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import NotFound from './NotFound.jsx'
import toast from 'react-hot-toast'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const event = mockEvents.find(e => e.id === id)
  
  useDocumentTitle(event ? event.title : 'Event Not Found')

  if (!event) {
    return <NotFound />
  }

  const handleJoinEvent = () => {
    toast.success(`Successfully joined "${event.title}"!`)
    // Here you could add logic to actually join the event
  }

  const handleGoBack = () => {
    navigate('/events')
  }

  const progressPercentage = Math.round((event.registeredParticipants / event.capacity) * 100)

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
          {/* Join Event Card */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-900">Join This Event</h3>
                <p className="text-sm text-green-700 mt-1">
                  Be part of the change in your community
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
                  {event.capacity - event.registeredParticipants} spots remaining
                </p>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={handleJoinEvent}
                disabled={progressPercentage >= 100}
              >
                {progressPercentage >= 100 ? 'Event Full' : 'Join This Event'}
              </Button>
            </CardContent>
          </Card>

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