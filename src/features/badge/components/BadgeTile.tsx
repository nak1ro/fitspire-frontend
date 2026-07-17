import { Award, Check } from 'lucide-react';
import { Card } from '@/shared/ui';
import type { BadgeCatalogueItem } from '../types';

const TIER_COLORS: Record<string, { color: string; bg: string }> = {
    Bronze: { color: '#B87333', bg: 'rgba(184,115,51,0.10)' },
    Silver: { color: '#8B95A1', bg: 'rgba(139,149,161,0.12)' },
    Gold:   { color: '#C9A227', bg: 'rgba(201,162,39,0.12)' },
};

function tierStyle(tier: string) {
    return TIER_COLORS[tier] ?? { color: 'var(--color-primary-500)', bg: 'var(--color-primary-50)' };
}

interface Props {
    item: BadgeCatalogueItem;
    selectable?: boolean;
    selected?: boolean;
    onClick?: () => void;
}

export function BadgeTile({ item, selectable, selected, onClick }: Props) {
    const { badge, isEarned, progressPercentage } = item;
    const { color, bg } = tierStyle(badge.tier);
    const pct = !isEarned && progressPercentage != null ? Math.min(100, Math.round(progressPercentage)) : null;

    return (
        <Card
            padding="sm"
            interactive={Boolean(onClick)}
            onClick={onClick}
            className={`flex flex-col items-center text-center gap-2 relative ${!isEarned ? 'opacity-50' : ''}`}
        >
            {selectable && selected && (
                <div className="absolute top-2 right-2 flex items-center justify-center h-5 w-5 rounded-full bg-primary-500 text-white">
                    <Check className="h-3 w-3" aria-hidden="true" />
                </div>
            )}
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-chip"
                style={{ backgroundColor: isEarned ? bg : 'var(--color-surface-100)' }}
            >
                {badge.iconUrl ? (
                    <img src={badge.iconUrl} alt="" className="w-8 h-8 object-contain" />
                ) : (
                    <Award className="h-6 w-6" style={{ color: isEarned ? color : 'var(--color-surface-400)' }} aria-hidden="true" />
                )}
            </div>
            <div className="min-w-0 w-full">
                <p className="text-xs font-bold text-foreground leading-tight truncate">{badge.name}</p>
                <p className="text-[11px] mt-0.5 font-medium" style={{ color: isEarned ? color : 'var(--color-surface-400)' }}>{badge.tier}</p>
            </div>
            {pct != null && (
                <div className="w-full h-1 rounded-full bg-surface-200 overflow-hidden">
                    <div className="h-full rounded-full bg-primary-400" style={{ width: `${pct}%` }} />
                </div>
            )}
        </Card>
    );
}
