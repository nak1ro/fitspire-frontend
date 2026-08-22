import { http } from '@/shared/lib/http';
import { WORKOUT_ROUTES } from './routes';
import {
    CompleteWorkoutRequest,
    AddGymExerciseRequest,
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
    GymSetInputRequest,
    PersonalRecord,
    ReorderGymItemsRequest,
    RunningWorkout,
    SaveWorkoutRoutineRequest,
    SwimmingWorkout,
    UpdateWorkoutRequest,
    UpdateGymExerciseRequest,
    UpdateGymSetRequest,
    UpdateWorkoutRoutineRequest,
    SetCompletionRequest,
    Workout,
    WorkoutDetail,
    WorkoutFilter,
    WorkoutRoutine,
    WorkoutSession,
    WorkoutPageResponse,
    WorkoutSummary,
    WorkoutSummaryFilter,
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

function toWorkoutSummaryQuery(filter?: WorkoutSummaryFilter) {
    return {
        from: filter?.from,
        to: filter?.to,
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
    http<{ success: boolean }>(WORKOUT_ROUTES.finish(workoutId), {
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

export const setFeaturedPersonalRecord = (accessToken: string, personalRecordId: string | null) =>
    http<void>(WORKOUT_ROUTES.featuredPersonalRecord, {
        method: 'PUT',
        accessToken,
        json: { personalRecordId },
    });

export const getActiveWorkoutSession = async (accessToken: string): Promise<WorkoutSession | null> =>
    (await http<WorkoutSession | undefined>(WORKOUT_ROUTES.activeSession, { accessToken })) ?? null;

export const pauseWorkout = (accessToken: string, workoutId: string) =>
    http<void>(WORKOUT_ROUTES.pause(workoutId), { method: 'POST', accessToken });

export const resumeWorkout = (accessToken: string, workoutId: string) =>
    http<void>(WORKOUT_ROUTES.resume(workoutId), { method: 'POST', accessToken });

export const abandonWorkout = (accessToken: string, workoutId: string) =>
    http<void>(WORKOUT_ROUTES.abandon(workoutId), { method: 'POST', accessToken });

export const restoreWorkout = (accessToken: string, workoutId: string) =>
    http<void>(WORKOUT_ROUTES.restore(workoutId), { method: 'POST', accessToken });

export const getWorkoutHistory = (accessToken: string, page = 1, pageSize = 20) =>
    http<WorkoutPageResponse>(WORKOUT_ROUTES.history, { accessToken, query: { page, pageSize } });

export const getArchivedWorkouts = (accessToken: string, page = 1, pageSize = 20) =>
    http<WorkoutPageResponse>(WORKOUT_ROUTES.archived, { accessToken, query: { page, pageSize } });

export const getWorkoutSummary = (accessToken: string, filter?: WorkoutSummaryFilter) =>
    http<WorkoutSummary>(WORKOUT_ROUTES.summary, {
        accessToken,
        query: toWorkoutSummaryQuery(filter),
    });

export const updateWorkoutRoutine = (accessToken: string, routineId: string, data: UpdateWorkoutRoutineRequest) =>
    http<void>(WORKOUT_ROUTES.routineById(routineId), { method: 'PATCH', accessToken, json: data });

export const addGymExercise = (accessToken: string, workoutId: string, data: AddGymExerciseRequest) =>
    http<void>(WORKOUT_ROUTES.gymExercises(workoutId), { method: 'POST', accessToken, json: data });

export const updateGymExercise = (accessToken: string, workoutId: string, exerciseEntryId: string, data: UpdateGymExerciseRequest) =>
    http<void>(WORKOUT_ROUTES.gymExercise(workoutId, exerciseEntryId), { method: 'PATCH', accessToken, json: data });

export const deleteGymExercise = (accessToken: string, workoutId: string, exerciseEntryId: string) =>
    http<void>(WORKOUT_ROUTES.gymExercise(workoutId, exerciseEntryId), { method: 'DELETE', accessToken });

export const reorderGymExercises = (accessToken: string, workoutId: string, data: ReorderGymItemsRequest) =>
    http<void>(WORKOUT_ROUTES.gymExerciseOrder(workoutId), { method: 'PUT', accessToken, json: data });

export const addGymSet = (accessToken: string, workoutId: string, exerciseEntryId: string, data: GymSetInputRequest) =>
    http<void>(WORKOUT_ROUTES.gymSets(workoutId, exerciseEntryId), { method: 'POST', accessToken, json: data });

export const updateGymSet = (accessToken: string, workoutId: string, exerciseEntryId: string, setId: string, data: UpdateGymSetRequest) =>
    http<void>(WORKOUT_ROUTES.gymSet(workoutId, exerciseEntryId, setId), { method: 'PATCH', accessToken, json: data });

export const setGymSetCompletion = (accessToken: string, workoutId: string, exerciseEntryId: string, setId: string, data: SetCompletionRequest) =>
    http<void>(WORKOUT_ROUTES.gymSetCompletion(workoutId, exerciseEntryId, setId), { method: 'PUT', accessToken, json: data });

export const deleteGymSet = (accessToken: string, workoutId: string, exerciseEntryId: string, setId: string) =>
    http<void>(WORKOUT_ROUTES.gymSet(workoutId, exerciseEntryId, setId), { method: 'DELETE', accessToken });

export const reorderGymSets = (accessToken: string, workoutId: string, exerciseEntryId: string, data: ReorderGymItemsRequest) =>
    http<void>(WORKOUT_ROUTES.gymSetOrder(workoutId, exerciseEntryId), { method: 'PUT', accessToken, json: data });
