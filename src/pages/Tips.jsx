import { useMockFetch } from '../hooks/useMockFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { mockTips } from '../data/mockTips.js'
import LazyTipCard from '../components/LazyTipCard.jsx'
import EcoLoader from '../components/EcoLoader.jsx'
import SubpageHero from '../components/SubpageHero.jsx'

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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="full-bleed -mt-8">
        <SubpageHero
          title="Eco Tips"
          subtitle="Discover practical tips and advice from our eco-conscious community"
          backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"
          height="medium"
          overlayIntensity="medium"
        />
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Latest Tips</h2>
          <p className="mt-1 text-slate-900">Recent community-shared sustainability tips and advice.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tips?.map((t, i) => (
            <LazyTipCard key={i} tip={t} showContent={false} showActions={true} />
          ))}
        </div>
      </div>
    </div>
  )
}


