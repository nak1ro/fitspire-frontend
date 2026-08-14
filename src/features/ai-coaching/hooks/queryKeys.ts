import type { CoachMessageHistoryFilter, CoachThreadHistoryFilter, WeeklyCoachHistoryFilter } from '../types';

const aiCoachingRootKey = ['ai-coaching'] as const;
const interactionRootKey = [...aiCoachingRootKey, 'interactions'] as const;

export const aiCoachingQueryKeys = {
    all: aiCoachingRootKey,
    reports: (filter?: WeeklyCoachHistoryFilter) => [...aiCoachingRootKey, 'reports', filter ?? {}] as const,
    report: (id: string) => [...aiCoachingRootKey, 'report', id] as const,
    interactions: interactionRootKey,
    threads: (filter?: CoachThreadHistoryFilter) => [...interactionRootKey, 'threads', filter ?? {}] as const,
    thread: (threadId: string) => [...interactionRootKey, 'thread', threadId] as const,
    messages: (threadId: string, filter?: CoachMessageHistoryFilter) => [...interactionRootKey, 'messages', threadId, filter ?? {}] as const,
    message: (threadId: string, messageId: string) => [...interactionRootKey, 'message', threadId, messageId] as const,
    dailyToday: [...interactionRootKey, 'daily-today'] as const,
    dailyBriefing: (briefingId: string) => [...interactionRootKey, 'daily-briefing', briefingId] as const,
};
