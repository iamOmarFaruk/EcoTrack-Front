import SectionHeading from './SectionHeading.jsx'
import { Card, CardContent } from './ui/Card.jsx'
import Skeleton from './Skeleton.jsx'
import { useMockFetch } from '../hooks/useMockFetch.js'
import { mockCommunityStatsList } from '../data/mockStats.js'

function formatValue(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0'
  return value.toLocaleString()
}

export default function CommunityStats() {
  const { data: stats, loading } = useMockFetch(() => mockCommunityStatsList, 450)

  return (
    <section>
      <SectionHeading
        title="Live Community Impact"
        subtitle="Community-wide impact at a glance"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}

        {!loading &&
          stats?.map((item) => (
            <Card key={item.key} className="h-full">
              <CardContent className="flex h-full items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <span className="text-xl" aria-hidden="true">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="truncate text-xl font-extrabold tracking-tight text-slate-900">
                    {formatValue(item.value)}{' '}
                    <span className="text-xs font-semibold text-slate-500 align-middle">{item.unit}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  )
}


