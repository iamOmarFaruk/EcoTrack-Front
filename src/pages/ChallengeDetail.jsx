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
  
  useDocumentTitle(challenge ? challenge.title : 'Challenge Details')

  // Check if current user is the creator of the challenge
  const isOwner = challenge && auth.user && (
    challenge.createdBy === auth.user.email ||
    challenge.createdBy === auth.user.uid ||
    challenge.createdById === auth.user.uid
  )

  const handleDeleteChallenge = async () => {
    if (!window.confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return
    }

    try {
      await challengeApi.delete(id)
      toast.success('Challenge deleted successfully!')
      // Navigate back to challenges page
      window.location.href = '/challenges'
    } catch (error) {
      console.error('Error deleting challenge:', error)
      toast.error('Failed to delete challenge. Please try again.')
    }
  }

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch the specific challenge
        const challengeResponse = await challengeApi.getById(id)
        
        let challengeData = null
        if (challengeResponse && challengeResponse.data && challengeResponse.data.challenge) {
          challengeData = challengeResponse.data.challenge
        } else if (challengeResponse && challengeResponse.challenge) {
          challengeData = challengeResponse.challenge
        } else if (challengeResponse) {
          challengeData = challengeResponse
        }

        if (!challengeData) {
          throw new Error('Challenge not found')
        }

        // Transform challenge data
        const transformedChallenge = {
          _id: challengeData._id || challengeData.id,
          title: challengeData.title || 'No data',
          description: challengeData.description || 'No data',
          category: challengeData.category || 'No data',
          difficulty: challengeData.difficulty || 'No data',
          duration: challengeData.duration || 'No data',
          target: challengeData.target || 'No data',
          startDate: challengeData.startDate || 'No data',
          endDate: challengeData.endDate || 'No data',
          instructions: challengeData.instructions || [],
          tips: challengeData.tips || [],
          imageUrl: challengeData.imageUrl || 'No data',
          impactMetric: challengeData.impactMetric || 'No data',
          participants: challengeData.participants || 'No data',
          createdAt: challengeData.createdAt || 'No data',
          updatedAt: challengeData.updatedAt || 'No data',
          createdBy: challengeData.createdBy || 'No data',
          createdById: challengeData.createdById || challengeData.userId,
          isActive: challengeData.isActive
        }

        setChallenge(transformedChallenge)

        // Fetch related challenges (all other challenges)
        try {
          const allChallengesResponse = await challengeApi.getAll()
          let allChallengesData = []
          
          if (Array.isArray(allChallengesResponse)) {
            allChallengesData = allChallengesResponse
          } else if (allChallengesResponse && allChallengesResponse.data && Array.isArray(allChallengesResponse.data.challenges)) {
            allChallengesData = allChallengesResponse.data.challenges
          }

          // Filter out current challenge and limit to 3
          const related = allChallengesData
            .filter(c => (c._id || c.id) !== id)
            .slice(0, 3)
            .map(challenge => ({
              _id: challenge._id || challenge.id,
              title: challenge.title || 'No data',
              description: challenge.description || 'No data',
              category: challenge.category || 'No data',
              difficulty: challenge.difficultyLevel || challenge.difficulty || 'No data',
              duration: challenge.duration || 'No data',
              imageUrl: challenge.imageUrl || 'No data',
              participants: challenge.participants || 'No data',
              impactMetric: challenge.impactMetric || 'No data',
              startDate: challenge.startDate || 'No data'
            }))

          setRelatedChallenges(related)
        } catch (relatedError) {
          console.warn('Failed to fetch related challenges:', relatedError)
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
              <dd>{challenge.participants}</dd>
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
              // Other users can join
              <Button as={Link} to={`/challenges/join/${challenge._id}`} className="w-full sm:w-auto">
                Join Challenge
              </Button>
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


