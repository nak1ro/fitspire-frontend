import { http } from '@/shared/lib/http';
import { WORKOUT_ROUTES } from './routes';
import {
    CompleteWorkoutRequest,
    CreateCyclingWorkoutRequest,
    CreateGymWorkoutRequest,
    CreateRunningWorkoutRequest,
    CreateSwimmingWorkoutRequest,
    CreateWorkoutFromRoutineRequest,
    CreateYogaWorkoutRequest,
    CyclingWorkout,
    Exercise,
    ExerciseCategory,
    ExerciseQuery,
    PersonalRecord,
    RunningWorkout,
    SaveWorkoutRoutineRequest,
    SwimmingWorkout,
    UpdateWorkoutRequest,
    Workout,
    WorkoutDetail,
    WorkoutFilter,
    WorkoutRoutine,
    YogaWorkout,
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
    http<WorkoutDetail>(WORKOUT_ROUTES.byId(workoutId), {
        accessToken,
    });

export const createGymWorkout = (accessToken: string, data: CreateGymWorkoutRequest) =>
    http<string>(WORKOUT_ROUTES.createGym, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const createRunningWorkout = (accessToken: string, data: CreateRunningWorkoutRequest) =>
    http<RunningWorkout>(WORKOUT_ROUTES.createRunning, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const createCyclingWorkout = (accessToken: string, data: CreateCyclingWorkoutRequest) =>
    http<CyclingWorkout>(WORKOUT_ROUTES.createCycling, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const createSwimmingWorkout = (accessToken: string, data: CreateSwimmingWorkoutRequest) =>
    http<SwimmingWorkout>(WORKOUT_ROUTES.createSwimming, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const createYogaWorkout = (accessToken: string, data: CreateYogaWorkoutRequest) =>
    http<YogaWorkout>(WORKOUT_ROUTES.createYoga, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const completeWorkout = (accessToken: string, workoutId: string, data: CompleteWorkoutRequest) =>
    http<{ success: boolean }>(WORKOUT_ROUTES.complete(workoutId), {
        method: 'POST',
        accessToken,
        json: data,
    });

export const updateWorkout = (accessToken: string, workoutId: string, data: UpdateWorkoutRequest) =>
    http<void>(WORKOUT_ROUTES.byId(workoutId), {
        method: 'PUT',
        accessToken,
        json: data,
    });

export const deleteWorkout = (accessToken: string, workoutId: string) =>
    http<void>(WORKOUT_ROUTES.byId(workoutId), {
        method: 'DELETE',
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

export const saveWorkoutAsRoutine = (
    accessToken: string,
    workoutId: string,
    data: SaveWorkoutRoutineRequest
) =>
    http<string>(WORKOUT_ROUTES.saveAsRoutine(workoutId), {
        method: 'POST',
        accessToken,
        json: data,
    });

export const createWorkoutFromRoutine = (
    accessToken: string,
    routineId: string,
    data: CreateWorkoutFromRoutineRequest
) =>
    http<string>(WORKOUT_ROUTES.fromRoutine(routineId), {
        method: 'POST',
        accessToken,
        json: data,
    });

export const deleteWorkoutRoutine = (accessToken: string, routineId: string) =>
    http<void>(WORKOUT_ROUTES.routineById(routineId), {
        method: 'DELETE',
        accessToken,
    });

export const getPersonalRecords = (accessToken: string) =>
    http<PersonalRecord[]>(WORKOUT_ROUTES.personalRecords, {
        accessToken,
    });
