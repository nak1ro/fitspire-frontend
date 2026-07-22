'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';
import { Card, EmptyState } from '@/shared/ui';
import { usePublicBadges } from '../hooks/useSocialReads';
import type { PublicBadge } from '../types';

const TIER_COLORS: Record<string, { color: string; bg: string }> = {
    Bronze: { color: '#B87333', bg: 'rgba(184,115,51,0.10)' },
    Silver: { color: '#8B95A1', bg: 'rgba(139,149,161,0.12)' },
    Gold:   { color: '#C9A227', bg: 'rgba(201,162,39,0.12)' },
};

function tierStyle(tier: string) {
    return TIER_COLORS[tier] ?? { color: 'var(--color-primary-500)', bg: 'var(--color-primary-50)' };
}

function BadgeTile({ badge }: { badge: PublicBadge }) {
    const { color, bg } = tierStyle(badge.tier);
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <Card padding="sm" className="flex flex-col items-center text-center gap-2">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-chip"
                style={{ backgroundColor: bg }}
            >
                {badge.iconUrl && !imageFailed ? (
                    <img src={badge.iconUrl} alt="" className="w-8 h-8 object-contain" onError={() => setImageFailed(true)} />
                ) : (
                    <Award className="h-6 w-6" style={{ color }} aria-hidden="true" />
                )}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-foreground leading-tight truncate">{badge.name}</p>
                <p className="text-[11px] mt-0.5 font-medium" style={{ color }}>{badge.tier}</p>
            </div>
        </Card>
    );
}

function BadgesSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-surface-100 animate-pulse" />
            ))}
        </div>
    );
}

export function ProfileBadgesTab({ userId }: { userId: string }) {
    const { data, isLoading } = usePublicBadges(userId, undefined, { pageSize: 30 });

    if (isLoading) return <BadgesSkeleton />;

    const badges = data?.items ?? [];

    if (badges.length === 0) {
        return <EmptyState icon={Award} title="No badges yet" description="Badges are earned automatically from workouts, goals, and challenges." />;
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
                <BadgeTile key={badge.badgeId} badge={badge} />
            ))}
        </div>
    );
}
