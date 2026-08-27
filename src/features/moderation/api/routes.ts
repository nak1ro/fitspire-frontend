export const MODERATION_ROUTES = {
    reports: '/api/moderation/reports',
    adminAccess: '/api/admin/access',
    adminModerationSummary: '/api/admin/moderation/summary',
    adminModerationReports: '/api/admin/moderation/reports',
    adminModerationReport: (reportId: string) => `/api/admin/moderation/reports/${reportId}`,
    adminResolveReport: (reportId: string) => `/api/admin/moderation/reports/${reportId}/resolve`,
    adminRestoreTarget: (reportId: string) => `/api/admin/moderation/reports/${reportId}/restore-target`,
    adminUnsuspendUser: (reportId: string) => `/api/admin/moderation/reports/${reportId}/unsuspend-user`,
    demoDataSeed: '/api/admin/demo-data/seed',
    demoDataStatus: '/api/admin/demo-data/status',
} as const;
