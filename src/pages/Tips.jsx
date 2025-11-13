import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useUserTips } from '../hooks/useUserTips.js'
import LazyTipCard from '../components/LazyTipCard.jsx'
import TipModal from '../components/TipModal.jsx'
import LoginModal from '../components/LoginModal.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'
import Button from '../components/ui/Button.jsx'
import { useState } from 'react'

export default function Tips() {
  useDocumentTitle('Recent Tips')
  const { user } = useAuth()
  const { tips, loading, error, addTip, updateTip, deleteTip, upvoteTip, canModifyTip } = useUserTips()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTip, setEditingTip] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  const handleAddTip = () => {
    setEditingTip(null)
    setIsModalOpen(true)
  }

  const handleEditTip = (tip) => {
    setEditingTip(tip)
    setIsModalOpen(true)
  }

  const handleDeleteTip = async (tipId) => {
    if (window.confirm('Are you sure you want to delete this tip?')) {
      try {
        await deleteTip(tipId)
      } catch (error) {
        alert('Failed to delete tip: ' + error.message)
      }
    }
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
      console.error('Error submitting tip:', error)
      throw error
    }
  }

  const handleUpvote = async (tipId) => {
    try {
      await upvoteTip(tipId)
    } catch (error) {
      console.error('Error upvoting tip:', error)
      alert('Failed to upvote tip: ' + error.message)
    }
  }

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true)
  }
  
  if (loading) {
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


