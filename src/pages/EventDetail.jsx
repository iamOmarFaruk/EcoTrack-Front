import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  ChevronLeft,
  Target,
  Sparkles,
  Leaf,
  Info,
  ShieldCheck,
  Trophy
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { formatDate } from '../utils/formatDate.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import NotFound from './NotFound.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { showConfirmation, showSuccess } from '../utils/toast.jsx'
import { useEvent, useEventMutations } from '../hooks/queries'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, auth } = useAuth()
  const [isShareTooltipOpen, setIsShareTooltipOpen] = useState(false)

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
        ? `This event has ${event.registeredParticipants} registered participant${event.registeredParticipants > 1 ? 's' : ''}. If you delete it, the event will be cancelled. This action cannot be undone.`
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsShareTooltipOpen(true)
    showSuccess('Link copied to clipboard!')
    setTimeout(() => setIsShareTooltipOpen(false), 2000)
  }

  if (loading) return <EcoLoader />
  if (error || !event) return <NotFound />

  // Calculate progress and status
  const progressPercentage = Math.min(Math.round((event.registeredParticipants / event.capacity) * 100), 100)
  const spotsRemaining = Math.max(0, event.capacity - event.registeredParticipants)
  const isCreator = user && event.createdBy === user.uid

  // Checking join status using the event data itself or fallback
  const isJoined = event.isJoined || (auth?.userEvents && auth.userEvents.includes(event._id))
  // Determine if full (only if not joined/creator)
  const isFull = spotsRemaining === 0
  const isCancelled = event.status === 'cancelled'
  const isPast = new Date(event.date) < new Date()

  return (
    <div className="min-h-screen bg-light pb-20">
      {/* Immersive Hero Section */}
      <div className="full-bleed relative h-[60vh] min-h-[400px] w-full overflow-hidden mb-8">
        <div className="absolute inset-0 bg-dark/20" />
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1523301386673-98fe0c2f3254?auto=format&fit=crop&q=80'})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

        <div className="container relative h-full flex flex-col justify-end pb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl"
          >
            <motion.div variants={itemVariants} className="mb-4 flex items-center gap-3">
              <Link to="/events" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20">
                <ChevronLeft className="w-4 h-4" />
                Back to Events
              </Link>
              {isJoined && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                  <CheckCircle2 className="w-4 h-4" />
                  Registered
                </span>
              )}
              {isCreator && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-white text-sm font-bold shadow-lg shadow-secondary/20">
                  <User className="w-4 h-4" />
                  Organizer
                </span>
              )}
              {isCancelled && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger text-white text-sm font-bold">
                  <AlertCircle className="w-4 h-4" />
                  Cancelled
                </span>
              )}
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {event.title}
            </motion.h1>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">{event.duration || '2 hours'}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container relative z-10 -mt-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-xl shadow-black/5 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Info className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-heading">About This Event</h2>
                  </div>
                  <div className="prose prose-lg text-text/80 leading-relaxed">
                    {event.detailedDescription || event.description}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-heading">Requirements</h3>
                    </div>
                    <p className="text-text/70 leading-relaxed">
                      {event.requirements || 'No specific requirements for this event. Just bring your enthusiasm!'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-heading">What You'll Get</h3>
                    </div>
                    <p className="text-text/70 leading-relaxed">
                      {event.benefits || 'Connect with like-minded individuals and make a tangible difference.'}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Map Placeholder or additional info could go here */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVariants} className="sticky top-24">
              {/* Action Card */}
              <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden relative">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

                <CardContent className="p-6 space-y-6">
                  {isCreator ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg text-heading">Manage Your Event</h3>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-text/70">Occupancy</span>
                          <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-2.5 mb-2 border border-border/50">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                            style={{ width: `${progressPercentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-text/50">
                          <span>{event.registeredParticipants} joined</span>
                          <span>{event.capacity} total capacity</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleEditEvent} variant="primary" className="w-full shadow-lg shadow-primary/10">
                          Edit Details
                        </Button>
                        <Button
                          onClick={handleDeleteEvent}
                          variant="danger"
                          className="w-full bg-danger text-white hover:bg-red-700 border-none"
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-heading">
                          {isJoined ? "You're Going!" : "Ready to join?"}
                        </h3>
                        <p className="text-sm text-text/60 mt-1">
                          {isJoined ? "See you there! Don't forget to prepare." : "Secure your spot and make an impact."}
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-center">
                          <span className="block text-2xl font-bold text-heading">{spotsRemaining}</span>
                          <span className="text-xs text-text/50 font-medium uppercase tracking-wider">Spots Left</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-center">
                          <span className="block text-2xl font-bold text-heading">{event.capacity}</span>
                          <span className="text-xs text-text/50 font-medium uppercase tracking-wider">Capacity</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${isFull ? 'bg-danger' : 'bg-primary'}`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-center text-text/50">
                          {isFull ? 'Event is currently full' : 'Spaces are filling up fast!'}
                        </p>
                      </div>

                      {isJoined ? (
                        <Button
                          onClick={handleLeaveEvent}
                          variant="ghost"
                          className="w-full text-danger hover:text-danger hover:bg-danger/10 border-2 border-transparent hover:border-danger/10"
                          disabled={isLeaving || isPast}
                        >
                          {isLeaving ? 'Processing...' : 'Cancel Registration'}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleJoinEvent}
                          variant="primary"
                          className="w-full py-6 text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                          disabled={isFull || isCancelled || isPast || isJoining}
                        >
                          {isJoining ? 'Processing...' : isFull ? 'Join Waitlist' : isCancelled ? 'Event Cancelled' : isPast ? 'Event Ended' : 'Join Event Now'}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Organizer Mini Profile */}
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      {event.organizerImage ? (
                        <img
                          src={event.organizerImage}
                          alt={event.organizer}
                          className="w-10 h-10 rounded-full object-cover border border-border shadow-md"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {event.organizer ? event.organizer.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-text/50 font-medium uppercase tracking-wider">Organized by</p>
                        <p className="text-sm font-bold text-heading">{event.organizer || 'EcoTrack Community'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Share Button */}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full gap-2 group" onClick={handleShare}>
                      <Share2 className="w-4 h-4 text-text/60 group-hover:text-primary transition-colors" />
                      <span className="text-text/60 group-hover:text-text transition-colors">Share Event</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="mt-6 border-none shadow-lg bg-gradient-to-br from-secondary/5 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-secondary">
                    <Leaf className="w-5 h-5" />
                    <h4 className="font-bold">Eco Tip</h4>
                  </div>
                  <p className="text-sm text-text/70 italic">
                    "Carpooling to the event reduces carbon footprint by up to 15% per person."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}