import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { challengeApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { utils } from '../config/env'
import { showSuccess, showError, showLoading, dismissToast, showDeleteConfirmation } from '../utils/toast.jsx'

export default function ChallengeDetail() {
  const { id } = useParams()
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
      await challengeApi.join(id)
      showSuccess('Successfully joined the challenge!')
      
      // Refresh challenge data
      const response = await challengeApi.getById(id)
      const challengeData = response?.data || response
      
      setChallenge(prev => ({
        ...prev,
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
      await challengeApi.leave(id)
      showSuccess('Successfully left the challenge')
      
      // Refresh challenge data
      const response = await challengeApi.getById(id)
      const challengeData = response?.data || response
      
      setChallenge(prev => ({
        ...prev,
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
          
          await challengeApi.delete(id)
          
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
    window.location.href = `/challenges/${id}/edit`
  }

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        setLoading(true)
        const response = await challengeApi.getById(id)
        const challengeData = response?.data || response
        
        setChallenge({
          ...challengeData,
          participants: challengeData.registeredParticipants || challengeData.participants || 0
        })

        // Fetch related challenges
        try {
          const relatedResponse = await challengeApi.getAll({ 
            category: challengeData.category, 
            limit: 3 
          })
          const relatedData = relatedResponse?.data || relatedResponse
          const challengesArray = relatedData.challenges || relatedData.data || relatedData || []
          
          setRelatedChallenges(challengesArray.filter(c => c.id !== id || c._id !== id).slice(0, 3))
        } catch (error) {
          console.error('Error fetching related challenges:', error)
        }
      } catch (error) {
        setError(error.message || 'Failed to load challenge details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchChallengeDetails()
    }
  }, [id])

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

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-900 mb-1">Duration</h3>
              <p className="text-emerald-700">{duration}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">Impact Metric</h3>
              <p className="text-blue-700">{impact}</p>
            </div>
            {co2Saved && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-1">CO₂ Saved</h3>
                <p className="text-purple-700">{co2Saved}</p>
              </div>
            )}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 mb-1">Timeline</h3>
              <p className="text-amber-700">{startDate} to {endDate}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Challenge Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Participants</span>
                <span className="font-semibold text-lg">{participantCount}</span>
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
                    variant="outline"
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
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


