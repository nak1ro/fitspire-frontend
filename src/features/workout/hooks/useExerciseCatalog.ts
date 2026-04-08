'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { getExerciseCategories, getExercises } from '../api/client';
import { ExerciseQuery } from '../types';
import { workoutQueryKeys } from './queryKeys';

export function useExerciseCategories() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.exerciseCategories(),
        queryFn: () => getExerciseCategories(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}

export function useExercises(query?: ExerciseQuery) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.exercises(query),
        queryFn: () => getExercises(requireAccessToken(accessToken), query),
        enabled: Boolean(accessToken),
    });
}
