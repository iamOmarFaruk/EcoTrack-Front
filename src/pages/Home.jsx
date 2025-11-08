import Button from '../components/ui/Button.jsx'
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
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="p-10 md:p-16">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Make sustainability your daily habit.
          </h1>
          <p className="mt-3 max-w-prose text-slate-600">
            Join eco challenges, learn from tips, and track your impact with a clean, fast UI.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/challenges" as="a">Browse Challenges</Button>
            <Button variant="secondary" href="/about" as="a">Learn More</Button>
          </div>
        </div>
      </section>

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


