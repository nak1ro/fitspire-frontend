'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { notificationQueryKeys } from '@/features/notification/hooks/queryKeys';
import { socialQueryKeys } from '@/features/social/hooks/queryKeys';
import type { PageRequest } from '@/shared/types';
import { archiveGoal, createGoal, getGoal, getGoalPeriods, getGoalProgress, getGoals, getGoalTargetHistory, getGoalTypes, updateGoal } from '../api/client';
import type { CreateGoalRequest, GoalListFilter, UpdateGoalRequest } from '../types';
import { goalQueryKeys } from './queryKeys';

function useGoalInvalidation() {
    const queryClient = useQueryClient();
    return async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: goalQueryKeys.all }),
            queryClient.invalidateQueries({ queryKey: socialQueryKeys.all }),
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
        ]);
    };
}

export function useGoals(filter?: GoalListFilter) {
    const { accessToken } = useAuthSession();
    return useQuery({ queryKey: goalQueryKeys.list(filter), queryFn: () => getGoals(requireAccessToken(accessToken), filter), enabled: Boolean(accessToken) });
}

export function useGoal(goalId: string | null) {
    const { accessToken } = useAuthSession();
    return useQuery({ queryKey: goalQueryKeys.detail(goalId ?? ''), queryFn: () => getGoal(requireAccessToken(accessToken), goalId ?? ''), enabled: Boolean(accessToken && goalId) });
}

export function useGoalPeriods(goalId: string | null, pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({ queryKey: goalQueryKeys.periods(goalId ?? '', pagination), queryFn: () => getGoalPeriods(requireAccessToken(accessToken), goalId ?? '', pagination), enabled: Boolean(accessToken && goalId) });
}

export function useGoalProgress(goalId: string | null, pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({ queryKey: goalQueryKeys.progress(goalId ?? '', pagination), queryFn: () => getGoalProgress(requireAccessToken(accessToken), goalId ?? '', pagination), enabled: Boolean(accessToken && goalId) });
}

export function useGoalTargetHistory(goalId: string | null, pagination?: Partial<PageRequest>) {
    const { accessToken } = useAuthSession();
    return useQuery({ queryKey: goalQueryKeys.targetHistory(goalId ?? '', pagination), queryFn: () => getGoalTargetHistory(requireAccessToken(accessToken), goalId ?? '', pagination), enabled: Boolean(accessToken && goalId) });
}

export function useGoalTypes() {
    const { accessToken } = useAuthSession();
    return useQuery({ queryKey: goalQueryKeys.types(), queryFn: () => getGoalTypes(requireAccessToken(accessToken)), enabled: Boolean(accessToken) });
}

export function useCreateGoal() {
    const { accessToken } = useAuthSession(); const invalidate = useGoalInvalidation();
    return useMutation({ mutationFn: (data: CreateGoalRequest) => createGoal(requireAccessToken(accessToken), data), onSuccess: invalidate });
}

export function useUpdateGoal() {
    const { accessToken } = useAuthSession(); const invalidate = useGoalInvalidation();
    return useMutation({ mutationFn: ({ goalId, data }: { goalId: string; data: UpdateGoalRequest }) => updateGoal(requireAccessToken(accessToken), goalId, data), onSuccess: invalidate });
}

export function useArchiveGoal() {
    const { accessToken } = useAuthSession(); const invalidate = useGoalInvalidation();
    return useMutation({ mutationFn: (goalId: string) => archiveGoal(requireAccessToken(accessToken), goalId), onSuccess: invalidate });
}
