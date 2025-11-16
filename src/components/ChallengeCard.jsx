import { Link } from 'react-router-dom'
import Button from './ui/Button.jsx'
import { Card, CardContent, CardHeader } from './ui/Card.jsx'
import { utils } from '../config/env'

export default function ChallengeCard({ challenge }) {
  return (
    <Card className="h-full overflow-hidden">
      <img
        src={challenge.imageUrl}
        alt={challenge.title}
        className="h-48 w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = utils.getPlaceholderImage(400, 300, challenge.title);
        }}
      />
      <CardContent className="p-4">
        <p className="text-sm font-medium text-emerald-600 mb-2">{challenge.category}</p>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{challenge.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600 mb-4">{challenge.description || challenge.shortDescription}</p>
        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <span>
            {(() => {
              const count = challenge.participants || challenge.registeredParticipants || 0;
              return count === 0 ? 'No one joined yet' : `${count} ${count === 1 ? 'person' : 'people'} joined`;
            })()}
          </span>
        </div>
        <Button as={Link} to={`/challenges/${challenge._id || challenge.id}`} className="self-start">View</Button>
      </CardContent>
    </Card>
  )
}


