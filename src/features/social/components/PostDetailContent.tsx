'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, ChevronLeft, ChevronRight, Heart, MessageCircle, X } from 'lucide-react';
import { Alert, Avatar } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { WorkoutDetailModal } from '@/features/workout/components/WorkoutDetailModal';
import { useDeletePost } from '../hooks/useSocialMutations';
import { usePostEngagement } from '../hooks/usePostEngagement';
import type { FeedItem } from '../types';
import { WorkoutSummaryBlock } from './WorkoutSummaryBlock';
import { GoalSummaryBlock } from './GoalSummaryBlock';
import { EditPostModal } from './EditPostModal';
import { LikesModal } from './LikesModal';
import { PostMenu } from './PostMenu';
import { PostComments } from './PostComments';
import { ReportContentDialog } from '@/features/moderation/components/ReportContentDialog';

function MediaCarousel({ media }: { media: FeedItem['media'] }) {
    const [index, setIndex] = useState(0);
    const active = media[index];
    const src = active.primary?.url ?? active.thumbnail?.url;

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-contain" />
            {media.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => setIndex(i => (i - 1 + media.length) % media.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIndex(i => (i + 1) % media.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {media.map((m, i) => (
                            <span key={m.id} className={cn('h-1.5 w-1.5 rounded-full', i === index ? 'bg-white' : 'bg-white/40')} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export function PostDetailContent({
    post,
    onDeleted,
    onClose,
    autoFocusComment,
}: {
    post: FeedItem;
    onDeleted?: () => void;
    /** Renders a close button in the header — only relevant when embedded in the modal, not the full-page fallback. */
    onClose?: () => void;
    autoFocusComment?: boolean;
}) {
    const [editOpen, setEditOpen] = useState(false);
    const [likesModalOpen, setLikesModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [reportPostOpen, setReportPostOpen] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    const { data: profile } = useUserProfile();
    const { liked, likesCount, toggleLike, saved, toggleSave } = usePostEngagement(post);
    const { mutate: deletePost, isPending: deleting } = useDeletePost();

    const isOwner = Boolean(profile && profile.id === post.userId);
    const canReport = Boolean(profile && !isOwner);
    const hasMedia = post.media.length > 0;

    const handleDelete = () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        setDeleteError(null);
        deletePost(post.id, {
            onSuccess: () => onDeleted?.(),
            onError: (err) => { setDeleteError(getErrorMessage(err, 'Failed to delete post.')); setConfirmDelete(false); },
        });
    };

    return (
        <div className={cn('flex flex-col md:flex-row w-full min-h-0', hasMedia ? 'h-[70vh]' : 'max-h-[85vh]')}>
            {hasMedia && (
                <div className="relative w-full md:flex-1 aspect-square md:aspect-auto md:h-full shrink-0 min-h-0">
                    <MediaCarousel media={post.media} />
                </div>
            )}

            <div className={cn('flex flex-col min-h-0 flex-1 bg-surface', hasMedia && 'md:w-[380px] md:max-w-[380px] md:flex-none')}>
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-100 shrink-0">
                    <Link href={`/profile/${post.userId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                        <Avatar displayName={post.userName} userName={post.userName} avatarUrl={post.userAvatarUrl} size="md" />
                    </Link>
                    <div className="min-w-0 flex-1">
                        <Link href={`/profile/${post.userId}`} className="text-sm font-semibold text-foreground leading-tight hover:underline">
                            {post.userName}
                        </Link>
                        <p className="text-[11px] text-surface-400 leading-tight mt-0.5">{formatRelativeTime(post.createdAt)}</p>
                    </div>
                    {(isOwner || canReport) && (
                        <PostMenu isOwner={isOwner} canEdit={post.type === 'Text'} onEdit={() => setEditOpen(true)} onDelete={handleDelete} onReport={() => setReportPostOpen(true)} />
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-foreground hover:bg-surface-100 transition-all shrink-0 cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                </div>

                {confirmDelete && (
                    <div className="px-4 pt-3 shrink-0">
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-error/5 border border-error/20 px-3.5 py-2.5">
                            <span className="text-xs font-medium text-error">Delete this post?</span>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={handleDelete} disabled={deleting} className="text-xs font-bold text-error hover:opacity-70 disabled:opacity-50 cursor-pointer disabled:cursor-default">
                                    {deleting ? 'Deleting…' : 'Delete'}
                                </button>
                                <button onClick={() => setConfirmDelete(false)} className="text-xs font-bold text-surface-500 hover:text-foreground cursor-pointer">
                                    Cancel
                                </button>
                            </div>
                        </div>
                        {deleteError && <div className="mt-2"><Alert variant="error">{deleteError}</Alert></div>}
                    </div>
                )}

                {/* Scrollable body: caption + summary blocks + comments */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {(post.content || post.workoutSummary || post.goalSummary || !hasMedia) && (
                        <div className="px-4 pt-3 pb-14">
                            {post.content && <p className="text-base text-foreground leading-relaxed">{post.content}</p>}
                            {post.workoutSummary && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedWorkoutId(post.workoutSummary!.id)}
                                    className="block w-full text-left transition-opacity hover:opacity-90 cursor-pointer"
                                >
                                    <WorkoutSummaryBlock summary={post.workoutSummary} />
                                </button>
                            )}
                            {post.goalSummary && (
                                <Link
                                    href={isOwner ? `/goals/${post.goalSummary.id}` : `/goals/${post.goalSummary.id}?ownerId=${post.userId}`}
                                    className="block transition-opacity hover:opacity-90"
                                >
                                    <GoalSummaryBlock summary={post.goalSummary} />
                                </Link>
                            )}
                        </div>
                    )}

                    <div className="px-4 pb-4">
                        <PostComments postId={post.id} postOwnerUserId={post.userId} variant="bare" autoFocus={autoFocusComment} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 px-4 py-3 border-t border-surface-100 shrink-0">
                    <button onClick={toggleLike} className="transition-all hover:opacity-70 cursor-pointer" aria-label={liked ? 'Unlike post' : 'Like post'}>
                        <Heart className={cn('h-[22px] w-[22px] transition-transform active:scale-125', liked ? 'text-primary-500 fill-primary-500' : 'text-surface-500')} aria-hidden="true" />
                    </button>
                    <MessageCircle className="h-[22px] w-[22px] text-surface-500" aria-hidden="true" />
                    <button onClick={toggleSave} className="ml-auto transition-all hover:opacity-70 cursor-pointer" aria-label={saved ? 'Unsave post' : 'Save post'}>
                        <Bookmark className={cn('h-[22px] w-[22px] transition-transform active:scale-125', saved ? 'text-primary-500 fill-primary-500' : 'text-surface-500')} aria-hidden="true" />
                    </button>
                </div>
                <button
                    onClick={() => setLikesModalOpen(true)}
                    disabled={likesCount === 0}
                    className="px-4 pb-3 text-xs font-semibold text-foreground text-left hover:underline disabled:no-underline cursor-pointer disabled:cursor-default shrink-0"
                >
                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </button>
            </div>

            <EditPostModal postId={post.id} initialContent={post.content ?? ''} open={editOpen} onClose={() => setEditOpen(false)} />
            <LikesModal target={{ kind: 'post', postId: post.id }} open={likesModalOpen} onClose={() => setLikesModalOpen(false)} />
            <ReportContentDialog target={{ targetType: 'Post', targetId: post.id, label: 'post' }} open={reportPostOpen} onClose={() => setReportPostOpen(false)} />
            <WorkoutDetailModal workoutId={selectedWorkoutId} ownerId={post.userId} onClose={() => setSelectedWorkoutId(null)} />
        </div>
    );
}
