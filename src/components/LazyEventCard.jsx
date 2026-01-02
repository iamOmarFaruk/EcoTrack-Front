import EventCard from './EventCard.jsx'

export default function LazyEventCard({ event, ...props }) {
  return <EventCard event={event} {...props} />
}