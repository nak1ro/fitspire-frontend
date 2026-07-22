'use client';

import { useEffect, useState } from 'react';
import { X, Trash2, Lock, AlertTriangle, Dumbbell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkout } from '../hooks/useWorkouts';
import { useDeleteWorkout } from '../hooks/useWorkoutMutations';
import { getTypeConfig, resolveKnownType } from '../typeConfig';
import { Alert, Badge, Button, Card, IconChip } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import type {
    GymWorkout,
    RunningWorkout,
    CyclingWorkout,
    SwimmingWorkout,
    WorkoutDetail,
    YogaWorkout,
} from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

function formatDuration(min: number | null | undefined): string | null {
    if (min == null) return null;
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Stat grid ─────────────────────────────────────────────────────────────────

function StatBox({ label, value }: { label: string; value: string | number }) {
    return (
        <Card variant="outlined" padding="sm" className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">{label}</span>
            <span className="text-base font-bold text-foreground">{value}</span>
        </Card>
    );
}

function TypeBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
    return (
        <Badge size="md" style={{ backgroundColor: bg, color }}>
            {label}
        </Badge>
    );
}

// ─── Type-specific detail sections ─────────────────────────────────────────────

function getExerciseSetSummary(sets: GymWorkout['exercises'][number]['sets']) {
    const loggedSets = sets.filter(set => set.isCompleted);
    const representativeSet = loggedSets[0] ?? sets[0];
    const maximumWeight = Math.max(0, ...sets.map(set => set.weightKg ?? 0));

    return {
        count: sets.length,
        reps: representativeSet?.reps ?? null,
        maximumWeight,
    };
}

function GymDetail({ workout, color, bg }: { workout: GymWorkout; color: string; bg: string }) {
    return (
        <div className="space-y-5">
            {/* Badges */}
            {(workout.splitType || workout.intensityLevel) && (
                <div className="flex gap-2.5 flex-wrap">
                    {workout.splitType && <TypeBadge label={workout.splitType} color={color} bg={bg} />}
                    {workout.intensityLevel && <TypeBadge label={workout.intensityLevel} color={color} bg={bg} />}
                </div>
            )}

            {/* Duration */}
            {workout.durationMinutes != null && (
                <StatBox label="Duration" value={formatDuration(workout.durationMinutes)!} />
            )}

            {/* Exercises */}
            {workout.exercises.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Exercises</p>
                    <Card variant="outlined" padding="none" className="overflow-hidden">
                        {/* Column headers */}
                        <div className="grid grid-cols-[1fr_52px_72px_72px] gap-2 px-3.5 py-2.5 border-b border-surface-200 bg-surface">
                            {['Exercise', 'Sets', 'Reps', 'Weight'].map((h, i) => (
                                <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-surface-400 text-center first:text-left">
                                    {h}
                                </span>
                            ))}
                        </div>
                        {workout.exercises
                            .slice()
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map(ex => {
                                const summary = getExerciseSetSummary(ex.sets);
                                return (
                                <div key={ex.id} className="grid grid-cols-[1fr_52px_72px_72px] gap-2 px-3.5 py-3 border-b border-surface-100 last:border-0">
                                    <span className="text-sm font-medium text-foreground truncate">{ex.exerciseName}</span>
                                    <span className="text-sm font-semibold text-foreground text-center">{summary.count}</span>
                                    <span className="text-sm font-semibold text-foreground text-center">{summary.reps ?? '—'}</span>
                                    <span className="text-sm font-semibold text-foreground text-center">
                                        {summary.maximumWeight > 0 ? `${summary.maximumWeight} kg` : '—'}
                                    </span>
                                </div>
                                );
                            })}
                    </Card>
                </div>
            )}
        </div>
    );
}

function RunningDetail({ workout }: { workout: RunningWorkout }) {
    const stats: Array<{ label: string; value: string }> = [
        { label: 'Distance', value: `${workout.distanceKm.toFixed(2)} km` },
        ...(workout.durationMinutes != null ? [{ label: 'Duration', value: formatDuration(workout.durationMinutes)! }] : []),
        ...(workout.elevationGainMeters != null ? [{ label: 'Elevation', value: `${workout.elevationGainMeters} m` }] : []),
        ...(workout.stepCount != null ? [{ label: 'Steps', value: workout.stepCount.toLocaleString() }] : []),
        ...(workout.caloriesBurned != null ? [{ label: 'Calories', value: `${workout.caloriesBurned} kcal` }] : []),
    ];
    return <div className="grid grid-cols-2 gap-3">{stats.map(s => <StatBox key={s.label} {...s} />)}</div>;
}

function CyclingDetail({ workout }: { workout: CyclingWorkout }) {
    const stats: Array<{ label: string; value: string }> = [
        { label: 'Distance', value: `${workout.distanceKm.toFixed(2)} km` },
        ...(workout.durationMinutes != null ? [{ label: 'Duration', value: formatDuration(workout.durationMinutes)! }] : []),
        ...(workout.elevationGainMeters != null ? [{ label: 'Elevation', value: `${workout.elevationGainMeters} m` }] : []),
        { label: 'Type', value: workout.isIndoor ? 'Indoor' : 'Outdoor' },
        ...(workout.caloriesBurned != null ? [{ label: 'Calories', value: `${workout.caloriesBurned} kcal` }] : []),
    ];
    return <div className="grid grid-cols-2 gap-3">{stats.map(s => <StatBox key={s.label} {...s} />)}</div>;
}

function SwimmingDetail({ workout }: { workout: SwimmingWorkout }) {
    const stats: Array<{ label: string; value: string }> = [
        ...(workout.distanceMeters != null ? [{ label: 'Distance', value: `${workout.distanceMeters} m` }] : []),
        ...(workout.laps != null ? [{ label: 'Laps', value: String(workout.laps) }] : []),
        ...(workout.poolLengthMeters != null ? [{ label: 'Pool length', value: `${workout.poolLengthMeters} m` }] : []),
        ...(workout.strokeType != null ? [{ label: 'Stroke', value: workout.strokeType }] : []),
        ...(workout.durationMinutes != null ? [{ label: 'Duration', value: formatDuration(workout.durationMinutes)! }] : []),
        ...(workout.caloriesBurned != null ? [{ label: 'Calories', value: `${workout.caloriesBurned} kcal` }] : []),
    ];
    return <div className="grid grid-cols-2 gap-3">{stats.map(s => <StatBox key={s.label} {...s} />)}</div>;
}

function YogaDetail({ workout, color, bg }: { workout: YogaWorkout; color: string; bg: string }) {
    const badges = [workout.style, workout.intensity, workout.focusArea].filter(Boolean) as string[];
    const stats: Array<{ label: string; value: string }> = [
        ...(workout.durationMinutes != null ? [{ label: 'Duration', value: formatDuration(workout.durationMinutes)! }] : []),
        ...(workout.caloriesBurned != null ? [{ label: 'Calories', value: `${workout.caloriesBurned} kcal` }] : []),
    ];
    return (
        <div className="space-y-4">
            {badges.length > 0 && (
                <div className="flex gap-2.5 flex-wrap">
                    {badges.map(b => <TypeBadge key={b} label={b} color={color} bg={bg} />)}
                </div>
            )}
            {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    {stats.map(s => <StatBox key={s.label} {...s} />)}
                </div>
            )}
        </div>
    );
}

function DetailBody({ workout }: { workout: WorkoutDetail }) {
    const { color, bg } = getTypeConfig(workout.workoutType);
    switch (resolveKnownType(workout.workoutType)) {
        case 'Gym':      return <GymDetail      workout={workout as GymWorkout}      color={color} bg={bg} />;
        case 'Running':  return <RunningDetail   workout={workout as RunningWorkout}  />;
        case 'Cycling':  return <CyclingDetail   workout={workout as CyclingWorkout}  />;
        case 'Swimming': return <SwimmingDetail  workout={workout as SwimmingWorkout} />;
        case 'Yoga':     return <YogaDetail      workout={workout as YogaWorkout}     color={color} bg={bg} />;
        default:         return null;
    }
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function DetailSkeleton() {
    return (
        <div className="animate-pulse space-y-4 p-5">
            <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-surface-200" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-36 bg-surface-200 rounded-full" />
                    <div className="h-3 w-24 bg-surface-200 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-surface-200" />)}
            </div>
        </div>
    );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

interface Props {
    workoutId: string | null;
    onClose: () => void;
    onDeleted?: () => void;
}

export function WorkoutDetailModal({ workoutId, onClose, onDeleted }: Props) {
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const { data: workout, isLoading } = useWorkout(workoutId);
    const { mutateAsync: deleteWorkout, isPending: deleting } = useDeleteWorkout();

    // The parent keeps this component mounted and only swaps `workoutId`, so local
    // state must be reset per-workout rather than relying on unmount to clear it.
    useEffect(() => {
        setConfirmDelete(false);
        setDeleteError(null);
    }, [workoutId]);

    const handleDelete = async () => {
        if (!workoutId) return;
        setDeleteError(null);
        try {
            await deleteWorkout(workoutId);
            onClose();
            onDeleted?.();
            router.refresh();
        } catch (err) {
            setDeleteError(getErrorMessage(err, 'Failed to delete workout.'));
            setConfirmDelete(false);
        }
    };

    // Reset confirm state when modal closes
    const handleClose = () => {
        setConfirmDelete(false);
        setDeleteError(null);
        onClose();
    };

    if (!workoutId) return null;

    const cfg = workout ? getTypeConfig(workout.workoutType) : null;
    const { Icon: TypeIcon, label: typeLabel, color, bg } = cfg ?? {
        Icon: Dumbbell, label: '', color: '#059669', bg: 'rgba(5,150,105,0.08)',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} aria-hidden="true" />

            {/* Panel */}
            <div
                className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                {/* Header */}
                <div className="flex items-center gap-3.5 px-5 pt-5 pb-2 shrink-0">
                    {cfg && <IconChip icon={TypeIcon} size="sm" color={color} bg={bg} />}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-foreground truncate">
                            {workout?.isRoutine && workout.routineName ? workout.routineName : typeLabel}
                        </h2>
                        {workout && (
                            <p className="text-xs text-surface-400">{formatDate(workout.date)}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {workout?.isPrivate && (
                            <Lock className="h-4 w-4 text-surface-400" aria-label="Private workout" />
                        )}
                        <button
                            onClick={handleClose}
                            className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
                    {isLoading && <DetailSkeleton />}

                    {!isLoading && workout && (
                        <div className="space-y-5">
                            <DetailBody workout={workout} />

                            {/* Notes / caption */}
                            {workout.notes && (
                                <Card variant="outlined" padding="sm">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1.5">
                                        {workout.isPrivate ? 'Notes' : 'Your caption'}
                                    </p>
                                    <p className="text-sm text-foreground leading-relaxed">{workout.notes}</p>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer — delete action */}
                <div className="shrink-0 border-t border-surface-200 px-5 py-5">
                    {!confirmDelete ? (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-error transition-colors"
                        >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Delete workout
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-surface-500">
                                <AlertTriangle className="h-4 w-4 text-error shrink-0" aria-hidden="true" />
                                <span>This can't be undone. Are you sure?</span>
                            </div>
                            {deleteError && <Alert variant="error">{deleteError}</Alert>}
                            <div className="flex gap-3">
                                <Button variant="danger" size="md" fullWidth onClick={handleDelete} loading={deleting}>
                                    Yes, delete
                                </Button>
                                <Button variant="secondary" size="md" fullWidth onClick={() => setConfirmDelete(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
