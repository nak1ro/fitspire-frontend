'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { getArchivedWorkouts, getWorkoutHistory } from '../api/client';
import { workoutQueryKeys } from './queryKeys';

export function useWorkoutHistory(page = 1, pageSize = 20, archived = false) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.history(archived, page, pageSize),
        queryFn: () => archived
            ? getArchivedWorkouts(requireAccessToken(accessToken), page, pageSize)
            : getWorkoutHistory(requireAccessToken(accessToken), page, pageSize),
        enabled: Boolean(accessToken),
    });
}
