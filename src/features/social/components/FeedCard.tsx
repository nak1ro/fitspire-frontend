'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Heart, MessageCircle, Send, Trophy } from 'lucide-react';
import { Avatar, Card, IconChip } from '@/shared/ui';
import type { FeedItem } from '../types';
import { useLikePost, useUnlikePost, useCommentOnPost, useSavePost, useUnsavePost } from '../hooks/useSocialMutations';
import { WorkoutSummaryBlock } from './WorkoutSummaryBlock';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';

// ─── Goal block ────────────────────────────────────────────────────────────────

function GoalAchievedBlock({ content }: { content?: string | null }) {
    return (
        <div className="rounded-xl border border-warning/25 mt-3 overflow-hidden">
            <div className="flex items-center gap-2.5 px-3.5 py-3 bg-warning/5">
                <IconChip icon={Trophy} size="sm" variant="warning" />
                <div className="min-w-0">
                    <p className="text-sm font-bold text-warning">Goal Achieved!</p>
                    {content && (
                        <p className="text-xs mt-0.5 text-warning/70">{content}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Comment row ───────────────────────────────────────────────────────────────

function CommentRow({ userId, userName, avatarUrl, content }: { userId: string; userName: string; avatarUrl?: string | null; content: string }) {
    return (
        <div className="flex items-start gap-2">
            <Link href={`/profile/${userId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                <Avatar displayName={userName} userName={userName} avatarUrl={avatarUrl} size="xs" />
            </Link>
            <div className="min-w-0 rounded-xl bg-background px-3 py-2 flex-1">
                <Link href={`/profile/${userId}`} className="text-xs font-semibold text-foreground hover:underline">{userName} </Link>
                <span className="text-xs text-surface-600">{content}</span>
            </div>
        </div>
    );
}

// ─── Main card ─────────────────────────────────────────────────────────────────

export function FeedCard({ item }: { item: FeedItem }) {
    const [liked, setLiked] = useState(item.isLikedByCurrentUser);
    const [likesCount, setLikesCount] = useState(item.likesCount);
    const [saved, setSaved] = useState(item.isSavedByCurrentUser);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentText, setCommentText] = useState('');

    const { mutate: likePost } = useLikePost();
    const { mutate: unlikePost } = useUnlikePost();
    const { mutate: savePost } = useSavePost();
    const { mutate: unsavePost } = useUnsavePost();
    const { mutate: postComment, isPending: isSendingComment } = useCommentOnPost();

    const handleLike = () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikesCount(c => c + (wasLiked ? -1 : 1));
        const mutateLike = wasLiked ? unlikePost : likePost;
        mutateLike(item.id, {
            onError: () => {
                setLiked(wasLiked);
                setLikesCount(c => c + (wasLiked ? 1 : -1));
            },
        });
    };

    const handleSave = () => {
        const wasSaved = saved;
        setSaved(!wasSaved);
        const mutateSave = wasSaved ? unsavePost : savePost;
        mutateSave(item.id, { onError: () => setSaved(wasSaved) });
    };

    const handleSendComment = () => {
        if (!commentText.trim()) return;
        postComment(
            { postId: item.id, data: { content: commentText.trim() } },
            { onSuccess: () => setCommentText('') }
        );
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
                    <Link href={`/feed/${item.id}`} className="text-[11px] text-surface-400 leading-tight mt-0.5 hover:underline block w-fit">
                        {formatRelativeTime(item.createdAt)}
                    </Link>
                </div>
            </div>

            {/* Body */}
            <div className="px-4 pt-3 pb-0">
                {item.type === 'Text' && item.content && (
                    <p className="text-sm text-foreground leading-relaxed">{item.content}</p>
                )}

                {item.type === 'WorkoutShare' && (
                    <>
                        {item.workoutSummary && <WorkoutSummaryBlock summary={item.workoutSummary} />}
                        {item.content && (
                            <p className="text-sm text-surface-600 mt-2.5 leading-relaxed">{item.content}</p>
                        )}
                    </>
                )}

                {item.type === 'GoalAchieved' && (
                    <GoalAchievedBlock content={item.content} />
                )}

                {item.media.length > 0 && (
                    <div className={item.media.length > 1 ? 'grid grid-cols-2 gap-1.5 mt-3' : 'mt-3'}>
                        {item.media.map(media => (
                            <img
                                key={media.id}
                                src={media.primary?.url ?? media.thumbnail?.url}
                                alt=""
                                className="w-full rounded-xl object-cover max-h-96"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 pt-3 pb-0">
                <div className="flex items-center gap-4 border-t border-surface-100 pt-3">

                    {/* Like */}
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 transition-all hover:opacity-70"
                        aria-label={liked ? 'Unlike post' : 'Like post'}
                    >
                        <Heart
                            className={liked ? 'h-[18px] w-[18px] transition-transform active:scale-125 text-primary-500 fill-primary-500' : 'h-[18px] w-[18px] transition-transform active:scale-125 text-surface-500'}
                            aria-hidden="true"
                        />
                        <span className={liked ? 'text-xs font-medium tabular-nums text-primary-500' : 'text-xs font-medium tabular-nums text-surface-500'}>
                            {likesCount}
                        </span>
                    </button>

                    {/* Comment toggle */}
                    <button
                        onClick={() => setShowCommentBox(v => !v)}
                        className="flex items-center gap-1.5 transition-all hover:opacity-70"
                        aria-label="Comment on post"
                    >
                        <MessageCircle className="h-[18px] w-[18px] text-surface-500" aria-hidden="true" />
                        <span className="text-xs font-medium text-surface-500 tabular-nums">
                            {item.commentsCount}
                        </span>
                    </button>

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        className="ml-auto transition-all hover:opacity-70"
                        aria-label={saved ? 'Unsave post' : 'Save post'}
                    >
                        <Bookmark
                            className={saved ? 'h-[18px] w-[18px] transition-transform active:scale-125 text-primary-500 fill-primary-500' : 'h-[18px] w-[18px] transition-transform active:scale-125 text-surface-500'}
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>

            {/* Recent comments */}
            {item.recentComments.length > 0 && (
                <div className="px-4 pt-3 pb-0 space-y-2">
                    {item.recentComments.map(c => (
                        <CommentRow
                            key={c.id}
                            userId={c.userId}
                            userName={c.userName}
                            avatarUrl={c.userAvatarUrl}
                            content={c.content}
                        />
                    ))}
                </div>
            )}

            {/* Inline comment box */}
            {showCommentBox && (
                <div className="px-4 pt-3 pb-0">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 shrink-0" aria-hidden="true" />
                        <div className="flex-1 flex items-center gap-2 rounded-xl bg-background border border-surface-200 px-3 py-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSendComment(); }}
                                placeholder="Add a comment…"
                                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none"
                            />
                            {commentText.trim() && (
                                <button
                                    onClick={handleSendComment}
                                    disabled={isSendingComment}
                                    className="shrink-0 transition-opacity hover:opacity-70 disabled:opacity-40"
                                    aria-label="Send comment"
                                >
                                    <Send className="h-4 w-4 text-primary-500" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom padding */}
            <div className="h-4" />
        </Card>
    );
}
