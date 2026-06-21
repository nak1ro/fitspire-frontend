import { getInitials } from '../lib/getInitials';
import { cn } from '../lib/cn';

interface AvatarProps {
    displayName: string;
    userName: string;
    avatarUrl?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const SIZES = {
    xs: 'w-6 h-6 text-[10px] rounded-full',
    sm: 'w-8 h-8 text-[11px] rounded-full',
    md: 'w-9 h-9 text-xs rounded-full',
    lg: 'w-12 h-12 text-sm rounded-full',
    xl: 'w-20 h-20 text-2xl rounded-2xl',
};

export function Avatar({ displayName, userName, avatarUrl, size = 'md', className }: AvatarProps) {
    const initials = getInitials(displayName, userName);

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={displayName || userName}
                className={cn('object-cover shrink-0', SIZES[size], className)}
            />
        );
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center font-bold shrink-0 bg-primary-100 text-primary-600',
                SIZES[size],
                className
            )}
            aria-hidden="true"
        >
            {initials}
        </div>
    );
}
