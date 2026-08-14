'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    addGymExercise,
    addGymSet,
    deleteGymExercise,
    deleteGymSet,
    reorderGymExercises,
    reorderGymSets,
    setGymSetCompletion,
    updateGymExercise,
    updateGymSet,
} from '../api/client';
import {
    AddGymExerciseRequest,
    GymSetInputRequest,
    ReorderGymItemsRequest,
    SetCompletionRequest,
    UpdateGymExerciseRequest,
    UpdateGymSetRequest,
} from '../types';
import { workoutQueryKeys } from './queryKeys';

function useDetailInvalidatingMutation<TVariables extends { workoutId: string }, TResult>(
    mutation: (accessToken: string, variables: TVariables) => Promise<TResult>
) {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: TVariables) => mutation(requireAccessToken(accessToken), variables),
        onSuccess: async (_result, variables) => {
            await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.detail(variables.workoutId) });
        },
    });
}

export function useAddGymExercise() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, data }: { workoutId: string; data: AddGymExerciseRequest }) =>
            addGymExercise(token, workoutId, data)
    );
}

export function useUpdateGymExercise() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, exerciseEntryId, data }: { workoutId: string; exerciseEntryId: string; data: UpdateGymExerciseRequest }) =>
            updateGymExercise(token, workoutId, exerciseEntryId, data)
    );
}

export function useDeleteGymExercise() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, exerciseEntryId }: { workoutId: string; exerciseEntryId: string }) =>
            deleteGymExercise(token, workoutId, exerciseEntryId)
    );
}

export function useReorderGymExercises() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, data }: { workoutId: string; data: ReorderGymItemsRequest }) =>
            reorderGymExercises(token, workoutId, data)
    );
}

export function useAddGymSet() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, exerciseEntryId, data }: { workoutId: string; exerciseEntryId: string; data: GymSetInputRequest }) =>
            addGymSet(token, workoutId, exerciseEntryId, data)
    );
}

export function useUpdateGymSet() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, exerciseEntryId, setId, data }: { workoutId: string; exerciseEntryId: string; setId: string; data: UpdateGymSetRequest }) =>
            updateGymSet(token, workoutId, exerciseEntryId, setId, data)
    );
}

export function useSetGymSetCompletion() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, exerciseEntryId, setId, data }: { workoutId: string; exerciseEntryId: string; setId: string; data: SetCompletionRequest }) =>
            setGymSetCompletion(token, workoutId, exerciseEntryId, setId, data)
    );
}

export function useDeleteGymSet() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, exerciseEntryId, setId }: { workoutId: string; exerciseEntryId: string; setId: string }) =>
            deleteGymSet(token, workoutId, exerciseEntryId, setId)
    );
}

export function useReorderGymSets() {
    return useDetailInvalidatingMutation(
        (token, { workoutId, exerciseEntryId, data }: { workoutId: string; exerciseEntryId: string; data: ReorderGymItemsRequest }) =>
            reorderGymSets(token, workoutId, exerciseEntryId, data)
    );
}
