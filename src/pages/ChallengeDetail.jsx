import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Leaf, Recycle, Droplets, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { utils } from '../config/env'
import { formatDate } from '../utils/formatDate.js'
import { showSuccess, showError, showLoading, dismissToast, showDeleteConfirmation } from '../utils/toast.jsx'
import { useChallengeBySlug, useChallenges, useChallengeMutations } from '../hooks/queries'

export default function ChallengeDetail() {
  const { slug } = useParams()
  const { auth } = useAuth()
  const navigate = useNavigate()

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

  if (loading) {
    return <EcoLoader />
  }

  if (error || !challenge) {
    return (
      <div className="text-center py-12">
        <p className="text-danger mb-4">{error || 'Challenge not found'}</p>
        <Button as={Link} to="/challenges">Back to Challenges</Button>
      </div>
    )
  }

  const {
    title,
    shortDescription,
    detailedDescription,
    category,
    image,
    participants: participantCount,
    duration,
    impact,
    co2Saved,
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
      accent: 'bg-primary/10 text-primary'
    },
    {
      key: 'plasticReducedKg',
      label: 'Plastic reduced',
      value: communityImpact?.plasticReducedKg,
      unit: 'kg',
      icon: Recycle,
      accent: 'bg-secondary/10 text-secondary'
    },
    {
      key: 'waterSavedL',
      label: 'Water saved',
      value: communityImpact?.waterSavedL,
      unit: 'L',
      icon: Droplets,
      accent: 'bg-secondary/10 text-secondary'
    },
    {
      key: 'energySavedKwh',
      label: 'Energy saved',
      value: communityImpact?.energySavedKwh,
      unit: 'kWh',
      icon: Zap,
      accent: 'bg-secondary/10 text-secondary'
    }
  ].filter(metric => metric.value !== null && metric.value !== undefined && metric.value !== '')

  const formatMetricValue = (value) => {
    const numeric = normalizeNumber(value)
    if (numeric === null) {
      return typeof value === 'string' ? value : '—'
    }
    return numberFormatter.format(numeric)
  }

  const timelineRange = startDate && endDate
    ? `${formatDate(startDate, { dateStyle: 'long' })} – ${formatDate(endDate, { dateStyle: 'long' })}`
    : 'Schedule coming soon'

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          backgroundImage={image || utils.getPlaceholderImage(1200, 400, title)}
          overlayIntensity="dark"
          height="large"
        >
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-primary/100/20 px-4 py-1 text-sm font-semibold text-surface uppercase tracking-wide">
                {category}
              </span>
              {featured && (
                <span className="inline-flex items-center rounded-full bg-secondary/20 px-4 py-1 text-sm font-semibold text-surface uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-surface sm:text-5xl md:text-6xl">
                {title}
              </h1>
              {shortDescription && (
                <p className="text-lg text-surface/90 sm:text-xl">
                  {shortDescription}
                </p>
              )}
            </div>
          </div>
        </SubpageHero>
      </div>

      {/* Impact Metrics - Full Width */}
      {impactMetrics.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text/70">Impact Metrics</p>
              <h3 className="text-xl font-bold text-heading mt-1">Measured community benefits</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {impactMetrics.map(metric => {
              const Icon = metric.icon
              return (
                <div key={metric.key} className="rounded-2xl border border-border bg-light/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full ${metric.accent} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text/70">{metric.label}</p>
                      <p className="text-2xl font-bold text-heading">
                        {formatMetricValue(metric.value)}
                        <span className="ml-1 text-base font-semibold text-text/70">{metric.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Challenge Details */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">About This Challenge</h2>
            <p className="text-lg text-text/80 mb-4">{shortDescription}</p>
            {detailedDescription && (
              <p className="text-text/80 whitespace-pre-line">{detailedDescription}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface border-2 border-border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Challenge Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-text/80">Participants</span>
                <span className="font-semibold text-lg">
                  {participantCount === 0 ? 'No one joined yet' : `${participantCount} ${participantCount === 1 ? 'person' : 'people'} joined`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-text/80">Start Date</span>
                <span className="font-semibold text-lg">{startDate ? formatDate(startDate) : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-text/80">End Date</span>
                <span className="font-semibold text-lg">{endDate ? formatDate(endDate) : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-text/80">Duration</span>
                <span className="font-semibold text-lg">{duration || 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text/80">Status</span>
                <span className="font-semibold text-primary">Active</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {!isOwner && !isJoined && (
                <Button
                  onClick={handleJoinChallenge}
                  disabled={isJoining}
                  className="w-full"
                >
                  {isJoining ? 'Joining...' : 'Join Challenge'}
                </Button>
              )}

              {!isOwner && isJoined && (
                <Button
                  onClick={handleLeaveChallenge}
                  disabled={isLeaving}
                  variant="outline"
                  className="w-full"
                >
                  {isLeaving ? 'Leaving...' : 'Leave Challenge'}
                </Button>
              )}

              {isOwner && (
                <>
                  <Button
                    onClick={handleEditChallenge}
                    className="w-full"
                  >
                    Edit Challenge
                  </Button>
                  <Button
                    onClick={handleDeleteChallenge}
                    variant="destructive"
                    className="w-full"
                  >
                    Delete Challenge
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Challenges */}
      {relatedChallenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Similar Challenges</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedChallenges.map((c) => (
              <ChallengeCard key={c._id || c.id} challenge={{
                ...c,
                imageUrl: c.image || c.imageUrl,
                description: c.shortDescription || c.description,
                participants: c.registeredParticipants || c.participants || 0
              }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


