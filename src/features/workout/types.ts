export type KnownWorkoutType = 'Gym' | 'Running' | 'Cycling' | 'Swimming' | 'Yoga';
export type WorkoutType = KnownWorkoutType | string;
export type WorkoutStatus = 'InProgress' | 'Completed' | string;
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
    types?: WorkoutType[];
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
    sets: number;
    reps: number;
    weightKg: number;
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
}

export interface UpdateWorkoutRequest {
    date?: string | null;
    durationMinutes?: number | null;
    notes?: string | null;
    isPrivate?: boolean | null;
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
    sets: number;
    reps: number;
    weight: number;
    orderIndex: number;
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
    createdAt: string;
    updatedAt?: string | null;
}

export interface SaveWorkoutRoutineRequest {
    name: string;
    description?: string | null;
}

export interface CreateWorkoutFromRoutineRequest {
    date: string;
}

export interface PersonalRecord {
    id: string;
    workoutType: WorkoutType;
    metric: string;
    value: number;
    workoutId: string;
    achievedAt: string;
}
