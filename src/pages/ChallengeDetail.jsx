import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Leaf,
  Recycle,
  Droplets,
  Zap,
  ChevronLeft,
  Users,
  Target,
  Sparkles,
  Info,
  ShieldCheck,
  Trophy,
  Calendar,
  CheckCircle2,
  Share2,
  Clock,
  User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import { Card, CardContent } from '../components/ui/Card.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { utils } from '../config/env'
import { formatDate } from '../utils/formatDate.js'
import { showSuccess, showError, showDeleteConfirmation } from '../utils/toast.jsx'
import { useChallengeBySlug, useChallenges, useChallengeMutations } from '../hooks/queries'
import { motion, AnimatePresence } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'
import NotFound from './NotFound.jsx'

export default function ChallengeDetail() {
  const { slug } = useParams()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [isShareTooltipOpen, setIsShareTooltipOpen] = useState(false)

  // Fetch challenge details
  const {
    data: challenge,
    isLoading: loading,
    error
  } = useChallengeBySlug(slug)

  // Fetch related challenges (only if we have a category)
  const { data: relatedChallenges = [] } = useChallenges(
    challenge?.category
      ? { category: challenge.category, limit: 3 }
      : { limit: 0 } // Don't fetch if no category
  )

  // Filter out current challenge from related
  const filteredRelated = relatedChallenges
    .filter(c => c.id !== challenge?.id && c._id !== challenge?._id)
    .slice(0, 3)

  useDocumentTitle(challenge ? challenge.title : 'Challenge Details')

  // Mutations
  const { joinChallenge, leaveChallenge, deleteChallenge } = useChallengeMutations()
  const isJoining = joinChallenge.isPending
  const isLeaving = leaveChallenge.isPending

  // Check ownership
  const isOwner = challenge && auth.user && (
    challenge.isCreator ||
    challenge.createdBy === auth.user.uid ||
    challenge.createdById === auth.user.uid
  )

  const isJoined = challenge?.isJoined || false

  const handleJoinChallenge = () => {
    if (!auth.isLoggedIn) {
      showError('Please log in to join challenges')
      navigate('/login')
      return
    }
    joinChallenge.mutate(challenge.id)
  }

  const handleLeaveChallenge = () => {
    leaveChallenge.mutate(challenge.id)
  }

  const handleDeleteChallenge = () => {
    showDeleteConfirmation({
      itemName: 'Challenge',
      onConfirm: () => {
        deleteChallenge.mutate(challenge.id, {
          onSuccess: () => navigate('/challenges')
        })
      }
    })
  }

  const handleEditChallenge = () => {
    const targetSlug = challenge.slug || slug
    navigate(`/challenges/${targetSlug}/edit`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsShareTooltipOpen(true)
    showSuccess('Link copied to clipboard!')
    setTimeout(() => setIsShareTooltipOpen(false), 2000)
  }

  if (loading) return <EcoLoader />
  if (error || !challenge) return <NotFound />

  const {
    title,
    shortDescription,
    detailedDescription,
    category,
    image,
    participants: participantCount,
    duration,
    startDate,
    endDate,
    featured
  } = challenge

  const communityImpact = challenge.communityImpact || null
  const normalizeNumber = (value) => {
    if (value === null || value === undefined || value === '') return null
    if (typeof value === 'number') return value
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  const numberFormatter = new Intl.NumberFormat('en-US')

  const impactMetrics = [
    {
      key: 'co2SavedKg',
      label: 'CO₂ saved',
      value: communityImpact?.co2SavedKg,
      unit: 'kg',
      icon: Leaf,
      accent: 'bg-primary/10 text-primary',
      color: 'emerald'
    },
    {
      key: 'plasticReducedKg',
      label: 'Plastic reduced',
      value: communityImpact?.plasticReducedKg,
      unit: 'kg',
      icon: Recycle,
      accent: 'bg-secondary/10 text-secondary',
      color: 'teal'
    },
    {
      key: 'waterSavedL',
      label: 'Water saved',
      value: communityImpact?.waterSavedL,
      unit: 'L',
      icon: Droplets,
      accent: 'bg-blue-500/10 text-blue-600',
      color: 'blue'
    },
    {
      key: 'energySavedKwh',
      label: 'Energy saved',
      value: communityImpact?.energySavedKwh,
      unit: 'kWh',
      icon: Zap,
      accent: 'bg-yellow-500/10 text-yellow-600',
      color: 'yellow'
    }
  ].filter(metric => metric.value !== null && metric.value !== undefined && metric.value !== '')

  const formatMetricValue = (value) => {
    const numeric = normalizeNumber(value)
    if (numeric === null) {
      return typeof value === 'string' ? value : '—'
    }
    return numberFormatter.format(numeric)
  }

  return (
    <div className="min-h-screen bg-light pb-20">
      {/* Immersive Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden mb-8">
        {/* Background Image - Full Bleed */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url(${image || utils.getPlaceholderImage(1200, 400, title)})`,
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Gradient Overlay - Bottom to Top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Content Container - Centered and Constrained */}
        <div className="container relative mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="max-w-4xl"
          >
            <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3 flex-wrap">
              <Link
                to="/challenges"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Challenges
              </Link>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                {category}
              </span>

              {isJoined && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                  <CheckCircle2 className="w-4 h-4" />
                  Participating
                </span>
              )}

              {isOwner && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-white text-sm font-bold shadow-lg shadow-secondary/20">
                  <User className="w-4 h-4" />
                  Creator
                </span>
              )}

              {featured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500 text-white text-sm font-bold shadow-lg shadow-yellow-500/20">
                  <Sparkles className="w-4 h-4" />
                  Featured
                </span>
              )}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 max-w-2xl mb-8 line-clamp-2 drop-shadow-md"
            >
              {shortDescription}
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Impact Metrics Block */}
            {impactMetrics.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-4 grid-cols-2 md:grid-cols-4"
              >
                {impactMetrics.map(metric => {
                  const Icon = metric.icon
                  return (
                    <motion.div key={metric.key} variants={itemVariants}>
                      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-4 text-center">
                          <div className={`mx-auto h-10 w-10 rounded-xl ${metric.accent} flex items-center justify-center mb-3`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest mb-1">{metric.label}</p>
                          <p className="text-xl font-bold text-heading">
                            {formatMetricValue(metric.value)}
                            <span className="ml-1 text-xs font-semibold text-text/50">{metric.unit}</span>
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}

            <motion.div variants={itemVariants} initial="hidden" animate="show">
              <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Info className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-bold text-heading">Challenge Details</h2>
                  </div>
                  <div className="prose prose-lg dark:prose-invert text-text/80 leading-relaxed max-w-none">
                    {detailedDescription || shortDescription}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} initial="hidden" animate="show">
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-heading mb-2">Community Impact</h3>
                    <p className="text-text/70 text-sm leading-relaxed">
                      Join {participantCount} others in making a collective difference for our planet.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="show">
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-heading mb-2">Completion Goal</h3>
                    <p className="text-text/70 text-sm leading-relaxed">
                      Complete all tasks within the {duration} timeframe to earn your eco-badge.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVariants} initial="hidden" animate="show" className="sticky top-24">
              {/* Action Card */}
              <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

                <CardContent className="p-6 space-y-6">
                  {isOwner ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg text-heading">Creator Dashboard</h3>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="flex justify-between items-center mb-1 text-xs font-bold text-text/40 uppercase tracking-wider">
                          <span>Participation</span>
                          <span>Active</span>
                        </div>
                        <p className="text-2xl font-bold text-heading">
                          {participantCount} <span className="text-sm font-medium text-text/50">Joined</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleEditChallenge} variant="primary" className="w-full">
                          Edit Challenge
                        </Button>
                        <Button
                          onClick={handleDeleteChallenge}
                          variant="danger"
                          className="w-full"
                        >
                          Delete Permanently
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-heading">
                          {isJoined ? "Challenge Accepted!" : "Join the Movement"}
                        </h3>
                        <p className="text-sm text-text/60 mt-1">
                          {isJoined ? "You're making a difference. Keep going!" : "Ready to track your eco-impact?"}
                        </p>
                      </div>

                      {/* Timeline Stats */}
                      <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-heading uppercase">Timeline</span>
                          </div>
                          <p className="text-sm font-medium text-text/80">
                            {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'Duration-based'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-bold text-heading uppercase">Duration</span>
                          </div>
                          <p className="text-sm font-medium text-text/80">{duration}</p>
                        </div>
                      </div>

                      {isJoined ? (
                        <Button
                          onClick={handleLeaveChallenge}
                          variant="ghost"
                          className="w-full text-danger hover:text-danger hover:bg-danger/10 border-2 border-transparent hover:border-danger/10"
                          disabled={isLeaving}
                        >
                          {isLeaving ? 'Processing...' : 'Leave Challenge'}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleJoinChallenge}
                          variant="primary"
                          className="w-full py-6 text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                          disabled={isJoining}
                        >
                          {isJoining ? 'Processing...' : 'Start Challenge Now'}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Share button */}
                  <div className="pt-2 border-t border-border mt-6">
                    <Button variant="outline" className="w-full gap-2 group" onClick={handleShare}>
                      <Share2 className="w-4 h-4 text-text/60 group-hover:text-primary transition-colors" />
                      <span className="text-text/60 group-hover:text-text transition-colors">Spread the Word</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Eco Motivation Card */}
              <Card className="mt-6 border-none shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Leaf className="w-5 h-5" />
                    <h4 className="font-bold">Eco Tip</h4>
                  </div>
                  <p className="text-sm text-text/70 italic leading-relaxed">
                    "Every small action adds up to a massive global impact. Thank you for being part of the solution."
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Similar Challenges Section */}
        {filteredRelated.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-heading">Similar <span className="text-primary italic">Challenges</span></h2>
                <p className="text-text/60 mt-1">Keep the momentum going with these related activities.</p>
              </div>
              <Link
                to="/challenges"
                className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
              >
                Browse All <Target className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRelated.map((c) => (
                <ChallengeCard key={c._id || c.id} challenge={{
                  ...c,
                  imageUrl: c.image || c.imageUrl,
                  description: c.shortDescription || c.description,
                  participants: c.registeredParticipants || c.participants || 0
                }} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
