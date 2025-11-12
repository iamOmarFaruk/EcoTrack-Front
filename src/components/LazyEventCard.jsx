import LazySection from './LazySection.jsx'
import EventCard from './EventCard.jsx'
import { EventCardSkeleton } from './Skeleton.jsx'

export default function LazyEventCard({ event, ...props }) {
  return (
    <LazySection
      fallback={<EventCardSkeleton />}
      {...props}
    >
      <EventCard event={event} />
    </LazySection>
  )
}