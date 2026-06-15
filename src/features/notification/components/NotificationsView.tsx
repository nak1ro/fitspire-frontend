'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAllNotificationsRead, useMarkNotificationRead } from '../hooks/useNotificationMutations';
import { NotificationRow } from './NotificationRow';

export function NotificationsView() {
    const { data: notifications, isLoading } = useNotifications({ pageSize: 50 });
    const markAllRead = useMarkAllNotificationsRead();
    const markRead = useMarkNotificationRead();
    const hasUnread = (notifications ?? []).some((n) => !n.isRead);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-surface-100 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!notifications || notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center px-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary-50">
                    <Bell className="h-6 w-6 text-primary-500" aria-hidden="true" />
                </div>
                <h2 className="text-base font-bold text-foreground">No notifications yet</h2>
                <p className="text-sm text-surface-500 max-w-xs">
                    Follows, likes, and comments on your posts will show up here.
                </p>
            </div>
        );
    }

    return (
        <div>
            {hasUnread && (
                <div className="flex justify-end mb-3">
                    <button
                        type="button"
                        onClick={() => markAllRead.mutate()}
                        className="text-sm font-semibold text-primary-500 hover:opacity-70 transition-opacity"
                    >
                        Mark all read
                    </button>
                </div>
            )}

            <div className="space-y-1">
                {notifications.map((notification) => (
                    <NotificationRow
                        key={notification.id}
                        notification={notification}
                        onClick={() => { if (!notification.isRead) markRead.mutate(notification.id); }}
                    />
                ))}
            </div>
        </div>
    );
}
