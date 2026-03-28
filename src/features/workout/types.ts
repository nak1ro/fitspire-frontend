export type KnownWorkoutType = 'Gym' | 'Running' | 'Cycling' | 'Swimming' | 'Yoga';
export type WorkoutType = KnownWorkoutType | string;
export type WorkoutStatus = 'Planned' | 'Completed' | 'Cancelled' | string;

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

export interface WorkoutRoutine {
    id: string;
    name: string;
    description?: string | null;
    workoutType: WorkoutType;
    createdAt: string;
    updatedAt?: string | null;
}

export interface PersonalRecord {
    id: string;
    workoutType: WorkoutType;
    metric: string;
    value: number;
    workoutId: string;
    achievedAt: string;
}
