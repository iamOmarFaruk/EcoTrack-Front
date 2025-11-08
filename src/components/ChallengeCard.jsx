import { Link } from 'react-router-dom'
import Button from './ui/Button.jsx'
import { Card, CardContent, CardHeader } from './ui/Card.jsx'

export default function ChallengeCard({ challenge }) {
  return (
    <Card className="h-full overflow-hidden">
      <img
        src={challenge.imageUrl}
        alt={challenge.title}
        className="h-40 w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/400x300/10b981/ffffff?text=' + encodeURIComponent(challenge.title);
        }}
      />
      <CardHeader className="border-b">
        <p className="text-xs font-medium text-emerald-700">{challenge.category}</p>
        <h3 className="mt-1 line-clamp-1 text-lg font-semibold">{challenge.title}</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="line-clamp-2 text-sm text-slate-900">{challenge.description}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-900">
          <span>Participants: {challenge.participants}</span>
          <span>{challenge.impactMetric}</span>
        </div>
        <Button as={Link} to={`/challenges/${challenge._id}`} className="h-9 self-start">View</Button>
      </CardContent>
    </Card>
  )
}


