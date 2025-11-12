import { useAuth } from '../context/AuthContext.jsx'
import { mockChallenges } from '../data/mockChallenges.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

export default function MyActivities() {
  useDocumentTitle('My Activities')
  const isLoading = useMinimumLoading(300)
  const { auth } = useAuth()
  const joined = (auth.userChallenges ?? []).map((id) => mockChallenges.find((c) => c._id === id)).filter(Boolean)

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Activities</h1>
        <p className="mt-1 text-slate-900">Your joined challenges and progress.</p>
      </div>
      {joined.length === 0 ? (
        <p className="text-slate-900">You haven’t joined any challenges yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {joined.map((c) => (
            <div key={c._id} className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <img 
                  src={c.imageUrl} 
                  alt={c.title} 
                  className="h-16 w-24 rounded object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/96x64/10b981/ffffff?text=Eco';
                  }}
                />
                <div>
                  <p className="text-xs text-emerald-700">{c.category}</p>
                  <h3 className="font-semibold">{c.title}</h3>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded bg-slate-200">
                  <div className="h-2 rounded bg-emerald-600" style={{ width: '42%' }} />
                </div>
                <p className="mt-1 text-xs text-slate-900">Progress: 42%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


