'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/shared/ui';
import { usePost } from '../hooks/useSocialFeed';
import { PostDetailContent } from './PostDetailContent';

function ModalSkeleton() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 rounded-full border-2 border-surface-300 border-t-primary-500 animate-spin" />
        </div>
    );
}

function ModalError() {
    return (
        <div className="flex flex-col items-center justify-center gap-1 px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground">Couldn&apos;t load this post</p>
            <p className="text-xs text-surface-400">It may have been deleted, or you don&apos;t have access to it.</p>
        </div>
    );
}

interface PostDetailModalProps {
    postId: string | null;
    open: boolean;
    onClose: () => void;
    onDeleted?: () => void;
    autoFocusComment?: boolean;
}

// Plain prop-driven modal — deliberately has no route/searchParams coupling of its own, so it opens
// identically no matter which page renders it. Next.js's intercepting-route convention only fires
// for navigations that originate within the layout tree that declares the @modal slot (just /feed),
// so relying on it here caused every other FeedCard usage (saved posts, profiles) to fall back to a
// full page instead of a modal. See RoutedPostDetailModal for the /feed intercepted-route wrapper.
export function PostDetailModal({ postId, open, onClose, onDeleted, autoFocusComment = false }: PostDetailModalProps) {
    // Kept alive through the close animation so the panel doesn't go blank while it fades out —
    // postId itself may already be null by the time the caller re-renders after a click.
    const [lastPostId, setLastPostId] = useState(postId);
    useEffect(() => {
        if (postId) setLastPostId(postId);
    }, [postId]);

    const { data: post, isLoading, isError } = usePost(lastPostId);
    const hasMedia = Boolean(post && post.media.length > 0);

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName={hasMedia ? 'sm:max-w-4xl' : 'sm:max-w-lg'} ariaLabel="Post">
            {isLoading && <ModalSkeleton />}
            {isError && <ModalError />}
            {!isLoading && !isError && post && (
                <PostDetailContent post={post} onDeleted={() => onDeleted?.()} onClose={onClose} autoFocusComment={autoFocusComment} />
            )}
        </Modal>
    );
}
