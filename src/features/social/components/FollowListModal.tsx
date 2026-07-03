'use client';

import Link from 'next/link';
import { X, Users } from 'lucide-react';
import { Avatar, EmptyState } from '@/shared/ui';
import { useFollowers, useFollowing } from '../hooks/useSocialReads';
import type { SocialUserSummary } from '../types';

interface Props {
    userId: string;
    mode: 'followers' | 'following';
    open: boolean;
    onClose: () => void;
}

function UserRow({ user, onNavigate }: { user: SocialUserSummary; onNavigate: () => void }) {
    return (
        <Link
            href={`/profile/${user.id}`}
            onClick={onNavigate}
            className="flex items-center gap-3 px-5 py-2.5 hover:bg-surface-100 transition-colors"
        >
            <Avatar displayName={user.displayName} userName={user.userName} avatarUrl={user.profilePictureUrl} size="sm" />
            <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight truncate">{user.displayName}</p>
                <p className="text-xs text-surface-400 leading-tight mt-0.5">@{user.userName}</p>
            </div>
        </Link>
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

    const { data: users, isLoading } = mode === 'followers' ? followersQuery : followingQuery;

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-sm h-[70vh] sm:h-[32rem] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden z-10 flex flex-col"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
                    <h2 className="text-base font-bold text-foreground capitalize">{mode}</h2>
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
                                <UserRow key={user.id} user={user} onNavigate={onClose} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
