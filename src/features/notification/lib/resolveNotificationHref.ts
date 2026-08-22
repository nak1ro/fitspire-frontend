import type { AppNotification } from '../types';

export function resolveNotificationHref(notification: AppNotification): string | null {
    if (!notification.referenceEntityId) return null;

    switch (notification.referenceEntityType) {
        case 'user': return `/profile/${notification.referenceEntityId}`;
        case 'post': return `/feed/${notification.referenceEntityId}`;
        case 'goal': return `/goals/${notification.referenceEntityId}`;
        case 'challenge': return `/challenges/${notification.referenceEntityId}`;
        case 'badge': return '/profile';
        default: return null;
    }
}
