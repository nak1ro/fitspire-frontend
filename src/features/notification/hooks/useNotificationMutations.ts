'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { markAllNotificationsRead, markNotificationRead } from '../api/client';
import { notificationQueryKeys } from './queryKeys';

async function invalidateNotificationReads(queryClient: ReturnType<typeof useQueryClient>) {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() }),
    ]);
}

export function useMarkNotificationRead() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) =>
            markNotificationRead(requireAccessToken(accessToken), notificationId),
        onSuccess: async () => {
            await invalidateNotificationReads(queryClient);
        },
    });
}

export function useMarkAllNotificationsRead() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => markAllNotificationsRead(requireAccessToken(accessToken)),
        onSuccess: async () => {
            await invalidateNotificationReads(queryClient);
        },
    });
}
