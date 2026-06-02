'use client';

import { useState } from 'react';
import { X, Trash2, Lock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkout } from '../hooks/useWorkouts';
import { useDeleteWorkout } from '../hooks/useWorkoutMutations';
import { getTypeConfig } from '../typeConfig';
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
        <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-background border border-surface-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">{label}</span>
            <span className="text-base font-bold text-foreground">{value}</span>
        </div>
    );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
    return (
        <span
            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold"
            style={{ backgroundColor: bg, color }}
        >
            {label}
        </span>
    );
}

// ─── Type-specific detail sections ─────────────────────────────────────────────

function GymDetail({ workout, color, bg }: { workout: GymWorkout; color: string; bg: string }) {
    return (
        <div className="space-y-4">
            {/* Badges */}
            {(workout.splitType || workout.intensityLevel) && (
                <div className="flex gap-2 flex-wrap">
                    {workout.splitType && <Badge label={workout.splitType} color={color} bg={bg} />}
                    {workout.intensityLevel && <Badge label={workout.intensityLevel} color={color} bg={bg} />}
                </div>
            )}

            {/* Duration */}
            {workout.durationMinutes != null && (
                <StatBox label="Duration" value={formatDuration(workout.durationMinutes)!} />
            )}

            {/* Exercises */}
            {workout.exercises.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Exercises</p>
                    <div className="rounded-xl border border-surface-200 bg-background overflow-hidden">
                        {/* Column headers */}
                        <div className="grid grid-cols-[1fr_52px_72px_72px] gap-2 px-3 py-2 border-b border-surface-200 bg-surface">
                            {['Exercise', 'Sets', 'Reps', 'Weight'].map((h, i) => (
                                <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-surface-400 text-center first:text-left">
                                    {h}
                                </span>
                            ))}
                        </div>
                        {workout.exercises
                            .slice()
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map(ex => (
                                <div key={ex.id} className="grid grid-cols-[1fr_52px_72px_72px] gap-2 px-3 py-2.5 border-b border-surface-100 last:border-0">
                                    <span className="text-sm font-medium text-foreground truncate">{ex.exerciseName}</span>
                                    <span className="text-sm font-semibold text-foreground text-center">{ex.sets}</span>
                                    <span className="text-sm font-semibold text-foreground text-center">{ex.reps}</span>
                                    <span className="text-sm font-semibold text-foreground text-center">
                                        {ex.weight > 0 ? `${ex.weight} kg` : '—'}
                                    </span>
                                </div>
                            ))}
                    </div>
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
    return <div className="grid grid-cols-2 gap-2">{stats.map(s => <StatBox key={s.label} {...s} />)}</div>;
}

function CyclingDetail({ workout }: { workout: CyclingWorkout }) {
    const stats: Array<{ label: string; value: string }> = [
        { label: 'Distance', value: `${workout.distanceKm.toFixed(2)} km` },
        ...(workout.durationMinutes != null ? [{ label: 'Duration', value: formatDuration(workout.durationMinutes)! }] : []),
        ...(workout.elevationGainMeters != null ? [{ label: 'Elevation', value: `${workout.elevationGainMeters} m` }] : []),
        { label: 'Type', value: workout.isIndoor ? 'Indoor' : 'Outdoor' },
        ...(workout.caloriesBurned != null ? [{ label: 'Calories', value: `${workout.caloriesBurned} kcal` }] : []),
    ];
    return <div className="grid grid-cols-2 gap-2">{stats.map(s => <StatBox key={s.label} {...s} />)}</div>;
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
    return <div className="grid grid-cols-2 gap-2">{stats.map(s => <StatBox key={s.label} {...s} />)}</div>;
}

function YogaDetail({ workout, color, bg }: { workout: YogaWorkout; color: string; bg: string }) {
    const badges = [workout.style, workout.intensity, workout.focusArea].filter(Boolean) as string[];
    const stats: Array<{ label: string; value: string }> = [
        ...(workout.durationMinutes != null ? [{ label: 'Duration', value: formatDuration(workout.durationMinutes)! }] : []),
        ...(workout.caloriesBurned != null ? [{ label: 'Calories', value: `${workout.caloriesBurned} kcal` }] : []),
    ];
    return (
        <div className="space-y-3">
            {badges.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {badges.map(b => <Badge key={b} label={b} color={color} bg={bg} />)}
                </div>
            )}
            {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                    {stats.map(s => <StatBox key={s.label} {...s} />)}
                </div>
            )}
        </div>
    );
}

function DetailBody({ workout }: { workout: WorkoutDetail }) {
    const { color, bg } = getTypeConfig(workout.workoutType);
    switch (workout.workoutType) {
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

    const { data: workout, isLoading } = useWorkout(workoutId);
    const { mutateAsync: deleteWorkout, isPending: deleting } = useDeleteWorkout();

    const handleDelete = async () => {
        if (!workoutId) return;
        await deleteWorkout(workoutId);
        onClose();
        onDeleted?.();
        router.refresh();
    };

    // Reset confirm state when modal closes
    const handleClose = () => {
        setConfirmDelete(false);
        onClose();
    };

    if (!workoutId) return null;

    const cfg = workout ? getTypeConfig(workout.workoutType) : null;
    const { Icon: TypeIcon, label: typeLabel, color, bg } = cfg ?? {
        Icon: () => null, label: '', color: '#C26D38', bg: 'rgba(194,109,56,0.08)',
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
                {/* Colored accent line */}
                <div className="h-[3px] shrink-0" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />

                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-200 shrink-0">
                    {cfg && (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                            <TypeIcon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                        </div>
                    )}
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
                            className="p-1.5 rounded-xl text-surface-500 hover:text-foreground transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading && <DetailSkeleton />}

                    {!isLoading && workout && (
                        <div className="p-5 space-y-4">
                            <DetailBody workout={workout} />

                            {/* Notes */}
                            {workout.notes && (
                                <div className="rounded-xl border border-surface-200 bg-background p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1">Notes</p>
                                    <p className="text-sm text-foreground leading-relaxed">{workout.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer — delete action */}
                <div className="shrink-0 border-t border-surface-200 px-5 py-4">
                    {!confirmDelete ? (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Delete workout
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-surface-500">
                                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" aria-hidden="true" />
                                <span>This can't be undone. Are you sure?</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
                                >
                                    {deleting ? 'Deleting…' : 'Yes, delete'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex-1 py-2 rounded-xl text-sm font-semibold border border-surface-200 text-foreground hover:bg-background transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
