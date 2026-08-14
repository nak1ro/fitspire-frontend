import { http } from '@/shared/lib/http';
import type { PageResponse } from '@/shared/types';
import { AI_COACHING_ROUTES } from './routes';
import type {
    CoachMessage,
    CoachMessageHistory,
    CoachMessageHistoryFilter,
    CoachQueuedExchange,
    CoachThread,
    CoachThreadHistoryFilter,
    CoachThreadListItem,
    CreateCoachThreadRequest,
    DailyCoachBriefing,
    GenerateWeeklyCoachReportRequest,
    SendCoachMessageRequest,
    UpdateCoachThreadRequest,
    WeeklyCoachHistoryFilter,
    WeeklyCoachReport,
    WeeklyCoachReportListItem,
} from '../types';

export const generateWeeklyCoachReport = (token: string, data: GenerateWeeklyCoachReportRequest) =>
    http<WeeklyCoachReport>(AI_COACHING_ROUTES.reports, { method: 'POST', accessToken: token, json: data });
export const getWeeklyCoachReport = (token: string, id: string) =>
    http<WeeklyCoachReport>(AI_COACHING_ROUTES.report(id), { accessToken: token });
export const getWeeklyCoachReports = (token: string, filter?: WeeklyCoachHistoryFilter) =>
    http<PageResponse<WeeklyCoachReportListItem>>(AI_COACHING_ROUTES.reports, { accessToken: token, query: filter ? { page: filter.page, pageSize: filter.pageSize } : undefined });
export const deleteWeeklyCoachReport = (token: string, id: string) =>
    http<void>(AI_COACHING_ROUTES.report(id), { method: 'DELETE', accessToken: token });

export const createCoachThread = (token: string, data: CreateCoachThreadRequest) =>
    http<CoachThread>(AI_COACHING_ROUTES.threads, { method: 'POST', accessToken: token, json: data });
export const getCoachThreads = (token: string, filter?: CoachThreadHistoryFilter) =>
    http<PageResponse<CoachThreadListItem>>(AI_COACHING_ROUTES.threads, { accessToken: token, query: filter ? { page: filter.page, pageSize: filter.pageSize } : undefined });
export const getCoachThread = (token: string, threadId: string) =>
    http<CoachThread>(AI_COACHING_ROUTES.thread(threadId), { accessToken: token });
export const updateCoachThread = (token: string, threadId: string, data: UpdateCoachThreadRequest) =>
    http<CoachThread>(AI_COACHING_ROUTES.thread(threadId), { method: 'PATCH', accessToken: token, json: data });
export const deleteCoachThread = (token: string, threadId: string) =>
    http<void>(AI_COACHING_ROUTES.thread(threadId), { method: 'DELETE', accessToken: token });

export const sendCoachMessage = (token: string, threadId: string, data: SendCoachMessageRequest) =>
    http<CoachQueuedExchange>(AI_COACHING_ROUTES.messages(threadId), { method: 'POST', accessToken: token, json: data });
export const getCoachMessages = (token: string, threadId: string, filter?: CoachMessageHistoryFilter) =>
    http<CoachMessageHistory>(AI_COACHING_ROUTES.messages(threadId), { accessToken: token, query: filter ? { beforeSequence: filter.beforeSequence, pageSize: filter.pageSize } : undefined });
export const getCoachMessage = (token: string, threadId: string, messageId: string) =>
    http<CoachMessage>(AI_COACHING_ROUTES.message(threadId, messageId), { accessToken: token });
export const retryCoachMessage = (token: string, threadId: string, messageId: string) =>
    http<CoachMessage>(AI_COACHING_ROUTES.retryMessage(threadId, messageId), { method: 'POST', accessToken: token });

export const queueTodayDailyBriefing = (token: string) =>
    http<DailyCoachBriefing>(AI_COACHING_ROUTES.dailyToday, { method: 'POST', accessToken: token });
export const getTodayDailyBriefing = (token: string) =>
    http<DailyCoachBriefing>(AI_COACHING_ROUTES.dailyToday, { accessToken: token });
export const getDailyBriefing = (token: string, briefingId: string) =>
    http<DailyCoachBriefing>(AI_COACHING_ROUTES.dailyBriefing(briefingId), { accessToken: token });
export const retryDailyBriefing = (token: string, briefingId: string) =>
    http<DailyCoachBriefing>(AI_COACHING_ROUTES.retryDailyBriefing(briefingId), { method: 'POST', accessToken: token });
