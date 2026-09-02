export const AI_COACHING_ROUTES = {
    reports: '/api/ai-coach/weekly-reports',
    report: (id: string) => `/api/ai-coach/weekly-reports/${id}`,
    threads: '/api/ai-coach/threads',
    thread: (threadId: string) => `/api/ai-coach/threads/${threadId}`,
    messages: (threadId: string) => `/api/ai-coach/threads/${threadId}/messages`,
    message: (threadId: string, messageId: string) => `/api/ai-coach/threads/${threadId}/messages/${messageId}`,
    retryMessage: (threadId: string, messageId: string) => `/api/ai-coach/threads/${threadId}/messages/${messageId}/retry`,
    dailyToday: '/api/ai-coach/daily-briefings/today',
    dailyBriefing: (briefingId: string) => `/api/ai-coach/daily-briefings/${briefingId}`,
    retryDailyBriefing: (briefingId: string) => `/api/ai-coach/daily-briefings/${briefingId}/retry`,
    regenerateDailyBriefing: (briefingId: string) => `/api/ai-coach/daily-briefings/${briefingId}/regenerate`,
} as const;
