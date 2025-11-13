import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { mockChallenges } from '../data/mockChallenges.js'
import Button from '../components/ui/Button.jsx'
import ChallengeCard from '../components/ChallengeCard.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function ChallengeDetail() {
  const { id } = useParams()
  const challenge = useMemo(() => mockChallenges.find((c) => c._id === id), [id])
  useDocumentTitle(challenge ? challenge.title : 'Challenge Details')
  const related = useMemo(
    () => mockChallenges.filter((c) => c._id !== id).slice(0, 3),
    [id]
  )

  if (!challenge) {
    return (
      <div className="text-center">
        <p className="text-slate-900">Challenge not found.</p>
        <Button as={Link} to="/challenges" className="mt-4">Back to Challenges</Button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <article className="grid gap-6 lg:grid-cols-2">
        <img
          src={challenge.imageUrl}
          alt={challenge.title}
          className="h-64 sm:h-72 w-full rounded-lg object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/600x400/10b981/ffffff?text=' + encodeURIComponent(challenge.title);
          }}
        />
        <div>
          <p className="text-sm font-medium text-emerald-700">{challenge.category}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">{challenge.title}</h1>
          <p className="mt-3 text-slate-700">{challenge.description}</p>
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-900">
            <div>
              <dt className="font-medium text-slate-900">Participants</dt>
              <dd>{challenge.participants}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Duration</dt>
              <dd>{challenge.duration}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Impact</dt>
              <dd>{challenge.impactMetric}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Start Date</dt>
              <dd>{challenge.startDate}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button as={Link} to={`/challenges/join/${challenge._id}`} className="w-full sm:w-auto">Join Challenge</Button>
            <Button variant="secondary" as={Link} to="/challenges" className="w-full sm:w-auto">Back</Button>
          </div>
        </div>
      </article>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Related challenges</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      </section>
    </div>
  )
}


