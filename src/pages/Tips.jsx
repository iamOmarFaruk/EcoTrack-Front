import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import LazyTipCard from '../components/LazyTipCard.jsx'
import TipModal from '../components/TipModal.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { TipCardSkeleton } from '../components/Skeleton.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { useState, useMemo } from 'react'
import { showDeleteConfirmation, showError } from '../utils/toast.jsx'
import { useTips, useTipMutations } from '../hooks/queries'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'

export default function Tips() {
  useDocumentTitle('Recent Tips')
  const { user } = useAuth()

  // Local state for UI
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTip, setEditingTip] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Local state for filters
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Memoize filters for React Query
  const filters = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 20,
      sortBy,
      order
    }
    if (searchQuery) params.search = searchQuery
    return params
  }, [currentPage, sortBy, order, searchQuery])

  // React Query Hooks
  const {
    data: tips = [],
    isLoading: loading,
    error
  } = useTips(filters)

  const { createTip, updateTip, deleteTip, upvoteTip } = useTipMutations()

  const handleAddTip = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }
    setEditingTip(null)
    setIsModalOpen(true)
  }

  const handleEditTip = (tip) => {
    setEditingTip(tip)
    setIsModalOpen(true)
  }

  const handleDeleteTip = (tipId) => {
    showDeleteConfirmation({
      itemName: 'Tip',
      onConfirm: () => deleteTip.mutate(tipId)
    })
  }

  const handleSubmitTip = async (tipData) => {
    try {
      if (editingTip) {
        await updateTip.mutateAsync({ id: editingTip.id, data: tipData })
      } else {
        await createTip.mutateAsync(tipData)
      }
      setIsModalOpen(false)
      setEditingTip(null)
    } catch (error) {
      console.error(error)
      // Error handled by mutation hook or toast
    }
  }

  const handleUpvote = (tipId) => {
    upvoteTip.mutate(tipId)
  }

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true)
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setOrder(order === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(newSortBy)
      setOrder('desc')
    }
    setCurrentPage(1)
  }

  // Check if user can edit/delete a tip
  const canModifyTip = (tip) => {
    if (!user) return false
    return (
      tip.authorId === user.uid ||
      tip.author?.uid === user.uid ||
      tip.author?.id === user.uid ||
      tip.author === user.uid ||
      tip.firebaseId === user.uid
    )
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
          <p className="text-danger">Error loading tips. Please try again.</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Refresh
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
            <p className="mt-1 text-sm sm:text-base text-heading">Recent community-shared sustainability tips and advice.</p>
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
                className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text/60"
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'createdAt'
                ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
                : 'bg-muted text-text hover:bg-muted'
                }`}
            >
              Newest
              {sortBy === 'createdAt' && (
                <span className="ml-1">{order === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
            <button
              onClick={() => handleSortChange('upvoteCount')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'upvoteCount'
                ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
                : 'bg-muted text-text hover:bg-muted'
                }`}
            >
              Popular
              {sortBy === 'upvoteCount' && (
                <span className="ml-1">{order === 'desc' ? '↓' : '↑'}</span>
              )}
            </button>
          </div>
        </div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TipCardSkeleton key={i} />
            ))
          ) : tips?.map((tip, i) => (
            <motion.div key={tip.id || tip._id || i} variants={itemVariants}>
              <LazyTipCard
                tip={tip}
                showContent={true}
                showActions={true}
                onEdit={handleEditTip}
                onDelete={handleDeleteTip}
                onUpvote={handleUpvote}
                onLoginRequired={handleLoginRequired}
                canModify={canModifyTip(tip)}
              />
            </motion.div>
          ))}
        </motion.div>

        {tips?.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-text/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h32l-3 18H11L8 12zm0 0l-2-7m14 25v8m0-8l3 3m-3-3l-3 3" />
            </svg>
            <h3 className="text-lg font-medium text-heading mb-2">No tips shared yet</h3>
            <p className="text-text/80 mb-4">Be the first to share an eco-friendly tip with the community!</p>
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

