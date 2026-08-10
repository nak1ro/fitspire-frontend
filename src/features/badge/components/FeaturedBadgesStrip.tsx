import { Award } from 'lucide-react';

const TIER_COLORS: Record<string, { color: string; bg: string }> = {
    Bronze: { color: '#B87333', bg: 'rgba(184,115,51,0.10)' },
    Silver: { color: '#8B95A1', bg: 'rgba(139,149,161,0.12)' },
    Gold:   { color: '#C9A227', bg: 'rgba(201,162,39,0.12)' },
};

function tierStyle(tier: string) {
    return TIER_COLORS[tier] ?? { color: 'var(--color-primary-500)', bg: 'var(--color-primary-50)' };
}

export interface FeaturedBadgeItem {
    id: string;
    name: string;
    tier: string;
    iconUrl?: string | null;
}

export function FeaturedBadgesStrip({ badges }: { badges: FeaturedBadgeItem[] }) {
    if (badges.length === 0) return null;

    return (
        <div className="flex items-start gap-3 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
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
    );
}
