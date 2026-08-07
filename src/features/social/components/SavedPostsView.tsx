'use client';

import { Bookmark } from 'lucide-react';
import { EmptyState } from '@/shared/ui';
import { useSavedPosts } from '../hooks/useSocialFeed';
import { FeedCard } from './FeedCard';
import { FeedSkeleton } from './FeedSkeleton';

function EmptySavedPosts() {
    return (
        <EmptyState
            icon={Bookmark}
            title="No saved posts yet"
            description="Tap the bookmark icon on any post to save it here for later."
        />
    );
}

function SavedPostsError() {
    return (
        <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Couldn't load saved posts</p>
            <p className="text-xs text-surface-400 mt-1">Check your connection and try again.</p>
        </div>
    );
}

export function SavedPostsView() {
    const { data, isLoading, isError } = useSavedPosts({ pageSize: 20 });

    return (
        <div className="space-y-4">
            {isLoading && <FeedSkeleton />}
            {isError && <SavedPostsError />}

            {!isLoading && !isError && data && data.length === 0 && <EmptySavedPosts />}

            {!isLoading && !isError && data && data.length > 0 && (
                data.map(item => <FeedCard key={item.id} item={item} />)
            )}
        </div>
    );
}
