import { http } from '@/shared/lib/http';
import { NOTIFICATION_ROUTES } from './routes';
import {
    AppNotification,
    MarkAllNotificationsReadResponse,
    NotificationPagination,
    UnreadNotificationCountResponse,
} from '../types';

function toNotificationQuery(pagination?: NotificationPagination) {
    return {
        page: pagination?.page,
        pageSize: pagination?.pageSize,
    };
}

export const getNotifications = (accessToken: string, pagination?: NotificationPagination) =>
    http<AppNotification[]>(NOTIFICATION_ROUTES.base, {
        accessToken,
        query: toNotificationQuery(pagination),
    });

export const getUnreadNotificationCount = (accessToken: string) =>
    http<UnreadNotificationCountResponse>(NOTIFICATION_ROUTES.unreadCount, {
        accessToken,
    });

export const markNotificationRead = (accessToken: string, notificationId: string) =>
    http<void>(NOTIFICATION_ROUTES.markRead(notificationId), {
        method: 'POST',
        accessToken,
    });

export const markAllNotificationsRead = (accessToken: string) =>
    http<MarkAllNotificationsReadResponse>(NOTIFICATION_ROUTES.markAllRead, {
        method: 'POST',
        accessToken,
    });
