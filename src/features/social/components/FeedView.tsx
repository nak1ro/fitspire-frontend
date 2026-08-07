'use client';

import { useState } from 'react';
import { Compass, Users } from 'lucide-react';
import { EmptyState } from '@/shared/ui';
import { useDiscoverFeed, useSocialFeed } from '../hooks/useSocialFeed';
import { FeedCard } from './FeedCard';
import { FeedSkeleton } from './FeedSkeleton';
import { PostComposer } from './PostComposer';

type Tab = 'following' | 'discover';

// ─── Empty states ──────────────────────────────────────────────────────────────

function EmptyFeed() {
    return (
        <EmptyState
            icon={Users}
            title="Your feed is quiet"
            description="Follow people to see their workouts, milestones, and posts here."
        />
    );
}

function EmptyDiscover() {
    return (
        <EmptyState
            icon={Compass}
            title="Nothing to discover yet"
            description="Public posts from across Fitspire will show up here."
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

// ─── Following tab ─────────────────────────────────────────────────────────────

function FollowingTab() {
    const { data, isLoading, isError } = useSocialFeed({ pageSize: 20 });

    return (
        <>
            {isLoading && <FeedSkeleton />}
            {isError && <FeedError />}

            {!isLoading && !isError && data && data.length === 0 && <EmptyFeed />}

            {!isLoading && !isError && data && data.length > 0 && (
                data.map(item => <FeedCard key={item.id} item={item} />)
            )}
        </>
    );
}

// ─── Discover tab ──────────────────────────────────────────────────────────────

function DiscoverTab() {
    const { data, isLoading, isError } = useDiscoverFeed({ pageSize: 20 });

    return (
        <>
            {isLoading && <FeedSkeleton />}
            {isError && <FeedError />}

            {!isLoading && !isError && data && data.length === 0 && <EmptyDiscover />}

            {!isLoading && !isError && data && data.length > 0 && (
                data.map(item => <FeedCard key={item.id} item={item} />)
            )}
        </>
    );
}

// ─── View ──────────────────────────────────────────────────────────────────────

export function FeedView() {
    const [tab, setTab] = useState<Tab>('following');

    return (
        <div className="space-y-4">
            <PostComposer />

            <div className="flex border-b border-surface-200">
                {([
                    { key: 'following', label: 'Following' },
                    { key: 'discover', label: 'Discover' },
                ] as const).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-1 mr-6 py-3 text-sm font-bold transition-colors relative ${tab === t.key ? 'text-primary-500' : 'text-surface-500'}`}
                    >
                        {t.label}
                        {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />}
                    </button>
                ))}
            </div>

            {tab === 'following' ? <FollowingTab /> : <DiscoverTab />}
        </div>
    );
}
