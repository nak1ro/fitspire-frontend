'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export function PostDetailModal({ postId }: { postId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: post, isLoading, isError } = usePost(postId);
    const autoFocusComment = searchParams.get('focus') === 'comment';

    // Route-driven modal: start closed and flip open a tick after mount so the
    // shared Modal shell's own enter transition plays (it animates on the
    // open:false→true edge, not on an already-true initial render).
    const [open, setOpen] = useState(false);
    useEffect(() => { setOpen(true); }, []);

    const handleClose = () => {
        setOpen(false);
        // Let the shell's exit transition play before actually popping the
        // route — router.back() would otherwise unmount this instantly.
        setTimeout(() => router.back(), 200);
    };

    const hasMedia = Boolean(post && post.media.length > 0);

    return (
        <Modal open={open} onClose={handleClose} maxWidthClassName={hasMedia ? 'sm:max-w-4xl' : 'sm:max-w-lg'} ariaLabel="Post">
            {isLoading && <ModalSkeleton />}
            {isError && <ModalError />}
            {!isLoading && !isError && post && (
                <PostDetailContent post={post} onDeleted={() => router.push('/feed')} onClose={handleClose} autoFocusComment={autoFocusComment} />
            )}
        </Modal>
    );
}
