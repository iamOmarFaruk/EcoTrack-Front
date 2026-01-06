import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/adminApi.js'
import { showError, showSuccess } from '../../utils/toast.jsx'
import Button from '../../components/ui/Button.jsx'
import EcoLoader from '../../components/EcoLoader.jsx'
import { ToggleLeft, ToggleRight } from 'lucide-react'

const statusBadges = {
  active: 'bg-emerald-500/10 text-emerald-200',
  draft: 'bg-white/10 text-white/70',
  completed: 'bg-indigo-500/10 text-indigo-200',
  cancelled: 'bg-red-500/10 text-red-200',
  published: 'bg-emerald-500/10 text-emerald-200'
}

function ResourceCard({ title, data, onUpdate, loading, publishStatus = 'active', draftStatus = 'draft' }) {
  if (loading) return <EcoLoader />

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center justify-between pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Publishing</p>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="space-y-3">
        {data?.length ? data.map((item) => (
          <div key={item._id || item.id} className="flex flex-col gap-2 rounded-xl border border-white/5 bg-black/20 p-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="text-xs text-white/50">{item.category || item.authorName}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
                <span className={`rounded-full px-2 py-1 ${statusBadges[item.status] || 'bg-white/10 text-white/60'}`}>{item.status}</span>
                {item.registeredParticipants !== undefined && (
                  <span>{item.registeredParticipants} participants</span>
                )}
                {item.upvoteCount !== undefined && (
                  <span>{item.upvoteCount} upvotes</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => onUpdate(item, publishStatus)} className="flex items-center gap-1 text-white hover:bg-white/10">
                <ToggleRight size={16} /> Publish
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onUpdate(item, draftStatus)} className="flex items-center gap-1 text-white hover:bg-white/10">
                <ToggleLeft size={16} /> Unpublish
              </Button>
            </div>
          </div>
        )) : (
          <p className="text-sm text-white/60">Nothing to moderate.</p>
        )}
      </div>
    </div>
  )
}

export default function AdminModeration() {
  const queryClient = useQueryClient()

  const challengesQuery = useQuery({
    queryKey: ['admin', 'challenges'],
    queryFn: () => adminApi.getChallenges({ limit: 40 })
  })

  const eventsQuery = useQuery({
    queryKey: ['admin', 'events'],
    queryFn: () => adminApi.getEvents({ limit: 40 })
  })

  const tipsQuery = useQuery({
    queryKey: ['admin', 'tips'],
    queryFn: () => adminApi.getTips({ limit: 40 })
  })

  const updateChallenge = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateChallengeStatus(id, { status }),
    onSuccess: () => {
      showSuccess('Challenge updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] })
    },
    onError: (err) => showError(err.message || 'Failed to update challenge')
  })

  const updateEvent = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateEventStatus(id, { status }),
    onSuccess: () => {
      showSuccess('Event updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] })
    },
    onError: (err) => showError(err.message || 'Failed to update event')
  })

  const updateTip = useMutation({
    mutationFn: ({ id, status }) => adminApi.updateTipStatus(id, { status }),
    onSuccess: () => {
      showSuccess('Tip updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'tips'] })
    },
    onError: (err) => showError(err.message || 'Failed to update tip')
  })

  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-white/40">Moderation</p>
        <h1 className="text-2xl font-bold">Publish or unpublish anything instantly</h1>
      </div>

      <ResourceCard
        title="Challenges"
        data={challengesQuery.data?.data || challengesQuery.data}
        onUpdate={(item, status) => updateChallenge.mutate({ id: item._id, status })}
        loading={challengesQuery.isLoading}
        publishStatus="active"
        draftStatus="draft"
      />

      <ResourceCard
        title="Events"
        data={eventsQuery.data?.data || eventsQuery.data}
        onUpdate={(item, status) => updateEvent.mutate({ id: item._id, status })}
        loading={eventsQuery.isLoading}
        publishStatus="active"
        draftStatus="draft"
      />

      <ResourceCard
        title="Tips"
        data={tipsQuery.data?.data || tipsQuery.data}
        onUpdate={(item, status) => updateTip.mutate({ id: item.id, status })}
        loading={tipsQuery.isLoading}
        publishStatus="published"
        draftStatus="draft"
      />
    </div>
  )
}
