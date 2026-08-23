'use client';

import { useState } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button, IconChip } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { toWorkoutOccurrenceInput, todayLocalDateInput } from '@/shared/lib/localDate';
import { useWorkoutRoutines } from '../hooks/useWorkoutRoutines';
import { useCreateWorkoutFromRoutine, useDeleteWorkoutRoutine } from '../hooks/useWorkoutMutations';
import { getTypeConfig } from '../typeConfig';
import type { WorkoutRoutine } from '../types';

function RoutineRow({ routine, onStarted }: { routine: WorkoutRoutine; onStarted: () => void }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [startError, setStartError] = useState<string | null>(null);
    const { Icon, color, bg } = getTypeConfig(routine.workoutType);
    const { mutate: startFromRoutine, isPending: starting } = useCreateWorkoutFromRoutine();
    const { mutate: deleteRoutine, isPending: deleting } = useDeleteWorkoutRoutine();

    const handleStart = () => {
        setStartError(null);
        startFromRoutine(
            { routineId: routine.id, data: { date: toWorkoutOccurrenceInput(todayLocalDateInput()) } },
            { onSuccess: onStarted, onError: (err) => setStartError(getErrorMessage(err, 'Failed to start workout from routine.')) }
        );
    };

    const handleDelete = () => {
        if (!confirmingDelete) { setConfirmingDelete(true); return; }
        deleteRoutine(routine.id, { onError: () => setConfirmingDelete(false) });
    };

    return (
        <div className="flex items-center gap-3 py-2.5">
            <IconChip icon={Icon} size="sm" color={color} bg={bg} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{routine.name}</p>
                {startError && <p className="text-xs text-error mt-0.5">{startError}</p>}
            </div>
            <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={cn(
                    'flex items-center justify-center h-8 rounded-lg text-surface-400 hover:text-error hover:bg-surface-100 transition-colors shrink-0',
                    confirmingDelete ? 'px-2 text-[11px] font-semibold text-error bg-error/5' : 'w-8'
                )}
                aria-label={`Delete routine ${routine.name}`}
            >
                {confirmingDelete ? 'Confirm?' : <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
            <Button variant="secondary" size="sm" loading={starting} onClick={handleStart} className="shrink-0">
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Start
            </Button>
        </div>
    );
}

interface Props {
    /** Called after a workout is successfully started from a routine — the caller opens the live session. */
    onStarted: () => void;
}

export function RoutinesSection({ onStarted }: Props) {
    const { data: routines, isLoading } = useWorkoutRoutines();

    if (isLoading || !routines || routines.length === 0) return null;

    return (
        <div className="mb-4 p-4 rounded-xl border border-surface-200 bg-surface">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Your routines</p>
            <div className="divide-y divide-surface-100">
                {routines.map(routine => (
                    <RoutineRow key={routine.id} routine={routine} onStarted={onStarted} />
                ))}
            </div>
        </div>
    );
}
