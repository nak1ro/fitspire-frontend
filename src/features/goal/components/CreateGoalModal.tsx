'use client';

import { useState, useMemo, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button, Input, Alert } from '@/shared/ui';
import { useGoalTypes, useCreateGoal } from '../hooks/useGoals';
import { useExercises } from '@/features/workout/hooks/useExerciseCatalog';
import type { GoalSchedule, GoalType, GoalWorkoutType } from '../types';

interface Props {
    open: boolean;
    onClose: () => void;
}

const CATEGORY_ORDER = ['Fitness', 'Body', 'Nutrition', 'Habit', 'Social'] as const;
const WORKOUT_TYPE_OPTIONS: { value: GoalWorkoutType; label: string }[] = [
    { value: 'gym', label: 'Gym' },
    { value: 'running', label: 'Running' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'yoga', label: 'Yoga' },
];

function TypeStep({ onSelect }: { onSelect: (type: GoalType) => void }) {
    const { data: goalTypes, isLoading } = useGoalTypes();

    const grouped = useMemo(() => {
        const map = new Map<string, GoalType[]>();
        for (const type of goalTypes ?? []) {
            if (!map.has(type.category)) map.set(type.category, []);
            map.get(type.category)!.push(type);
        }
        return CATEGORY_ORDER
            .map((category) => ({ category, types: map.get(category) ?? [] }))
            .filter((group) => group.types.length > 0);
    }, [goalTypes]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-xl bg-surface-100 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {grouped.map(({ category, types }) => (
                <div key={category} className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-surface-400">{category}</p>
                    <div className="space-y-1.5">
                        {types.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => onSelect(type)}
                                className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border border-surface-200 bg-background hover:bg-surface transition-all text-left"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-foreground">{type.name}</p>
                                    {type.description && (
                                        <p className="text-xs text-surface-400 mt-0.5 line-clamp-1">{type.description}</p>
                                    )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-surface-300 shrink-0" aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function DetailsStep({ goalType, onSuccess }: { goalType: GoalType; onSuccess: () => void }) {
    const [targetValue, setTargetValue] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [schedule, setSchedule] = useState<GoalSchedule>(goalType.allowedSchedules[0] ?? 'one-off');
    const [selectedWorkoutType, setSelectedWorkoutType] = useState<GoalWorkoutType | ''>('');
    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const { mutate, isPending, error } = useCreateGoal();
    const { data: exercises, isLoading: areExercisesLoading } = useExercises();
    const isOneOff = schedule === 'one-off';
    const requiresExercise = goalType.parameterKind === 'Exercise';
    const acceptsWorkoutType = goalType.parameterKind === 'WorkoutType' && !goalType.relatedWorkoutType;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutate(
            {
                goalTypeId: goalType.id,
                targetValue: Number(targetValue),
                schedule,
                deadline: isOneOff ? deadline || null : null,
                isPublic,
                selectedWorkoutType: acceptsWorkoutType ? selectedWorkoutType || null : null,
                selectedExerciseId: requiresExercise ? selectedExerciseId : null,
            },
            { onSuccess }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 mb-2">
                <h2 className="text-base font-semibold text-foreground">{goalType.name}</h2>
                {goalType.description && (
                    <p className="text-xs text-surface-500">{goalType.description}</p>
                )}
            </div>

            <Input
                label={`Target (${goalType.defaultUnit})`}
                type="number"
                min="0"
                step="any"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
            />

            <Input
                label={isOneOff ? 'Deadline' : 'Deadline (not used for recurring goals)'}
                type="date"
                required={isOneOff}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={!isOneOff}
            />

            {goalType.allowedSchedules.length > 1 && (
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-foreground">Schedule</span>
                    <select
                        value={schedule}
                        onChange={(event) => setSchedule(event.target.value as GoalSchedule)}
                        className="w-full rounded-xl border border-surface-200 bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary-500"
                    >
                        {goalType.allowedSchedules.map((allowedSchedule) => (
                            <option key={allowedSchedule} value={allowedSchedule}>
                                {allowedSchedule === 'one-off' ? 'One-off' : allowedSchedule[0].toUpperCase() + allowedSchedule.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {acceptsWorkoutType && (
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-foreground">Workout type <span className="text-surface-400">(optional)</span></span>
                    <select
                        value={selectedWorkoutType}
                        onChange={(event) => setSelectedWorkoutType(event.target.value as GoalWorkoutType | '')}
                        className="w-full rounded-xl border border-surface-200 bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary-500"
                    >
                        <option value="">Any workout type</option>
                        {WORKOUT_TYPE_OPTIONS.map((workoutType) => (
                            <option key={workoutType.value} value={workoutType.value}>{workoutType.label}</option>
                        ))}
                    </select>
                </label>
            )}

            {requiresExercise && (
                <label className="block space-y-1">
                    <span className="text-sm font-medium text-foreground">Exercise</span>
                    <select
                        required
                        value={selectedExerciseId}
                        onChange={(event) => setSelectedExerciseId(event.target.value)}
                        disabled={areExercisesLoading}
                        className="w-full rounded-xl border border-surface-200 bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <option value="">{areExercisesLoading ? 'Loading exercises…' : 'Choose an exercise'}</option>
                        {exercises?.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>
                                {exercise.name}{exercise.categoryName ? ` · ${exercise.categoryName}` : ''}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-surface-300 accent-primary-500"
                />
                <span className="text-sm text-surface-600">Show this goal on my profile</span>
            </label>

            {error && <Alert variant="error">Something went wrong. Please try again.</Alert>}

            <Button type="submit" loading={isPending} disabled={requiresExercise && (!selectedExerciseId || areExercisesLoading)} fullWidth>
                Create goal
            </Button>
        </form>
    );
}

export function CreateGoalModal({ open, onClose }: Props) {
    const [selectedType, setSelectedType] = useState<GoalType | null>(null);

    if (!open) return null;

    const handleClose = () => {
        onClose();
        setSelectedType(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    {selectedType && (
                        <button
                            onClick={() => setSelectedType(null)}
                            className="p-1.5 -ml-1 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                            aria-label="Back to goal type selection"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                    <h2 className="flex-1 text-base font-bold text-foreground">
                        {selectedType ? selectedType.name : 'New Goal'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1">
                    {selectedType ? (
                        <DetailsStep goalType={selectedType} onSuccess={handleClose} />
                    ) : (
                        <TypeStep onSelect={setSelectedType} />
                    )}
                </div>
            </div>
        </div>
    );
}
