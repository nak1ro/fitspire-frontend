'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
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
} from '../types';
import { workoutQueryKeys } from './queryKeys';

function requireAccessToken(accessToken: string | null) {
    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}

async function invalidateWorkoutLists(queryClient: ReturnType<typeof useQueryClient>) {
    await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.lists() });
}

async function cacheCreatedWorkout(queryClient: ReturnType<typeof useQueryClient>, workout: Workout) {
    queryClient.setQueryData(workoutQueryKeys.detail(workout.id), workout);
    await invalidateWorkoutLists(queryClient);
}

export function useCreateGymWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGymWorkoutRequest) =>
            createGymWorkout(requireAccessToken(accessToken), data),
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
