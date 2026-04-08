import { http } from '@/shared/lib/http';
import { GOAL_ROUTES } from './routes';
import { CreateGoalRequest, Goal, GoalType, UpdateGoalProgressRequest } from '../types';

export const getGoals = (accessToken: string) =>
    http<Goal[]>(GOAL_ROUTES.base, {
        accessToken,
    });

export const getGoalTypes = (accessToken: string) =>
    http<GoalType[]>(GOAL_ROUTES.types, {
        accessToken,
    });

export const createGoal = (accessToken: string, data: CreateGoalRequest) =>
    http<string>(GOAL_ROUTES.base, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const updateGoalProgress = (
    accessToken: string,
    goalId: string,
    data: UpdateGoalProgressRequest
) =>
    http<void>(GOAL_ROUTES.progress(goalId), {
        method: 'POST',
        accessToken,
        json: data,
    });
