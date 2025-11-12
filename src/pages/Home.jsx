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
import { mockTips } from '../data/mockTips.js'
import { mockEvents } from '../data/mockEvents.js'

export default function Home() {
  useDocumentTitle('Home')
  
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
  const { data: tips, loading: loadingTips } = useMockFetch(() => mockTips.slice(0, 3), 600)
  const { data: events, loading: loadingEvents } = useMockFetch(() => mockEvents.slice(0, 3), 700)
  
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
            <LazyTipCard key={i} tip={t} showActions={true} />
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
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=500&q=80"
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


