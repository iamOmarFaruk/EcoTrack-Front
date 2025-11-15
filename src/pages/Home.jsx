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
import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js'
import { mockChallenges } from '../data/mockChallenges.js'
import { defaultImages } from '../config/env'
import { useState, useEffect } from 'react'
import { tipsApi, eventApi } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  useDocumentTitle('Home')
  
  const { user } = useAuth()
  
  // State for real tips from API
  const [tips, setTips] = useState([])
  const [loadingTips, setLoadingTips] = useState(true)
  
  // State for real events from API
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  
  // Intersection observer for Why Go Green section
  const [setWhyGoGreenRef, isWhyGoGreenVisible] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '50px',
    triggerOnce: true
  })
  
  const { data: challenges, loading: loadingChallenges } = useMockFetch(() => {
    const now = new Date()
    const MS_PER_DAY = 24 * 60 * 60 * 1000
    const parseDays = (duration) => {
      const n = Number.parseInt(duration)
      return Number.isFinite(n) ? n : 0
    }
    const ongoing = mockChallenges.filter((c) => {
      const start = new Date(c.startDate)
      const days = parseDays(c.duration)
      if (days <= 0) return true
      const end = new Date(start.getTime() + days * MS_PER_DAY)
      return now >= start && now <= end
    })
    const source = ongoing.length
      ? ongoing
      : [...mockChallenges].sort((a, b) => (b.participants || 0) - (a.participants || 0))
    // Limit to 4–6 items; prefer up to 6
    return source.slice(0, 6)
  }, 500)

  // Fetch 3 latest events from API
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoadingEvents(true)
        const response = await eventApi.getAll({ 
          page: 1, 
          limit: 3,
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
        
        // Enhance events with proper data structure
        const enhancedEvents = eventsArray.map(event => ({
          ...event,
          _id: event._id || event.id,
          id: event.id || event._id
        }))
        
        setEvents(enhancedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }
    
    fetchUpcomingEvents()
  }, [])

  // Fetch 3 most recent tips from API
  useEffect(() => {
    const fetchRecentTips = async () => {
      try {
        setLoadingTips(true)
        const response = await tipsApi.getAll({ 
          page: 1, 
          limit: 3, 
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
  
  const isInitialLoading = loadingChallenges && loadingTips && loadingEvents

  if (isInitialLoading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-12">
      <div className="full-bleed">
        <Hero slides={mockChallenges.slice(0, 5)} effect="creative" />
      </div>

      <CommunityStats />

      <section>
        <SectionHeading title="Active Challenges" subtitle="Happening right now" />
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
        <SectionHeading title="Recent Tips" subtitle="Practical, bite-sized advice" />
        <div className="grid gap-6 md:grid-cols-3">
          {loadingTips && Array.from({ length: 3 }).map((_, i) => (
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
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Upcoming Events" subtitle="Join the community" />
        <div className="grid gap-6 md:grid-cols-3">
          {loadingEvents && Array.from({ length: 3 }).map((_, i) => (
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
            className={`w-full h-80 sm:h-96 lg:h-[28rem] object-cover rounded-2xl shadow-lg transition-all duration-1000 ease-out ${
              isWhyGoGreenVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}
            loading="lazy"
          />
        </div>
        
        {/* Content */}
        <div className="order-2 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Why Go Green?
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600">
            Sustainable living isn't just good for the planet—it's good for you too. 
            Discover the amazing benefits of making eco-friendly choices in your daily life.
          </p>
          
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-slate-900">Save Money:</strong> Reduce utility bills through energy efficiency and waste reduction
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-slate-900">Better Health:</strong> Cleaner air, organic foods, and active transportation improve well-being
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-slate-900">Protect the Future:</strong> Preserve natural resources for future generations
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-slate-900">Create Community:</strong> Connect with like-minded people who share your values
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
              <span className="text-base sm:text-lg leading-relaxed">
                <strong className="text-slate-900">Feel Empowered:</strong> Take meaningful action that makes a real difference
              </span>
            </li>
          </ul>
        </div>
      </section>

      <HowItWorks />
    </div>
  )
}


