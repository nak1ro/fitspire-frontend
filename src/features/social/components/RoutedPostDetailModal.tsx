'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PostDetailModal } from './PostDetailModal';

// Wraps the plain PostDetailModal with the router-driven open/close behavior needed specifically
// for /feed's intercepted route: opens on mount (so the shared Modal shell's enter transition
// plays instead of rendering already-open) and pops the intercepted route via router.back() after
// the exit transition finishes, so a shared/bookmarked /feed/[postId] URL still works as expected.
export function RoutedPostDetailModal({ postId }: { postId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const autoFocusComment = searchParams.get('focus') === 'comment';

    const [open, setOpen] = useState(false);
    useEffect(() => { setOpen(true); }, []);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => router.back(), 200);
    };

    return (
        <PostDetailModal
            postId={postId}
            open={open}
            onClose={handleClose}
            onDeleted={() => router.push('/feed')}
            autoFocusComment={autoFocusComment}
        />
    );
}
