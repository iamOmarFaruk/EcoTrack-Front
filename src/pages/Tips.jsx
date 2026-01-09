import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import LazyTipCard from '../components/LazyTipCard.jsx'
import TipModal from '../components/TipModal.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { TipCardSkeleton } from '../components/Skeleton.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { useState, useMemo } from 'react'
import { defaultImages } from '../config/env.js'
import { showDeleteConfirmation, showError } from '../utils/toast.jsx'
import { useTips, useTipMutations } from '../hooks/queries'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [activeTab, setActiveTab] = useState('all') // 'all', 'trending', 'my'
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = [
    'All', 'Energy', 'Water', 'Waste', 'Transportation', 'Food', 'Home', 'Biodiversity'
  ]

  // Memoize filters for React Query
  const filters = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 20,
      sortBy: activeTab === 'trending' ? 'upvoteCount' : sortBy,
      order: activeTab === 'trending' ? 'desc' : order
    }
    if (searchQuery) params.search = searchQuery
    if (selectedCategory !== 'All') params.category = selectedCategory

    return params
  }, [currentPage, sortBy, order, searchQuery, activeTab, selectedCategory, user])

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
            backgroundImage={defaultImages.tipsHero}
            height="medium"
            overlayIntensity="medium"
          />
        </div>
        {/* Error Message */}
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="mb-6 p-4 rounded-full bg-danger/15">
            <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-heading mb-2">
            Unable to Load Tips
          </h3>
          <p className="text-text/80 mb-6 max-w-md">
            {error.message || 'There was an issue connecting to the server.'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
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
          backgroundImage={defaultImages.tipsHero}
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

        {/* Filter Toolbar */}
        <div className="bg-surface rounded-2xl border border-border p-4 sm:p-6 shadow-sm space-y-6">
          {/* Top Row: Tabs and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* View Tabs */}
            <div className="flex p-1 bg-muted rounded-xl w-fit">
              {[
                { id: 'all', label: 'All Tips' },
                { id: 'trending', label: 'Trending' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-surface text-primary shadow-sm ring-1 ring-border'
                    : 'text-text/60 hover:text-text hover:bg-surface/50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-2xl">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search tips..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 pl-10 bg-muted/50 text-text border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface transition-all placeholder:text-text/40"
                />
                <svg
                  className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {activeTab !== 'trending' && (
                <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-xl border border-border/50">
                  <button
                    onClick={() => handleSortChange('createdAt')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${sortBy === 'createdAt'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text/60 hover:text-text'
                      }`}
                  >
                    Newest {sortBy === 'createdAt' && (order === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    onClick={() => handleSortChange('upvoteCount')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${sortBy === 'upvoteCount'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text/60 hover:text-text'
                      }`}
                  >
                    Popular {sortBy === 'upvoteCount' && (order === 'desc' ? '↓' : '↑')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Pills */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text/40 px-1">
              Explore by category
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${selectedCategory === cat
                    ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/5'
                    : 'bg-surface border-border text-text/70 hover:border-text/30 hover:text-text'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-text/60">
            {loading ? 'Finding tips...' : `Showing ${tips.length} tips`}
            {selectedCategory !== 'All' && <span className="ml-1 text-primary">in {selectedCategory}</span>}
          </p>
          {(searchQuery || selectedCategory !== 'All' || activeTab !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setActiveTab('all');
                setSortBy('createdAt');
                setOrder('desc');
              }}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset Filters
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-skeletons"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={`skeleton-${i}`} variants={itemVariants}>
                  <TipCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : tips.length > 0 ? (
            <motion.div
              key={`tips-grid-${tips.length}-${sortBy}-${order}-${searchQuery}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {tips.map((tip) => (
                <motion.div key={tip.id} variants={itemVariants}>
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
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              <div className="bg-surface rounded-xl p-12 border border-border dashed text-center max-w-2xl mx-auto">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-primary/5">
                    <svg className="h-12 w-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-heading mb-3">No tips shared yet</h3>
                <p className="text-text/70 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? `We couldn't find any tips matching "${searchQuery}". Try a different search term.`
                    : 'Be the first to share an eco-friendly tip with the community and inspire others!'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  )}
                  {user ? (
                    <Button onClick={handleAddTip} className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Share Your Tip
                    </Button>
                  ) : (
                    <Button onClick={handleLoginRequired}>
                      Login to Share Tips
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
