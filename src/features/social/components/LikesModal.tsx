'use client';

import Link from 'next/link';
import { X, Heart } from 'lucide-react';
import { Avatar, EmptyState, Modal } from '@/shared/ui';
import { usePostLikes, useCommentLikes } from '../hooks/useSocialReads';
import type { SocialUserSummary } from '../types';

type Target =
    | { kind: 'post'; postId: string }
    | { kind: 'comment'; postId: string; commentId: string };

interface Props {
    target: Target;
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
            {[1, 2, 3].map((i) => (
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

export function LikesModal({ target, open, onClose }: Props) {
    const postLikesQuery = usePostLikes(target.kind === 'post' && open ? target.postId : null, { pageSize: 50 });
    const commentLikesQuery = useCommentLikes(
        target.kind === 'comment' && open ? target.postId : null,
        target.kind === 'comment' && open ? target.commentId : null,
        { pageSize: 50 }
    );

    const { data: users, isLoading } = target.kind === 'post' ? postLikesQuery : commentLikesQuery;

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-sm" className="h-[70vh] sm:h-[32rem] flex flex-col" labelledBy="likes-title">
                <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
                    <h2 id="likes-title" className="text-base font-bold text-foreground">Likes</h2>
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
                        <EmptyState icon={Heart} title="No likes yet" className="py-12" />
                    ) : (
                        <div className="py-1.5">
                            {users.map((user) => (
                                <UserRow key={user.id} user={user} onNavigate={onClose} />
                            ))}
                        </div>
                    )}
                </div>
        </Modal>
    );
}
