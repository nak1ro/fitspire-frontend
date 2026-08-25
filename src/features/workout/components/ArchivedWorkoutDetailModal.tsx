'use client';

import { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Alert, Button, Card, IconChip, Modal } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useRestoreWorkout } from '../hooks/useWorkoutMutations';
import { getTypeConfig, resolveKnownType } from '../typeConfig';
import { formatDate, formatDuration, humanize, StatBox } from './workoutDetailFormatters';
import type { WorkoutHistoryItem } from '../types';

function getStats(item: WorkoutHistoryItem): Array<{ label: string; value: string | number }> {
    const s = item.summary;
    switch (resolveKnownType(item.workoutType)) {
        case 'Gym':
            return [
                ...(s.exerciseCount != null ? [{ label: 'Exercises', value: s.exerciseCount }] : []),
                ...(s.completedSetCount != null ? [{ label: 'Sets', value: s.completedSetCount }] : []),
                ...(s.totalVolumeKg != null ? [{ label: 'Volume', value: `${s.totalVolumeKg} kg` }] : []),
                ...(s.maximumWeightKg != null ? [{ label: 'Max weight', value: `${s.maximumWeightKg} kg` }] : []),
            ];
        case 'Running':
            return [
                ...(s.distanceKm != null ? [{ label: 'Distance', value: `${s.distanceKm.toFixed(2)} km` }] : []),
                ...(s.elevationGainMeters != null ? [{ label: 'Elevation', value: `${s.elevationGainMeters} m` }] : []),
                ...(s.stepCount != null ? [{ label: 'Steps', value: s.stepCount.toLocaleString() }] : []),
                ...(s.averagePaceMinutesPerKm != null ? [{ label: 'Pace', value: `${s.averagePaceMinutesPerKm.toFixed(2)} min/km` }] : []),
            ];
        case 'Cycling':
            return [
                ...(s.distanceKm != null ? [{ label: 'Distance', value: `${s.distanceKm.toFixed(2)} km` }] : []),
                ...(s.elevationGainMeters != null ? [{ label: 'Elevation', value: `${s.elevationGainMeters} m` }] : []),
                { label: 'Type', value: s.isIndoor ? 'Indoor' : 'Outdoor' },
                ...(s.averageSpeedKph != null ? [{ label: 'Avg speed', value: `${s.averageSpeedKph.toFixed(1)} km/h` }] : []),
            ];
        case 'Swimming':
            return [
                ...(s.distanceMeters != null ? [{ label: 'Distance', value: `${s.distanceMeters} m` }] : []),
                ...(s.laps != null ? [{ label: 'Laps', value: s.laps }] : []),
                ...(s.poolLengthMeters != null ? [{ label: 'Pool length', value: `${s.poolLengthMeters} m` }] : []),
                ...(s.strokeType != null ? [{ label: 'Stroke', value: humanize(s.strokeType) }] : []),
            ];
        case 'Yoga':
            return [
                ...(s.style != null ? [{ label: 'Style', value: humanize(s.style) }] : []),
                ...(s.intensity != null ? [{ label: 'Intensity', value: humanize(s.intensity) }] : []),
                ...(s.focusArea != null ? [{ label: 'Focus', value: humanize(s.focusArea) }] : []),
            ];
        default:
            return [];
    }
}

interface Props {
    item: WorkoutHistoryItem | null;
    onClose: () => void;
}

export function ArchivedWorkoutDetailModal({ item, onClose }: Props) {
    const [restoreError, setRestoreError] = useState<string | null>(null);
    const { mutate: restore, isPending } = useRestoreWorkout();
    // Kept alive through the close animation so the panel doesn't go blank
    // while it fades out — item itself goes null immediately on close.
    const [lastItem, setLastItem] = useState(item);

    useEffect(() => {
        if (item) setLastItem(item);
    }, [item]);

    if (!lastItem) return null;

    const { Icon: TypeIcon, label: typeLabel, color, bg } = getTypeConfig(lastItem.workoutType);
    const stats = getStats(lastItem);
    const willResumeAs = lastItem.completedAt != null ? 'Completed' : 'In Progress';

    const handleRestore = () => {
        setRestoreError(null);
        restore(lastItem.id, {
            onSuccess: onClose,
            onError: (err) => setRestoreError(getErrorMessage(err, 'Failed to restore workout.')),
        });
    };

    return (
        <Modal open={Boolean(item)} onClose={onClose} maxWidthClassName="sm:max-w-lg" className="max-h-[92dvh] sm:max-h-[88dvh] flex flex-col" labelledBy="archived-workout-title">
                {/* Header */}
                <div className="flex items-center gap-3.5 px-5 pt-5 pb-2 shrink-0">
                    <IconChip icon={TypeIcon} size="sm" color={color} bg={bg} />
                    <div className="flex-1 min-w-0">
                        <h2 id="archived-workout-title" className="text-base font-bold text-foreground truncate">{typeLabel}</h2>
                        <p className="text-xs text-surface-400">{formatDate(lastItem.date)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2 space-y-5">
                    {lastItem.durationMinutes != null && (
                        <StatBox label="Duration" value={formatDuration(lastItem.durationMinutes)!} />
                    )}

                    {stats.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                            {stats.map(s => <StatBox key={s.label} {...s} />)}
                        </div>
                    )}

                    {lastItem.notesPreview && (
                        <Card variant="outlined" padding="sm">
                            <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
                                {lastItem.isPrivate ? 'Notes' : 'Caption'}
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">{lastItem.notesPreview}</p>
                        </Card>
                    )}
                </div>

                {/* Footer — restore action */}
                <div className="shrink-0 border-t border-surface-200 px-5 py-5 space-y-3">
                    <p className="text-xs text-surface-400">Restoring will resume this workout as {willResumeAs}.</p>
                    {restoreError && <Alert variant="error">{restoreError}</Alert>}
                    <Button
                        variant="secondary"
                        size="md"
                        fullWidth
                        loading={isPending}
                        onClick={handleRestore}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Restore workout
                    </Button>
                </div>
        </Modal>
    );
}
