'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import { Avatar, Button, Card } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import { usePostComments, useCommentReplies } from '../hooks/useSocialReads';
import {
    useCommentOnPost,
    useUpdateComment,
    useDeleteComment,
    useLikeComment,
    useUnlikeComment,
} from '../hooks/useSocialMutations';
import { LikesModal } from './LikesModal';
import type { CommentResponse } from '../types';

function useOptimisticCommentLike(comment: CommentResponse, postId: string) {
    const [liked, setLiked] = useState(comment.isLikedByCurrentUser);
    const [count, setCount] = useState(comment.likesCount);
    const { mutate: likeComment } = useLikeComment();
    const { mutate: unlikeComment } = useUnlikeComment();

    const toggle = () => {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setCount(c => c + (wasLiked ? -1 : 1));
        const mutateLike = wasLiked ? unlikeComment : likeComment;
        mutateLike({ postId, commentId: comment.id }, {
            onError: () => {
                setLiked(wasLiked);
                setCount(c => c + (wasLiked ? 1 : -1));
            },
        });
    };

    return { liked, count, toggle };
}

function CommentItem({
    comment,
    postId,
    currentUserId,
    postOwnerUserId,
    onReply,
}: {
    comment: CommentResponse;
    postId: string;
    currentUserId?: string;
    postOwnerUserId?: string;
    onReply: (comment: CommentResponse) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [likesModalOpen, setLikesModalOpen] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { liked, count, toggle } = useOptimisticCommentLike(comment, postId);
    const { mutate: updateComment, isPending: saving } = useUpdateComment();
    const { mutate: deleteComment, isPending: deleting } = useDeleteComment();

    // Editing is author-only; deleting is also allowed for the post owner (moderation),
    // matching Comment.CanBeDeletedBy on the backend.
    const isAuthor = Boolean(currentUserId && currentUserId === comment.userId);
    const canDelete = isAuthor || Boolean(currentUserId && currentUserId === postOwnerUserId);
    const isReply = Boolean(comment.rootCommentId);

    const handleSaveEdit = () => {
        const trimmed = editContent.trim();
        if (!trimmed) return;
        setError(null);
        updateComment(
            { postId, commentId: comment.id, data: { content: trimmed } },
            {
                onSuccess: () => setEditing(false),
                onError: (err) => setError(getErrorMessage(err, 'Failed to update comment.')),
            }
        );
    };

    const handleDelete = () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        setError(null);
        deleteComment(
            { postId, commentId: comment.id },
            { onError: (err) => { setError(getErrorMessage(err, 'Failed to delete comment.')); setConfirmDelete(false); } }
        );
    };

    return (
        <div className={isReply ? 'flex items-start gap-2.5 pl-9' : 'flex items-start gap-2.5'}>
            <Link href={`/profile/${comment.userId}`} className="shrink-0 hover:opacity-80 transition-opacity">
                <Avatar displayName={comment.userName} userName={comment.userName} avatarUrl={comment.userAvatarUrl} size={isReply ? 'xs' : 'sm'} />
            </Link>
            <div className="min-w-0 flex-1 space-y-1">
                <div className="rounded-xl bg-background px-3.5 py-2.5">
                    <Link href={`/profile/${comment.userId}`} className="text-xs font-semibold text-foreground hover:underline">
                        {comment.userName}
                    </Link>
                    {comment.replyToUser && (
                        <span className="text-xs text-surface-400">
                            {' '}→{' '}
                            <Link href={`/profile/${comment.replyToUser.id}`} className="font-semibold hover:underline">
                                @{comment.replyToUser.userName}
                            </Link>
                        </span>
                    )}

                    {editing ? (
                        <div className="mt-1.5 space-y-2">
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                rows={2}
                                className="w-full resize-none rounded-lg bg-surface border border-surface-200 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary-500 transition-colors"
                            />
                            <div className="flex gap-2">
                                <Button size="sm" loading={saving} disabled={!editContent.trim()} onClick={handleSaveEdit}>Save</Button>
                                <Button size="sm" variant="secondary" onClick={() => { setEditing(false); setEditContent(comment.content); }}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-surface-700 mt-0.5">{comment.content}</p>
                    )}
                </div>

                {error && <p className="text-xs text-error px-1">{error}</p>}

                {!editing && (
                    <div className="flex items-center gap-3 px-1">
                        <span className="text-[11px] text-surface-400">{formatRelativeTime(comment.createdAt)}</span>
                        <button onClick={toggle} className={`text-[11px] font-semibold hover:opacity-70 ${liked ? 'text-primary-500' : 'text-surface-500'}`}>
                            {liked ? 'Liked' : 'Like'}
                        </button>
                        {count > 0 && (
                            <button onClick={() => setLikesModalOpen(true)} className="text-[11px] text-surface-400 hover:underline">
                                {count} {count === 1 ? 'like' : 'likes'}
                            </button>
                        )}
                        <button onClick={() => onReply(comment)} className="text-[11px] font-semibold text-surface-500 hover:text-foreground transition-colors">
                            Reply
                        </button>
                        {isAuthor && (
                            <button onClick={() => setEditing(true)} className="text-[11px] font-semibold text-surface-500 hover:text-foreground transition-colors">
                                Edit
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className={`text-[11px] font-semibold transition-colors disabled:opacity-50 ${confirmDelete ? 'text-error' : 'text-surface-500 hover:text-error'}`}
                            >
                                {confirmDelete ? (deleting ? 'Deleting…' : 'Confirm delete') : 'Delete'}
                            </button>
                        )}
                    </div>
                )}

                {!isReply && comment.repliesCount > 0 && (
                    <button
                        onClick={() => setShowReplies(v => !v)}
                        className="text-[11px] font-semibold text-surface-400 hover:text-foreground transition-colors px-1"
                    >
                        {showReplies ? 'Hide replies' : `View ${comment.repliesCount} ${comment.repliesCount === 1 ? 'reply' : 'replies'}`}
                    </button>
                )}

                {!isReply && showReplies && (
                    <RepliesList
                        postId={postId}
                        rootCommentId={comment.id}
                        currentUserId={currentUserId}
                        postOwnerUserId={postOwnerUserId}
                        onReply={onReply}
                    />
                )}
            </div>

            <LikesModal target={{ kind: 'comment', postId, commentId: comment.id }} open={likesModalOpen} onClose={() => setLikesModalOpen(false)} />
        </div>
    );
}

function RepliesList({
    postId,
    rootCommentId,
    currentUserId,
    postOwnerUserId,
    onReply,
}: {
    postId: string;
    rootCommentId: string;
    currentUserId?: string;
    postOwnerUserId?: string;
    onReply: (comment: CommentResponse) => void;
}) {
    const { data: replies, isLoading } = useCommentReplies(postId, rootCommentId, { pageSize: 50 });

    if (isLoading) {
        return <p className="text-xs text-surface-400 pl-9 mt-2">Loading replies…</p>;
    }

    return (
        <div className="space-y-3 mt-2">
            {(replies ?? []).map(reply => (
                <CommentItem key={reply.id} comment={reply} postId={postId} currentUserId={currentUserId} postOwnerUserId={postOwnerUserId} onReply={onReply} />
            ))}
        </div>
    );
}

export function PostComments({ postId, postOwnerUserId }: { postId: string; postOwnerUserId?: string }) {
    const { data: profile } = useUserProfile();
    const { data: comments, isLoading, isError } = usePostComments(postId, { pageSize: 50 });
    const { mutate: postComment, isPending: isSending } = useCommentOnPost();
    const [commentText, setCommentText] = useState('');
    const [replyTarget, setReplyTarget] = useState<CommentResponse | null>(null);

    const handleSubmit = () => {
        const trimmed = commentText.trim();
        if (!trimmed) return;
        postComment(
            { postId, data: { content: trimmed, replyToCommentId: replyTarget?.id ?? null } },
            { onSuccess: () => { setCommentText(''); setReplyTarget(null); } }
        );
    };

    return (
        <Card padding="md" className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Comments</h3>

            {isLoading && <p className="text-sm text-surface-400">Loading comments…</p>}
            {isError && <p className="text-sm text-error">Couldn't load comments.</p>}
            {!isLoading && !isError && (!comments || comments.length === 0) && (
                <p className="text-sm text-surface-400">No comments yet. Be the first to say something.</p>
            )}

            {!isLoading && !isError && comments && comments.length > 0 && (
                <div className="space-y-4">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={postId}
                            currentUserId={profile?.id}
                            postOwnerUserId={postOwnerUserId}
                            onReply={setReplyTarget}
                        />
                    ))}
                </div>
            )}

            <div className="pt-3 border-t border-surface-100 space-y-2">
                {replyTarget && (
                    <div className="flex items-center justify-between text-xs text-surface-500 px-1">
                        <span>Replying to <span className="font-semibold text-foreground">{replyTarget.userName}</span></span>
                        <button onClick={() => setReplyTarget(null)} className="font-semibold hover:text-foreground transition-colors">
                            Cancel
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Avatar displayName={profile?.displayName ?? ''} userName={profile?.userName ?? '...'} avatarUrl={profile?.profilePictureUrl} size="sm" />
                    <div className="flex-1 flex items-center gap-2 rounded-xl bg-background border border-surface-200 px-3 py-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                            placeholder={replyTarget ? `Reply to ${replyTarget.userName}…` : 'Add a comment…'}
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none"
                        />
                        {commentText.trim() && (
                            <button
                                onClick={handleSubmit}
                                disabled={isSending}
                                className="shrink-0 transition-opacity hover:opacity-70 disabled:opacity-40"
                                aria-label="Send comment"
                            >
                                <Send className="h-4 w-4 text-primary-500" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
