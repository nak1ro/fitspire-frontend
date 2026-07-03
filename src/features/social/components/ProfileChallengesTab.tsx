'use client';

import { Trophy } from 'lucide-react';
import { Badge, Card, EmptyState, IconChip } from '@/shared/ui';
import { usePublicChallengeResults } from '../hooks/useSocialReads';
import type { PublicChallengeResult } from '../types';

function ordinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

function ResultRow({ result }: { result: PublicChallengeResult }) {
    return (
        <Card padding="sm" className="flex items-center gap-3">
            <IconChip icon={Trophy} size="sm" variant={result.isWinner ? 'warning' : 'neutral'} />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground leading-tight truncate">{result.challengeTitle}</p>
                <p className="text-xs text-surface-400 leading-tight mt-0.5">
                    {ordinal(result.rank)} place &middot; score {result.score}
                </p>
            </div>
            {result.isWinner && <Badge variant="warning" size="sm">Winner</Badge>}
            {!result.isWinner && result.isFinisher && <Badge variant="success" size="sm">Finisher</Badge>}
        </Card>
    );
}

function ChallengesSkeleton() {
    return (
        <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-surface-100 animate-pulse" />
            ))}
        </div>
    );
}

export function ProfileChallengesTab({ userId }: { userId: string }) {
    const { data: results, isLoading } = usePublicChallengeResults(userId);

    if (isLoading) return <ChallengesSkeleton />;

    if (!results || results.length === 0) {
        return <EmptyState icon={Trophy} title="No challenge results" description="This account hasn't finished any challenges yet." />;
    }

    return (
        <div className="space-y-2.5">
            {results.map((result) => (
                <ResultRow key={result.challengeId} result={result} />
            ))}
        </div>
    );
}
