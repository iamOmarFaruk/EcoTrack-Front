import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  History,
  Timer,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import { EventCardSkeleton } from '../components/Skeleton.jsx'
import { formatDate } from '../utils/formatDate.js'
import { useMyEvents, useMyJoinedEvents } from '../hooks/queries'
import { containerVariants, itemVariants } from '../utils/animations'

export default function MyEvents() {
  useDocumentTitle('My Events')
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('created')

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

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-primary/10 text-primary',
      cancelled: 'bg-red-500/10 text-red-500',
      completed: 'bg-green-500/10 text-green-500'
    }
    return badges[status] || 'bg-light text-text/60'
  }

  return (
    <motion.div
      key={`my-events-page-${activeTab}-${events.length}`}
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      <motion.header
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-heading">My Events</h1>
          <p className="text-text/60">Manage events you've created or joined</p>
        </div>
        <Button
          onClick={() => navigate('/events/add')}
          variant="primary"
          size="sm"
          className="rounded-xl shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus size={18} />
          Create Event
        </Button>
      </motion.header>

      {/* Tabs */}
      <motion.div
        variants={itemVariants}
        className="flex w-fit items-center gap-2 rounded-2xl bg-surface p-1.5 shadow-sm border border-border"
      >
        {[
          { id: 'created', label: 'Organized', icon: Users },
          { id: 'joined', label: 'Participating', icon: Calendar }
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="sm"
            className={`rounded-xl px-4 ${activeTab === tab.id ? 'shadow-md' : 'text-text/60 hover:text-text'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </Button>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 gap-6 lg:grid-cols-4"
      >
        {activeTab === 'created' ? (
          <>
            {[
              { label: 'Active', value: stats?.active || 0, icon: Timer, color: 'text-primary' },
              { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: 'text-green-500' },
              { label: 'Cancelled', value: stats?.cancelled || 0, icon: XCircle, color: 'text-red-500' },
              { label: 'Total Joined', value: stats?.totalParticipants || 0, icon: Users, color: 'text-purple-500' }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
              >
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="p-6">
                    <stat.icon className={stat.color} size={20} />
                    <p className="mt-4 text-2xl font-bold text-heading">{stat.value}</p>
                    <p className="text-xs font-medium text-text/40">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {[
              { label: 'Upcoming', value: stats?.upcoming || 0, icon: Calendar, color: 'text-primary' },
              { label: 'Past', value: stats?.past || 0, icon: History, color: 'text-text/40' },
              { label: 'Total Joined', value: stats?.total || 0, icon: Users, color: 'text-purple-500' }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
              >
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="p-6">
                    <stat.icon className={stat.color} size={20} />
                    <p className="mt-4 text-2xl font-bold text-heading">{stat.value}</p>
                    <p className="text-xs font-medium text-text/40">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Events List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </motion.div>
        ) : events.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-light text-4xl">📅</div>
            <h3 className="text-xl font-bold text-heading">No events found</h3>
            <p className="mt-2 text-text/60">
              {activeTab === 'created' ? 'You haven\'t organized any events yet.' : 'You haven\'t joined any events yet.'}
            </p>
            <Button
              onClick={() => navigate(activeTab === 'created' ? '/events/add' : '/events')}
              variant="ghost"
              size="sm"
              className="mt-6 text-primary hover:underline"
            >
              {activeTab === 'created' ? 'Create Your First Event' : 'Explore Events'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {events.map((event) => {
              const identifier = event.slug || event._id
              return (
                <motion.div
                  key={event._id}
                  variants={itemVariants}
                >
                  <Card className="group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:shadow-xl hover:shadow-primary/5">
                    <div className="relative h-40 overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-light text-text/20">
                          <Calendar size={48} />
                        </div>
                      )}
                      <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${getStatusBadge(event.status)}`}>
                        {event.status}
                      </span>
                    </div>

                    <CardContent className="flex flex-1 flex-col p-6">
                      <h3 className="line-clamp-1 font-bold text-heading">{event.title}</h3>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-text/60">
                          <Calendar size={14} className="text-primary" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text/60">
                          <MapPin size={14} className="text-primary" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
                          <span className="text-text/40">Registered</span>
                          <span className="text-heading">{event.registeredParticipants} / {event.capacity}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-light overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((event.registeredParticipants / event.capacity) * 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2">
                        <Button
                          as={Link}
                          to={`/events/${identifier}`}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl text-xs"
                        >
                          View Details
                        </Button>
                        {activeTab === 'created' && (
                          <Button
                            as={Link}
                            to={`/events/${identifier}/edit`}
                            variant="ghost"
                            size="sm"
                            className="flex-1 rounded-xl text-xs text-primary hover:bg-primary/10"
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
