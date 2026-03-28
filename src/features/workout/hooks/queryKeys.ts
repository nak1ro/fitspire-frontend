import { ExerciseQuery, WorkoutFilter } from '../types';

export const workoutQueryKeys = {
    all: ['workout'] as const,
    lists: () => [...workoutQueryKeys.all, 'list'] as const,
    list: (filter?: WorkoutFilter) => [...workoutQueryKeys.lists(), filter ?? {}] as const,
    details: () => [...workoutQueryKeys.all, 'detail'] as const,
    detail: (workoutId: string) => [...workoutQueryKeys.details(), workoutId] as const,
    exerciseCategories: () => [...workoutQueryKeys.all, 'exercise-categories'] as const,
    exercises: (query?: ExerciseQuery) => [...workoutQueryKeys.all, 'exercises', query ?? {}] as const,
    routines: () => [...workoutQueryKeys.all, 'routines'] as const,
    routine: (routineId: string) => [...workoutQueryKeys.routines(), routineId] as const,
    personalRecords: () => [...workoutQueryKeys.all, 'personal-records'] as const,
};
