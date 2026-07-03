'use client';

import { useState } from 'react';
import { Check, Clock, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui';
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
    const { mutate: follow, isPending: isFollowing } = useFollowUser();
    const { mutate: unfollow, isPending: isUnfollowing } = useUnfollowUser();
    const { data: outgoingRequests } = useOutgoingFollowRequests();
    const { mutate: cancelRequest, isPending: isCancelling } = useCancelFollowRequest();

    if (relationship === 'self') return null;

    if (relationship === 'following') {
        return (
            <Button
                variant={hovered ? 'danger' : 'secondary'}
                size={size}
                className="gap-1.5"
                loading={isUnfollowing}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => unfollow(userId)}
            >
                {!isUnfollowing && (hovered ? null : <Check className="h-4 w-4" aria-hidden="true" />)}
                {hovered ? 'Unfollow' : 'Following'}
            </Button>
        );
    }

    if (relationship === 'outgoing-request-pending') {
        const pendingRequest = outgoingRequests?.find((r) => r.userId === userId);
        return (
            <Button
                variant="secondary"
                size={size}
                className="gap-1.5"
                loading={isCancelling}
                disabled={!pendingRequest}
                onClick={() => pendingRequest && cancelRequest(pendingRequest.id)}
            >
                <Clock className="h-4 w-4" aria-hidden="true" />
                Requested
            </Button>
        );
    }

    return (
        <Button
            variant="primary"
            size={size}
            className="gap-1.5"
            loading={isFollowing}
            onClick={() => follow(userId)}
        >
            {isPrivate ? <Lock className="h-3.5 w-3.5" aria-hidden="true" /> : <UserPlus className="h-4 w-4" aria-hidden="true" />}
            {isPrivate ? 'Request' : 'Follow'}
        </Button>
    );
}
