import SectionHeading from '../components/SectionHeading.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { auth } = useAuth()
  const user = auth.user ?? { name: 'Eco User', email: 'user@example.com', avatarUrl: '' }

  const initials = (user.name || 'EU')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="max-w-2xl">
      <SectionHeading title="Profile" subtitle="Manage your personal information" />
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold uppercase text-white">
              {initials}
            </div>
          )}
          <div>
            <div className="text-lg font-semibold text-slate-900">{user.name}</div>
            <div className="text-sm text-slate-700">{user.email}</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-md border p-4">
            <div className="text-xs uppercase text-slate-500">Joined</div>
            <div className="mt-1 text-sm text-slate-900">—</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-xs uppercase text-slate-500">Challenges Joined</div>
            <div className="mt-1 text-sm text-slate-900">{auth.userChallenges?.length ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


