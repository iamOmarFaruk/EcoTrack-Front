import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockEvents } from '../data/mockEvents.js'
import LazyEventCard from '../components/LazyEventCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'

export default function Events() {
  useDocumentTitle('Events')
  const { data: events, loading } = useMockFetch(() => mockEvents, 700)
  
  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title="Eco Events"
          subtitle="Join community events and connect with like-minded environmental advocates"
          backgroundImage="https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=2070&auto=format&fit=crop"
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <p className="mt-1 text-slate-900">Discover and participate in eco-friendly events near you.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events?.map((e, i) => (
            <LazyEventCard key={i} event={e} />
          ))}
        </div>
      </div>
    </div>
  )
}


