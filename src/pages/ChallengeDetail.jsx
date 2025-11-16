import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Leaf, Recycle, Droplets, Zap } from 'lucide-react'
import { challengeApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { utils } from '../config/env'
import { formatDate } from '../utils/formatDate.js'
import { showSuccess, showError, showLoading, dismissToast, showDeleteConfirmation } from '../utils/toast.jsx'

export default function ChallengeDetail() {
  const { slug } = useParams() // Use slug from URL (SEO-friendly)
  const { auth } = useAuth()
  const [challenge, setChallenge] = useState(null)
  const [relatedChallenges, setRelatedChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  
  useDocumentTitle(challenge ? challenge.title : 'Challenge Details')

  // Check if current user is the creator of the challenge
  const isOwner = challenge && auth.user && (
    challenge.isCreator || 
    challenge.createdBy === auth.user.uid ||
    challenge.createdById === auth.user.uid
  )
  
  // Check if user has joined the challenge
  const isJoined = challenge?.isJoined || false

  const handleJoinChallenge = async () => {
    if (!auth.isLoggedIn) {
      showError('Please log in to join challenges')
      return
    }

    setIsJoining(true)
    try {
      // Use _id for join operation, not slug
      await challengeApi.join(challenge._id)
      showSuccess('Successfully joined the challenge!')
      
      // Refresh challenge data using slug
      const response = await challengeApi.getBySlug(slug)
      const challengeData = response?.data || response
      
      setChallenge(prev => ({
        ...prev,
        _id: challengeData._id || challengeData.id || prev._id, // Ensure _id is preserved
        isJoined: true,
        participants: challengeData.registeredParticipants || (prev.participants + 1)
      }))
    } catch (error) {
      console.error('Error joining challenge:', error)
      if (error.message?.includes('already joined')) {
        showError('You have already joined this challenge')
      } else if (error.message?.includes('not active')) {
        showError('This challenge is not currently active')
      } else {
        showError('Failed to join challenge. Please try again.')
      }
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveChallenge = async () => {
    setIsLeaving(true)
    try {
      // Use _id for leave operation, not slug
      await challengeApi.leave(challenge._id)
      showSuccess('Successfully left the challenge')
      
      // Refresh challenge data using slug
      const response = await challengeApi.getBySlug(slug)
      const challengeData = response?.data || response
      
      setChallenge(prev => ({
        ...prev,
        _id: challengeData._id || challengeData.id || prev._id, // Ensure _id is preserved
        isJoined: false,
        participants: challengeData.registeredParticipants || Math.max(0, prev.participants - 1)
      }))
    } catch (error) {
      console.error('Error leaving challenge:', error)
      showError('Failed to leave challenge. Please try again.')
    } finally {
      setIsLeaving(false)
    }
  }

  const handleDeleteChallenge = async () => {
    showDeleteConfirmation({
      itemName: 'Challenge',
      onConfirm: async () => {
        try {
          const loadingToast = showLoading('Deleting challenge...')
          
          // Use _id for delete operation, not slug
          await challengeApi.delete(challenge._id)
          
          dismissToast(loadingToast)
          showSuccess('Challenge deleted successfully!')
          
          window.location.href = '/challenges'
        } catch (error) {
          console.error('Error deleting challenge:', error)
          showError('Failed to delete challenge. Please try again.')
        }
      }
    })
  }

  const handleEditChallenge = () => {
    // Use _id for edit URL, not slug (as per API specification)
    window.location.href = `/challenges/${challenge._id}/edit`
  }

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        setLoading(true)
        // Fetch challenge by slug (SEO-friendly)
        const response = await challengeApi.getBySlug(slug)
        const challengeData = response?.data || response
        
        setChallenge({
          ...challengeData,
          _id: challengeData._id || challengeData.id, // Ensure _id is set
          participants: challengeData.registeredParticipants ?? (Array.isArray(challengeData.participants) ? challengeData.participants.length : challengeData.participants) ?? 0
        })

        // Fetch related challenges
        try {
          const relatedResponse = await challengeApi.getAll({ 
            category: challengeData.category, 
            limit: 3 
          })
          const relatedData = relatedResponse?.data || relatedResponse
          const challengesArray = relatedData.challenges || relatedData.data || relatedData || []
          const normalizeId = (value) => value?.toString?.()
          const currentId = normalizeId(challengeData.id || challengeData._id)
          
          setRelatedChallenges(
            challengesArray
              .filter(c => normalizeId(c.id || c._id) !== currentId)
              .slice(0, 3)
          )
        } catch (error) {
          console.error('Error fetching related challenges:', error)
        }
      } catch (error) {
        setError(error.message || 'Failed to load challenge details')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchChallengeDetails()
    }
  }, [slug])

  if (loading) {
    return <EcoLoader />
  }

  if (error || !challenge) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Challenge not found'}</p>
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
      accent: 'bg-emerald-50 text-emerald-600'
    },
    {
      key: 'plasticReducedKg',
      label: 'Plastic reduced',
      value: communityImpact?.plasticReducedKg,
      unit: 'kg',
      icon: Recycle,
      accent: 'bg-teal-50 text-teal-600'
    },
    {
      key: 'waterSavedL',
      label: 'Water saved',
      value: communityImpact?.waterSavedL,
      unit: 'L',
      icon: Droplets,
      accent: 'bg-blue-50 text-blue-600'
    },
    {
      key: 'energySavedKwh',
      label: 'Energy saved',
      value: communityImpact?.energySavedKwh,
      unit: 'kWh',
      icon: Zap,
      accent: 'bg-amber-50 text-amber-600'
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
            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-white uppercase tracking-wide">
              {category}
            </span>
            {featured && (
              <span className="inline-flex items-center rounded-full bg-amber-400/20 px-4 py-1 text-sm font-semibold text-white uppercase tracking-wide">
                Featured
              </span>
            )}
          </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {title}
              </h1>
              {shortDescription && (
                <p className="text-lg text-white/90 sm:text-xl">
                  {shortDescription}
                </p>
              )}
            </div>
          </div>
        </SubpageHero>
      </div>

      {/* Impact Metrics - Full Width */}
      {impactMetrics.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">Impact Metrics</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Measured community benefits</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {impactMetrics.map(metric => {
              const Icon = metric.icon
              return (
                <div key={metric.key} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full ${metric.accent} flex items-center justify-center`}> 
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatMetricValue(metric.value)}
                        <span className="ml-1 text-base font-semibold text-slate-500">{metric.unit}</span>
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
            <p className="text-lg text-slate-600 mb-4">{shortDescription}</p>
            {detailedDescription && (
              <p className="text-slate-600 whitespace-pre-line">{detailedDescription}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Challenge Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Participants</span>
                <span className="font-semibold text-lg">
                  {participantCount === 0 ? 'No one joined yet' : `${participantCount} ${participantCount === 1 ? 'person' : 'people'} joined`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Start Date</span>
                <span className="font-semibold text-lg">{startDate ? formatDate(startDate) : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">End Date</span>
                <span className="font-semibold text-lg">{endDate ? formatDate(endDate) : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Duration</span>
                <span className="font-semibold text-lg">{duration || 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Status</span>
                <span className="font-semibold text-emerald-600">Active</span>
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


