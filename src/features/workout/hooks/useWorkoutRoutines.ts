'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { getWorkoutRoutineById, getWorkoutRoutines } from '../api/client';
import { workoutQueryKeys } from './queryKeys';

export function useWorkoutRoutines() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.routines(),
        queryFn: () => getWorkoutRoutines(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}

export function useWorkoutRoutine(routineId: string | null) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.routine(routineId ?? ''),
        queryFn: () => getWorkoutRoutineById(requireAccessToken(accessToken), routineId ?? ''),
        enabled: Boolean(accessToken && routineId),
    });
}
