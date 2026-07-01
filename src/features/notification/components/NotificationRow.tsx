import { UserPlus, Heart, MessageCircle, Bell, UserCheck, Reply, type LucideIcon } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import type { AppNotification } from '../types';

const TYPE_ICON: Record<string, LucideIcon> = {
    Follow: UserPlus,
    FollowRequest: UserPlus,
    FollowRequestAccepted: UserCheck,
    PostLike: Heart,
    PostComment: MessageCircle,
    CommentLike: Heart,
    CommentReply: Reply,
};

interface NotificationRowProps {
    notification: AppNotification;
    onClick?: () => void;
}

export function NotificationRow({ notification, onClick }: NotificationRowProps) {
    const Icon = TYPE_ICON[notification.type] ?? Bell;

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-surface-100"
        >
            <IconChip icon={Icon} size="sm" />
            <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground leading-snug">{notification.message}</p>
                <p className="text-xs text-surface-400 mt-0.5">{formatRelativeTime(notification.createdAt)}</p>
            </div>
            {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-primary-500 shrink-0 mt-1.5" aria-hidden="true" />
            )}
        </button>
    );
}
