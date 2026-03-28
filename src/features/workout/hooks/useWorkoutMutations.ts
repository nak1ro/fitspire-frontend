'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import {
    completeWorkout,
    createWorkoutFromRoutine,
    deleteWorkout,
    deleteWorkoutRoutine,
    saveWorkoutAsRoutine,
    updateWorkout,
} from '../api/client';
import {
    CompleteWorkoutRequest,
    CreateWorkoutFromRoutineRequest,
    SaveWorkoutRoutineRequest,
    UpdateWorkoutRequest,
} from '../types';
import { workoutQueryKeys } from './queryKeys';

function requireAccessToken(accessToken: string | null) {
    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}

async function invalidateWorkoutReads(queryClient: ReturnType<typeof useQueryClient>) {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.personalRecords() }),
    ]);
}

export function useCompleteWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ workoutId, data }: { workoutId: string; data: CompleteWorkoutRequest }) =>
            completeWorkout(requireAccessToken(accessToken), workoutId, data),
        onSuccess: async (_result, variables) => {
            await Promise.all([
                invalidateWorkoutReads(queryClient),
                queryClient.invalidateQueries({ queryKey: workoutQueryKeys.detail(variables.workoutId) }),
            ]);
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
            await Promise.all([
                invalidateWorkoutReads(queryClient),
                queryClient.invalidateQueries({ queryKey: workoutQueryKeys.detail(variables.workoutId) }),
            ]);
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
            await invalidateWorkoutReads(queryClient);
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
            await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.lists() });
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
