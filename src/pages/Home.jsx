import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import LazyTipCard from '../components/LazyTipCard.jsx'
import LazyEventCard from '../components/LazyEventCard.jsx'
import { ChallengeCardSkeleton, TipCardSkeleton, EventCardSkeleton } from '../components/Skeleton.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import CommunityStats from '../components/CommunityStats.jsx'
import LazySection from '../components/LazySection.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Button from '../components/ui/Button.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js'
import { defaultImages } from '../config/env'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import TipModal from '../components/TipModal.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { showSuccess, showDeleteConfirmation } from '../utils/toast.jsx'
import {
  useFeaturedChallenges,
  useChallenges,
  useEvents,
  useTips,
  useTipMutations
} from '../hooks/queries'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../utils/animations'

export default function Home() {
  useDocumentTitle('Home')

  const { user } = useAuth()

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTip, setEditingTip] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Intersection observer for Why Go Green section
  const [setWhyGoGreenRef, isWhyGoGreenVisible] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '50px',
    triggerOnce: true
  })

  // Queries
  const {
    data: featuredChallenges = [],
    isLoading: loadingFeatured
  } = useFeaturedChallenges()

  const {
    data: challenges = [],
    isLoading: loadingChallenges
  } = useChallenges({
    page: 1,
    limit: 6,
    status: 'active',
    sortBy: 'startDate',
    order: 'asc'
  })

  const {
    data: events = [],
    isLoading: loadingEvents
  } = useEvents({
    page: 1,
    limit: 4,
    sortBy: 'createdAt',
    order: 'desc'
  })

  const {
    data: tips = [],
    isLoading: loadingTips
  } = useTips({
    page: 1,
    limit: 4,
    sortBy: 'createdAt',
    order: 'desc'
  })

  // Mutations
  const { deleteTip, upvoteTip, updateTip } = useTipMutations()

  // Check if user can modify a tip (ownership check)
  const canModifyTip = (tip) => {
    if (!user) return false

    return (
      tip.authorId === user.uid ||
      tip.author?.uid === user.uid ||
      tip.author?.id === user.uid ||
      tip.author?.firebaseId === user.uid ||
      tip.author === user.uid ||
      tip.firebaseId === user.uid
    )
  }

  // Handle edit tip
  const handleEditTip = (tip) => {
    setEditingTip(tip)
    setIsModalOpen(true)
  }

  // Handle delete tip
  const handleDeleteTip = async (tipId) => {
    showDeleteConfirmation({
      itemName: 'Tip',
      onConfirm: () => deleteTip.mutate(tipId)
    })
  }

  // Handle upvote tip
  const handleUpvote = (tipId) => {
    upvoteTip.mutate(tipId)
  }

  // Handle submit tip (for edit modal)
  const handleSubmitTip = async (tipData) => {
    try {
      if (editingTip) {
        // Use mutateAsync to wait for success before closing modal or handling errors locally if needed
        await updateTip.mutateAsync({ id: editingTip.id, data: tipData })
      }

      setIsModalOpen(false)
      setEditingTip(null)
    } catch (error) {
      // Error is handled by mutation hook global error or local override
      console.error(error)
    }
  }

  // Handle login required
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true)
  }


  return (
    <div className="space-y-12">
      <div className="full-bleed">
        {loadingFeatured ? (
          <div className="relative h-[500px] bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <div className="text-center text-surface">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-surface mx-auto mb-4"></div>
              <p className="text-lg">Loading featured challenges...</p>
            </div>
          </div>
        ) : featuredChallenges.length > 0 ? (
          <Hero slides={featuredChallenges} effect="fade" />
        ) : (
          <div className="relative h-[500px] bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <div className="text-center text-surface px-4">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-3xl font-heading font-bold mb-2">No Featured Challenges Available</h2>
              <p className="text-lg text-surface/90 mb-6">Check back soon for exciting eco-friendly challenges!</p>
              <Button as={Link} to="/challenges" variant="secondary">
                Browse All Challenges
              </Button>
            </div>
          </div>
        )}
      </div>

      <CommunityStats />

      <section>
        <SectionHeading
          badge="Challenges"
          title="Active Challenges"
          subtitle="Happening right now"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {loadingChallenges && Array.from({ length: 6 }).map((_, i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
          {!loadingChallenges && challenges?.map((c) => (
            <motion.div key={c._id || c.id} variants={itemVariants}>
              <LazyChallengeCard challenge={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <SectionHeading
          badge="Community Wisdom"
          title="Recent Tips"
          subtitle="Practical, bite-sized advice"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {loadingTips && Array.from({ length: 4 }).map((_, i) => (
            <TipCardSkeleton key={i} />
          ))}
          {!loadingTips && tips?.map((t, i) => (
            <motion.div key={t._id || t.id || i} variants={itemVariants}>
              <LazyTipCard
                tip={t}
                showActions={true}
                canModify={canModifyTip(t)}
                onEdit={handleEditTip}
                onDelete={handleDeleteTip}
                onUpvote={handleUpvote}
                onLoginRequired={handleLoginRequired}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <SectionHeading
          badge="Events"
          title="Upcoming Events"
          subtitle="Join the community"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {loadingEvents && Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
          {!loadingEvents && events?.map((e, i) => (
            <motion.div key={e._id || e.id || i} variants={itemVariants}>
              <LazyEventCard event={e} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center" ref={setWhyGoGreenRef}>
        {/* Left Image */}
        <div className="order-1">
          <img
            src={defaultImages.homeFeature}
            alt="Hands holding a small plant seedling with soil"
            className={`w-full h-80 sm:h-96 lg:h-[28rem] object-cover rounded-2xl shadow-lg transition-all duration-1000 ease-out ${isWhyGoGreenVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-12'
              }`}
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="order-2 space-y-4">
          <SectionHeading
            badge="Why EcoTrack"
            title="Why Go Green?"
            subtitle="Sustainable living isn't just good for the planet—it's good for you too. Discover the amazing benefits of making eco-friendly choices in your daily life."
            centered={false}
          />

          <ul className="space-y-3 text-text/80">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-heading">Save Money:</strong> Reduce utility bills through energy efficiency and waste reduction
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-heading">Better Health:</strong> Cleaner air, organic foods, and active transportation improve well-being
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-heading">Protect the Future:</strong> Preserve natural resources for future generations
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-heading">Create Community:</strong> Connect with like-minded people who share your values
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-heading">Feel Empowered:</strong> Take meaningful action that makes a real difference
              </span>
            </li>
          </ul>
        </div>
      </section>

      <HowItWorks />

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




