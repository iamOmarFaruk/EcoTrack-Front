import { useMemo, useState } from 'react'
import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockChallenges } from '../data/mockChallenges.js'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'

export default function Challenges() {
  useDocumentTitle('Challenges')
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

  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Challenges</h1>
          <p className="mt-1 text-slate-900">Browse and filter eco challenges.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-900">Category</label>
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
        {filtered.map((c) => (
          <LazyChallengeCard key={c._id} challenge={c} />
        ))}
      </div>
    </div>
  )
}


