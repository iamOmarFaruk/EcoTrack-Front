import { useAuth } from '../context/AuthContext.jsx'
import { mockChallenges } from '../data/mockChallenges.js'

export default function MyActivities() {
  const { auth } = useAuth()
  const joined = (auth.userChallenges ?? []).map((id) => mockChallenges.find((c) => c._id === id)).filter(Boolean)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Activities</h1>
        <p className="mt-1 text-slate-600">Your joined challenges and progress.</p>
      </div>
      {joined.length === 0 ? (
        <p className="text-slate-600">You haven’t joined any challenges yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {joined.map((c) => (
            <div key={c._id} className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <img src={c.imageUrl} alt={c.title} className="h-16 w-24 rounded object-cover" />
                <div>
                  <p className="text-xs text-emerald-700">{c.category}</p>
                  <h3 className="font-semibold">{c.title}</h3>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded bg-slate-200">
                  <div className="h-2 rounded bg-emerald-600" style={{ width: '42%' }} />
                </div>
                <p className="mt-1 text-xs text-slate-600">Progress: 42%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


