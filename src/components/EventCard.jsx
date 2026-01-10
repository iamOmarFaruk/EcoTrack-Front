import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
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
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-md transition-shadow duration-300">
      {event.image && (
        <div className="w-full h-32 sm:h-40 md:h-48 overflow-hidden relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {event.category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-primary shadow-sm">
                {event.category}
              </span>
            </div>
          )}
        </div>
      )}
      <CardContent className="flex flex-1 flex-col p-5">
        <h3 className="text-base sm:text-lg font-heading font-bold text-heading leading-tight mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-medium text-text/60 mb-4">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-primary/70" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary/70" />
            <span className="truncate max-w-[100px] sm:max-w-[150px]">{event.location}</span>
          </div>
        </div>

        <div className="border-t border-border/60 mb-4"></div>

        <p className="text-sm text-text/80 line-clamp-3 mb-6 flex-grow leading-relaxed">
          {event.description}
        </p>

        <Button
          className="mt-auto h-8 sm:h-9 self-start px-4 sm:px-6"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}


