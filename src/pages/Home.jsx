import Hero from '../components/Hero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import TipCard from '../components/TipCard.jsx'
import EventCard from '../components/EventCard.jsx'
import Skeleton from '../components/Skeleton.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockChallenges } from '../data/mockChallenges.js'
import { mockTips } from '../data/mockTips.js'
import { mockEvents } from '../data/mockEvents.js'

export default function Home() {
  useDocumentTitle('Home')
  const { data: challenges, loading: loadingChallenges } = useMockFetch(() => mockChallenges.slice(0, 3), 500)
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

      <section>
        <SectionHeading title="Featured Challenges" subtitle="A few to get you started" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingChallenges && Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
          {!loadingChallenges && challenges?.map((c) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Eco Tips" subtitle="Practical, bite-sized advice" />
        <div className="grid gap-6 md:grid-cols-3">
          {loadingTips && Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
          {!loadingTips && tips?.map((t, i) => (
            <TipCard key={i} tip={t} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Upcoming Events" subtitle="Join the community" />
        <div className="grid gap-6 md:grid-cols-3">
          {loadingEvents && Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
          {!loadingEvents && events?.map((e, i) => (
            <EventCard key={i} event={e} />
          ))}
        </div>
      </section>
    </div>
  )
}


