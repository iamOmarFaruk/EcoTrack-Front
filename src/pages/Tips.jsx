import { useMockFetch } from '../hooks/useMockFetch.js'
import { mockTips } from '../data/mockTips.js'
import TipCard from '../components/TipCard.jsx'
import Skeleton from '../components/Skeleton.jsx'

export default function Tips() {
  const { data: tips, loading } = useMockFetch(() => mockTips, 700)
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Eco Tips</h1>
        <p className="mt-1 text-slate-600">Helpful, upvotable suggestions.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
        {!loading && tips?.map((t, i) => (
          <TipCard key={i} tip={t} />
        ))}
      </div>
    </div>
  )
}


