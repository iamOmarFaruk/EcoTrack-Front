import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { challengeApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { utils } from '../config/env'
import toast from 'react-hot-toast'

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
      toast.error('Please log in to join challenges')
      return
    }

    setIsJoining(true)
    try {
      await challengeApi.join(id)
      toast.success('Successfully joined the challenge!')
      
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
        toast.error('You have already joined this challenge')
      } else if (error.message?.includes('not active')) {
        toast.error('This challenge is not currently active')
      } else {
        toast.error('Failed to join challenge. Please try again.')
      }
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveChallenge = async () => {
    setIsLeaving(true)
    try {
      await challengeApi.leave(id)
      toast.success('Successfully left the challenge')
      
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
      toast.error('Failed to leave challenge. Please try again.')
    } finally {
      setIsLeaving(false)
    }
  }

  const handleDeleteChallenge = async () => {
    // Create a professional confirmation toast
    toast((t) => (
      <div className="flex flex-col gap-3 p-2 text-white">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">Delete Challenge</h3>
            <p className="text-sm text-gray-100 mt-1">
              Are you sure you want to delete this challenge? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              try {
                const loadingToast = toast.loading('Deleting challenge...')
                
                await challengeApi.delete(id)
                
                toast.dismiss(loadingToast)
                toast.success('Challenge deleted successfully!')
                
                window.location.href = '/challenges'
              } catch (error) {
                console.error('Error deleting challenge:', error)
                toast.error('Failed to delete challenge. Please try again.')
              }
            }}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        maxWidth: '400px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    })
  }

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch the specific challenge
        const response = await challengeApi.getById(id)
        const challengeData = response?.data || response

        if (!challengeData) {
          throw new Error('Challenge not found')
        }

        // Transform challenge data to match new API structure
        const transformedChallenge = {
          _id: challengeData.id || challengeData._id,
          title: challengeData.title || 'No data',
          description: challengeData.shortDescription || challengeData.description || 'No data',
          detailedDescription: challengeData.detailedDescription || '',
          category: challengeData.category || 'No data',
          duration: challengeData.duration || 'No data',
          startDate: challengeData.startDate || 'No data',
          endDate: challengeData.endDate || 'No data',
          status: challengeData.status || 'active',
          imageUrl: challengeData.image || challengeData.imageUrl || 'No data',
          impactMetric: challengeData.impact || challengeData.impactMetric || 'No data',
          co2Saved: challengeData.co2Saved || null,
          participants: challengeData.registeredParticipants || challengeData.participants || 0,
          isJoined: challengeData.isJoined || false,
          isCreator: challengeData.isCreator || false,
          featured: challengeData.featured || false,
          createdBy: challengeData.createdBy || 'No data',
          createdById: challengeData.createdById || challengeData.userId,
          createdAt: challengeData.createdAt || 'No data'
        }

        setChallenge(transformedChallenge)

        // Fetch related challenges in the same category
        try {
          const params = {
            category: challengeData.category,
            limit: 4, // Get 4 to exclude current one
            status: 'active'
          }
          const allChallengesResponse = await challengeApi.getAll(params)
          let allChallengesData = []
          
          if (allChallengesResponse?.data) {
            allChallengesData = allChallengesResponse.data
          } else if (Array.isArray(allChallengesResponse)) {
            allChallengesData = allChallengesResponse
          }

          // Filter out current challenge and limit to 3
          const related = allChallengesData
            .filter(c => (c.id || c._id) !== id)
            .slice(0, 3)
            .map(challenge => ({
              _id: challenge.id || challenge._id,
              title: challenge.title || 'No data',
              description: challenge.shortDescription || challenge.description || 'No data',
              category: challenge.category || 'No data',
              duration: challenge.duration || 'No data',
              imageUrl: challenge.image || challenge.imageUrl || 'No data',
              participants: challenge.registeredParticipants || challenge.participants || 0,
              impactMetric: challenge.impact || challenge.impactMetric || 'No data',
              startDate: challenge.startDate || 'No data'
            }))

          setRelatedChallenges(related)
        } catch (relatedError) {
          console.error('Error fetching related challenges:', relatedError)
          setRelatedChallenges([])
        }

      } catch (error) {
        console.error('Error fetching challenge:', error)
        if (error.status === 404) {
          setError({ type: 'not-found', message: 'Challenge not found.' })
        } else if (error.status === 0) {
          setError({ type: 'network', message: 'Unable to connect to the server. Please check your internet connection.' })
        } else {
          setError({ type: 'general', message: 'Failed to load challenge details. Please try again.' })
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchChallenge()
    }
  }, [id])

  if (loading) {
    return <EcoLoader />
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mb-6 p-4 rounded-full bg-red-100 inline-flex">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {error.type === 'not-found' ? 'Challenge Not Found' : 'Unable to Load Challenge'}
        </h2>
        <p className="text-slate-600 mb-6">{error.message}</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="outline" as={Link} to="/challenges">Back to Challenges</Button>
        </div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-900 mb-4">Challenge not found.</p>
        <Button as={Link} to="/challenges">Back to Challenges</Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <article className="grid gap-6 lg:grid-cols-2">
        <img
          src={challenge.imageUrl}
          alt={challenge.title}
          className="h-64 sm:h-72 w-full rounded-lg object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = utils.getPlaceholderImage(600, 400, challenge.title);
          }}
        />
        <div>
          <p className="text-sm font-medium text-emerald-700">{challenge.category}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">{challenge.title}</h1>
          <p className="mt-3 text-slate-700">{challenge.description}</p>
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-900">
            <div>
              <dt className="font-medium text-slate-900">Participants</dt>
              <dd>
                {challenge.participants > 0
                  ? `${challenge.participants} people joined already`
                  : 'No people joined yet'}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Duration</dt>
              <dd>{challenge.duration}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Difficulty</dt>
              <dd>{challenge.difficulty}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Target</dt>
              <dd>{challenge.target}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Start Date</dt>
              <dd>{challenge.startDate}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">End Date</dt>
              <dd>{challenge.endDate}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {isOwner ? (
              // Owner can edit and delete
              <>
                <Button 
                  as={Link} 
                  to={`/challenges/edit/${challenge._id}`} 
                  className="w-full sm:w-auto"
                >
                  Edit Challenge
                </Button>
                <Button 
                  onClick={handleDeleteChallenge}
                  variant="destructive" 
                  className="w-full sm:w-auto"
                >
                  Delete Challenge
                </Button>
              </>
            ) : auth.isLoggedIn ? (
              // Other users can join or leave
              <>
                {isJoined ? (
                  <Button 
                    onClick={handleLeaveChallenge}
                    disabled={isLeaving}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {isLeaving ? 'Leaving...' : 'Leave Challenge'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleJoinChallenge}
                    disabled={isJoining || challenge.status !== 'active'}
                    className="w-full sm:w-auto"
                  >
                    {isJoining ? 'Joining...' : 'Join Challenge'}
                  </Button>
                )}
              </>
            ) : (
              // Not logged in - prompt to login
              <Button as={Link} to="/login" className="w-full sm:w-auto">
                Login to Join Challenge
              </Button>
            )}
            <Button variant="secondary" as={Link} to="/challenges" className="w-full sm:w-auto">
              Back
            </Button>
          </div>
        </div>
      </article>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Related challenges</h2>
        {relatedChallenges.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedChallenges.map((c) => (
              <ChallengeCard key={c._id} challenge={c} />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No related challenges available.</p>
        )}
      </section>
    </div>
  )
}


