'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    createCyclingWorkout,
    createGymWorkout,
    createRunningWorkout,
    createSwimmingWorkout,
    createYogaWorkout,
} from '../api/client';
import {
    CreateCyclingWorkoutRequest,
    CreateGymWorkoutRequest,
    CreateRunningWorkoutRequest,
    CreateSwimmingWorkoutRequest,
    CreateYogaWorkoutRequest,
    Workout,
    LegacyCreateGymWorkoutRequest,
} from '../types';
import { workoutQueryKeys } from './queryKeys';
import { adaptLegacyGymFormRequest } from '../lib/legacyGymFormAdapter';
import { invalidateWorkoutDerivedQueries } from './invalidation';

async function invalidateWorkoutLists(queryClient: ReturnType<typeof useQueryClient>) {
    await invalidateWorkoutDerivedQueries(queryClient);
}

async function cacheCreatedWorkout(queryClient: ReturnType<typeof useQueryClient>, workout: Workout) {
    queryClient.setQueryData(workoutQueryKeys.detail(workout.id), workout);
    await invalidateWorkoutDerivedQueries(queryClient, workout.id);
}

export function useCreateGymWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGymWorkoutRequest | LegacyCreateGymWorkoutRequest) =>
            createGymWorkout(
                requireAccessToken(accessToken),
                Array.isArray(data.exercises[0]?.sets)
                    ? data as CreateGymWorkoutRequest
                    : adaptLegacyGymFormRequest(data as LegacyCreateGymWorkoutRequest),
            ),
        onSuccess: async () => {
            await invalidateWorkoutLists(queryClient);
        },
    });
}

export function useCreateRunningWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRunningWorkoutRequest) =>
            createRunningWorkout(requireAccessToken(accessToken), data),
        onSuccess: async (workout) => {
            await cacheCreatedWorkout(queryClient, workout);
        },
    });
}

export function useCreateCyclingWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCyclingWorkoutRequest) =>
            createCyclingWorkout(requireAccessToken(accessToken), data),
        onSuccess: async (workout) => {
            await cacheCreatedWorkout(queryClient, workout);
        },
    });
}

export function useCreateSwimmingWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSwimmingWorkoutRequest) =>
            createSwimmingWorkout(requireAccessToken(accessToken), data),
        onSuccess: async (workout) => {
            await cacheCreatedWorkout(queryClient, workout);
        },
    });
}

export function useCreateYogaWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateYogaWorkoutRequest) =>
            createYogaWorkout(requireAccessToken(accessToken), data),
        onSuccess: async (workout) => {
            await cacheCreatedWorkout(queryClient, workout);
        },
    });
}
