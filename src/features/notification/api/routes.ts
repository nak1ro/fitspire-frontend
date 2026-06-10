export const NOTIFICATION_ROUTES = {
    base: '/api/notifications',
    unreadCount: '/api/notifications/unread-count',
    markRead: (notificationId: string) => `/api/notifications/${notificationId}/read`,
    markAllRead: '/api/notifications/read-all',
} as const;
