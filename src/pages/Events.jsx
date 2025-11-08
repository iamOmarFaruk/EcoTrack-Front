import { useMockFetch } from '../hooks/useMockFetch.js'
import { mockEvents } from '../data/mockEvents.js'
import EventCard from '../components/EventCard.jsx'
import Skeleton from '../components/Skeleton.jsx'

export default function Events() {
  const { data: events, loading } = useMockFetch(() => mockEvents, 700)
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="mt-1 text-slate-600">Upcoming eco events near you.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
        {!loading && events?.map((e, i) => (
          <EventCard key={i} event={e} />
        ))}
      </div>
    </div>
  )
}


