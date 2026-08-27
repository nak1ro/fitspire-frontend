import { http } from '@/shared/lib/http';
import { normalizeAdminModerationReportFilter } from '../types';
import type {
    AdminAccessResponse,
    AdminModerationQueueSummary,
    AdminModerationReportDetail,
    AdminModerationReportFilter,
    AdminModerationReportPage,
    CreateModerationReportRequest,
    DemoDataStatusResponse,
    ModerationReportSubmissionResponse,
    ResolveModerationReportRequest,
} from '../types';
import { MODERATION_ROUTES } from './routes';

function toReportFilterQuery(filter?: AdminModerationReportFilter) {
    return normalizeAdminModerationReportFilter(filter);
}

export const createModerationReport = (accessToken: string, data: CreateModerationReportRequest) =>
    http<ModerationReportSubmissionResponse>(MODERATION_ROUTES.reports, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const getAdminAccess = (accessToken: string) =>
    http<AdminAccessResponse>(MODERATION_ROUTES.adminAccess, { accessToken });

export const getAdminModerationSummary = (accessToken: string) =>
    http<AdminModerationQueueSummary>(MODERATION_ROUTES.adminModerationSummary, { accessToken });

export const getAdminModerationReports = (accessToken: string, filter?: AdminModerationReportFilter) =>
    http<AdminModerationReportPage>(MODERATION_ROUTES.adminModerationReports, {
        accessToken,
        query: toReportFilterQuery(filter),
    });

export const getAdminModerationReport = (accessToken: string, reportId: string) =>
    http<AdminModerationReportDetail>(MODERATION_ROUTES.adminModerationReport(reportId), { accessToken });

export const resolveModerationReport = (accessToken: string, reportId: string, data: ResolveModerationReportRequest) =>
    http<AdminModerationReportDetail>(MODERATION_ROUTES.adminResolveReport(reportId), {
        method: 'POST',
        accessToken,
        json: data,
    });

export const restoreModerationTarget = (accessToken: string, reportId: string) =>
    http<AdminModerationReportDetail>(MODERATION_ROUTES.adminRestoreTarget(reportId), {
        method: 'POST',
        accessToken,
    });

export const unsuspendModerationUser = (accessToken: string, reportId: string) =>
    http<AdminModerationReportDetail>(MODERATION_ROUTES.adminUnsuspendUser(reportId), {
        method: 'POST',
        accessToken,
    });

export const seedDemoData = (accessToken: string) =>
    http<{ message: string }>(MODERATION_ROUTES.demoDataSeed, { method: 'POST', accessToken });

export const getDemoDataStatus = (accessToken: string) =>
    http<DemoDataStatusResponse>(MODERATION_ROUTES.demoDataStatus, { accessToken });
