import { Award, Trophy } from 'lucide-react';
import { formatMetric, formatValue } from '@/features/workout/personalRecordFormat';
import { getTypeConfig } from '@/features/workout/typeConfig';
import type { FeaturedBadgeItem } from '@/features/badge/components/FeaturedBadgesStrip';
import type { FeaturedPersonalRecordItem } from '@/features/workout/components/FeaturedPersonalRecordCard';

const TIER_COLORS: Record<string, { color: string; bg: string }> = {
    Bronze: { color: '#B87333', bg: 'rgba(184,115,51,0.10)' },
    Silver: { color: '#8B95A1', bg: 'rgba(139,149,161,0.12)' },
    Gold:   { color: '#C9A227', bg: 'rgba(201,162,39,0.12)' },
};

function tierStyle(tier: string) {
    return TIER_COLORS[tier] ?? { color: 'var(--color-primary-500)', bg: 'var(--color-primary-50)' };
}

interface Props {
    badges: FeaturedBadgeItem[];
    record?: FeaturedPersonalRecordItem | null;
}

export function ProfileHighlights({ badges, record }: Props) {
    if (badges.length === 0 && !record) return null;

    return (
        <div className="mb-4 rounded-2xl border border-surface-200 bg-surface px-4 py-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2.5">Highlights</p>
            <div className="flex items-start gap-3 overflow-x-auto pb-0.5 -mx-1 px-1">
                {record && (() => {
                    const { color, bg } = getTypeConfig(record.workoutType);
                    return (
                        <div className="flex flex-col items-center gap-1 shrink-0 w-16" title={formatMetric(record.metric)}>
                            <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-chip"
                                style={{ backgroundColor: bg }}
                            >
                                <Trophy className="h-5 w-5" style={{ color }} aria-hidden="true" />
                            </div>
                            <p className="text-[10px] font-bold text-foreground leading-tight" style={{ color }}>
                                {formatValue(record.metric, record.value)}
                            </p>
                            <p className="text-[9px] text-surface-400 leading-tight truncate w-full text-center">
                                {formatMetric(record.metric)}
                            </p>
                        </div>
                    );
                })()}

                {badges.map(badge => {
                    const { color, bg } = tierStyle(badge.tier);
                    return (
                        <div key={badge.id} className="flex flex-col items-center gap-1 shrink-0 w-14" title={badge.name}>
                            <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-chip"
                                style={{ backgroundColor: bg }}
                            >
                                {badge.iconUrl ? (
                                    <img src={badge.iconUrl} alt="" className="w-6 h-6 object-contain" />
                                ) : (
                                    <Award className="h-5 w-5" style={{ color }} aria-hidden="true" />
                                )}
                            </div>
                            <p className="text-[10px] font-medium text-surface-500 leading-tight truncate w-full text-center">
                                {badge.name}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
