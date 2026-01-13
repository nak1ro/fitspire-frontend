/**
 * React Query Configuration
 * 
 * Centralized QueryClient setup with default options.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Default options for all queries
 */
const defaultQueryOptions = {
    queries: {
        // Refetch on window focus (disabled for mobile)
        refetchOnWindowFocus: false,

        // Retry failed requests 2 times
        retry: 2,

        // Consider data stale after 5 minutes
        staleTime: 5 * 60 * 1000,

        // Keep cached data for 30 minutes
        gcTime: 30 * 60 * 1000,
    },
    mutations: {
        // Retry failed mutations once
        retry: 1,
    },
};

/**
 * Create configured QueryClient instance
 */
export const queryClient = new QueryClient({
    defaultOptions: defaultQueryOptions,
});
