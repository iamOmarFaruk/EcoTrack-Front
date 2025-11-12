import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockEvents } from '../data/mockEvents.js'
import LazyEventCard from '../components/LazyEventCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'

export default function Events() {
  useDocumentTitle('Events')
  const { data: events, loading } = useMockFetch(() => mockEvents, 700)
  
  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="mt-1 text-slate-900">Upcoming eco events near you.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events?.map((e, i) => (
          <LazyEventCard key={i} event={e} />
        ))}
      </div>
    </div>
  )
}


