'use client';

import { useState } from 'react';
import { Check, Clock, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useFollowUser, useUnfollowUser, useCancelFollowRequest } from '../hooks/useSocialMutations';
import { useOutgoingFollowRequests } from '../hooks/useSocialReads';
import type { SocialRelationship } from '../types';

interface FollowButtonProps {
    userId: string;
    relationship: SocialRelationship;
    isPrivate: boolean;
    size?: 'sm' | 'md';
}

export function FollowButton({ userId, relationship, isPrivate, size = 'md' }: FollowButtonProps) {
    const [hovered, setHovered] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mutate: follow, isPending: isFollowing } = useFollowUser();
    const { mutate: unfollow, isPending: isUnfollowing } = useUnfollowUser();
    const { data: outgoingRequests } = useOutgoingFollowRequests();
    const { mutate: cancelRequest, isPending: isCancelling } = useCancelFollowRequest();

    if (relationship === 'self') return null;

    if (relationship === 'following') {
        const showUnfollow = hovered || confirming;

        const handleClick = () => {
            if (!showUnfollow) { setConfirming(true); return; }
            setError(null);
            unfollow(userId, { onError: (err) => { setError(getErrorMessage(err, 'Failed to unfollow.')); setConfirming(false); } });
        };

        return (
            <div className="inline-flex flex-col items-end gap-1">
                <Button
                    variant={showUnfollow ? 'danger' : 'secondary'}
                    size={size}
                    className="gap-1.5"
                    loading={isUnfollowing}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleClick}
                >
                    {!isUnfollowing && (showUnfollow ? null : <Check className="h-4 w-4" aria-hidden="true" />)}
                    {showUnfollow ? 'Unfollow' : 'Following'}
                </Button>
                {error && <p className="text-xs text-error">{error}</p>}
            </div>
        );
    }

    if (relationship === 'outgoing-request-pending') {
        const pendingRequest = outgoingRequests?.find((r) => r.userId === userId);
        return (
            <div className="inline-flex flex-col items-end gap-1">
                <Button
                    variant="secondary"
                    size={size}
                    className="gap-1.5"
                    loading={isCancelling}
                    disabled={!pendingRequest}
                    onClick={() => {
                        if (!pendingRequest) return;
                        setError(null);
                        cancelRequest(pendingRequest.id, { onError: (err) => setError(getErrorMessage(err, 'Failed to cancel request.')) });
                    }}
                >
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Requested
                </Button>
                {error && <p className="text-xs text-error">{error}</p>}
            </div>
        );
    }

    return (
        <div className="inline-flex flex-col items-end gap-1">
            <Button
                variant="primary"
                size={size}
                className="gap-1.5"
                loading={isFollowing}
                onClick={() => {
                    setError(null);
                    follow(userId, { onError: (err) => setError(getErrorMessage(err, 'Failed to follow.')) });
                }}
            >
                {isPrivate ? <Lock className="h-3.5 w-3.5" aria-hidden="true" /> : <UserPlus className="h-4 w-4" aria-hidden="true" />}
                {isPrivate ? 'Request' : 'Follow'}
            </Button>
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}
