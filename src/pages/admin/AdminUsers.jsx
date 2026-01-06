import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { ShieldCheck } from 'lucide-react'

export default function AdminUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers({ limit: 50 })
  })

  const updateUser = useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateUser(id, payload),
    onSuccess: () => {
      showSuccess('User updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (err) => showError(err.message || 'Failed to update user')
  })

  const users = usersQuery.data?.data?.users || usersQuery.data?.users || []

  if (usersQuery.isLoading) return <EcoLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-text/40">Users</p>
          <h1 className="text-2xl font-bold text-heading">Manage access and activity</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-600 dark:text-emerald-300">
          <ShieldCheck size={14} /> Admin token enforced
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="grid grid-cols-6 bg-muted/40 px-4 py-3 text-xs uppercase tracking-wide text-text/50">
          <span className="col-span-2">User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span className="text-right">Actions</span>
        </div>
        {users.map((user) => (
          <div key={user._id} className="grid grid-cols-6 items-center border-t border-border px-4 py-3 text-sm">
            <div className="col-span-2">
              <p className="font-semibold text-heading">{user.displayName}</p>
              <p className="text-xs text-text/50">{user.email}</p>
            </div>
            <div className="text-text/80">{user.role}</div>
            <div>
              <span className={`rounded-full px-2 py-1 text-xs ${user.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-red-500/10 text-red-600 dark:text-red-300'}`}>
                {user.isActive ? 'Active' : 'Suspended'}
              </span>
            </div>
            <div className="text-text/60 text-xs">{new Date(user.joinedAt).toLocaleDateString()}</div>
            <div className="text-right">
              <Button
                size="sm"
                variant="ghost"
                className="text-text/70 hover:bg-muted hover:text-heading"
                onClick={() => updateUser.mutate({ id: user._id, payload: { isActive: !user.isActive } })}
              >
                {user.isActive ? 'Suspend' : 'Activate'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
