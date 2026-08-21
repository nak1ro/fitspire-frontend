'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Alert, Button, Input } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { toLocalDateInput } from '@/shared/lib/localDate';
import { useUpdateGoal } from '../hooks/useGoals';
import type { Goal } from '../types';

interface Props {
    goal: Goal;
    open: boolean;
    onClose: () => void;
}

export function EditGoalModal({ goal, open, onClose }: Props) {
    const [targetValue, setTargetValue] = useState(String(goal.targetValue));
    const [isPublic, setIsPublic] = useState(goal.isPublic);
    const [deadline, setDeadline] = useState(goal.deadline ? toLocalDateInput(goal.deadline) : '');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useUpdateGoal();

    useEffect(() => {
        if (!open) return;
        setTargetValue(String(goal.targetValue));
        setIsPublic(goal.isPublic);
        setDeadline(goal.deadline ? toLocalDateInput(goal.deadline) : '');
        setSubmitError(null);
    }, [open, goal]);

    if (!open) return null;

    const handleSubmit = async () => {
        const parsed = Number(targetValue);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            setSubmitError('Enter a target greater than zero.');
            return;
        }
        setSubmitError(null);
        try {
            await mutateAsync({
                goalId: goal.id,
                data: {
                    targetValue: parsed,
                    isPublic,
                    deadline: goal.isRecurring ? null : (deadline || null),
                },
            });
            onClose();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to update goal. Please try again.'));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center justify-between px-5 pt-4 pb-1">
                    <h2 className="text-base font-bold text-foreground">Edit goal</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl text-surface-500 hover:text-foreground transition-colors" aria-label="Close">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="px-5 pb-5 pt-1 space-y-4">
                    <Input
                        label={`Target (${goal.unit})`}
                        type="number"
                        min="0"
                        step="any"
                        value={targetValue}
                        onChange={(e) => setTargetValue(e.target.value)}
                    />

                    <Input
                        label={goal.isRecurring ? 'Deadline (not used for recurring goals)' : 'Deadline'}
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        disabled={goal.isRecurring}
                    />

                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-4 w-4 rounded border-surface-300 accent-primary-500"
                        />
                        <span className="text-sm text-surface-600">Show this goal on my profile</span>
                    </label>

                    {submitError && <Alert variant="error">{submitError}</Alert>}

                    <Button onClick={handleSubmit} loading={isPending} fullWidth>
                        Save changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
