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
import { useState, useEffect } from 'react'
import { tipsApi, eventApi, challengeApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import TipModal from '../components/TipModal.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { showSuccess, showError, showDeleteConfirmation } from '../utils/toast.jsx'

export default function Home() {
  useDocumentTitle('Home')

  const { user } = useAuth()

  // State for real tips from API
  const [tips, setTips] = useState([])
  const [loadingTips, setLoadingTips] = useState(true)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTip, setEditingTip] = useState(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // State for real events from API
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  // State for real challenges from API
  const [challenges, setChallenges] = useState([])
  const [loadingChallenges, setLoadingChallenges] = useState(true)

  // State for featured challenges (for hero slider)
  const [featuredChallenges, setFeaturedChallenges] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  // Intersection observer for Why Go Green section
  const [setWhyGoGreenRef, isWhyGoGreenVisible] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '50px',
    triggerOnce: true
  })

  // Fetch 5 featured challenges for hero slider
  useEffect(() => {
    const fetchFeaturedChallenges = async () => {
      try {
        setLoadingFeatured(true)
        const response = await challengeApi.getAll({
          page: 1,
          limit: 5,
          status: 'active',
          featured: true,
          sortBy: 'startDate',
          order: 'asc'
        })

        // Handle different API response structures
        let challengesData = response.data
        if (response.data?.challenges) {
          challengesData = response.data.challenges
        } else if (response.data?.data?.challenges) {
          challengesData = response.data.data.challenges
        } else if (response.data?.data) {
          challengesData = response.data.data
        }

        // Ensure we have an array
        const challengesArray = Array.isArray(challengesData) ? challengesData : Object.values(challengesData || {})

        // Enhance challenges with proper data structure for Hero slider
        const enhancedChallenges = challengesArray.map(challenge => ({
          ...challenge,
          _id: challenge._id || challenge.id,
          id: challenge.id || challenge._id,
          slug: challenge.slug || '', // Store slug for SEO-friendly URLs
          participants: challenge.registeredParticipants ?? (Array.isArray(challenge.participants) ? challenge.participants.length : challenge.participants) ?? 0,
          imageUrl: challenge.image || challenge.imageUrl,
          description: challenge.shortDescription || challenge.description // Map API shortDescription to description for Hero
        }))

        setFeaturedChallenges(enhancedChallenges)
      } catch (error) {
        console.error('Error fetching featured challenges:', error)
        setFeaturedChallenges([])
      } finally {
        setLoadingFeatured(false)
      }
    }

    fetchFeaturedChallenges()
  }, [])

  // Fetch 6 active challenges from API
  useEffect(() => {
    const fetchActiveChallenges = async () => {
      try {
        setLoadingChallenges(true)
        const response = await challengeApi.getAll({
          page: 1,
          limit: 6,
          status: 'active',
          sortBy: 'startDate',
          order: 'asc'
        })

        // Handle different API response structures
        let challengesData = response.data
        if (response.data?.challenges) {
          challengesData = response.data.challenges
        } else if (response.data?.data?.challenges) {
          challengesData = response.data.data.challenges
        } else if (response.data?.data) {
          challengesData = response.data.data
        }

        // Ensure we have an array
        const challengesArray = Array.isArray(challengesData) ? challengesData : Object.values(challengesData || {})

        // Enhance challenges with proper data structure
        const enhancedChallenges = challengesArray.map(challenge => ({
          ...challenge,
          _id: challenge._id || challenge.id,
          id: challenge.id || challenge._id,
          slug: challenge.slug || '', // Store slug for SEO-friendly URLs
          participants: challenge.registeredParticipants ?? (Array.isArray(challenge.participants) ? challenge.participants.length : challenge.participants) ?? 0,
          imageUrl: challenge.image || challenge.imageUrl
        }))

        setChallenges(enhancedChallenges)
      } catch (error) {
        console.error('Error fetching challenges:', error)
        setChallenges([])
      } finally {
        setLoadingChallenges(false)
      }
    }

    fetchActiveChallenges()
  }, [])

  // Fetch 4 latest events from API
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoadingEvents(true)
        const response = await eventApi.getAll({
          page: 1,
          limit: 4,
          sortBy: 'createdAt',
          order: 'desc'
        })

        // Handle different API response structures
        let eventsData = response.data
        if (response.data?.events) {
          eventsData = response.data.events
        } else if (response.data?.data?.events) {
          eventsData = response.data.data.events
        } else if (response.data?.data) {
          eventsData = response.data.data
        }

        // Ensure we have an array
        const eventsArray = Array.isArray(eventsData) ? eventsData : Object.values(eventsData || {})

        // Backend always returns _id and slug
        // No need to enhance, use as-is
        setEvents(eventsArray)
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchUpcomingEvents()
  }, [])

  // Fetch 5 most recent tips from API
  useEffect(() => {
    const fetchRecentTips = async () => {
      try {
        setLoadingTips(true)
        const response = await tipsApi.getAll({
          page: 1,
          limit: 5,
          sortBy: 'createdAt',
          order: 'desc'
        })

        // Handle different API response structures
        let tipsData = response.data
        if (response.data?.tips) {
          tipsData = response.data.tips
        } else if (response.data?.data?.tips) {
          tipsData = response.data.data.tips
        } else if (response.data?.data) {
          tipsData = response.data.data
        }

        // Ensure we have an array
        const tipsArray = Array.isArray(tipsData) ? tipsData : Object.values(tipsData || {})

        // Enhance tips with proper data structure
        const enhancedTips = tipsArray.map(tip => ({
          ...tip,
          id: tip.id || tip._id,
          upvotes: Number.isFinite(Number(tip.upvoteCount))
            ? Number(tip.upvoteCount)
            : (Number.isFinite(Number(tip.upvotes)) ? Number(tip.upvotes) : 0),
          authorId: tip.authorId || (typeof tip.author === 'string' ? tip.author : tip.author?.uid || tip.author?.id),
          authorName: tip.authorName || tip.author?.name || 'Anonymous',
          authorImage: tip.authorImage || tip.authorAvatar || tip.author?.avatarUrl || tip.author?.imageUrl,
          firebaseId: tip.firebaseId || (typeof tip.author === 'string' ? tip.author : tip.author?.firebaseId)
        }))

        setTips(enhancedTips)
      } catch (error) {
        console.error('Error fetching tips:', error)
        setTips([])
      } finally {
        setLoadingTips(false)
      }
    }

    fetchRecentTips()
  }, [])

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
      onConfirm: async () => {
        try {
          await tipsApi.delete(tipId)
          setTips(prevTips => prevTips.filter(tip => tip.id !== tipId))
          showSuccess('Tip deleted successfully')
        } catch (error) {
          showError('Failed to delete tip: ' + error.message)
        }
      }
    })
  }

  // Handle upvote tip
  const handleUpvote = async (tipId) => {
    const originalTip = tips.find(tip => tip.id === tipId)
    if (!originalTip) return

    try {
      // Optimistic update
      setTips(prevTips =>
        prevTips.map(tip =>
          tip.id === tipId ? { ...tip, upvotes: tip.upvotes + 1 } : tip
        )
      )

      const response = await tipsApi.upvote(tipId)

      // Update with server response
      let updatedTip = response.data
      if (response.data?.tip) {
        updatedTip = response.data.tip
      } else if (response.data?.data?.tip) {
        updatedTip = response.data.data.tip
      } else if (response.data?.data) {
        updatedTip = response.data.data
      }

      const serverUpvotes = updatedTip?.upvotes ?? updatedTip?.upvoteCount ?? null

      setTips(prevTips =>
        prevTips.map(tip =>
          tip.id === tipId
            ? {
              ...tip,
              ...updatedTip,
              upvotes: Number.isFinite(Number(serverUpvotes))
                ? Number(serverUpvotes)
                : originalTip.upvotes + 1
            }
            : tip
        )
      )
    } catch (error) {
      // Rollback on error
      setTips(prevTips =>
        prevTips.map(tip =>
          tip.id === tipId ? { ...tip, upvotes: originalTip.upvotes } : tip
        )
      )
      showError('Failed to upvote tip: ' + error.message)
    }
  }

  // Handle submit tip (for edit modal)
  const handleSubmitTip = async (tipData) => {
    try {
      if (editingTip) {
        const response = await tipsApi.update(editingTip.id, tipData)

        // Handle response
        let updatedTip = response.data
        if (response.data?.tip) {
          updatedTip = response.data.tip
        } else if (response.data?.data?.tip) {
          updatedTip = response.data.data.tip
        } else if (response.data?.data) {
          updatedTip = response.data.data
        }

        // Update local state
        setTips(prevTips =>
          prevTips.map(tip =>
            tip.id === editingTip.id
              ? {
                ...tip,
                ...tipData,
                ...updatedTip,
                id: editingTip.id,
                upvotes: Number.isFinite(Number(updatedTip?.upvoteCount))
                  ? Number(updatedTip.upvoteCount)
                  : (Number.isFinite(Number(updatedTip?.upvotes)) ? Number(updatedTip.upvotes) : tip.upvotes)
              }
              : tip
          )
        )

        showSuccess('Tip updated successfully!')
      }

      setIsModalOpen(false)
      setEditingTip(null)
    } catch (error) {
      throw error
    }
  }

  // Handle login required
  const handleLoginRequired = () => {
    setIsLoginModalOpen(true)
  }

  const isInitialLoading = loadingChallenges && loadingTips && loadingEvents && loadingFeatured
  const isAnyLoading = loadingChallenges || loadingTips || loadingEvents || loadingFeatured

  if (isInitialLoading) {
    return <EcoLoader />
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
          <Hero slides={featuredChallenges} effect="creative" />
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingChallenges && Array.from({ length: 6 }).map((_, i) => (
            <LazySection
              key={i}
              fallback={<ChallengeCardSkeleton />}
              minimumLoadingTime={2000}
            >
              <div style={{ display: 'none' }}>Loading...</div>
            </LazySection>
          ))}
          {!loadingChallenges && challenges?.map((c) => (
            <LazyChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          badge="Community Wisdom"
          title="Recent Tips"
          subtitle="Practical, bite-sized advice"
        />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {loadingTips && Array.from({ length: 5 }).map((_, i) => (
            <LazySection
              key={i}
              fallback={<TipCardSkeleton />}
              minimumLoadingTime={2000}
            >
              <div style={{ display: 'none' }}>Loading...</div>
            </LazySection>
          ))}
          {!loadingTips && tips?.map((t, i) => (
            <LazyTipCard
              key={i}
              tip={t}
              showActions={true}
              canModify={canModifyTip(t)}
              onEdit={handleEditTip}
              onDelete={handleDeleteTip}
              onUpvote={handleUpvote}
              onLoginRequired={handleLoginRequired}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          badge="Events"
          title="Upcoming Events"
          subtitle="Join the community"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loadingEvents && Array.from({ length: 4 }).map((_, i) => (
            <LazySection
              key={i}
              fallback={<EventCardSkeleton />}
              minimumLoadingTime={2000}
            >
              <div style={{ display: 'none' }}>Loading...</div>
            </LazySection>
          ))}
          {!loadingEvents && events?.map((e, i) => (
            <LazyEventCard key={i} event={e} />
          ))}
        </div>
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




