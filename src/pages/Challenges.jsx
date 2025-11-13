import { useMemo, useState } from 'react'
import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockChallenges } from '../data/mockChallenges.js'
import LazyChallengeCard from '../components/LazyChallengeCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'

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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title="Eco Challenges"
          subtitle="Join our community challenges and make a positive impact on the environment"
          backgroundImage="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop"
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Browse Challenges</h2>
            <p className="mt-1 text-sm sm:text-base text-slate-900">Find and join challenges that match your interests.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-900 whitespace-nowrap">Category</label>
            <select
              className="flex-1 sm:flex-initial rounded-md border pl-3 pr-8 py-2 text-sm min-w-0 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 8px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px 16px'
              }}
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
    </div>
  )
}


