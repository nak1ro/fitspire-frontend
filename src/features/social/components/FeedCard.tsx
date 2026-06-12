'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Trophy, Send } from 'lucide-react';
import type { FeedItem } from '../types';
import { useTogglePostLike, useCommentOnPost } from '../hooks/useSocialMutations';
import { WorkoutSummaryBlock } from './WorkoutSummaryBlock';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
}

function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, avatarUrl, size = 9 }: { name: string; avatarUrl?: string | null; size?: number }) {
    const px = size * 4; // Tailwind rem → px approximation for inline
    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                className={`w-${size} h-${size} rounded-full object-cover shrink-0`}
            />
        );
    }
    return (
        <div
            className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold shrink-0`}
            style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: '#059669', minWidth: `${px/4}rem`, minHeight: `${px/4}rem` }}
        >
            {getInitials(name)}
        </div>
    );
}

// ─── Goal block ────────────────────────────────────────────────────────────────

function GoalAchievedBlock({ content }: { content?: string | null }) {
    return (
        <div
            className="rounded-xl border mt-3 overflow-hidden"
            style={{ borderColor: 'rgba(184,134,11,0.22)' }}
        >
            <div
                className="flex items-center gap-2.5 px-3.5 py-3"
                style={{ background: 'rgba(184,134,11,0.06)' }}
            >
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(184,134,11,0.10)' }}
                >
                    <Trophy className="h-4 w-4" style={{ color: '#B8860B' }} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold" style={{ color: '#B8860B' }}>Goal Achieved!</p>
                    {content && (
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(184,134,11,0.70)' }}>{content}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Comment row ───────────────────────────────────────────────────────────────

function CommentRow({ userName, avatarUrl, content }: { userName: string; avatarUrl?: string | null; content: string }) {
    return (
        <div className="flex items-start gap-2">
            <Avatar name={userName} avatarUrl={avatarUrl} size={6} />
            <div className="min-w-0 rounded-xl bg-background px-3 py-2 flex-1">
                <span className="text-xs font-semibold text-foreground">{userName} </span>
                <span className="text-xs text-surface-600">{content}</span>
            </div>
        </div>
    );
}

// ─── Main card ─────────────────────────────────────────────────────────────────

export function FeedCard({ item }: { item: FeedItem }) {
    const [liked, setLiked] = useState(item.isLikedByCurrentUser);
    const [likesCount, setLikesCount] = useState(item.likesCount);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentText, setCommentText] = useState('');

    const { mutate: toggleLike } = useTogglePostLike();
    const { mutate: postComment, isPending: isSendingComment } = useCommentOnPost();

    const handleLike = () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikesCount(c => c + (wasLiked ? -1 : 1));
        toggleLike(item.id, {
            onError: () => {
                setLiked(wasLiked);
                setLikesCount(c => c + (wasLiked ? 1 : -1));
            },
        });
    };

    const handleSendComment = () => {
        if (!commentText.trim()) return;
        postComment(
            { postId: item.id, data: { content: commentText.trim() } },
            { onSuccess: () => setCommentText('') }
        );
    };

    return (
        <article className="rounded-2xl border border-surface-200 bg-surface overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-0">
                <Avatar name={item.userName} avatarUrl={item.userAvatarUrl} size={9} />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground leading-tight">{item.userName}</p>
                    <p className="text-[11px] text-surface-400 leading-tight mt-0.5">
                        {formatRelativeTime(item.createdAt)}
                    </p>
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
                            className="h-[18px] w-[18px] transition-transform active:scale-125"
                            style={{
                                color: liked ? '#059669' : 'var(--color-surface-500)',
                                fill: liked ? '#059669' : 'none',
                            }}
                            aria-hidden="true"
                        />
                        <span
                            className="text-xs font-medium tabular-nums"
                            style={{ color: liked ? '#059669' : 'var(--color-surface-500)' }}
                        >
                            {likesCount}
                        </span>
                    </button>

                    {/* Comment toggle */}
                    <button
                        onClick={() => setShowCommentBox(v => !v)}
                        className="flex items-center gap-1.5 transition-all hover:opacity-70"
                        aria-label="Comment on post"
                    >
                        <MessageCircle
                            className="h-[18px] w-[18px]"
                            style={{ color: 'var(--color-surface-500)' }}
                            aria-hidden="true"
                        />
                        <span className="text-xs font-medium text-surface-500 tabular-nums">
                            {item.commentsCount}
                        </span>
                    </button>
                </div>
            </div>

            {/* Recent comments */}
            {item.recentComments.length > 0 && (
                <div className="px-4 pt-3 pb-0 space-y-2">
                    {item.recentComments.map(c => (
                        <CommentRow
                            key={c.id}
                            userName={c.userName}
                            avatarUrl={c.userAvatarUrl}
                            content={c.content}
                        />
                    ))}
                    {item.commentsCount > item.recentComments.length && (
                        <button className="text-xs font-medium text-primary-500 hover:opacity-70 transition-opacity pl-8">
                            View all {item.commentsCount} comments
                        </button>
                    )}
                </div>
            )}

            {/* Inline comment box */}
            {showCommentBox && (
                <div className="px-4 pt-3 pb-0">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: '#059669' }}
                        >
                            Me
                        </div>
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
                                    <Send className="h-4 w-4" style={{ color: '#059669' }} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom padding */}
            <div className="h-4" />
        </article>
    );
}
