import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
            cacheTime: 1000 * 60 * 30, // Data remains in cache for 30 minutes
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch on window focus by default
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        }
    }
})
