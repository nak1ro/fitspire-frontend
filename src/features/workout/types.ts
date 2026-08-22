export type KnownWorkoutType = 'Gym' | 'Running' | 'Cycling' | 'Swimming' | 'Yoga';
export type WorkoutType = KnownWorkoutType | string;
export type WorkoutTypeFilter = 'gym' | 'running' | 'cycling' | 'swimming' | 'yoga';
export type WorkoutStatus = 'InProgress' | 'Completed' | 'Paused' | 'Archived';
export type WorkoutSplit =
    | 'Push'
    | 'Pull'
    | 'Legs'
    | 'UpperBody'
    | 'LowerBody'
    | 'FullBody'
    | 'Cardio'
    | 'Other';
export type WorkoutIntensity = 'Low' | 'Medium' | 'High' | 'Extreme';
export type SwimmingStroke =
    | 'Freestyle'
    | 'Breaststroke'
    | 'Backstroke'
    | 'Butterfly'
    | 'Sidestroke'
    | 'Mixed'
    | 'Other';
export type YogaStyle =
    | 'Hatha'
    | 'Vinyasa'
    | 'Ashtanga'
    | 'Iyengar'
    | 'Bikram'
    | 'Kundalini'
    | 'Yin'
    | 'Restorative'
    | 'Power'
    | 'Other';
export type YogaIntensity = 'Low' | 'Medium' | 'High';
export type YogaFocusArea =
    | 'FullBody'
    | 'UpperBody'
    | 'LowerBody'
    | 'Core'
    | 'Flexibility'
    | 'Balance'
    | 'Relaxation';

export interface WorkoutFilter {
    from?: string;
    to?: string;
    types?: WorkoutTypeFilter[];
}

export interface Workout {
    id: string;
    userId: string;
    workoutType: WorkoutType;
    date: string;
    durationMinutes?: number | null;
    notes?: string | null;
    isPrivate: boolean;
    status: WorkoutStatus;
    completedAt?: string | null;
    isRoutine: boolean;
    routineName?: string | null;
    createdAt: string;
}

export interface ExerciseInputRequest {
    exerciseId: string;
    sets: GymSetInputRequest[];
    notes?: string | null;
}

export interface GymSetInputRequest {
    reps?: number | null;
    weightKg?: number | null;
    durationSeconds?: number | null;
    distanceMeters?: number | null;
    isWarmup: boolean;
    rpe?: number | null;
    notes?: string | null;
    isCompleted?: boolean;
}

export interface LegacyGymExerciseFormInput {
    exerciseId: string;
    sets: number;
    reps: number;
    weightKg: number;
}

export interface LegacyCreateGymWorkoutRequest {
    date: string;
    splitType?: WorkoutSplit | null;
    intensityLevel?: WorkoutIntensity | null;
    exercises: LegacyGymExerciseFormInput[];
}

export interface CreateGymWorkoutRequest {
    date: string;
    splitType?: WorkoutSplit | null;
    intensityLevel?: WorkoutIntensity | null;
    exercises: ExerciseInputRequest[];
}

export interface CreateRunningWorkoutRequest {
    date: string;
    distanceKm: number;
    durationMinutes?: number | null;
    elevationGainMeters?: number | null;
    stepCount?: number | null;
    caloriesBurned?: number | null;
    mapData?: string | null;
    notes?: string | null;
    isPrivate: boolean;
}

export interface CreateCyclingWorkoutRequest {
    date: string;
    distanceKm: number;
    durationMinutes?: number | null;
    elevationGainMeters?: number | null;
    caloriesBurned?: number | null;
    mapData?: string | null;
    notes?: string | null;
    isPrivate: boolean;
    isIndoor: boolean;
}

export interface CreateSwimmingWorkoutRequest {
    date: string;
    laps?: number | null;
    poolLengthMeters?: number | null;
    distanceMeters?: number | null;
    strokeType?: SwimmingStroke | null;
    durationMinutes?: number | null;
    caloriesBurned?: number | null;
    notes?: string | null;
    isPrivate: boolean;
}

export interface CreateYogaWorkoutRequest {
    date: string;
    durationMinutes?: number | null;
    style?: YogaStyle | null;
    intensity?: YogaIntensity | null;
    focusArea?: YogaFocusArea | null;
    caloriesBurned?: number | null;
    notes?: string | null;
    isPrivate: boolean;
}

export interface CompleteWorkoutRequest {
    durationMinutes?: number | null;
    notes?: string | null;
    isPrivate?: boolean | null;
}

export interface UpdateWorkoutRequest {
    date?: string | null;
    durationMinutes?: number | null;
    notes?: string | null;
    isPrivate?: boolean | null;
    caloriesBurned?: number | null;
    distanceKm?: number | null;
    elevationGainMeters?: number | null;
    stepCount?: number | null;
    mapData?: string | null;
    isIndoor?: boolean | null;
    laps?: number | null;
    poolLengthMeters?: number | null;
    distanceMeters?: number | null;
    strokeType?: SwimmingStroke | null;
    style?: YogaStyle | null;
    intensity?: YogaIntensity | null;
    focusArea?: YogaFocusArea | null;
    splitType?: WorkoutSplit | null;
    intensityLevel?: WorkoutIntensity | null;
    exercises?: ExerciseInputRequest[] | null;
}

export interface ExerciseCategory {
    id: string;
    name: string;
    description?: string | null;
    exercisesCount: number;
}

export interface Exercise {
    id: string;
    name: string;
    description?: string | null;
    categoryId?: string | null;
    categoryName?: string | null;
}

export interface ExerciseQuery {
    categoryId?: string | null;
    search?: string | null;
}

export interface GymExercise {
    id: string;
    exerciseId: string;
    exerciseName: string;
    orderIndex: number;
    notes?: string | null;
    sets: GymSet[];
}

export interface GymSet {
    id: string;
    orderIndex: number;
    reps?: number | null;
    weightKg?: number | null;
    durationSeconds?: number | null;
    distanceMeters?: number | null;
    isWarmup: boolean;
    rpe?: number | null;
    notes?: string | null;
    isCompleted: boolean;
    completedAtUtc?: string | null;
}

export interface GymWorkout extends Workout {
    splitType?: WorkoutSplit | null;
    intensityLevel?: WorkoutIntensity | null;
    exercises: GymExercise[];
}

export interface RunningWorkout extends Workout {
    caloriesBurned?: number | null;
    distanceKm: number;
    elevationGainMeters?: number | null;
    stepCount?: number | null;
    mapData?: string | null;
}

export interface CyclingWorkout extends Workout {
    caloriesBurned?: number | null;
    distanceKm: number;
    elevationGainMeters?: number | null;
    mapData?: string | null;
    isIndoor: boolean;
}

export interface SwimmingWorkout extends Workout {
    caloriesBurned?: number | null;
    laps?: number | null;
    poolLengthMeters?: number | null;
    distanceMeters?: number | null;
    strokeType?: SwimmingStroke | null;
}

export interface YogaWorkout extends Workout {
    caloriesBurned?: number | null;
    style?: YogaStyle | null;
    intensity?: YogaIntensity | null;
    focusArea?: YogaFocusArea | null;
}

export type WorkoutDetail =
    | GymWorkout
    | RunningWorkout
    | CyclingWorkout
    | SwimmingWorkout
    | YogaWorkout;

export interface WorkoutRoutine {
    id: string;
    name: string;
    description?: string | null;
    workoutType: WorkoutType;
    schemaVersion: number;
    definition: WorkoutRoutineDefinition;
    createdAt: string;
    updatedAt?: string | null;
}

export interface WorkoutRoutineDefinition {
    schemaVersion: number;
    workoutType: WorkoutType;
    [key: string]: unknown;
}

export interface SaveWorkoutRoutineRequest {
    name: string;
    description?: string | null;
}

export interface UpdateWorkoutRoutineRequest {
    name: string;
    description?: string | null;
    definition: WorkoutRoutineDefinition;
}

export interface CreateWorkoutFromRoutineRequest {
    date: string;
}

export interface PersonalRecord {
    id: string;
    workoutType: WorkoutType;
    metric: string;
    unit: string;
    value: number;
    workoutId: string;
    exerciseId?: string | null;
    exerciseName?: string | null;
    achievedAt: string;
    isFeatured: boolean;
}

export interface WorkoutSession {
    id: string;
    workoutType: WorkoutType;
    status: WorkoutStatus;
    startedAt?: string | null;
    pausedAt?: string | null;
    accumulatedPausedSeconds: number;
    elapsedMinutes: number;
}

export interface AddGymExerciseRequest {
    exerciseId: string;
    sets?: GymSetInputRequest[] | null;
    notes?: string | null;
}

export interface UpdateGymExerciseRequest {
    notes?: string | null;
}

export interface ReorderGymItemsRequest {
    orderedIds: string[];
}

export interface UpdateGymSetRequest {
    reps?: number | null;
    weightKg?: number | null;
    durationSeconds?: number | null;
    distanceMeters?: number | null;
    isWarmup: boolean;
    rpe?: number | null;
    notes?: string | null;
}

export interface SetCompletionRequest {
    isCompleted: boolean;
}

export interface WorkoutHistorySummary {
    exerciseCount?: number | null;
    completedSetCount?: number | null;
    totalVolumeKg?: number | null;
    maximumWeightKg?: number | null;
    distanceKm?: number | null;
    elevationGainMeters?: number | null;
    stepCount?: number | null;
    averagePaceMinutesPerKm?: number | null;
    isIndoor?: boolean | null;
    averageSpeedKph?: number | null;
    distanceMeters?: number | null;
    laps?: number | null;
    poolLengthMeters?: number | null;
    strokeType?: string | null;
    style?: string | null;
    intensity?: string | null;
    focusArea?: string | null;
}

export interface WorkoutHistoryItem {
    id: string;
    workoutType: WorkoutType;
    date: string;
    durationMinutes?: number | null;
    caloriesBurned?: number | null;
    isPrivate: boolean;
    status: WorkoutStatus;
    completedAt?: string | null;
    createdFromRoutineId?: string | null;
    notesPreview?: string | null;
    summary: WorkoutHistorySummary;
}

export interface WorkoutPageResponse {
    items: WorkoutHistoryItem[];
    page: number;
    pageSize: number;
    totalCount: number;
}

export interface WorkoutSummaryFilter {
    from?: string;
    to?: string;
}

export interface WorkoutSummary {
    from: string;
    to: string;
    workoutCount: number;
    durationMinutes: number;
    distanceKm: number;
    caloriesBurned: number;
    gymVolumeKg: number;
}
