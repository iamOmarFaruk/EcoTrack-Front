import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showConfirmation, showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { ShieldCheck, User, Mail, Calendar, Settings, MoreVertical, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function AdminUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers({ limit: 50 })
  })

  const updateUser = useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateUser(id, payload),
    onSuccess: () => {
      showSuccess('User status updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (err) => showError(err.message || 'Failed to update user')
  })

  const users = usersQuery.data?.data?.users || usersQuery.data?.users || []

  if (usersQuery.isLoading) return <EcoLoader />

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-8 rounded-full bg-primary/30" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Access Control</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-heading tracking-tight">
            User <span className="text-primary">Directory</span>
          </h1>
          <p className="mt-2 text-text/60 font-medium">Manage user permissions, monitor activity and protect the community.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface/50 backdrop-blur-sm text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all w-64 md:w-80"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm shadow-xl shadow-zinc-200/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text/40">UserInfo</th>
                <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text/40">Role</th>
                <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text/40">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text/40">Joined</th>
                <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {users.map((user, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={user._id}
                  className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-heading font-bold text-xs border border-zinc-200 dark:border-zinc-600 shadow-sm">
                        {user.displayName?.charAt(0) || <User size={16} />}
                      </div>
                      <div>
                        <p className="font-bold text-heading group-hover:text-primary transition-colors">{user.displayName}</p>
                        <p className="text-xs text-text/40 flex items-center gap-1">
                          <Mail size={12} className="opacity-50" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                      user.role === 'admin'
                        ? "bg-amber-100/50 text-amber-600 border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                        : "bg-zinc-100/50 text-zinc-500 border-zinc-200/50 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={clsx(
                        "h-1.5 w-1.5 rounded-full ring-4 shadow-sm",
                        user.isActive ? "bg-emerald-500 ring-emerald-500/10" : "bg-rose-500 ring-rose-500/10"
                      )} />
                      <span className={clsx(
                        "text-xs font-bold",
                        user.isActive ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-text/40 flex items-center gap-1.5 font-medium">
                      <Calendar size={14} className="opacity-50" />
                      {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => showConfirmation({
                        title: user.isActive ? 'Suspend User' : 'Activate User',
                        message: user.isActive
                          ? `Are you sure you want to suspend ${user.displayName || 'this user'}? They will lose access immediately.`
                          : `Are you sure you want to activate ${user.displayName || 'this user'}?`,
                        confirmText: user.isActive ? 'Suspend' : 'Activate',
                        cancelText: 'Cancel',
                        type: 'danger',
                        onConfirm: () => updateUser.mutate({ id: user._id, payload: { isActive: !user.isActive } })
                      })}
                      className={clsx(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        user.isActive
                          ? "text-rose-500 border-rose-100 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/10"
                          : "text-emerald-500 border-emerald-100 hover:bg-emerald-50 dark:border-emerald-900/30 dark:hover:bg-emerald-900/10"
                      )}
                    >
                      {user.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
