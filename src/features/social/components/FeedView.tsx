'use client';

import { Users } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import { useSocialFeed } from '../hooks/useSocialFeed';
import { FeedCard } from './FeedCard';
import { FeedSkeleton } from './FeedSkeleton';
import { PostComposer } from './PostComposer';

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyFeed() {
    return (
        <div className="flex flex-col items-center text-center py-16 px-6 space-y-4">
            <IconChip icon={Users} size="lg" />
            <div className="space-y-1.5 max-w-xs">
                <p className="text-base font-semibold text-foreground">Your feed is quiet</p>
                <p className="text-sm text-surface-500 leading-relaxed">
                    Follow people to see their workouts, milestones, and posts here.
                </p>
            </div>
        </div>
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
