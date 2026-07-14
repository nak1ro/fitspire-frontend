'use client';

import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { Avatar, EmptyState } from '@/shared/ui';
import { useChallengeLeaderboard, useChallengeResults } from '../hooks/useChallenges';
import type { ChallengeLeaderboardEntry } from '../types';

function medalColor(rank: number): string | undefined {
    if (rank === 1) return '#C9A227';
    if (rank === 2) return '#8B95A1';
    if (rank === 3) return '#B87333';
    return undefined;
}

function Row({ entry }: { entry: ChallengeLeaderboardEntry }) {
    const color = medalColor(entry.rank);
    const pct = entry.progressPercent != null ? Math.min(100, Math.round(entry.progressPercent)) : null;

    return (
        <Link
            href={`/profile/${entry.userId}`}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-surface-100 transition-colors"
        >
            <span
                className="w-6 text-sm font-extrabold text-center tabular-nums shrink-0"
                style={{ color: color ?? 'var(--color-surface-400)' }}
            >
                {entry.rank}
            </span>
            <Avatar displayName={entry.displayName} userName={entry.displayName} avatarUrl={entry.profilePictureUrl} size="sm" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground leading-tight truncate">{entry.displayName}</p>
                {pct != null && (
                    <div className="w-full h-1.5 rounded-full bg-surface-200 overflow-hidden mt-1.5">
                        <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                )}
            </div>
            <span className="text-sm font-bold text-foreground tabular-nums shrink-0">{entry.score}</span>
        </Link>
    );
}

function ListSkeleton() {
    return (
        <div className="space-y-2 px-1">
            {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl bg-surface-100 animate-pulse" />)}
        </div>
    );
}

export function ChallengeLeaderboard({ challengeId, showResults }: { challengeId: string; showResults: boolean }) {
    const leaderboardQuery = useChallengeLeaderboard(showResults ? null : challengeId, { pageSize: 50 });
    const resultsQuery = useChallengeResults(showResults ? challengeId : null, { pageSize: 50 });

    const { data, isLoading } = showResults ? resultsQuery : leaderboardQuery;

    if (isLoading) return <ListSkeleton />;

    const entries = data?.items ?? [];
    if (entries.length === 0) {
        return <EmptyState icon={Trophy} title="No entries yet" className="py-10" />;
    }

    return (
        <div className="space-y-0.5">
            {entries.map(entry => <Row key={entry.userId} entry={entry} />)}
        </div>
    );
}
