import { useMemo, useState } from 'react'
import { useMockFetch } from '../hooks/useMockFetch.js'
import { mockChallenges } from '../data/mockChallenges.js'
import ChallengeCard from '../components/ChallengeCard.jsx'
import Skeleton from '../components/Skeleton.jsx'

export default function Challenges() {
  const { data: challenges, loading } = useMockFetch(() => mockChallenges, 800)
  const categories = useMemo(
    () => ['All', ...Array.from(new Set((challenges ?? []).map((c) => c.category)))],
    [challenges]
  )
  const [category, setCategory] = useState('All')
  const filtered = useMemo(
    () => (category === 'All' ? challenges ?? [] : (challenges ?? []).filter((c) => c.category === category)),
    [challenges, category]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Challenges</h1>
          <p className="mt-1 text-slate-600">Browse and filter eco challenges.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Category</label>
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
        {!loading && filtered.map((c) => (
          <ChallengeCard key={c._id} challenge={c} />
        ))}
      </div>
    </div>
  )
}


