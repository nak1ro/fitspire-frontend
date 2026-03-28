'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { getWorkoutById, getWorkouts } from '../api/client';
import { WorkoutFilter } from '../types';
import { workoutQueryKeys } from './queryKeys';

function requireAccessToken(accessToken: string | null) {
    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}

export function useWorkouts(filter?: WorkoutFilter) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.list(filter),
        queryFn: () => getWorkouts(requireAccessToken(accessToken), filter),
        enabled: Boolean(accessToken),
    });
}

export function useWorkout(workoutId: string | null) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.detail(workoutId ?? ''),
        queryFn: () => getWorkoutById(requireAccessToken(accessToken), workoutId ?? ''),
        enabled: Boolean(accessToken && workoutId),
    });
}
