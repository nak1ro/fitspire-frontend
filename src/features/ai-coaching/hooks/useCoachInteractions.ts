'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    createCoachThread,
    deleteCoachThread,
    getCoachMessage,
    getCoachMessages,
    getCoachThread,
    getCoachThreads,
    getDailyBriefing,
    getTodayDailyBriefing,
    queueTodayDailyBriefing,
    retryCoachMessage,
    retryDailyBriefing,
    sendCoachMessage,
    updateCoachThread,
} from '../api/client';
import type {
    CoachMessageHistoryFilter,
    CoachThreadHistoryFilter,
    CreateCoachThreadRequest,
    SendCoachMessageInput,
    UpdateCoachThreadRequest,
} from '../types';
import { aiCoachingQueryKeys } from './queryKeys';

const pollIntervalMs = 3000;
const isGenerating = (status?: string) => status === 'Pending' || status === 'Processing';
const createRequestId = () => crypto.randomUUID();

function useInteractionInvalidation() {
    const client = useQueryClient();
    return () => client.invalidateQueries({ queryKey: aiCoachingQueryKeys.interactions });
}

export function useCoachThreads(filter?: CoachThreadHistoryFilter) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: aiCoachingQueryKeys.threads(filter),
        queryFn: () => getCoachThreads(requireAccessToken(accessToken), filter),
        enabled: Boolean(accessToken),
    });
}

export function useCoachThread(threadId: string | null) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: aiCoachingQueryKeys.thread(threadId ?? ''),
        queryFn: () => getCoachThread(requireAccessToken(accessToken), threadId ?? ''),
        enabled: Boolean(accessToken && threadId),
    });
}

export function useCoachMessages(threadId: string | null, filter?: CoachMessageHistoryFilter) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: aiCoachingQueryKeys.messages(threadId ?? '', filter),
        queryFn: () => getCoachMessages(requireAccessToken(accessToken), threadId ?? '', filter),
        enabled: Boolean(accessToken && threadId),
        refetchInterval: (query) => query.state.data?.items.some((message) => isGenerating(message.status)) ? pollIntervalMs : false,
    });
}

export function useCoachMessage(threadId: string | null, messageId: string | null) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: aiCoachingQueryKeys.message(threadId ?? '', messageId ?? ''),
        queryFn: () => getCoachMessage(requireAccessToken(accessToken), threadId ?? '', messageId ?? ''),
        enabled: Boolean(accessToken && threadId && messageId),
        refetchInterval: (query) => isGenerating(query.state.data?.status) ? pollIntervalMs : false,
    });
}

export function useTodayDailyBriefing() {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: aiCoachingQueryKeys.dailyToday,
        queryFn: () => getTodayDailyBriefing(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
        retry: false,
        refetchInterval: (query) => isGenerating(query.state.data?.status) ? pollIntervalMs : false,
    });
}

export function useDailyBriefing(briefingId: string | null) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: aiCoachingQueryKeys.dailyBriefing(briefingId ?? ''),
        queryFn: () => getDailyBriefing(requireAccessToken(accessToken), briefingId ?? ''),
        enabled: Boolean(accessToken && briefingId),
        refetchInterval: (query) => isGenerating(query.state.data?.status) ? pollIntervalMs : false,
    });
}

export function useCreateCoachThread() {
    const { accessToken } = useAuthSession();
    const invalidate = useInteractionInvalidation();
    return useMutation({ mutationFn: (data: CreateCoachThreadRequest) => createCoachThread(requireAccessToken(accessToken), data), onSuccess: invalidate });
}

export function useUpdateCoachThread() {
    const { accessToken } = useAuthSession();
    const invalidate = useInteractionInvalidation();
    return useMutation({ mutationFn: ({ threadId, data }: { threadId: string; data: UpdateCoachThreadRequest }) => updateCoachThread(requireAccessToken(accessToken), threadId, data), onSuccess: invalidate });
}

export function useDeleteCoachThread() {
    const { accessToken } = useAuthSession();
    const invalidate = useInteractionInvalidation();
    return useMutation({ mutationFn: (threadId: string) => deleteCoachThread(requireAccessToken(accessToken), threadId), onSuccess: invalidate });
}

export function useSendCoachMessage(threadId: string) {
    const { accessToken } = useAuthSession();
    const invalidate = useInteractionInvalidation();
    return useMutation({
        mutationFn: (input: SendCoachMessageInput) => sendCoachMessage(requireAccessToken(accessToken), threadId, { content: input.content, clientRequestId: input.clientRequestId ?? createRequestId() }),
        onSuccess: invalidate,
    });
}

export function useRetryCoachMessage(threadId: string) {
    const { accessToken } = useAuthSession();
    const invalidate = useInteractionInvalidation();
    return useMutation({ mutationFn: (messageId: string) => retryCoachMessage(requireAccessToken(accessToken), threadId, messageId), onSuccess: invalidate });
}

export function useQueueTodayDailyBriefing() {
    const { accessToken } = useAuthSession();
    const invalidate = useInteractionInvalidation();
    return useMutation({ mutationFn: () => queueTodayDailyBriefing(requireAccessToken(accessToken)), onSuccess: invalidate });
}

export function useRetryDailyBriefing() {
    const { accessToken } = useAuthSession();
    const invalidate = useInteractionInvalidation();
    return useMutation({ mutationFn: (briefingId: string) => retryDailyBriefing(requireAccessToken(accessToken), briefingId), onSuccess: invalidate });
}
