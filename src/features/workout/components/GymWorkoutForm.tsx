'use client';

import { useState } from 'react';
import { Trash2, Plus, ChevronUp } from 'lucide-react';
import { Alert } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCreateGymWorkout } from '../hooks/useCreateWorkout';
import { useCompleteWorkout } from '../hooks/useWorkoutMutations';
import { ExerciseSearchPanel } from './ExerciseSearchPanel';
import type { Exercise, WorkoutSplit, WorkoutIntensity } from '../types';

const today = () => new Date().toISOString().split('T')[0];

interface ExerciseRow {
    rowId: string;
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weightKg: number;
}

const SPLIT_OPTIONS: WorkoutSplit[] = ['Push', 'Pull', 'Legs', 'UpperBody', 'LowerBody', 'FullBody', 'Cardio', 'Other'];
const SPLIT_LABELS: Record<WorkoutSplit, string> = {
    Push: 'Push', Pull: 'Pull', Legs: 'Legs',
    UpperBody: 'Upper', LowerBody: 'Lower', FullBody: 'Full Body',
    Cardio: 'Cardio', Other: 'Other',
};
const INTENSITY_OPTIONS: WorkoutIntensity[] = ['Low', 'Medium', 'High', 'Extreme'];

interface Props {
    onSuccess: () => void;
}

export function GymWorkoutForm({ onSuccess }: Props) {
    const [exercises, setExercises] = useState<ExerciseRow[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [splitType, setSplitType] = useState<WorkoutSplit | ''>('');
    const [intensityLevel, setIntensityLevel] = useState<WorkoutIntensity | ''>('');
    const [duration, setDuration] = useState('');
    const [date, setDate] = useState(today());
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { mutateAsync: createGym, isPending: creating } = useCreateGymWorkout();
    const { mutateAsync: completeGym, isPending: completing } = useCompleteWorkout();
    const isPending = creating || completing;

    const addExercise = (exercise: Exercise) => {
        setExercises(prev => [
            ...prev,
            {
                rowId: `${exercise.id}-${Date.now()}`,
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                sets: 3,
                reps: 10,
                weightKg: 0,
            },
        ]);
    };

    const removeExercise = (rowId: string) => {
        setExercises(prev => prev.filter(e => e.rowId !== rowId));
    };

    const updateExercise = (rowId: string, field: 'sets' | 'reps' | 'weightKg', raw: string) => {
        const value = field === 'weightKg'
            ? Math.max(0, parseFloat(raw) || 0)
            : Math.max(1, parseInt(raw) || 1);
        setExercises(prev => prev.map(e => e.rowId === rowId ? { ...e, [field]: value } : e));
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        if (exercises.length === 0) {
            setSubmitError('Add at least one exercise.');
            return;
        }

        try {
            const workoutId = await createGym({
                date: new Date(date).toISOString(),
                splitType: splitType || null,
                intensityLevel: intensityLevel || null,
                exercises: exercises.map(e => ({
                    exerciseId: e.exerciseId,
                    sets: e.sets,
                    reps: e.reps,
                    weightKg: e.weightKg,
                })),
            });

            await completeGym({
                workoutId,
                data: { durationMinutes: duration ? parseFloat(duration) : null },
            });

            onSuccess();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to log workout. Please try again.'));
        }
    };

    return (
        <div className="space-y-5">

            {/* Split type */}
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                    Split <span className="normal-case font-normal">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                    {SPLIT_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setSplitType(splitType === opt ? '' : opt)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                            style={splitType === opt ? {
                                backgroundColor: 'rgba(5,150,105,0.08)',
                                borderColor: '#059669',
                                color: '#059669',
                            } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
                        >
                            {SPLIT_LABELS[opt]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Intensity */}
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                    Intensity <span className="normal-case font-normal">(optional)</span>
                </label>
                <div className="flex gap-1.5">
                    {INTENSITY_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setIntensityLevel(intensityLevel === opt ? '' : opt)}
                            className="flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                            style={intensityLevel === opt ? {
                                backgroundColor: 'rgba(5,150,105,0.08)',
                                borderColor: '#059669',
                                color: '#059669',
                            } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exercises */}
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                    Exercises
                </label>

                {exercises.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="grid grid-cols-[1fr_50px_50px_60px_32px] gap-1.5 px-1 mb-1">
                            {['Exercise', 'Sets', 'Reps', 'kg', ''].map((h, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] font-semibold uppercase tracking-wider text-surface-400 text-center first:text-left"
                                >
                                    {h}
                                </span>
                            ))}
                        </div>
                        {exercises.map(ex => (
                            <div key={ex.rowId} className="grid grid-cols-[1fr_50px_50px_60px_32px] gap-1.5 items-center">
                                <span className="text-xs font-medium text-foreground truncate pr-1 leading-tight">
                                    {ex.exerciseName}
                                </span>
                                {(['sets', 'reps'] as const).map(field => (
                                    <input
                                        key={field}
                                        type="number"
                                        min={1}
                                        value={ex[field]}
                                        onChange={e => updateExercise(ex.rowId, field, e.target.value)}
                                        className="w-full text-center text-xs font-semibold bg-background border border-surface-200 rounded-lg py-1.5 outline-none transition-colors"
                                        style={{ colorScheme: 'light' }}
                                    />
                                ))}
                                <input
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    value={ex.weightKg}
                                    onChange={e => updateExercise(ex.rowId, 'weightKg', e.target.value)}
                                    className="w-full text-center text-xs font-semibold bg-background border border-surface-200 rounded-lg py-1.5 outline-none transition-colors"
                                    style={{ colorScheme: 'light' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExercise(ex.rowId)}
                                    className="flex items-center justify-center h-7 w-7 rounded-lg text-surface-400 hover:text-red-500 transition-colors"
                                    aria-label={`Remove ${ex.exerciseName}`}
                                >
                                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {showSearch ? (
                    <div className="space-y-2 mt-2">
                        <ExerciseSearchPanel onAdd={addExercise} />
                        <button
                            type="button"
                            onClick={() => setShowSearch(false)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-surface-500 hover:text-foreground transition-colors"
                        >
                            <ChevronUp className="h-4 w-4" aria-hidden="true" />
                            Close search
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowSearch(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-surface-200 text-sm font-semibold text-surface-400 hover:text-surface-600 hover:border-surface-300 transition-all mt-2"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add exercise
                    </button>
                )}
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                    Duration <span className="normal-case font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        step={1}
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        placeholder="—"
                        className="flex-1 text-sm font-medium bg-background border border-surface-200 rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground"
                    />
                    <span className="text-sm text-surface-400 shrink-0">min</span>
                </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">Date</label>
                <input
                    type="date"
                    value={date}
                    max={today()}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-sm font-medium bg-background border border-surface-200 rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground"
                />
            </div>

            {submitError && <Alert variant="error">{submitError}</Alert>}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #059669, #34D399)' }}
            >
                {isPending ? 'Logging workout…' : 'Log Workout'}
            </button>
        </div>
    );
}
