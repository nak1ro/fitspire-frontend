import { http } from '@/shared/lib/http';
import type { PageResponse } from '@/shared/types';
import { BODY_CHECK_IN_ROUTES } from './routes';
import type { BodyCheckIn, BodyCheckInHistoryFilter, BodyCheckInSummary, CreateBodyCheckInRequest, DateRangeFilter, UpdateBodyCheckInRequest } from '../types';
export const createBodyCheckIn = (accessToken: string, data: CreateBodyCheckInRequest) => http<string>(BODY_CHECK_IN_ROUTES.base, { method: 'POST', accessToken, json: data });
export const getLatestBodyCheckIn = async (accessToken: string) => (await http<BodyCheckIn | undefined>(BODY_CHECK_IN_ROUTES.latest, { accessToken })) ?? null;
export const getBodyCheckInSummary = (accessToken: string, filter?: DateRangeFilter) =>
    http<BodyCheckInSummary>(BODY_CHECK_IN_ROUTES.summary, {
        accessToken,
        query: filter ? { from: filter.from, to: filter.to } : undefined,
    });
export const getBodyCheckIns = (accessToken: string, filter?: BodyCheckInHistoryFilter) => http<PageResponse<BodyCheckIn>>(BODY_CHECK_IN_ROUTES.base, { accessToken, query: filter ? { from: filter.from, to: filter.to, page: filter.page, pageSize: filter.pageSize } : undefined });
export const getBodyCheckIn = (accessToken: string, id: string) => http<BodyCheckIn>(BODY_CHECK_IN_ROUTES.detail(id), { accessToken });
export const updateBodyCheckIn = (accessToken: string, id: string, data: UpdateBodyCheckInRequest) => http<void>(BODY_CHECK_IN_ROUTES.detail(id), { method: 'PUT', accessToken, json: data });
export const deleteBodyCheckIn = (accessToken: string, id: string) => http<void>(BODY_CHECK_IN_ROUTES.detail(id), { method: 'DELETE', accessToken });
