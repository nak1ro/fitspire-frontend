'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePost } from '../hooks/useSocialFeed';
import { FeedCard } from './FeedCard';
import { PostComments } from './PostComments';

function DetailSkeleton() {
    return (
        <div className="rounded-2xl border border-surface-200 bg-surface p-4 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-24 rounded-full bg-surface-200" />
                    <div className="h-2.5 w-12 rounded-full bg-surface-200" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-full rounded-full bg-surface-200" />
                <div className="h-3 w-4/5 rounded-full bg-surface-200" />
            </div>
        </div>
    );
}

function PostNotFound() {
    return (
        <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Couldn't load this post</p>
            <p className="text-xs text-surface-400 mt-1">It may have been deleted, or you don't have access to it.</p>
        </div>
    );
}

export function PostDetailView({ postId }: { postId: string }) {
    const router = useRouter();
    const { data: post, isLoading, isError } = usePost(postId);

    return (
        <div className="space-y-4">
            <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm font-semibold text-surface-500 hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to feed
            </Link>

            {isLoading && <DetailSkeleton />}
            {isError && <PostNotFound />}
            {!isLoading && !isError && post && (
                <>
                    <FeedCard item={post} onDeleted={() => router.push('/feed')} />
                    <PostComments postId={postId} postOwnerUserId={post.userId} />
                </>
            )}
        </div>
    );
}
