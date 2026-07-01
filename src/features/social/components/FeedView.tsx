'use client';

import { Users } from 'lucide-react';
import { EmptyState } from '@/shared/ui';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { FeedCard } from './FeedCard';
import { FeedSkeleton } from './FeedSkeleton';
import { PostComposer } from './PostComposer';

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyFeed() {
    return (
        <EmptyState
            icon={Users}
            title="Your feed is quiet"
            description="Follow people to see their workouts, milestones, and posts here."
        />
    );
}

// ─── Error state ───────────────────────────────────────────────────────────────

function FeedError() {
    return (
        <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Couldn't load the feed</p>
            <p className="text-xs text-surface-400 mt-1">Check your connection and try again.</p>
        </div>
    );
}

// ─── View ──────────────────────────────────────────────────────────────────────

export function FeedView() {
    const { data, isLoading, isError } = useSocialFeed({ pageSize: 20 });

    return (
        <div className="space-y-4">
            <PostComposer />

            {isLoading && <FeedSkeleton />}
            {isError && <FeedError />}

            {!isLoading && !isError && data && data.length === 0 && <EmptyFeed />}

            {!isLoading && !isError && data && data.length > 0 && (
                data.map(item => <FeedCard key={item.id} item={item} />)
            )}
        </div>
    );
}
