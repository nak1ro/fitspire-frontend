export type NotificationType = 'Follow' | 'PostLike' | 'PostComment' | 'GoalCompleted' | string;
export type NotificationReferenceType = 'user' | 'post' | string;

export interface NotificationPagination {
    page?: number;
    pageSize?: number;
}

export interface AppNotification {
    id: string;
    type: NotificationType;
    message: string;
    actorUserId?: string | null;
    referenceEntityId?: string | null;
    referenceEntityType?: NotificationReferenceType | null;
    isRead: boolean;
    readAt?: string | null;
    createdAt: string;
}

export interface UnreadNotificationCountResponse {
    count: number;
}

export interface MarkAllNotificationsReadResponse {
    count: number;
}
