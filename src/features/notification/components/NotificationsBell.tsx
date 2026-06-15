'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useUnreadNotificationCount } from '../hooks/useNotifications';
import { NotificationsDropdown } from './NotificationsDropdown';

export function NotificationsBell() {
    const [hovered, setHovered] = useState(false);
    const { data: unreadNotifications } = useUnreadNotificationCount();
    const unreadCount = unreadNotifications?.count ?? 0;
    const unreadLabel = unreadCount > 9 ? '9+' : String(unreadCount);

    return (
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Link
                href="/notifications"
                className="relative flex p-2 rounded-xl transition-all text-surface-500 hover:bg-surface-100 hover:text-foreground"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
                <Bell className="h-5 w-5" aria-hidden="true" />
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full ring-2 ring-background flex items-center justify-center text-[10px] font-bold text-white bg-primary-500"
                        aria-hidden="true"
                    >
                        {unreadLabel}
                    </span>
                )}
            </Link>

            {hovered && <NotificationsDropdown />}
        </div>
    );
}
