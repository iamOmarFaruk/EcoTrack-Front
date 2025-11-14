import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading.jsx'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'
import { userApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function MyActivities() {
  const isLoading = useMinimumLoading(300)
  const { auth } = useAuth()
  const [activities, setActivities] = useState([])
  const [summary, setSummary] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchActivities()
  }, [currentPage, statusFilter])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 12
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      const response = await userApi.getMyActivities(params)
      const data = response?.data || response
      
      setActivities(data?.activities || [])
      setSummary(data?.summary || null)
      setPagination(data?.pagination || null)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
      toast.error('Failed to load your activities')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return <EcoLoader />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeading title="My Activities" subtitle="Track your eco-friendly journey and achievements" />
      
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
            <div className="text-3xl font-bold text-emerald-600">{summary.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Challenges</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600">{summary.active}</div>
            <div className="text-sm text-gray-600 mt-1">Active Challenges</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
            <div className="text-3xl font-bold text-purple-600">{summary.completed}</div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'active'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'completed'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Activities Grid */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🌱</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No activities yet</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Start joining challenges to track your eco-friendly journey!
          </p>
          <Link
            to="/challenges"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
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
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {activity.challenge?.imageUrl && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={activity.challenge.imageUrl}
                      alt={activity.challenge.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {activity.challenge?.category || 'Challenge'}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        activity.userProgress?.status === 'Completed'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {activity.userProgress?.status || 'Ongoing'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {activity.challenge?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {activity.challenge?.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-gray-900">
                        {activity.userProgress?.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activity.userProgress?.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Impact */}
                  {activity.userProgress?.impactAchieved > 0 && (
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-semibold text-emerald-600">
                        {activity.userProgress.impactAchieved}
                      </span>{' '}
                      {activity.challenge?.impactMetric || 'impact points'}
                    </div>
                  )}

                  <Link
                    to={`/challenges/${activity.challenge?._id}`}
                    className="block w-full text-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
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
                className="px-4 py-2 rounded-lg border border-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg border border-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
