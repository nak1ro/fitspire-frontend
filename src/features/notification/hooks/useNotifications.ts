'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { getNotifications, getUnreadNotificationCount } from '../api/client';
import { NotificationPagination } from '../types';
import { notificationQueryKeys } from './queryKeys';

export function useNotifications(pagination?: NotificationPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: notificationQueryKeys.list(pagination),
        queryFn: () => getNotifications(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function useUnreadNotificationCount() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: notificationQueryKeys.unreadCount(),
        queryFn: () => getUnreadNotificationCount(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}
