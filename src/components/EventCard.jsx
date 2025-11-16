import { useNavigate } from 'react-router-dom'
import Button from './ui/Button.jsx'
import { Card, CardContent } from './ui/Card.jsx'
import { formatDate } from '../utils/formatDate.js'

export default function EventCard({ event }) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    // Use slug for SEO-friendly URLs, fallback to _id
    const identifier = event.slug || event._id || event.id
    navigate(`/events/${identifier}`)
  }

  return (
    <Card className="h-full overflow-hidden">
      {event.image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardContent className="flex h-full flex-col">
        <h3 className="text-base font-semibold">{event.title}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {formatDate(event.date)} • {event.location}
        </p>
        <p className="mt-2 line-clamp-3 text-sm text-slate-900">{event.description}</p>
        <Button
          className="mt-4 h-9 self-start"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}


