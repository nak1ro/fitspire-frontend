import { http } from '@/shared/lib/http';
import { WORKOUT_ROUTES } from './routes';
import {
    Exercise,
    ExerciseCategory,
    ExerciseQuery,
    PersonalRecord,
    Workout,
    WorkoutFilter,
    WorkoutRoutine,
} from '../types';

function toWorkoutQuery(filter?: WorkoutFilter) {
    return {
        From: filter?.from,
        To: filter?.to,
        Types: filter?.types,
    };
}

function toExerciseQuery(query?: ExerciseQuery) {
    return {
        categoryId: query?.categoryId,
        search: query?.search,
    };
}

export const getWorkouts = (accessToken: string, filter?: WorkoutFilter) =>
    http<Workout[]>(WORKOUT_ROUTES.base, {
        accessToken,
        query: toWorkoutQuery(filter),
    });

export const getWorkoutById = (accessToken: string, workoutId: string) =>
    http<Workout>(WORKOUT_ROUTES.byId(workoutId), {
        accessToken,
    });

export const getExerciseCategories = (accessToken: string) =>
    http<ExerciseCategory[]>(WORKOUT_ROUTES.exerciseCategories, {
        accessToken,
    });

export const getExercises = (accessToken: string, query?: ExerciseQuery) =>
    http<Exercise[]>(WORKOUT_ROUTES.exercises, {
        accessToken,
        query: toExerciseQuery(query),
    });

export const getWorkoutRoutines = (accessToken: string) =>
    http<WorkoutRoutine[]>(WORKOUT_ROUTES.routines, {
        accessToken,
    });

export const getWorkoutRoutineById = (accessToken: string, routineId: string) =>
    http<WorkoutRoutine>(WORKOUT_ROUTES.routineById(routineId), {
        accessToken,
    });

export const getPersonalRecords = (accessToken: string) =>
    http<PersonalRecord[]>(WORKOUT_ROUTES.personalRecords, {
        accessToken,
    });
