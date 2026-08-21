'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    completeWorkout,
    createWorkoutFromRoutine,
    deleteWorkout,
    deleteWorkoutRoutine,
    restoreWorkout,
    saveWorkoutAsRoutine,
    updateWorkout,
    updateWorkoutRoutine,
} from '../api/client';
import {
    CompleteWorkoutRequest,
    CreateWorkoutFromRoutineRequest,
    SaveWorkoutRoutineRequest,
    UpdateWorkoutRequest,
    UpdateWorkoutRoutineRequest,
} from '../types';
import { workoutQueryKeys } from './queryKeys';
import { invalidateWorkoutDerivedQueries } from './invalidation';

export function useCompleteWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workoutId, data }: { workoutId: string; data: CompleteWorkoutRequest }) =>
            completeWorkout(requireAccessToken(accessToken), workoutId, data),
        onSuccess: async (_result, variables) => {
            await invalidateWorkoutDerivedQueries(queryClient, variables.workoutId);
        },
        // A failed finish still leaves the workout created (InProgress) server-side from the
        // preceding create call — refetch the active session so "unfinished session" banners
        // pick it up immediately instead of only after the query naturally goes stale.
        onError: async (_error, variables) => {
            await invalidateWorkoutDerivedQueries(queryClient, variables.workoutId);
        },
    });
}

export function useUpdateWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workoutId, data }: { workoutId: string; data: UpdateWorkoutRequest }) =>
            updateWorkout(requireAccessToken(accessToken), workoutId, data),
        onSuccess: async (_result, variables) => {
            await invalidateWorkoutDerivedQueries(queryClient, variables.workoutId);
        },
    });
}

export function useDeleteWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workoutId: string) => deleteWorkout(requireAccessToken(accessToken), workoutId),
        onSuccess: async (_result, workoutId) => {
            queryClient.removeQueries({ queryKey: workoutQueryKeys.detail(workoutId) });
            await invalidateWorkoutDerivedQueries(queryClient);
        },
    });
}

export function useRestoreWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workoutId: string) => restoreWorkout(requireAccessToken(accessToken), workoutId),
        onSuccess: async (_result, workoutId) => {
            await invalidateWorkoutDerivedQueries(queryClient, workoutId);
        },
    });
}

export function useSaveWorkoutAsRoutine() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workoutId, data }: { workoutId: string; data: SaveWorkoutRoutineRequest }) =>
            saveWorkoutAsRoutine(requireAccessToken(accessToken), workoutId, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.routines() });
        },
    });
}

export function useCreateWorkoutFromRoutine() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routineId, data }: { routineId: string; data: CreateWorkoutFromRoutineRequest }) =>
            createWorkoutFromRoutine(requireAccessToken(accessToken), routineId, data),
        onSuccess: async () => {
            await invalidateWorkoutDerivedQueries(queryClient);
        },
    });
}

export function useDeleteWorkoutRoutine() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (routineId: string) => deleteWorkoutRoutine(requireAccessToken(accessToken), routineId),
        onSuccess: async (_result, routineId) => {
            queryClient.removeQueries({ queryKey: workoutQueryKeys.routine(routineId) });
            await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.routines() });
        },
    });
}

export function useUpdateWorkoutRoutine() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ routineId, data }: { routineId: string; data: UpdateWorkoutRoutineRequest }) =>
            updateWorkoutRoutine(requireAccessToken(accessToken), routineId, data),
        onSuccess: async (_result, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: workoutQueryKeys.routine(variables.routineId) }),
                queryClient.invalidateQueries({ queryKey: workoutQueryKeys.routines() }),
            ]);
        },
    });
}
