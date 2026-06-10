import { NotificationPagination } from '../types';

export const notificationQueryKeys = {
    all: ['notification'] as const,
    lists: () => [...notificationQueryKeys.all, 'list'] as const,
    list: (pagination?: NotificationPagination) =>
        [...notificationQueryKeys.lists(), pagination ?? {}] as const,
    unreadCount: () => [...notificationQueryKeys.all, 'unread-count'] as const,
};
