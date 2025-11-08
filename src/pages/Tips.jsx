import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockTips } from '../data/mockTips.js'
import TipCard from '../components/TipCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'

export default function Tips() {
  useDocumentTitle('Eco Tips')
  const { data: tips, loading } = useMockFetch(() => mockTips, 700)
  
  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Eco Tips</h1>
        <p className="mt-1 text-slate-900">Helpful, upvotable suggestions.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tips?.map((t, i) => (
          <TipCard key={i} tip={t} />
        ))}
      </div>
    </div>
  )
}


