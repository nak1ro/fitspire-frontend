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
import type {
    AddGymExerciseRequest,
    GymSetInputRequest,
    ReorderGymItemsRequest,
    SetCompletionRequest,
    UpdateGymExerciseRequest,
    UpdateGymSetRequest,
} from '../types';
import { workoutQueryKeys } from './queryKeys';

type WorkoutIdVariables = { workoutId: string };
type ExerciseVariables = WorkoutIdVariables & { exerciseEntryId: string };
type SetVariables = ExerciseVariables & { setId: string };

export function useGymWorkoutMutations() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();
    const token = () => requireAccessToken(accessToken);
    const invalidate = async ({ workoutId }: WorkoutIdVariables) => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: workoutQueryKeys.detail(workoutId) }),
            queryClient.invalidateQueries({ queryKey: workoutQueryKeys.lists() }),
            queryClient.invalidateQueries({ queryKey: workoutQueryKeys.personalRecords() }),
        ]);
    };

    return {
        addExercise: useMutation({
            mutationFn: (variables: WorkoutIdVariables & { data: AddGymExerciseRequest }) => addGymExercise(token(), variables.workoutId, variables.data),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        updateExercise: useMutation({
            mutationFn: (variables: ExerciseVariables & { data: UpdateGymExerciseRequest }) => updateGymExercise(token(), variables.workoutId, variables.exerciseEntryId, variables.data),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        deleteExercise: useMutation({
            mutationFn: (variables: ExerciseVariables) => deleteGymExercise(token(), variables.workoutId, variables.exerciseEntryId),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        reorderExercises: useMutation({
            mutationFn: (variables: WorkoutIdVariables & { data: ReorderGymItemsRequest }) => reorderGymExercises(token(), variables.workoutId, variables.data),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        addSet: useMutation({
            mutationFn: (variables: ExerciseVariables & { data: GymSetInputRequest }) => addGymSet(token(), variables.workoutId, variables.exerciseEntryId, variables.data),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        updateSet: useMutation({
            mutationFn: (variables: SetVariables & { data: UpdateGymSetRequest }) => updateGymSet(token(), variables.workoutId, variables.exerciseEntryId, variables.setId, variables.data),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        setCompletion: useMutation({
            mutationFn: (variables: SetVariables & { data: SetCompletionRequest }) => setGymSetCompletion(token(), variables.workoutId, variables.exerciseEntryId, variables.setId, variables.data),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        deleteSet: useMutation({
            mutationFn: (variables: SetVariables) => deleteGymSet(token(), variables.workoutId, variables.exerciseEntryId, variables.setId),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
        reorderSets: useMutation({
            mutationFn: (variables: ExerciseVariables & { data: ReorderGymItemsRequest }) => reorderGymSets(token(), variables.workoutId, variables.exerciseEntryId, variables.data),
            onSuccess: async (_result, variables) => invalidate(variables),
        }),
    };
}
