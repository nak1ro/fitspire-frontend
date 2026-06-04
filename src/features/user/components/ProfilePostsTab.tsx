'use client';

import { MessageSquare } from 'lucide-react';
import { useUserPosts } from '@/features/social/hooks/useSocialFeed';
import { FeedCard } from '@/features/social/components/FeedCard';

function PostsSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse rounded-2xl border border-surface-200 bg-surface p-4 space-y-3">
                    <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-200 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-3 w-28 bg-surface-200 rounded-full" />
                            <div className="h-3 w-16 bg-surface-200 rounded-full" />
                        </div>
                    </div>
                    <div className="h-4 w-3/4 bg-surface-200 rounded-full" />
                    <div className="h-4 w-1/2 bg-surface-200 rounded-full" />
                </div>
            ))}
        </div>
    );
}

interface Props {
    userId: string;
}

export function ProfilePostsTab({ userId }: Props) {
    const { data: posts, isLoading, isError } = useUserPosts(userId, { pageSize: 20 });

    if (isLoading) return <PostsSkeleton />;

    if (isError) return (
        <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Couldn't load posts</p>
            <p className="text-xs text-surface-400 mt-1">Check your connection and try again.</p>
        </div>
    );

    if (!posts || posts.length === 0) return (
        <div className="flex flex-col items-center text-center py-16 px-6 space-y-4">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(194,109,56,0.08)' }}
            >
                <MessageSquare className="h-7 w-7" style={{ color: '#C26D38' }} aria-hidden="true" />
            </div>
            <div className="space-y-1.5 max-w-xs">
                <p className="text-base font-semibold text-foreground">No posts yet</p>
                <p className="text-sm text-surface-500 leading-relaxed">
                    Share a workout, milestone, or thought from the feed.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-3">
            {posts.map(item => <FeedCard key={item.id} item={item} />)}
        </div>
    );
}
