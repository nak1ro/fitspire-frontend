'use client';

import { useMemo, useState } from 'react';
import { Award, Star } from 'lucide-react';
import { EmptyState } from '@/shared/ui';
import { useBadgeCatalogue } from '../hooks/useBadges';
import { BadgeTile } from './BadgeTile';
import { FeaturedBadgePicker } from './FeaturedBadgePicker';

function groupByCategory<T extends { badge: { category: string } }>(items: T[]) {
    const groups = new Map<string, T[]>();
    for (const item of items) {
        if (!groups.has(item.badge.category)) groups.set(item.badge.category, []);
        groups.get(item.badge.category)!.push(item);
    }
    return Array.from(groups.entries());
}

export function BadgesTab() {
    const [pickerOpen, setPickerOpen] = useState(false);
    const { data: catalogue, isLoading } = useBadgeCatalogue({ pageSize: 100 });

    const items = catalogue?.items ?? [];
    const earnedCount = items.filter(i => i.isEarned).length;
    const grouped = useMemo(() => groupByCategory(items), [items]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 rounded-2xl bg-surface-100 animate-pulse" />)}
            </div>
        );
    }

    if (items.length === 0) {
        return <EmptyState icon={Award} title="No badges available" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
                <p className="text-sm text-surface-500">{earnedCount} of {items.length} earned</p>
                <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:opacity-70 transition-opacity"
                >
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit featured
                </button>
            </div>

            {grouped.map(([category, categoryItems]) => (
                <div key={category} className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">{category}</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {categoryItems.map(item => <BadgeTile key={item.badge.badgeId} item={item} />)}
                    </div>
                </div>
            ))}

            <FeaturedBadgePicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
        </div>
    );
}
