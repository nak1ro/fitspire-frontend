'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { Alert, Avatar, Card, ImageLightbox } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { WorkoutDetailModal } from '@/features/workout/components/WorkoutDetailModal';
import type { FeedItem } from '../types';
import { useDeletePost } from '../hooks/useSocialMutations';
import { usePostEngagement } from '../hooks/usePostEngagement';
import { WorkoutSummaryBlock } from './WorkoutSummaryBlock';
import { GoalSummaryBlock } from './GoalSummaryBlock';
import { PersonalRecordSummaryBlock } from './PersonalRecordSummaryBlock';
import { EditPostModal } from './EditPostModal';
import { LikesModal } from './LikesModal';
import { PostDetailModal } from './PostDetailModal';
import { PostMenu } from './PostMenu';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import { ReportContentDialog } from '@/features/moderation/components/ReportContentDialog';
import { ReportTrigger } from '@/features/moderation/components/ReportTrigger';

// ─── Main card ─────────────────────────────────────────────────────────────────

export function FeedCard({ item, onDeleted }: { item: FeedItem; onDeleted?: () => void }) {
    const [editOpen, setEditOpen] = useState(false);
    const [likesModalOpen, setLikesModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [reportPostOpen, setReportPostOpen] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [focusComment, setFocusComment] = useState(false);

    const openDetail = (withFocusComment = false) => {
        setFocusComment(withFocusComment);
        setDetailOpen(true);
    };
    const closeDetail = () => setDetailOpen(false);

    const { data: profile } = useUserProfile();
    const { liked, likesCount, toggleLike, saved, toggleSave } = usePostEngagement(item);
    const { mutate: deletePost, isPending: deleting } = useDeletePost();

    const isOwner = Boolean(profile && profile.id === item.userId);
    const canReport = Boolean(profile && !isOwner);

    const handleDelete = () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        setDeleteError(null);
        deletePost(item.id, {
            onSuccess: () => onDeleted?.(),
            onError: (err) => { setDeleteError(getErrorMessage(err, 'Failed to delete post.')); setConfirmDelete(false); },
        });
    };

    return (
        <Card padding="none" className="overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-0">
                <Link href={`/profile/${item.userId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                    <Avatar displayName={item.userName} userName={item.userName} avatarUrl={item.userAvatarUrl} size="md" />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link href={`/profile/${item.userId}`} className="text-sm font-semibold text-foreground leading-tight hover:underline">
                        {item.userName}
                    </Link>
                    <button type="button" onClick={() => openDetail()} className="text-[11px] text-surface-400 leading-tight mt-0.5 hover:underline block w-fit cursor-pointer">
                        {formatRelativeTime(item.createdAt)}
                    </button>
                </div>
                {(isOwner || canReport) && <PostMenu isOwner={isOwner} canEdit={item.type === 'Text'} onEdit={() => setEditOpen(true)} onDelete={handleDelete} onReport={() => setReportPostOpen(true)} />}
            </div>

            {confirmDelete && (
                <div className="px-4 pt-3">
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-error/5 border border-error/20 px-3.5 py-2.5">
                        <span className="text-xs font-medium text-error">Delete this post? This can&apos;t be undone.</span>
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

            {/* Body */}
            <div className="px-4 pt-3 pb-0">
                {item.type === 'Text' && item.content && (
                    <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
                )}

                {item.type === 'WorkoutShare' && (
                    <>
                        {item.content && (
                            <p className="text-sm text-foreground leading-relaxed mb-2.5">{item.content}</p>
                        )}
                        {item.workoutSummary && (
                            <button
                                type="button"
                                onClick={() => setSelectedWorkoutId(item.workoutSummary!.id)}
                                className="block w-full text-left transition-opacity hover:opacity-90 cursor-pointer"
                            >
                                <WorkoutSummaryBlock summary={item.workoutSummary} />
                            </button>
                        )}
                    </>
                )}

                {item.type === 'GoalAchieved' && (
                    <>
                        {item.content && (
                            <p className="text-sm text-foreground leading-relaxed mb-2.5">{item.content}</p>
                        )}
                        {item.goalSummary && (
                            <Link
                                href={isOwner ? `/goals/${item.goalSummary.id}` : `/goals/${item.goalSummary.id}?ownerId=${item.userId}`}
                                className="block transition-opacity hover:opacity-90"
                            >
                                <GoalSummaryBlock summary={item.goalSummary} />
                            </Link>
                        )}
                    </>
                )}

                {item.type === 'PersonalRecordAchieved' && (
                    <>
                        {item.content && (
                            <p className="text-sm text-foreground leading-relaxed mb-2.5">{item.content}</p>
                        )}
                        {/* No click-through — unlike Workout/Goal, there's no personal-record detail view to link to. */}
                        {item.personalRecordSummary && (
                            <PersonalRecordSummaryBlock summary={item.personalRecordSummary} />
                        )}
                    </>
                )}

                {item.media.length > 0 && (
                    <div className={item.media.length > 1 ? 'grid grid-cols-2 gap-1.5 mt-3' : 'mt-3'}>
                        {item.media.map(media => {
                            const fullSrc = media.primary?.url ?? media.thumbnail?.url;
                            return (
                                <div key={media.id} className="relative">
                                    {/* Azure SAS media has no stable optimization source or intrinsic dimensions;
                                        the fixed aspect ratio + object-cover keeps every post image the same
                                        bounded size in the feed without stretching it. */}
                                    <button
                                        type="button"
                                        onClick={() => fullSrc && setLightboxSrc(fullSrc)}
                                        className="block w-full aspect-square overflow-hidden rounded-xl bg-surface-100 cursor-pointer"
                                        aria-label="Expand image"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={media.thumbnail?.url ?? media.primary?.url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                    {canReport && (
                                        <div className="absolute right-2 top-2 rounded-lg bg-surface/90">
                                            <ReportTrigger target={{ targetType: 'Media', targetId: media.id, label: 'post image' }} compact />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 pt-3 pb-0">
                {/* Counts summary */}
                {(likesCount > 0 || item.commentsCount > 0) && (
                    <div className="flex items-center gap-4 border-t border-surface-100 pt-3 pb-3 text-xs text-surface-400">
                        {likesCount > 0 && (
                            <button
                                onClick={() => setLikesModalOpen(true)}
                                className="flex items-center gap-1.5 hover:underline cursor-pointer"
                                aria-label="See who liked this post"
                            >
                                <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary-500">
                                    <Heart className="h-2.5 w-2.5 text-white fill-white" aria-hidden="true" />
                                </span>
                                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                            </button>
                        )}
                        {item.commentsCount > 0 && (
                            <button type="button" onClick={() => openDetail()} className="flex items-center gap-1.5 hover:underline cursor-pointer">
                                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                {item.commentsCount} {item.commentsCount === 1 ? 'comment' : 'comments'}
                            </button>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className={cn('grid grid-cols-3', likesCount === 0 && item.commentsCount === 0 && 'border-t border-surface-100 pt-3')}>
                    <button
                        onClick={toggleLike}
                        className={cn(
                            'flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-surface-100 cursor-pointer',
                            liked ? 'text-primary-500' : 'text-surface-500'
                        )}
                        aria-label={liked ? 'Unlike post' : 'Like post'}
                    >
                        <Heart className={cn('h-[18px] w-[18px] transition-transform active:scale-125', liked && 'fill-primary-500')} aria-hidden="true" />
                        Like
                    </button>

                    <button
                        onClick={() => openDetail(true)}
                        className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-surface-500 hover:bg-surface-100 transition-colors cursor-pointer"
                        aria-label="Comment on post"
                    >
                        <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
                        Comment
                    </button>

                    <button
                        onClick={toggleSave}
                        className={cn(
                            'flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-surface-100 cursor-pointer',
                            saved ? 'text-primary-500' : 'text-surface-500'
                        )}
                        aria-label={saved ? 'Unsave post' : 'Save post'}
                    >
                        <Bookmark className={cn('h-[18px] w-[18px] transition-transform active:scale-125', saved && 'fill-primary-500')} aria-hidden="true" />
                        Save
                    </button>
                </div>
            </div>

            {/* Bottom padding */}
            <div className="h-4" />

            <EditPostModal postId={item.id} initialContent={item.content ?? ''} open={editOpen} onClose={() => setEditOpen(false)} />
            <LikesModal target={{ kind: 'post', postId: item.id }} open={likesModalOpen} onClose={() => setLikesModalOpen(false)} />
            <ReportContentDialog target={{ targetType: 'Post', targetId: item.id, label: 'post' }} open={reportPostOpen} onClose={() => setReportPostOpen(false)} />
            <ImageLightbox src={lightboxSrc ?? ''} open={Boolean(lightboxSrc)} onClose={() => setLightboxSrc(null)} />
            <WorkoutDetailModal workoutId={selectedWorkoutId} ownerId={item.userId} onClose={() => setSelectedWorkoutId(null)} />
            <PostDetailModal
                postId={item.id}
                open={detailOpen}
                onClose={closeDetail}
                onDeleted={() => { closeDetail(); onDeleted?.(); }}
                autoFocusComment={focusComment}
            />
        </Card>
    );
}
