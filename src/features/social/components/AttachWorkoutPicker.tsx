'use client';

import { useEffect, useState } from 'react';
import { Dumbbell, Loader2, X } from 'lucide-react';
import { useWorkoutHistory } from '@/features/workout/hooks/useWorkoutHistory';
import { getTypeConfig } from '@/features/workout/typeConfig';
import { formatDuration } from '@/features/workout/components/workoutDetailFormatters';
import { Button, Card, EmptyState, IconChip } from '@/shared/ui';
import { useMySharedWorkoutIds } from '../hooks/useSocialReads';
import type { WorkoutHistoryItem } from '@/features/workout/types';

function shortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function keyStat(item: WorkoutHistoryItem): string | null {
    const { summary } = item;
    switch (item.workoutType) {
        case 'Gym':
            return summary.totalVolumeKg != null ? `${Math.round(summary.totalVolumeKg)} kg lifted` : null;
        case 'Running':
        case 'Cycling':
            return summary.distanceKm != null ? `${summary.distanceKm.toFixed(1)} km` : null;
        case 'Swimming':
            return summary.distanceMeters != null ? `${summary.distanceMeters} m` : null;
        case 'Yoga':
            return summary.style ?? summary.intensity ?? null;
        default:
            return null;
    }
}

function WorkoutRow({ item, onSelect }: { item: WorkoutHistoryItem; onSelect: () => void }) {
    const { Icon, color, bg } = getTypeConfig(item.workoutType);
    const stat = keyStat(item);
    const duration = formatDuration(item.durationMinutes);

    return (
        <Card padding="sm" interactive onClick={onSelect} className="flex items-center gap-3">
            <IconChip icon={Icon} size="sm" color={color} bg={bg} />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{getTypeConfig(item.workoutType).label}</p>
                <p className="text-xs text-surface-500 mt-0.5">
                    {shortDate(item.date)}
                    {duration ? ` · ${duration}` : ''}
                    {stat ? ` · ${stat}` : ''}
                </p>
            </div>
        </Card>
    );
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (workout: WorkoutHistoryItem) => void;
}

export function AttachWorkoutPicker({ open, onClose, onSelect }: Props) {
    const [page, setPage] = useState(1);
    const [allItems, setAllItems] = useState<WorkoutHistoryItem[]>([]);
    const { data, isLoading, isFetching } = useWorkoutHistory(page, 20);
    const { data: sharedIds } = useMySharedWorkoutIds();

    useEffect(() => {
        if (!data) return;
        setAllItems(prev => {
            const merged = page === 1 ? data.items : [...prev, ...data.items];
            const seen = new Set<string>();
            return merged.filter(item => (seen.has(item.id) ? false : (seen.add(item.id), true)));
        });
    }, [data, page]);

    if (!open) return null;

    const eligible = allItems.filter(
        item => item.status === 'Completed' && !item.isPrivate && !(sharedIds ?? []).includes(item.id)
    );
    const canLoadMore = Boolean(data && data.page * data.pageSize < data.totalCount);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-md max-h-[85dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                    <h2 className="text-base font-bold text-foreground">Attach a workout</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-2.5">
                    {isLoading && page === 1 && (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-5 w-5 animate-spin text-surface-400" aria-hidden="true" />
                        </div>
                    )}

                    {!(isLoading && page === 1) && eligible.length === 0 && (
                        <EmptyState
                            icon={Dumbbell}
                            title="No workouts ready to share"
                            description="Complete a non-private workout to be able to attach it to a post."
                        />
                    )}

                    {eligible.map(item => (
                        <WorkoutRow key={item.id} item={item} onSelect={() => onSelect(item)} />
                    ))}

                    {canLoadMore && (
                        <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            loading={isFetching}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Load more
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
