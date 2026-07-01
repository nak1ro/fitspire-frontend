import type { PageRequest } from '@/shared/types';
import type { GoalListFilter } from '../types';

export const goalQueryKeys = {
    all: ['goal'] as const, lists: () => [...goalQueryKeys.all, 'list'] as const,
    list: (filter?: GoalListFilter) => [...goalQueryKeys.lists(), filter ?? {}] as const,
    types: () => [...goalQueryKeys.all, 'types'] as const, details: () => [...goalQueryKeys.all, 'detail'] as const,
    detail: (goalId: string) => [...goalQueryKeys.details(), goalId] as const,
    periods: (goalId: string, pagination?: Partial<PageRequest>) => [...goalQueryKeys.detail(goalId), 'periods', pagination ?? {}] as const,
    progress: (goalId: string, pagination?: Partial<PageRequest>) => [...goalQueryKeys.detail(goalId), 'progress', pagination ?? {}] as const,
    targetHistory: (goalId: string, pagination?: Partial<PageRequest>) => [...goalQueryKeys.detail(goalId), 'target-history', pagination ?? {}] as const,
};
