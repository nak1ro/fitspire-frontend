'use client';

import { useState } from 'react';
import { Check, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useFollowUser, useUnfollowUser } from '../hooks/useSocialMutations';

interface DiscoveryFollowButtonProps {
    userId: string;
    isFollowing: boolean;
    onFollowStarted: () => void;
    onUnfollowed: () => void;
}

export function DiscoveryFollowButton({
    userId,
    isFollowing,
    onFollowStarted,
    onUnfollowed,
}: DiscoveryFollowButtonProps) {
    const [error, setError] = useState<string | null>(null);
    const { mutate: follow, isPending: isFollowingPending } = useFollowUser();
    const { mutate: unfollow, isPending: isUnfollowingPending } = useUnfollowUser();

    const handleClick = () => {
        setError(null);
        if (isFollowing) {
            unfollow(userId, {
                onSuccess: onUnfollowed,
                onError: (error) => setError(getErrorMessage(error, 'Failed to unfollow.')),
            });
            return;
        }

        onFollowStarted();
        follow(userId, {
            onError: (error) => {
                onUnfollowed();
                setError(getErrorMessage(error, 'Failed to follow.'));
            },
        });
    };

    return (
        <div className="inline-flex flex-col items-end gap-1">
            <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                size="sm"
                className="gap-1.5"
                loading={isFollowingPending || isUnfollowingPending}
                onClick={handleClick}
            >
                {isFollowing ? <Check className="h-4 w-4" aria-hidden="true" /> : <UserPlus className="h-4 w-4" aria-hidden="true" />}
                {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}
