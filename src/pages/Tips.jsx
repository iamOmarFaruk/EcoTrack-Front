import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useUserTips } from '../hooks/useUserTips.js'
import { mockTips } from '../data/mockTips.js'
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
  const { getAllTipsForDisplay, addTip, updateTip, deleteTip } = useUserTips()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTip, setEditingTip] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  const { data: mockTipsData, loading } = useMockFetch(() => {
    return [...mockTips]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, 700)

  // Combine mock tips with user tips
  const allTips = getAllTipsForDisplay(mockTipsData || [])
  
  const handleAddTip = () => {
    setEditingTip(null)
    setIsModalOpen(true)
  }

  const handleEditTip = (tip) => {
    setEditingTip(tip)
    setIsModalOpen(true)
  }

  const handleDeleteTip = (tipId) => {
    if (window.confirm('Are you sure you want to delete this tip?')) {
      deleteTip(tipId)
    }
  }

  const handleSubmitTip = async (tipData) => {
    try {
      if (editingTip) {
        updateTip(editingTip.id, tipData)
      } else {
        addTip(tipData)
      }
      setIsModalOpen(false)
      setEditingTip(null)
    } catch (error) {
      console.error('Error submitting tip:', error)
      throw error
    }
  }

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true)
  }
  
  if (loading) {
    return <EcoLoader />
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
          {allTips?.map((t, i) => (
            <LazyTipCard 
              key={t.id || i} 
              tip={t} 
              showContent={false} 
              showActions={true}
              onEdit={handleEditTip}
              onDelete={handleDeleteTip}
              onLoginRequired={handleLoginRequired}
            />
          ))}
        </div>
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


