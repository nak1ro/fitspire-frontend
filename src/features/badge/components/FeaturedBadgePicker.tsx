'use client';

import { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import { Alert, Button, EmptyState } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useBadgeCatalogue, useSetFeaturedBadges } from '../hooks/useBadges';
import { BadgeTile } from './BadgeTile';

interface Props {
    open: boolean;
    onClose: () => void;
}

const MAX_FEATURED = 5;

export function FeaturedBadgePicker({ open, onClose }: Props) {
    const { data: earned, isLoading } = useBadgeCatalogue({ earned: true, pageSize: 100 });
    const { mutateAsync: save, isPending: saving } = useSetFeaturedBadges();
    const [selected, setSelected] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !earned) return;
        const initial = earned.items
            .filter(item => item.featuredOrder != null)
            .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
            .map(item => item.badge.badgeId);
        setSelected(initial);
        setError(null);
    }, [open, earned]);

    const toggle = (badgeId: string) => {
        setSelected(prev => {
            if (prev.includes(badgeId)) return prev.filter(id => id !== badgeId);
            if (prev.length >= MAX_FEATURED) return prev;
            return [...prev, badgeId];
        });
    };

    const handleSave = async () => {
        setError(null);
        try {
            await save({ badgeIds: selected });
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to save featured badges.'));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-lg max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    <h2 className="flex-1 text-base font-bold text-foreground">Featured badges</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all" aria-label="Close">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1 space-y-4">
                    <p className="text-xs text-surface-500">Pick up to {MAX_FEATURED} badges to show on your profile. {selected.length}/{MAX_FEATURED} selected.</p>

                    {isLoading ? (
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 rounded-2xl bg-surface-100 animate-pulse" />)}
                        </div>
                    ) : !earned || earned.items.length === 0 ? (
                        <EmptyState icon={Award} title="No earned badges yet" className="py-10" />
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {earned.items.map(item => (
                                <BadgeTile
                                    key={item.badge.badgeId}
                                    item={item}
                                    selectable
                                    selected={selected.includes(item.badge.badgeId)}
                                    onClick={() => toggle(item.badge.badgeId)}
                                />
                            ))}
                        </div>
                    )}

                    {error && <Alert variant="error">{error}</Alert>}

                    <Button onClick={handleSave} loading={saving} fullWidth>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
