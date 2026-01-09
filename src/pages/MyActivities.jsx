import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Trophy,
  Flame,
  Search,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import { ChallengeCardSkeleton } from '../components/Skeleton.jsx'
import { useMyCreatedChallenges, useMyJoinedChallenges } from '../hooks/queries'
import { containerVariants, itemVariants } from '../utils/animations'

export default function MyActivities() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: joinedChallenges = [],
    isLoading: loadingJoined
  } = useMyJoinedChallenges({ limit: 50 })

  const {
    data: createdChallenges = [],
    isLoading: loadingCreated
  } = useMyCreatedChallenges()

  const { activities, summary } = useMemo(() => {
    const transformedJoined = Array.isArray(joinedChallenges) ? joinedChallenges.map(challenge => ({
      _id: challenge.id,
      challenge: {
        _id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        imageUrl: challenge.imageUrl,
        impactMetric: challenge.impactMetric,
        slug: challenge.slug
      },
      userProgress: {
        status: challenge.status === 'completed' ? 'Completed' : 'Active',
        progress: challenge.progress || 0,
        impactAchieved: challenge.impactAchieved || 0
      }
    })) : []

    const transformedCreated = Array.isArray(createdChallenges) ? createdChallenges.map(challenge => ({
      _id: challenge.id,
      challenge: {
        _id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        imageUrl: challenge.imageUrl,
        impactMetric: challenge.impactMetric,
        slug: challenge.slug
      },
      userProgress: {
        status: 'Creator',
        progress: 100,
        impactAchieved: 0
      }
    })) : []

    let all = [...transformedCreated, ...transformedJoined]

    // Search filter
    if (searchQuery) {
      all = all.filter(a =>
        a.challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.challenge.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    let filtered = all
    if (statusFilter === 'active') {
      filtered = all.filter(a => a.userProgress.status === 'Active' || a.userProgress.status === 'Creator')
    } else if (statusFilter === 'completed') {
      filtered = all.filter(a => a.userProgress.status === 'Completed')
    }

    return {
      activities: filtered,
      summary: {
        total: all.length,
        active: all.filter(a => a.userProgress.status === 'Active' || a.userProgress.status === 'Creator').length,
        completed: all.filter(a => a.userProgress.status === 'Completed').length,
        streak: 5 // Mock streak
      }
    }
  }, [joinedChallenges, createdChallenges, statusFilter, searchQuery])

  const loading = loadingJoined || loadingCreated
  const handleSearchChange = (e) => setSearchQuery(e.target.value)
  const handleStatusFilter = (status) => setStatusFilter(status)

  return (
    <motion.div
      key={`my-challenges-${statusFilter}-${searchQuery}-${activities.length}`}
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
          <h1 className="text-3xl font-bold text-heading">My Challenges</h1>
          <p className="text-text/60">Track your eco-journey and achievements</p>
        </div>
        <Button
          as={Link}
          to="/challenges"
          variant="primary"
          size="sm"
          className="rounded-xl shadow-lg shadow-primary/20 active:scale-95"
        >
          Explore More
          <ArrowUpRight size={16} />
        </Button>
      </motion.header>

      {/* Summary Stats */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-2 gap-6 lg:grid-cols-4"
      >
        {[
          { label: 'Total', value: summary.total, icon: Activity, color: 'text-primary' },
          { label: 'Active', value: summary.active, icon: Flame, color: 'text-orange-500' },
          { label: 'Completed', value: summary.completed, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Streak', value: `${summary.streak}d`, icon: Trophy, color: 'text-amber-500' }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
          >
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <stat.icon className={stat.color} size={20} />
                  <div className="h-6 w-1 rounded-full bg-light" />
                </div>
                <p className="mt-4 text-2xl font-bold text-heading">{stat.value}</p>
                <p className="text-xs font-medium text-text/40">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" size={18} />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1">
          {['all', 'active', 'completed'].map((status) => (
            <Button
              key={status}
              onClick={() => handleStatusFilter(status)}
              variant={statusFilter === status ? 'primary' : 'ghost'}
              size="sm"
              className={`rounded-lg px-4 text-xs font-semibold capitalize ${statusFilter === status ? 'shadow-md' : 'text-text/60 hover:text-text'}`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Activities Table/Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => <ChallengeCardSkeleton key={i} />)}
          </motion.div>
        ) : activities.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-light text-4xl">🌱</div>
            <h3 className="text-xl font-bold text-heading">No activities found</h3>
            <p className="mt-2 text-text/60">Start joining challenges to track your impact!</p>
            <Button
              as={Link}
              to="/challenges"
              variant="ghost"
              size="sm"
              className="mt-6 text-primary hover:underline"
            >
              Browse Challenges
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
            {activities.map((activity) => (
              <motion.div
                key={activity._id}
                variants={itemVariants}
              >
                <Card className="group relative overflow-hidden rounded-2xl transition-all hover:shadow-xl hover:shadow-primary/5">
                  {activity.challenge?.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={activity.challenge.imageUrl}
                        alt={activity.challenge.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {activity.challenge?.category}
                      </span>
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${activity.userProgress?.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                        }`}>
                        {activity.userProgress?.status === 'Completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {activity.userProgress?.status}
                      </span>
                    </div>
                    <h3 className="line-clamp-1 font-bold text-heading">{activity.challenge?.title}</h3>

                    {/* Progress Section */}
                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-text/40">Progress</span>
                        <span className="text-heading">{activity.userProgress?.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-light overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activity.userProgress?.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      {activity.userProgress?.impactAchieved > 0 ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-primary">
                          <Flame size={14} />
                          {activity.userProgress.impactAchieved} {activity.challenge?.impactMetric}
                        </div>
                      ) : <div />}
                      <Button
                        as={Link}
                        to={`/challenges/${activity.challenge?.slug || activity.challenge?._id}`}
                        variant="ghost"
                        size="sm"
                        className="rounded-lg p-2 text-text hover:bg-primary hover:text-surface"
                      >
                        <ArrowUpRight size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
