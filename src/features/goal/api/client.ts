import { http } from '@/shared/lib/http';
import type { PageRequest, PageResponse } from '@/shared/types';
import { GOAL_ROUTES } from './routes';
import type { CreateGoalRequest, Goal, GoalDetail, GoalListFilter, GoalPeriod, GoalProgressEntry, GoalTargetChange, GoalType, UpdateGoalRequest } from '../types';

function paginationQuery(pagination?: Partial<PageRequest>) { return { page: pagination?.page, pageSize: pagination?.pageSize }; }

export const getGoals = (accessToken: string, filter?: GoalListFilter) => http<PageResponse<Goal>>(GOAL_ROUTES.base, { accessToken, query: { scope: filter?.scope, status: filter?.status, ...paginationQuery(filter) } });
export const getGoal = (accessToken: string, goalId: string) => http<GoalDetail>(GOAL_ROUTES.detail(goalId), { accessToken });
export const getGoalPeriods = (accessToken: string, goalId: string, pagination?: Partial<PageRequest>) => http<PageResponse<GoalPeriod>>(GOAL_ROUTES.periods(goalId), { accessToken, query: paginationQuery(pagination) });
export const getGoalProgress = (accessToken: string, goalId: string, pagination?: Partial<PageRequest>) => http<PageResponse<GoalProgressEntry>>(GOAL_ROUTES.progress(goalId), { accessToken, query: paginationQuery(pagination) });
export const getGoalTargetHistory = (accessToken: string, goalId: string, pagination?: Partial<PageRequest>) => http<PageResponse<GoalTargetChange>>(GOAL_ROUTES.targetHistory(goalId), { accessToken, query: paginationQuery(pagination) });
export const getGoalTypes = (accessToken: string) => http<GoalType[]>(GOAL_ROUTES.types, { accessToken });
export const createGoal = (accessToken: string, data: CreateGoalRequest) => http<string>(GOAL_ROUTES.base, { method: 'POST', accessToken, json: data });
export const updateGoal = (accessToken: string, goalId: string, data: UpdateGoalRequest) => http<void>(GOAL_ROUTES.detail(goalId), { method: 'PATCH', accessToken, json: data });
export const archiveGoal = (accessToken: string, goalId: string) => http<void>(GOAL_ROUTES.archive(goalId), { method: 'POST', accessToken });
