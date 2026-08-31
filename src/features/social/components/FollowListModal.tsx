'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Users, UserMinus, UserX } from 'lucide-react';
import { Avatar, Button, EmptyState, Modal } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { useFollowers, useFollowing } from '../hooks/useSocialReads';
import { useRemoveFollower, useUnfollowUser } from '../hooks/useSocialMutations';
import type { SocialUserSummary } from '../types';

interface Props {
    userId: string;
    mode: 'followers' | 'following';
    open: boolean;
    onClose: () => void;
}

function UserRow({ user, onNavigate, canRemove, canUnfollow }: { user: SocialUserSummary; onNavigate: () => void; canRemove: boolean; canUnfollow: boolean }) {
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mutate: removeFollower, isPending: removing } = useRemoveFollower();
    const { mutate: unfollowUser, isPending: unfollowing } = useUnfollowUser();

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirming) { setConfirming(true); return; }
        setError(null);
        removeFollower(user.id, {
            onError: (err) => { setError(getErrorMessage(err, 'Failed to remove.')); setConfirming(false); },
        });
    };

    const handleUnfollow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setError(null);
        unfollowUser(user.id, {
            onError: (err) => setError(getErrorMessage(err, 'Failed to unfollow.')),
        });
    };

    return (
        <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-surface-100 transition-colors">
            <Link href={`/profile/${user.id}`} onClick={onNavigate} className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar displayName={user.displayName} userName={user.userName} avatarUrl={user.profilePictureUrl} size="sm" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{user.displayName}</p>
                    <p className="text-xs leading-tight mt-0.5 truncate">
                        {error ? <span className="text-error">{error}</span> : <span className="text-surface-400">@{user.userName}</span>}
                    </p>
                </div>
            </Link>
            {canRemove && (
                <Button
                    size="sm"
                    variant={confirming ? 'danger' : 'secondary'}
                    loading={removing}
                    onClick={handleRemove}
                    className="gap-1 shrink-0"
                >
                    <UserMinus className="h-3.5 w-3.5" aria-hidden="true" />
                    {confirming ? 'Confirm' : 'Remove'}
                </Button>
            )}
            {canUnfollow && (
                <Button
                    size="sm"
                    variant="secondary"
                    loading={unfollowing}
                    onClick={handleUnfollow}
                    className="gap-1 shrink-0"
                >
                    <UserX className="h-3.5 w-3.5" aria-hidden="true" />
                    Unfollow
                </Button>
            )}
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="py-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-2.5 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-surface-200 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-28 bg-surface-200 rounded-full" />
                        <div className="h-2.5 w-20 bg-surface-200 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FollowListModal({ userId, mode, open, onClose }: Props) {
    const followersQuery = useFollowers(mode === 'followers' && open ? userId : null, { pageSize: 50 });
    const followingQuery = useFollowing(mode === 'following' && open ? userId : null, { pageSize: 50 });
    const { data: profile } = useUserProfile();

    const { data: users, isLoading } = mode === 'followers' ? followersQuery : followingQuery;
    // Removing a follower / unfollowing is only possible from your own lists — the
    // backend infers whose list is being edited from the caller's identity.
    const isOwnList = Boolean(profile && profile.id === userId);
    const canRemove = mode === 'followers' && isOwnList;
    const canUnfollow = mode === 'following' && isOwnList;

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-sm" className="h-[70vh] sm:h-[32rem] flex flex-col" labelledBy="follow-list-title">
                <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
                    <h2 id="follow-list-title" className="text-base font-bold text-foreground capitalize">{mode}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <ListSkeleton />
                    ) : !users || users.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title={mode === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                            className="py-12"
                        />
                    ) : (
                        <div className="py-1.5">
                            {users.map((user) => (
                                <UserRow key={user.id} user={user} onNavigate={onClose} canRemove={canRemove} canUnfollow={canUnfollow} />
                            ))}
                        </div>
                    )}
                </div>
        </Modal>
    );
}
