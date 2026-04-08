export const GOAL_ROUTES = {
    base: '/api/goal',
    types: '/api/goal/types',
    progress: (goalId: string) => `/api/goal/${goalId}/progress`,
} as const;
