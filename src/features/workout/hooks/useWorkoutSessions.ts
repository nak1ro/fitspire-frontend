'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    abandonWorkout,
    getActiveWorkoutSession,
    pauseWorkout,
    resumeWorkout,
} from '../api/client';
import { workoutQueryKeys } from './queryKeys';
import { invalidateWorkoutDerivedQueries } from './invalidation';

async function invalidateSessionAndWorkouts(queryClient: ReturnType<typeof useQueryClient>, workoutId?: string) {
    await invalidateWorkoutDerivedQueries(queryClient, workoutId);
}

export function useActiveWorkoutSession() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.activeSession(),
        queryFn: () => getActiveWorkoutSession(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}

function useSessionMutation(mutation: (token: string, workoutId: string) => Promise<void>) {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workoutId: string) => mutation(requireAccessToken(accessToken), workoutId),
        onSuccess: async (_result, workoutId) => invalidateSessionAndWorkouts(queryClient, workoutId),
    });
}

export const usePauseWorkout = () => useSessionMutation(pauseWorkout);
export const useResumeWorkout = () => useSessionMutation(resumeWorkout);
export const useAbandonWorkout = () => useSessionMutation(abandonWorkout);
