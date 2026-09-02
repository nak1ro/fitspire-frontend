'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Pause, Play, X } from 'lucide-react';
import { Alert, Button, IconChip, Modal, Toggle } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useActiveWorkoutSession, useAbandonWorkout, usePauseWorkout, useResumeWorkout } from '../hooks/useWorkoutSessions';
import { useWorkout } from '../hooks/useWorkouts';
import { useCompleteWorkout } from '../hooks/useWorkoutMutations';
import { useLiveElapsed } from '../hooks/useLiveElapsed';
import { getTypeConfig, resolveKnownType } from '../typeConfig';
import { StatBox } from './workoutDetailFormatters';
import { LiveGymExercises } from './LiveGymExercises';
import type { CyclingWorkout, GymWorkout, RunningWorkout, SwimmingWorkout, WorkoutDetail, YogaWorkout } from '../types';

function LiveCardioSummary({ workout }: { workout: WorkoutDetail }) {
    const type = resolveKnownType(workout.workoutType);
    const stats: Array<{ label: string; value: string | number }> = [];

    if (type === 'Running' || type === 'Cycling') {
        const w = workout as RunningWorkout | CyclingWorkout;
        stats.push({ label: 'Distance', value: `${w.distanceKm.toFixed(2)} km` });
        if (w.elevationGainMeters != null) stats.push({ label: 'Elevation', value: `${w.elevationGainMeters} m` });
    }
    if (type === 'Swimming') {
        const w = workout as SwimmingWorkout;
        if (w.distanceMeters != null) stats.push({ label: 'Distance', value: `${w.distanceMeters} m` });
        if (w.laps != null) stats.push({ label: 'Laps', value: w.laps });
        if (w.strokeType != null) stats.push({ label: 'Stroke', value: w.strokeType });
    }
    if (type === 'Yoga') {
        const w = workout as YogaWorkout;
        if (w.style != null) stats.push({ label: 'Style', value: w.style });
        if (w.intensity != null) stats.push({ label: 'Intensity', value: w.intensity });
        if (w.focusArea != null) stats.push({ label: 'Focus', value: w.focusArea });
    }

    return (
        <div className="space-y-3">
            <p className="text-xs text-surface-500">
                Already logged at start — finish this session once you're done to save it.
            </p>
            {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                    {stats.map(s => <StatBox key={s.label} {...s} />)}
                </div>
            )}
        </div>
    );
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export function LiveSessionModal({ open, onClose }: Props) {
    const [finishing, setFinishing] = useState(false);
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [finishError, setFinishError] = useState<string | null>(null);
    const [confirmAbandon, setConfirmAbandon] = useState(false);
    const [abandonError, setAbandonError] = useState<string | null>(null);

    const { data: session, isLoading: sessionLoading } = useActiveWorkoutSession();
    const { data: workout, isLoading: workoutLoading } = useWorkout(open ? session?.id ?? null : null);
    const { mutate: pause, isPending: pausing } = usePauseWorkout();
    const { mutate: resume, isPending: resuming } = useResumeWorkout();
    const { mutateAsync: completeWorkout, isPending: completing } = useCompleteWorkout();
    const { mutate: abandon, isPending: abandoning } = useAbandonWorkout();
    const elapsed = useLiveElapsed(session);

    // Auto-close if the active session disappears (finished/abandoned elsewhere) while open.
    useEffect(() => {
        if (open && !sessionLoading && !session) onClose();
    }, [open, sessionLoading, session, onClose]);

    useEffect(() => {
        if (!open) {
            setFinishing(false);
            setFinishError(null);
            setConfirmAbandon(false);
            setAbandonError(null);
        }
    }, [open]);

    if (!session) return null;

    const { Icon: TypeIcon, label: typeLabel, color, bg } = getTypeConfig(session.workoutType);

    const openFinish = () => {
        setDuration(String(Math.round(elapsed.elapsedMinutes)));
        setNotes('');
        setIsPrivate(false);
        setFinishError(null);
        setFinishing(true);
    };

    const handleFinish = async () => {
        setFinishError(null);
        try {
            await completeWorkout({
                workoutId: session.id,
                data: {
                    durationMinutes: duration ? parseFloat(duration) : null,
                    notes: notes || null,
                    isPrivate,
                },
            });
            onClose();
        } catch (err) {
            setFinishError(getErrorMessage(err, 'Failed to finish workout.'));
        }
    };

    const handleAbandon = () => {
        if (!confirmAbandon) { setConfirmAbandon(true); return; }
        setAbandonError(null);
        abandon(session.id, {
            onSuccess: onClose,
            onError: (err) => { setAbandonError(getErrorMessage(err, 'Failed to abandon session.')); setConfirmAbandon(false); },
        });
    };

    const isPaused = session.status === 'Paused';

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-xl" className="max-h-[92dvh] sm:max-h-[88dvh] flex flex-col" labelledBy="live-session-title">
                {/* Header */}
                <div className="flex items-center gap-3.5 px-5 pt-5 pb-3 shrink-0">
                    <IconChip icon={TypeIcon} size="sm" color={color} bg={bg} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h2 id="live-session-title" className="text-xs font-semibold uppercase tracking-wider text-surface-500 truncate">
                                {typeLabel} session
                            </h2>
                            {isPaused ? (
                                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-surface-500 bg-surface-100 px-1.5 py-0.5 rounded-full">
                                    Paused
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 shrink-0">
                                    <span className="h-1.5 w-1.5 rounded-full bg-error animate-pulse" aria-hidden="true" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-error">Live</span>
                                </span>
                            )}
                        </div>
                        <p
                            className={cn(
                                'text-3xl font-extrabold leading-tight mt-0.5',
                                isPaused ? 'text-surface-400' : 'text-foreground'
                            )}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {elapsed.formatted}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => (isPaused ? resume(session.id) : pause(session.id))}
                        disabled={pausing || resuming}
                        className="flex items-center justify-center h-9 w-9 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all disabled:opacity-50"
                        aria-label={isPaused ? 'Resume session' : 'Pause session'}
                    >
                        {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 pb-6 pt-2">
                    {(sessionLoading || workoutLoading || !workout) && (
                        <div className="animate-pulse space-y-3">
                            <div className="h-16 rounded-xl bg-surface-200" />
                            <div className="h-16 rounded-xl bg-surface-200" />
                        </div>
                    )}

                    {workout && (
                        resolveKnownType(workout.workoutType) === 'Gym'
                            ? <LiveGymExercises workoutId={workout.id} exercises={(workout as GymWorkout).exercises} />
                            : <LiveCardioSummary workout={workout} />
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-surface-200 px-5 py-5 space-y-3">
                    {!finishing ? (
                        <Button variant="primary" size="md" fullWidth onClick={openFinish}>
                            Finish workout
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-surface-700">Duration (min)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={duration}
                                        onChange={e => setDuration(e.target.value)}
                                        className="flex h-10 w-full rounded-xl border border-surface-200 px-3 text-sm text-foreground bg-surface-50 outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder={isPrivate ? 'Notes (optional)' : 'Caption (optional)'}
                                rows={2}
                                className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none resize-none text-foreground placeholder:text-surface-400 focus:border-primary-500"
                            />
                            <Toggle label="Private workout" subtitle="Won't appear in friends' feeds" checked={isPrivate} onChange={setIsPrivate} />
                            {finishError && <Alert variant="error">{finishError}</Alert>}
                            <div className="flex gap-3">
                                <Button variant="primary" size="md" fullWidth loading={completing} onClick={handleFinish}>
                                    Save & finish
                                </Button>
                                <Button variant="secondary" size="md" fullWidth onClick={() => setFinishing(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {!confirmAbandon ? (
                        <button
                            type="button"
                            onClick={handleAbandon}
                            className="flex items-center gap-2 text-sm font-semibold text-surface-500 hover:text-error transition-colors"
                        >
                            Abandon session
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-surface-500">
                                <AlertTriangle className="h-4 w-4 text-error shrink-0" aria-hidden="true" />
                                <span>Abandon it to start a new workout — this can't be undone.</span>
                            </div>
                            {abandonError && <Alert variant="error">{abandonError}</Alert>}
                            <div className="flex gap-3">
                                <Button variant="danger" size="md" fullWidth loading={abandoning} onClick={handleAbandon}>
                                    Yes, abandon
                                </Button>
                                <Button variant="secondary" size="md" fullWidth onClick={() => setConfirmAbandon(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
        </Modal>
    );
}
