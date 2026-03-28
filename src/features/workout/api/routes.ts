export const WORKOUT_ROUTES = {
    base: '/api/workout',
    byId: (workoutId: string) => `/api/workout/${workoutId}`,
    exerciseCategories: '/api/workout/exercise-categories',
    exercises: '/api/workout/exercises',
    routines: '/api/workout/routines',
    routineById: (routineId: string) => `/api/workout/routines/${routineId}`,
    personalRecords: '/api/workout/personal-records',
} as const;
