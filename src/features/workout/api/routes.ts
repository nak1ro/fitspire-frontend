export const WORKOUT_ROUTES = {
    base: '/api/workout',
    byId: (workoutId: string) => `/api/workout/${workoutId}`,
    complete: (workoutId: string) => `/api/workout/${workoutId}/complete`,
    saveAsRoutine: (workoutId: string) => `/api/workout/${workoutId}/save-as-routine`,
    fromRoutine: (routineId: string) => `/api/workout/from-routine/${routineId}`,
    exerciseCategories: '/api/workout/exercise-categories',
    exercises: '/api/workout/exercises',
    routines: '/api/workout/routines',
    routineById: (routineId: string) => `/api/workout/routines/${routineId}`,
    personalRecords: '/api/workout/personal-records',
} as const;
