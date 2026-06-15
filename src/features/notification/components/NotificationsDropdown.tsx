import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAllNotificationsRead, useMarkNotificationRead } from '../hooks/useNotificationMutations';
import { NotificationRow } from './NotificationRow';

export function NotificationsDropdown() {
    const { data: notifications } = useNotifications({ pageSize: 6 });
    const markAllRead = useMarkAllNotificationsRead();
    const markRead = useMarkNotificationRead();
    const hasUnread = (notifications ?? []).some((n) => !n.isRead);

    return (
        <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-surface-200 bg-background overflow-hidden z-20"
            style={{ boxShadow: 'var(--shadow-panel)' }}
        >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-surface-100">
                <p className="text-sm font-bold text-foreground">Notifications</p>
                {hasUnread && (
                    <button
                        type="button"
                        onClick={() => markAllRead.mutate()}
                        className="text-xs font-semibold text-primary-500 hover:opacity-70 transition-opacity"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            <div className="max-h-80 overflow-y-auto p-1.5">
                {!notifications || notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
                        <Bell className="h-5 w-5 text-surface-300" aria-hidden="true" />
                        <p className="text-sm text-surface-400">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationRow
                            key={notification.id}
                            notification={notification}
                            onClick={() => { if (!notification.isRead) markRead.mutate(notification.id); }}
                        />
                    ))
                )}
            </div>

            <Link
                href="/notifications"
                className="block text-center text-sm font-semibold text-primary-500 py-2.5 border-t border-surface-100 hover:bg-surface-100 transition-colors"
            >
                View all
            </Link>
        </div>
    );
}
