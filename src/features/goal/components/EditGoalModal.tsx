'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Alert, Button, Input, Modal } from '@/shared/ui';
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
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-md" labelledBy="edit-goal-title">
                <div className="flex items-center justify-between px-5 pt-4 pb-1">
                    <h2 id="edit-goal-title" className="text-base font-bold text-foreground">Edit goal</h2>
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
        </Modal>
    );
}
