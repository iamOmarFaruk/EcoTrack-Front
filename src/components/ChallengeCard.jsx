import { Link } from 'react-router-dom'
import Button from './ui/Button.jsx'
import { Card, CardContent, CardHeader } from './ui/Card.jsx'
import { utils } from '../config/env'

export default function ChallengeCard({ challenge }) {
  // Use slug for SEO-friendly URLs, fallback to _id if slug is not available
  const challengeUrl = challenge.slug ? `/challenges/${challenge.slug}` : `/challenges/${challenge._id || challenge.id}`

  return (
    <Card className="h-full overflow-hidden">
      <img
        src={challenge.imageUrl}
        alt={challenge.title}
        className="h-32 sm:h-40 md:h-48 w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = utils.getPlaceholderImage(400, 300, challenge.title);
        }}
      />
      <CardContent className="p-3 sm:p-4 md:p-5 flex flex-col h-[calc(100%-8rem)] sm:h-[calc(100%-10rem)] md:h-[calc(100%-12rem)]">
        <p className="text-xs font-bold tracking-wider text-primary uppercase mb-2">{challenge.category}</p>
        <h3 className="text-lg sm:text-xl font-heading font-bold text-heading mb-2 line-clamp-1">{challenge.title}</h3>

        <div className="flex items-center text-sm text-text/70 mb-4">
          <svg className="w-4 h-4 mr-2 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>
            {(() => {
              const count = challenge.participants || challenge.registeredParticipants || 0;
              return count === 0 ? 'Be the first to join' : `${count.toLocaleString()} ${count === 1 ? 'person' : 'people'} joined`;
            })()}
          </span>
        </div>

        <div className="border-t border-border/60 mb-4"></div>

        <p className="line-clamp-2 text-sm text-text/80 mb-6 flex-grow leading-relaxed">
          {challenge.description || challenge.shortDescription}
        </p>

        <Button as={Link} to={challengeUrl} className="self-start w-full sm:w-auto">
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}


