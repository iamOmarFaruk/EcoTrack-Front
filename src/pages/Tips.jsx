import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useUserTips } from '../hooks/useUserTips.js'
import LazyTipCard from '../components/LazyTipCard.jsx'
import TipModal from '../components/TipModal.jsx'
import LoginModal from '../components/LoginModal.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Tips() {
  useDocumentTitle('Recent Tips')
  const { user } = useAuth()
  const { tips, loading, error, pagination, fetchTips, addTip, updateTip, deleteTip, upvoteTip, canModifyTip } = useUserTips()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTip, setEditingTip] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleAddTip = () => {
    setEditingTip(null)
    setIsModalOpen(true)
  }

  const handleEditTip = (tip) => {
    setEditingTip(tip)
    setIsModalOpen(true)
  }

  const handleDeleteTip = async (tipId) => {
    toast((t) => (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">Delete Tip</h3>
          <p className="text-sm text-gray-600 mt-1 mb-3">
            Are you sure you want to delete this tip? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await deleteTip(tipId)
                } catch (error) {
                  toast.error('Failed to delete tip: ' + error.message)
                }
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        background: '#fff',
        border: '1px solid #fed7d7',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
      }
    })
  }

  const handleSubmitTip = async (tipData) => {
    try {
      if (editingTip) {
        await updateTip(editingTip.id, tipData)
      } else {
        await addTip(tipData)
      }
      setIsModalOpen(false)
      setEditingTip(null)
    } catch (error) {
      throw error
    }
  }

  const handleUpvote = async (tipId) => {
    try {
      await upvoteTip(tipId)
    } catch (error) {
      toast.error('Failed to upvote tip: ' + error.message)
    }
  }

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true)
  }

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle order if clicking the same sort option
      setOrder(order === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(newSortBy)
      setOrder('desc')
    }
  }

  // Handle search with debounce effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTips({ 
        sortBy, 
        order, 
        search: searchQuery,
        page: 1,
        limit: 20
      })
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [sortBy, order, searchQuery])
  
  if (loading && tips.length === 0) {
    return <EcoLoader />
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="full-bleed -mt-8">
          <SubpageHero
            title="Eco Tips"
            subtitle="Discover practical tips and advice from our eco-conscious community"
            backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
            height="medium"
            overlayIntensity="medium"
          />
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading tips: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title="Eco Tips"
          subtitle="Discover practical tips and advice from our eco-conscious community"
          backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Community Tips</h2>
            <p className="mt-1 text-sm sm:text-base text-slate-900">Recent community-shared sustainability tips and advice.</p>
          </div>
          {user && (
            <Button 
              onClick={handleAddTip}
              className="hidden sm:flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Tip
            </Button>
          )}
        </div>

        {/* Mobile Add Button */}
        {user && (
          <div className="sm:hidden">
            <Button 
              onClick={handleAddTip}
              className="w-full flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Share Your Tip
            </Button>
          </div>
        )}

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('createdAt')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'createdAt'
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Newest
              {sortBy === 'createdAt' && (
                <span className="ml-1">{order === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
            <button
              onClick={() => handleSortChange('upvoteCount')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'upvoteCount'
                  ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Popular
              {sortBy === 'upvoteCount' && (
                <span className="ml-1">{order === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tips?.map((tip) => (
            <LazyTipCard 
              key={tip.id} 
              tip={tip} 
              showContent={true} 
              showActions={true}
              onEdit={handleEditTip}
              onDelete={handleDeleteTip}
              onUpvote={handleUpvote}
              onLoginRequired={handleLoginRequired}
              canModify={canModifyTip(tip)}
            />
          ))}
        </div>

        {tips?.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h32l-3 18H11L8 12zm0 0l-2-7m14 25v8m0-8l3 3m-3-3l-3 3" />
            </svg>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No tips shared yet</h3>
            <p className="text-slate-600 mb-4">Be the first to share an eco-friendly tip with the community!</p>
            {user ? (
              <Button onClick={handleAddTip} className="mx-auto">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Share Your First Tip
              </Button>
            ) : (
              <Button onClick={handleLoginRequired} className="mx-auto">
                Login to Share Tips
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tip Modal */}
      <TipModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTip(null)
        }}
        onSubmit={handleSubmitTip}
        editTip={editingTip}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  )
}


