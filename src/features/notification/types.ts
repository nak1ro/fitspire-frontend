export type NotificationType =
    | 'Follow'
    | 'PostLike'
    | 'PostComment'
    | 'GoalCompleted'
    | 'FollowRequest'
    | 'FollowRequestAccepted'
    | 'CommentLike'
    | 'CommentReply'
    | 'GoalPeriodFailed'
    | 'ChallengeInvitation'
    | 'ChallengeStarted'
    | 'ChallengeCancelled'
    | 'ChallengeCompleted'
    | 'ChallengeWon'
    | 'BadgeEarned'
    | 'ChallengeUpdated';
export type NotificationReferenceType = 'user' | 'post' | 'comment' | 'goal' | 'challenge' | 'badge';

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
