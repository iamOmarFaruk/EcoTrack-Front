import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { challengeApi, tipsApi, eventApi, userApi, authApi } from '../services/api'
import { showSuccess, showError } from '../utils/toast'

/* -------------------------------------------------------------------------- */
/*                                 Key Factory                                */
/* -------------------------------------------------------------------------- */
export const queryKeys = {
    challenges: {
        all: ['challenges'],
        lists: () => [...queryKeys.challenges.all, 'list'],
        list: (filters) => [...queryKeys.challenges.lists(), { ...filters }],
        details: () => [...queryKeys.challenges.all, 'detail'],
        detail: (id) => [...queryKeys.challenges.details(), id],
        myCreated: ['challenges', 'my', 'created'],
        myJoined: (filters) => ['challenges', 'my', 'joined', { ...filters }],
    },
    tips: {
        all: ['tips'],
        lists: () => [...queryKeys.tips.all, 'list'],
        list: (filters) => [...queryKeys.tips.lists(), { ...filters }],
        details: () => [...queryKeys.tips.all, 'detail'],
        detail: (id) => [...queryKeys.tips.details(), id],
        myTips: (filters) => ['tips', 'my', { ...filters }],
    },
    events: {
        all: ['events'],
        lists: () => [...queryKeys.events.all, 'list'],
        list: (filters) => [...queryKeys.events.lists(), { ...filters }],
        details: () => [...queryKeys.events.all, 'detail'],
        detail: (id) => [...queryKeys.events.details(), id],
        myEvents: ['events', 'my', 'created'],
        myJoined: (status) => ['events', 'my', 'joined', status],
    },
    user: {
        all: ['user'],
        profile: ['user', 'profile'],
        stats: (id) => ['user', 'stats', id],
        activities: (id, params) => ['user', 'activities', id, { ...params }]
    }
}

/* -------------------------------------------------------------------------- */
/*                              Challenge Hooks                               */
/* -------------------------------------------------------------------------- */

const normalizeChallenge = (challenge) => {
    if (!challenge || typeof challenge !== 'object') return null;
    return {
        ...challenge,
        _id: challenge._id || challenge.id,
        id: challenge.id || challenge._id,
        slug: challenge.slug || '',
        participants: challenge.registeredParticipants ?? (Array.isArray(challenge.participants) ? challenge.participants.length : challenge.participants) ?? 0,
        imageUrl: challenge.image || challenge.imageUrl,
        description: challenge.shortDescription || challenge.description
    }
}

const defaultQueryOptions = {
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
    refetchOnWindowFocus: false,
}

export const useChallenges = (filters = {}) => {
    return useQuery({
        ...defaultQueryOptions,
        queryKey: queryKeys.challenges.list(filters),
        queryFn: async () => {
            const response = await challengeApi.getAll(filters)
            // Handle various response structures
            const data = response.challenges || response.data?.challenges || response.data || response || []
            // Support both Array and Object (map) formats
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            return array.map(normalizeChallenge).filter(Boolean)
        },
        placeholderData: keepPreviousData
    })
}

export const useFeaturedChallenges = () => {
    return useChallenges({
        page: 1,
        limit: 5,
        status: 'active',
        featured: true,
        sortBy: 'startDate',
        order: 'asc'
    })
}

export const useChallenge = (id, options = {}) => {
    return useQuery({
        queryKey: queryKeys.challenges.detail(id),
        queryFn: async () => {
            const response = await challengeApi.getById(id)
            const data = response.challenge || response.data?.challenge || response.data || response
            return normalizeChallenge(data)
        },
        enabled: !!id,
        ...options
    })
}

export const useChallengeBySlug = (slug, options = {}) => {
    return useQuery({
        queryKey: queryKeys.challenges.detail(slug),
        queryFn: async () => {
            const response = await challengeApi.getBySlug(slug)
            const data = response.challenge || response.data?.challenge || response.data || response
            return normalizeChallenge(data)
        },
        enabled: !!slug,
        ...options
    })
}

export const useMyCreatedChallenges = () => {
    return useQuery({
        queryKey: queryKeys.challenges.myCreated,
        queryFn: async () => {
            const response = await challengeApi.getMyCreated()
            const data = response.challenges || response.data?.challenges || response.data || response || []
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            return array.map(normalizeChallenge).filter(Boolean)
        }
    })
}

export const useMyJoinedChallenges = (filters = {}) => {
    return useQuery({
        queryKey: queryKeys.challenges.myJoined(filters),
        queryFn: async () => {
            const response = await challengeApi.getMyJoined(filters)
            const data = response.challenges || response.data?.challenges || response.data || response || []
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            return array.map(normalizeChallenge).filter(Boolean)
        }
    })
}

// Challenge Mutations
export const useChallengeMutations = () => {
    const queryClient = useQueryClient()

    const createChallenge = useMutation({
        mutationFn: (data) => challengeApi.create(data),
        onSuccess: () => {
            showSuccess('Challenge created successfully!')
            queryClient.invalidateQueries(queryKeys.challenges.all)
        },
        onError: (error) => showError(error.message || 'Failed to create challenge')
    })

    const updateChallenge = useMutation({
        mutationFn: ({ id, data }) => challengeApi.update(id, data),
        onSuccess: (data, variables) => {
            showSuccess('Challenge updated!')
            queryClient.invalidateQueries(queryKeys.challenges.detail(variables.id))
            queryClient.invalidateQueries(queryKeys.challenges.lists())
        },
        onError: (error) => showError(error.message)
    })

    const deleteChallenge = useMutation({
        mutationFn: (id) => challengeApi.delete(id),
        onSuccess: () => {
            showSuccess('Challenge deleted')
            queryClient.invalidateQueries(queryKeys.challenges.all)
        },
        onError: (error) => showError(error.message)
    })

    const joinChallenge = useMutation({
        mutationFn: (id) => challengeApi.join(id),
        onSuccess: (data, id) => {
            showSuccess('Joined challenge!')
            queryClient.invalidateQueries(queryKeys.challenges.detail(id))
            queryClient.invalidateQueries(queryKeys.challenges.lists())
        },
        onError: (error) => showError(error.message)
    })

    const leaveChallenge = useMutation({
        mutationFn: (id) => challengeApi.leave(id),
        onSuccess: (data, id) => {
            showSuccess('Left challenge')
            queryClient.invalidateQueries(queryKeys.challenges.detail(id))
        },
        onError: (error) => showError(error.message)
    })

    return { createChallenge, updateChallenge, deleteChallenge, joinChallenge, leaveChallenge }
}

/* -------------------------------------------------------------------------- */
/*                                  Tip Hooks                                 */
/* -------------------------------------------------------------------------- */

const normalizeTip = (tip) => {
    if (!tip || typeof tip !== 'object') return null;
    return {
        ...tip,
        id: tip.id || tip._id,
        upvotes: Number.isFinite(Number(tip.upvoteCount))
            ? Number(tip.upvoteCount)
            : (Number.isFinite(Number(tip.upvotes)) ? Number(tip.upvotes) : 0),
        authorId: tip.authorId || (typeof tip.author === 'string' ? tip.author : tip.author?.uid || tip.author?.id),
        authorName: tip.authorName || tip.author?.name || 'Anonymous',
        authorImage: tip.authorImage || tip.authorAvatar || tip.author?.avatarUrl || tip.author?.imageUrl,
        firebaseId: tip.firebaseId || (typeof tip.author === 'string' ? tip.author : tip.author?.firebaseId)
    }
}

export const useTips = (filters = {}) => {
    return useQuery({
        ...defaultQueryOptions,
        queryKey: queryKeys.tips.list(filters),
        queryFn: async () => {
            const response = await tipsApi.getAll(filters)
            const data = response.tips || response.data?.tips || response.data || response || []
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            return array.map(normalizeTip).filter(Boolean)
        },
        placeholderData: keepPreviousData
    })
}

export const useMyTips = (filters = {}) => {
    return useQuery({
        queryKey: queryKeys.tips.myTips(filters),
        queryFn: async () => {
            const response = await tipsApi.getMyTips(filters)
            const data = response.tips || response.data?.tips || response.data || response || []
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            return array.map(normalizeTip).filter(Boolean)
        },
        placeholderData: keepPreviousData
    })
}

export const useTipMutations = () => {
    const queryClient = useQueryClient()

    const createTip = useMutation({
        mutationFn: (data) => tipsApi.create(data),
        onSuccess: () => {
            showSuccess('Tip shared successfully!')
            queryClient.invalidateQueries(queryKeys.tips.all)
        },
        onError: (error) => showError(error.message)
    })

    const updateTip = useMutation({
        mutationFn: ({ id, data }) => tipsApi.update(id, data),
        onSuccess: (data, variables) => {
            showSuccess('Tip updated!')
            queryClient.invalidateQueries(queryKeys.tips.all)
        },
        onError: (error) => showError(error.message)
    })

    const deleteTip = useMutation({
        mutationFn: (id) => tipsApi.delete(id),
        onSuccess: () => {
            showSuccess('Tip deleted')
            queryClient.invalidateQueries(queryKeys.tips.all)
        },
        onError: (error) => showError(error.message)
    })

    const upvoteTip = useMutation({
        mutationFn: (id) => tipsApi.upvote(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries(queryKeys.tips.list({}))

            const previousTips = queryClient.getQueryData(queryKeys.tips.list({}))

            // Optimistically update
            if (previousTips) {
                // Note: This logic depends on the filter used in the key. 
                // We might need to invalidate widely or be more specific.
                // For now, simpler invalidation is safer than complex optimistic logic across all filters.
            }
        },
        onSuccess: () => {
            // Invalidate all tip lists to show new vote counts
            queryClient.invalidateQueries(queryKeys.tips.lists())
        },
        onError: (error) => showError(error.message)
    })

    return { createTip, updateTip, deleteTip, upvoteTip }
}

/* -------------------------------------------------------------------------- */
/*                                 Event Hooks                                */
/* -------------------------------------------------------------------------- */

export const useEvents = (filters = {}) => {
    return useQuery({
        ...defaultQueryOptions,
        queryKey: queryKeys.events.list(filters),
        queryFn: async () => {
            const response = await eventApi.getAll(filters)
            const data = response.events || response.data?.events || response.data || response || []
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            return array
        },
        placeholderData: keepPreviousData
    })
}

// ... (existing imports and code)

export const useEvent = (id, options = {}) => {
    return useQuery({
        queryKey: queryKeys.events.detail(id),
        queryFn: async () => {
            const response = await eventApi.getById(id)
            return response.event || response.data?.event || response.data || response
        },
        enabled: !!id,
        ...options
    })
}

export const useMyEvents = () => {
    return useQuery({
        queryKey: queryKeys.events.myEvents,
        queryFn: async () => {
            const response = await eventApi.getMyEvents()
            const data = response.events || response.data?.events || response.data || response || []
            const stats = response.stats || response.data?.stats || null
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            // Return object with events and stats since MyEvents page uses stats
            return { events: array, stats }
        }
    })
}

export const useMyJoinedEvents = (status = 'upcoming') => {
    return useQuery({
        queryKey: queryKeys.events.myJoined(status),
        queryFn: async () => {
            const response = await eventApi.getMyJoined(status)
            const data = response.events || response.data?.events || response.data || response || []
            const stats = {
                total: response.total || response.data?.total || 0,
                upcoming: response.upcoming || response.data?.upcoming || 0,
                past: response.past || response.data?.past || 0
            }
            const array = Array.isArray(data) ? data : (typeof data === 'object' && data !== null ? Object.values(data) : [])
            return { events: array, stats }
        }
    })
}

// ... (rest of the file)

export const useEventMutations = () => {
    const queryClient = useQueryClient()

    const createEvent = useMutation({
        mutationFn: (data) => eventApi.create(data),
        onSuccess: () => {
            showSuccess('Event created!')
            queryClient.invalidateQueries(queryKeys.events.all)
        },
        onError: (error) => showError(error.message)
    })

    const joinEvent = useMutation({
        mutationFn: (id) => eventApi.join(id),
        onSuccess: (data, id) => {
            showSuccess('Joined event!')
            queryClient.invalidateQueries(queryKeys.events.detail(id))
            queryClient.invalidateQueries(queryKeys.events.lists())
        },
        onError: (error) => showError(error.message)
    })

    const leaveEvent = useMutation({
        mutationFn: (id) => eventApi.leave(id),
        onSuccess: (data, id) => {
            showSuccess('Left event')
            queryClient.invalidateQueries(queryKeys.events.detail(id))
            queryClient.invalidateQueries(queryKeys.events.lists())
        },
        onError: (error) => showError(error.message)
    })

    const deleteEvent = useMutation({
        mutationFn: (id) => eventApi.delete(id),
        onSuccess: () => {
            showSuccess('Event deleted')
            queryClient.invalidateQueries(queryKeys.events.all)
        },
        onError: (error) => showError(error.message)
    })

    return { createEvent, joinEvent, leaveEvent, deleteEvent }
}

/* -------------------------------------------------------------------------- */
/*                                 User Hooks                                 */
/* -------------------------------------------------------------------------- */

export const useUserProfile = () => {
    return useQuery({
        queryKey: queryKeys.user.profile,
        queryFn: async () => {
            const response = await authApi.getMe()
            return response.data || response
        },
        // Don't refetch user profile too often
        staleTime: 1000 * 60 * 10
    })
}
