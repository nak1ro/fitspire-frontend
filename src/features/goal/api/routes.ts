export const GOAL_ROUTES = {
    base: '/api/goal', types: '/api/goal/types', detail: (goalId: string) => `/api/goal/${goalId}`,
    periods: (goalId: string) => `/api/goal/${goalId}/periods`, progress: (goalId: string) => `/api/goal/${goalId}/progress`,
    targetHistory: (goalId: string) => `/api/goal/${goalId}/target-history`, archive: (goalId: string) => `/api/goal/${goalId}/archive`,
} as const;
