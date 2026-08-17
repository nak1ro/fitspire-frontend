import { normalizeAdminModerationReportFilter, type AdminModerationReportFilter } from '../types';

export const moderationQueryKeys = {
    all: ['moderation'] as const,
    reports: () => [...moderationQueryKeys.all, 'reports'] as const,
    admin: () => [...moderationQueryKeys.all, 'admin'] as const,
    adminAccess: () => [...moderationQueryKeys.admin(), 'access'] as const,
    adminSummary: () => [...moderationQueryKeys.admin(), 'summary'] as const,
    adminReports: (filter?: AdminModerationReportFilter) =>
        [...moderationQueryKeys.admin(), 'reports', normalizeAdminModerationReportFilter(filter)] as const,
    adminReport: (reportId: string) => [...moderationQueryKeys.admin(), 'report', reportId] as const,
};
