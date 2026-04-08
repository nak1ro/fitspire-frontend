'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { createGoal, getGoalTypes, getGoals, updateGoalProgress } from '../api/client';
import { CreateGoalRequest, UpdateGoalProgressRequest } from '../types';
import { goalQueryKeys } from './queryKeys';

function requireAccessToken(accessToken: string | null) {
    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}

export function useGoals() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: goalQueryKeys.list(),
        queryFn: () => getGoals(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}

export function useGoalTypes() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: goalQueryKeys.types(),
        queryFn: () => getGoalTypes(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}

export function useCreateGoal() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGoalRequest) => createGoal(requireAccessToken(accessToken), data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: goalQueryKeys.lists() });
        },
    });
}

export function useUpdateGoalProgress() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ goalId, data }: { goalId: string; data: UpdateGoalProgressRequest }) =>
            updateGoalProgress(requireAccessToken(accessToken), goalId, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: goalQueryKeys.lists() });
        },
    });
}
