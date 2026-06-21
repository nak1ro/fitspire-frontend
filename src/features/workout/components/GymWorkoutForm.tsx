'use client';

import { useState } from 'react';
import { Plus, ChevronUp } from 'lucide-react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCreateGymWorkout } from '../hooks/useCreateWorkout';
import { useCompleteWorkout } from '../hooks/useWorkoutMutations';
import { ExerciseSearchPanel } from './ExerciseSearchPanel';
import { FormSection } from './form/FormSection';
import { ChipSelect } from './form/ChipSelect';
import { NumField } from './form/NumField';
import { Toggle } from './form/Toggle';
import { ExerciseRow } from './form/ExerciseRow';
import type { Exercise, WorkoutSplit, WorkoutIntensity } from '../types';

const today = () => new Date().toISOString().split('T')[0];

interface ExerciseRowState {
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
    const [exercises, setExercises] = useState<ExerciseRowState[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [splitType, setSplitType] = useState<WorkoutSplit | ''>('');
    const [intensityLevel, setIntensityLevel] = useState<WorkoutIntensity | ''>('');
    const [duration, setDuration] = useState('');
    const [date, setDate] = useState(today());
    const [notes, setNotes] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
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
                data: {
                    durationMinutes: duration ? parseFloat(duration) : null,
                    notes: notes || null,
                    isPrivate,
                },
            });

            onSuccess();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to log workout. Please try again.'));
        }
    };

    return (
        <div className="space-y-5">

            <FormSection title="Details">
                <ChipSelect label="Split" options={SPLIT_OPTIONS} value={splitType} onChange={setSplitType} labelMap={SPLIT_LABELS} />
                <ChipSelect label="Intensity" options={INTENSITY_OPTIONS} value={intensityLevel} onChange={setIntensityLevel} equalWidth />
            </FormSection>

            <FormSection title="Exercises">
                {exercises.length > 0 && (
                    <div className="space-y-2.5">
                        {exercises.map(ex => (
                            <ExerciseRow
                                key={ex.rowId}
                                name={ex.exerciseName}
                                sets={ex.sets}
                                reps={ex.reps}
                                weightKg={ex.weightKg}
                                onChange={(field, raw) => updateExercise(ex.rowId, field, raw)}
                                onRemove={() => removeExercise(ex.rowId)}
                            />
                        ))}
                    </div>
                )}

                {showSearch ? (
                    <div className="space-y-2">
                        <ExerciseSearchPanel onAdd={addExercise} />
                        <button
                            type="button"
                            onClick={() => setShowSearch(false)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-surface-500 hover:text-foreground transition-colors"
                        >
                            <ChevronUp className="h-4 w-4" aria-hidden="true" />
                            Close search
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowSearch(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-surface-200 text-sm font-semibold text-surface-400 hover:text-surface-600 hover:border-surface-300 transition-all"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add exercise
                    </button>
                )}
            </FormSection>

            <FormSection title="Stats">
                <NumField label="Duration" value={duration} onChange={setDuration} unit="min" />
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">Date</label>
                    <input
                        type="date"
                        value={date}
                        max={today()}
                        onChange={e => setDate(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 transition-colors duration-150 outline-none focus:bg-primary-50 focus:border-primary-500"
                    />
                </div>
            </FormSection>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">
                    {isPrivate ? 'Notes' : 'Caption'} <span className="text-surface-400 font-normal">(optional)</span>
                </label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="How did it go?"
                    rows={2}
                    className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none transition-colors resize-none text-foreground placeholder:text-surface-400 focus:bg-primary-50 focus:border-primary-500"
                />
                <p className="text-[11px] text-surface-400">
                    {isPrivate ? 'Visible only to you.' : "Shown on your post — leave blank to use a default caption."}
                </p>
            </div>

            <Toggle
                label="Private workout"
                subtitle="Won't appear in friends' feeds"
                checked={isPrivate}
                onChange={setIsPrivate}
            />

            {submitError && <Alert variant="error">{submitError}</Alert>}

            <Button onClick={handleSubmit} loading={isPending} fullWidth>
                Log Workout
            </Button>
        </div>
    );
}
