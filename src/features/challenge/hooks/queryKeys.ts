import type { PageRequest } from '@/shared/types';
import type { ChallengeListFilter } from '../types';

export const challengeQueryKeys = {
    all: ['challenge'] as const,
    discover: (pagination?: Partial<PageRequest>) => [...challengeQueryKeys.all, 'discover', pagination ?? {}] as const,
    available: (pagination?: Partial<PageRequest>) => [...challengeQueryKeys.all, 'available', pagination ?? {}] as const,
    mine: (filter?: ChallengeListFilter) => [...challengeQueryKeys.all, 'mine', filter ?? {}] as const,
    incomingInvitations: (pagination?: Partial<PageRequest>) =>
        [...challengeQueryKeys.all, 'invitations', 'incoming', pagination ?? {}] as const,
    details: () => [...challengeQueryKeys.all, 'detail'] as const,
    detail: (challengeId: string) => [...challengeQueryKeys.details(), challengeId] as const,
    leaderboard: (challengeId: string, pagination?: Partial<PageRequest>) =>
        [...challengeQueryKeys.detail(challengeId), 'leaderboard', pagination ?? {}] as const,
    results: (challengeId: string, pagination?: Partial<PageRequest>) =>
        [...challengeQueryKeys.detail(challengeId), 'results', pagination ?? {}] as const,
    sentInvitations: (challengeId: string, pagination?: Partial<PageRequest>) =>
        [...challengeQueryKeys.detail(challengeId), 'invitations', 'sent', pagination ?? {}] as const,
};
