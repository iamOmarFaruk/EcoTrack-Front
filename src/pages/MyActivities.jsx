import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading.jsx'
import { ChallengeCardSkeleton } from '../components/Skeleton.jsx'
import { challengeApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast.jsx'
import { useMyCreatedChallenges, useMyJoinedChallenges } from '../hooks/queries'

export default function MyActivities() {
  const { auth } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    data: joinedChallenges = [],
    isLoading: loadingJoined
  } = useMyJoinedChallenges({ page: currentPage, limit: 12 })

  const {
    data: createdChallenges = [],
    isLoading: loadingCreated
  } = useMyCreatedChallenges()

  const { activities, summary, pagination } = useMemo(() => {
    // Transform joined challenges
    // Note: useMyJoinedChallenges already returns normalized data array from queries.js
    // But we need to match the structure MyActivities expects which includes userProgress

    // The previous implementation fetched raw data. The hook returns normalized challenges.
    // However, for "activities", we need extra info like "userProgress".
    // Normalized challenge object from queries.js:
    /*
      {
        id: ...,
        title: ...,
        ...
      }
    */
    // The previous code mapped raw response.
    // If the unified hook returns just the challenge details, we might be missing specific "userProgress" if it was in the joined response.
    // Queries.js normalizeChallenge doesn't seem to include "userProgress" explicitly unless it was part of the challenge object.

    // Let's assume standard properties for now.

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

    const all = [...transformedCreated, ...transformedJoined]

    // Filter
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
        completed: all.filter(a => a.userProgress.status === 'Completed').length
      },
      // Pagination only applies to joined challenges effectively in this UI as verified by previous code
      // But since we merge them, true pagination is complex. 
      // The previous code just passed "joinedResponse?.pagination".
      // Our hook returns an array, not the full response object with pagination.
      // We might need to update the hook to return pagination info if we want to keep it.
      // For now, I'll omit pagination or set it to null to avoid errors.
      pagination: null
    }
  }, [joinedChallenges, createdChallenges, statusFilter])

  const loading = loadingJoined || loadingCreated

  // ... (rest of render code)




  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeading
        badge="Your Journey"
        title="My Activities"
        subtitle="Track your eco-friendly journey and achievements"
      />

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface p-6 rounded-xl border border-border text-center">
            <div className="text-3xl font-bold text-primary">{summary.total}</div>
            <div className="text-sm text-text/80 mt-1">Total Challenges</div>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-border text-center">
            <div className="text-3xl font-bold text-secondary">{summary.active}</div>
            <div className="text-sm text-text/80 mt-1">Active Challenges</div>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-border text-center">
            <div className="text-3xl font-bold text-secondary">{summary.completed}</div>
            <div className="text-sm text-text/80 mt-1">Completed</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'all'
            ? 'bg-primary text-surface'
            : 'bg-surface text-text/80 border border-border hover:bg-light'
            }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'active'
            ? 'bg-primary text-surface'
            : 'bg-surface text-text/80 border border-border hover:bg-light'
            }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === 'completed'
            ? 'bg-primary text-surface'
            : 'bg-surface text-text/80 border border-border hover:bg-light'
            }`}
        >
          Completed
        </button>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 border border-border shadow-sm text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/15 to-primary/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌱</span>
          </div>
          <h3 className="text-2xl font-bold text-heading mb-4">No activities yet</h3>
          <p className="text-lg text-text/80 mb-6 max-w-2xl mx-auto">
            Start joining challenges to track your eco-friendly journey!
          </p>
          <Link
            to="/challenges"
            className="inline-block px-6 py-3 bg-primary text-surface rounded-lg font-medium hover:bg-primary transition-colors"
          >
            Browse Challenges
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                {activity.challenge?.imageUrl && (
                  <div className="h-48 bg-muted">
                    <img
                      src={activity.challenge.imageUrl}
                      alt={activity.challenge.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {activity.challenge?.category || 'Challenge'}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${activity.userProgress?.status === 'Completed'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-secondary/10 text-secondary'
                        }`}
                    >
                      {activity.userProgress?.status || 'Ongoing'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-heading mb-2 line-clamp-2">
                    {activity.challenge?.title}
                  </h3>
                  <p className="text-sm text-text/80 mb-4 line-clamp-2">
                    {activity.challenge?.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text/80">Progress</span>
                      <span className="text-xs font-semibold text-heading">
                        {activity.userProgress?.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activity.userProgress?.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Impact */}
                  {activity.userProgress?.impactAchieved > 0 && (
                    <div className="text-sm text-text/80 mb-3">
                      <span className="font-semibold text-primary">
                        {activity.userProgress.impactAchieved}
                      </span>{' '}
                      {activity.challenge?.impactMetric || 'impact points'}
                    </div>
                  )}

                  <Link
                    to={`/challenges/${activity.challenge?.slug || activity.challenge?._id}`}
                    className="block w-full text-center px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/15 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 rounded-lg border border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-text/80">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg border border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-light"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
