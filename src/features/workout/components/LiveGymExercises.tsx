'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import {
    useAddGymExercise,
    useAddGymSet,
    useDeleteGymExercise,
    useDeleteGymSet,
    useReorderGymExercises,
    useReorderGymSets,
    useSetGymSetCompletion,
    useUpdateGymExercise,
    useUpdateGymSet,
} from '../hooks/useGymSessionMutations';
import { ExerciseSearchPanel } from './ExerciseSearchPanel';
import type { Exercise, GymExercise, GymSet } from '../types';

function NumCell({ draft, onChange, onBlur, placeholder }: { draft: string; onChange: (v: string) => void; onBlur: () => void; placeholder: string }) {
    return (
        <input
            type="number"
            min={0}
            step={placeholder === 'kg' ? 0.5 : 1}
            value={draft}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            className="w-full h-9 text-center text-sm font-semibold bg-surface-50 border border-surface-200 rounded-lg outline-none transition-colors focus:border-primary-500"
            style={{ colorScheme: 'light' }}
        />
    );
}

function LiveSetRow({ workoutId, exerciseEntryId, set, onMoveUp, onMoveDown }: {
    workoutId: string;
    exerciseEntryId: string;
    set: GymSet;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}) {
    const { mutate: updateSet } = useUpdateGymSet();
    const { mutate: setCompletion, isPending: completing } = useSetGymSetCompletion();
    const { mutate: deleteSet, isPending: deleting } = useDeleteGymSet();

    // Reps and weight are kept as local draft state (not sourced from `set` props on
    // commit) so that two quick, sequential blurs — reps then weight — never race a
    // still-in-flight refetch and stomp each other's just-typed value with a stale one.
    const [repsDraft, setRepsDraft] = useState(set.reps != null ? String(set.reps) : '');
    const [weightDraft, setWeightDraft] = useState(set.weightKg != null ? String(set.weightKg) : '');

    const commit = (overrides: Partial<{ reps: number | null; weightKg: number | null; isWarmup: boolean }> = {}) => {
        const reps = overrides.reps !== undefined ? overrides.reps : (repsDraft === '' ? null : parseFloat(repsDraft));
        const weightKg = overrides.weightKg !== undefined ? overrides.weightKg : (weightDraft === '' ? null : parseFloat(weightDraft));
        const isWarmup = overrides.isWarmup !== undefined ? overrides.isWarmup : set.isWarmup;

        if (reps === (set.reps ?? null) && weightKg === (set.weightKg ?? null) && isWarmup === set.isWarmup) return;

        updateSet({
            workoutId,
            exerciseEntryId,
            setId: set.id,
            data: {
                reps,
                weightKg,
                durationSeconds: set.durationSeconds ?? null,
                distanceMeters: set.distanceMeters ?? null,
                isWarmup,
                rpe: set.rpe ?? null,
                notes: set.notes ?? null,
            },
        });
    };

    const hasMeasurement = repsDraft !== '' || weightDraft !== '';

    return (
        <div className="grid grid-cols-[24px_1fr_1fr_32px_28px_28px_28px] items-center gap-1.5">
            <button
                type="button"
                onClick={() => commit({ isWarmup: !set.isWarmup })}
                className={cn(
                    'h-7 w-6 rounded-md text-[10px] font-bold border transition-colors',
                    set.isWarmup ? 'bg-warning/10 border-warning/40 text-warning' : 'border-surface-200 text-surface-300 hover:text-surface-500'
                )}
                aria-pressed={set.isWarmup}
                aria-label="Toggle warmup set"
            >
                W
            </button>
            <NumCell draft={repsDraft} placeholder="reps" onChange={setRepsDraft} onBlur={() => commit()} />
            <NumCell draft={weightDraft} placeholder="kg" onChange={setWeightDraft} onBlur={() => commit()} />
            <button
                type="button"
                onClick={() => setCompletion({ workoutId, exerciseEntryId, setId: set.id, data: { isCompleted: !set.isCompleted } })}
                disabled={completing || (!set.isCompleted && !hasMeasurement)}
                className={cn(
                    'h-7 w-7 rounded-lg border text-xs font-bold transition-colors disabled:opacity-30',
                    set.isCompleted
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'border-surface-200 text-surface-300 hover:text-surface-500'
                )}
                aria-pressed={set.isCompleted}
                aria-label={set.isCompleted ? 'Mark set incomplete' : 'Mark set complete'}
            >
                ✓
            </button>
            <div className="flex flex-col">
                <button
                    type="button"
                    onClick={onMoveUp}
                    disabled={!onMoveUp}
                    className="flex items-center justify-center h-3.5 w-7 text-surface-400 hover:text-foreground disabled:opacity-20 transition-colors"
                    aria-label="Move set up"
                >
                    <ChevronUp className="h-3 w-3" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={onMoveDown}
                    disabled={!onMoveDown}
                    className="flex items-center justify-center h-3.5 w-7 text-surface-400 hover:text-foreground disabled:opacity-20 transition-colors"
                    aria-label="Move set down"
                >
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                </button>
            </div>
            <button
                type="button"
                onClick={() => deleteSet({ workoutId, exerciseEntryId, setId: set.id })}
                disabled={deleting}
                className="flex items-center justify-center h-7 w-7 rounded-lg text-surface-400 hover:text-error hover:bg-surface-100 transition-colors"
                aria-label="Remove set"
            >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
        </div>
    );
}

function ExerciseNotesEditor({ workoutId, exerciseEntryId, notes, onClose }: {
    workoutId: string;
    exerciseEntryId: string;
    notes: string | null | undefined;
    onClose: () => void;
}) {
    const [draft, setDraft] = useState(notes ?? '');
    const { mutate: updateExercise } = useUpdateGymExercise();

    return (
        <textarea
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={() => {
                if ((draft || null) !== (notes || null)) {
                    updateExercise({ workoutId, exerciseEntryId, data: { notes: draft || null } });
                }
                onClose();
            }}
            maxLength={500}
            rows={2}
            placeholder="Notes for this exercise…"
            className="w-full text-sm bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 outline-none resize-none text-foreground placeholder:text-surface-400 focus:border-primary-500"
        />
    );
}

function LiveExerciseCard({ workoutId, exercise, onMoveUp, onMoveDown }: {
    workoutId: string;
    exercise: GymExercise;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}) {
    const [editingNotes, setEditingNotes] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const { mutate: addSet, isPending: addingSet } = useAddGymSet();
    const { mutate: deleteExercise, isPending: deletingExercise } = useDeleteGymExercise();
    const { mutate: reorderSets } = useReorderGymSets();

    const sortedSets = [...exercise.sets].sort((a, b) => a.orderIndex - b.orderIndex);

    const moveSet = (index: number, direction: -1 | 1) => {
        const next = [...sortedSets];
        const target = index + direction;
        if (target < 0 || target >= next.length) return;
        [next[index], next[target]] = [next[target], next[index]];
        reorderSets({ workoutId, exerciseEntryId: exercise.id, data: { orderedIds: next.map(s => s.id) } });
    };

    return (
        <div className="rounded-xl border border-surface-200 bg-background p-3 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground truncate flex-1 min-w-0">{exercise.exerciseName}</span>
                <div className="flex items-center gap-0.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setEditingNotes(v => !v)}
                        className="flex items-center justify-center h-7 w-7 rounded-lg text-surface-400 hover:text-foreground hover:bg-surface-100 transition-colors"
                        aria-label="Edit exercise notes"
                    >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <div className="flex flex-col">
                        <button
                            type="button"
                            onClick={onMoveUp}
                            disabled={!onMoveUp}
                            className="flex items-center justify-center h-4 w-6 text-surface-400 hover:text-foreground disabled:opacity-25 transition-colors"
                            aria-label={`Move ${exercise.exerciseName} up`}
                        >
                            <ChevronUp className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={onMoveDown}
                            disabled={!onMoveDown}
                            className="flex items-center justify-center h-4 w-6 text-surface-400 hover:text-foreground disabled:opacity-25 transition-colors"
                            aria-label={`Move ${exercise.exerciseName} down`}
                        >
                            <ChevronDown className="h-3 w-3" aria-hidden="true" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (!confirmingDelete) { setConfirmingDelete(true); return; }
                            deleteExercise({ workoutId, exerciseEntryId: exercise.id });
                        }}
                        disabled={deletingExercise}
                        className={cn(
                            'flex items-center justify-center h-7 rounded-lg text-surface-400 hover:text-error hover:bg-surface-100 transition-colors shrink-0',
                            confirmingDelete ? 'px-2 text-[11px] font-semibold text-error bg-error/5' : 'w-7'
                        )}
                        aria-label={`Remove ${exercise.exerciseName}`}
                    >
                        {confirmingDelete ? 'Confirm?' : <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {(editingNotes || exercise.notes) && (
                editingNotes ? (
                    <ExerciseNotesEditor
                        workoutId={workoutId}
                        exerciseEntryId={exercise.id}
                        notes={exercise.notes}
                        onClose={() => setEditingNotes(false)}
                    />
                ) : (
                    <p className="text-xs text-surface-500">{exercise.notes}</p>
                )
            )}

            {sortedSets.length > 0 && (
                <div className="space-y-1.5">
                    <div className="grid grid-cols-[24px_1fr_1fr_32px_28px_28px_28px] gap-1.5 px-0.5">
                        {['', 'Reps', 'Kg', '', '', '', ''].map((h, i) => (
                            <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-surface-400 text-center">{h}</span>
                        ))}
                    </div>
                    {sortedSets.map((set, index) => (
                        <LiveSetRow
                            key={set.id}
                            workoutId={workoutId}
                            exerciseEntryId={exercise.id}
                            set={set}
                            onMoveUp={index > 0 ? () => moveSet(index, -1) : undefined}
                            onMoveDown={index < sortedSets.length - 1 ? () => moveSet(index, 1) : undefined}
                        />
                    ))}
                </div>
            )}

            <button
                type="button"
                disabled={addingSet}
                onClick={() => addSet({
                    workoutId,
                    exerciseEntryId: exercise.id,
                    data: { isWarmup: false, isCompleted: false, reps: null, weightKg: null, durationSeconds: null, distanceMeters: null, rpe: null, notes: null },
                })}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-surface-200 text-xs font-semibold text-surface-400 hover:text-surface-600 hover:border-surface-300 transition-all"
            >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add set
            </button>
        </div>
    );
}

interface Props {
    workoutId: string;
    exercises: GymExercise[];
}

export function LiveGymExercises({ workoutId, exercises }: Props) {
    const [showSearch, setShowSearch] = useState(false);
    const { mutate: addExercise, isPending: addingExercise } = useAddGymExercise();
    const { mutate: reorderExercises } = useReorderGymExercises();

    const sortedExercises = [...exercises].sort((a, b) => a.orderIndex - b.orderIndex);

    const moveExercise = (index: number, direction: -1 | 1) => {
        const next = [...sortedExercises];
        const target = index + direction;
        if (target < 0 || target >= next.length) return;
        [next[index], next[target]] = [next[target], next[index]];
        reorderExercises({ workoutId, data: { orderedIds: next.map(e => e.id) } });
    };

    const handleAddExercise = (exercise: Exercise) => {
        addExercise({ workoutId, data: { exerciseId: exercise.id, sets: null, notes: null } });
        setShowSearch(false);
    };

    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Exercises</p>

            {sortedExercises.length > 0 && (
                <div className="space-y-2.5">
                    {sortedExercises.map((exercise, index) => (
                        <LiveExerciseCard
                            key={exercise.id}
                            workoutId={workoutId}
                            exercise={exercise}
                            onMoveUp={index > 0 ? () => moveExercise(index, -1) : undefined}
                            onMoveDown={index < sortedExercises.length - 1 ? () => moveExercise(index, 1) : undefined}
                        />
                    ))}
                </div>
            )}

            {showSearch ? (
                <div className="space-y-2">
                    <ExerciseSearchPanel onAdd={handleAddExercise} />
                    <button
                        type="button"
                        disabled={addingExercise}
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
        </div>
    );
}
