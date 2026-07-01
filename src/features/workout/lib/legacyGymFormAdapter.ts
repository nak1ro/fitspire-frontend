import type {
    CreateGymWorkoutRequest,
    LegacyCreateGymWorkoutRequest,
} from '../types';

export function adaptLegacyGymFormRequest(request: LegacyCreateGymWorkoutRequest): CreateGymWorkoutRequest {
    return {
        ...request,
        exercises: request.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            sets: Array.from({ length: exercise.sets }, () => ({
                reps: exercise.reps,
                weightKg: exercise.weightKg,
                isWarmup: false,
                isCompleted: true,
            })),
        })),
    };
}
