import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import LazyTipCard from '../components/LazyTipCard.jsx'
import LazyEventCard from '../components/LazyEventCard.jsx'
import { ChallengeCardSkeleton, TipCardSkeleton, EventCardSkeleton, HeroSkeleton } from '../components/Skeleton.jsx'
import CommunityStats from '../components/CommunityStats.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Testimonials from '../components/Testimonials.jsx'
import FAQ from '../components/FAQ.jsx'
import CTA from '../components/CTA.jsx'
import Button from '../components/ui/Button.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js'
import { defaultImages } from '../config/env'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import TipModal from '../components/TipModal.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { showDeleteConfirmation, showError } from '../utils/toast.jsx'
import {
  useFeaturedChallenges,
  useChallenges,
  useEvents,
  useTips,
  useTipMutations
} from '../hooks/queries'
import { motion, AnimatePresence } from 'framer-motion'
import { stackedContainer, stackedItem } from '../utils/animations'
import whyGoGreenImg from '../assets/why-go-green.png'

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
      showError(error.message || 'Unable to save tip')
    }
  }

  // Handle login required
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="full-bleed mb-8 sm:mb-10">
        {loadingFeatured ? (
          <HeroSkeleton />
        ) : featuredChallenges.length > 0 ? (
          <Hero slides={featuredChallenges} effect="fade" />
        ) : (
          <div className="relative h-[500px] bg-surface flex items-center justify-center overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="text-center text-text px-4 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-heading font-bold mb-3 tracking-tight text-heading">No Featured Challenges Yet</h2>
              <p className="text-lg text-text/60 mb-8 max-w-md mx-auto">We're currently preparing new exciting eco-challenges for you. Browse our community to see what else is happening!</p>
              <Button as={Link} to="/challenges" variant="primary" size="lg">
                Explore All Challenges
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
        <AnimatePresence mode="wait">
          {loadingChallenges ? (
            <motion.div
              key="loading-challenges"
              variants={stackedContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={`skeleton-${i}`} variants={stackedItem}>
                  <ChallengeCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : challenges.length > 0 ? (
            <motion.div
              key="challenges-content"
              variants={stackedContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {challenges.map((c) => (
                <motion.div key={c._id || c.id} variants={stackedItem}>
                  <LazyChallengeCard challenge={c} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-challenges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-[200px] bg-surface flex items-center justify-center overflow-hidden rounded-2xl border border-border dashed"
            >
              <p className="text-text/60">No active challenges at the moment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section>
        <SectionHeading
          badge="Community Wisdom"
          title="Recent Tips"
          subtitle="Practical, bite-sized advice"
        />
        <AnimatePresence mode="wait">
          {loadingTips ? (
            <motion.div
              key="loading-tips"
              variants={stackedContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={`skeleton-${i}`} variants={stackedItem}>
                  <TipCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : tips.length > 0 ? (
            <motion.div
              key="tips-content"
              variants={stackedContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {tips.map((t, i) => (
                <motion.div key={t._id || t.id || i} variants={stackedItem}>
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
          ) : (
            <motion.div
              key="no-tips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-[150px] bg-surface flex items-center justify-center overflow-hidden rounded-2xl border border-border dashed"
            >
              <p className="text-text/60">No recent tips shared yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="full-bleed bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Events"
            title="Upcoming Events"
            subtitle="Join the community"
          />
          <AnimatePresence mode="wait">
            {loadingEvents ? (
              <motion.div
                key="loading-events"
                variants={stackedContainer}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div key={`skeleton-${i}`} variants={stackedItem}>
                    <EventCardSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : events.length > 0 ? (
              <motion.div
                key="events-content"
                variants={stackedContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {events.map((e, i) => (
                  <motion.div key={e._id || e.id || i} variants={stackedItem}>
                    <LazyEventCard event={e} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-events"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-[150px] bg-surface flex items-center justify-center overflow-hidden rounded-2xl border border-border dashed"
              >
                <p className="text-text/60">No upcoming events scheduled.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="full-bleed bg-surface !mt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center" ref={setWhyGoGreenRef}>
            {/* Left Image */}
            <div className="order-1 h-full">
              <img
                src={whyGoGreenImg}
                alt="Sustainable lifestyle gardening and eco-friendly home items"
                className={`w-full h-[30rem] sm:h-[35rem] lg:h-[42rem] object-cover rounded-2xl shadow-xl transition-all duration-1000 ease-out ${isWhyGoGreenVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'
                  }`}
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="order-2 space-y-6">
              <SectionHeading
                badge="Why EcoTrack"
                title="Why Go Green?"
                subtitle="Sustainable living isn't just good for the planet—it's good for you too. Discover the amazing benefits of making eco-friendly choices in your daily life."
                subtitleClassName="text-text/95 font-medium"
                centered={false}
              />

              <ul className="space-y-4 text-text/90">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2.5"></span>
                  <span className="text-base sm:text-lg leading-relaxed">
                    <strong className="text-heading font-bold">Save Money:</strong> Reduce utility bills through energy efficiency and waste reduction
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2.5"></span>
                  <span className="text-base sm:text-lg leading-relaxed">
                    <strong className="text-heading font-bold">Better Health:</strong> Cleaner air, organic foods, and active transportation improve well-being
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2.5"></span>
                  <span className="text-base sm:text-lg leading-relaxed">
                    <strong className="text-heading font-bold">Protect the Future:</strong> Preserve natural resources for future generations
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2.5"></span>
                  <span className="text-base sm:text-lg leading-relaxed">
                    <strong className="text-heading font-bold">Create Community:</strong> Connect with like-minded people who share your values
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary/100 rounded-full mt-2.5"></span>
                  <span className="text-base sm:text-lg leading-relaxed">
                    <strong className="text-heading font-bold">Feel Empowered:</strong> Take meaningful action that makes a real difference
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <div className="full-bleed">
        <Testimonials />
      </div>

      <FAQ />

      <div className="full-bleed mb-8 sm:mb-12">
        <CTA />
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
