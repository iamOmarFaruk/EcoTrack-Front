import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockTips } from '../data/mockTips.js'
import LazyTipCard from '../components/LazyTipCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'

export default function Tips() {
  useDocumentTitle('Recent Tips')
  const { data: tips, loading } = useMockFetch(() => {
    return [...mockTips]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, 700)
  
  if (loading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Recent Tips</h1>
        <p className="mt-1 text-slate-900">Latest 5 community tips</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tips?.map((t, i) => (
          <LazyTipCard key={i} tip={t} showContent={false} showActions={true} />
        ))}
      </div>
    </div>
  )
}


