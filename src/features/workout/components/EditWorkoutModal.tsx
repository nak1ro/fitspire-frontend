'use client';

import { X } from 'lucide-react';
import { IconChip, Modal } from '@/shared/ui';
import { getTypeConfig } from '../typeConfig';
import { WorkoutEditForm } from './WorkoutEditForm';
import type { WorkoutDetail } from '../types';

interface Props {
    workout: WorkoutDetail;
    open: boolean;
    onClose: () => void;
}

export function EditWorkoutModal({ workout, open, onClose }: Props) {
    const { Icon: TypeIcon, label: typeLabel, color, bg } = getTypeConfig(workout.workoutType);

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-lg" className="max-h-[92dvh] sm:max-h-[88dvh] flex flex-col" labelledBy="edit-workout-title">
                {/* Header */}
                <div className="flex items-center gap-3.5 px-5 pt-5 pb-2 shrink-0">
                    <IconChip icon={TypeIcon} size="sm" color={color} bg={bg} />
                    <h2 id="edit-workout-title" className="flex-1 text-base font-bold text-foreground truncate">
                        Edit {typeLabel}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2">
                    <WorkoutEditForm workout={workout} onSuccess={onClose} />
                </div>
        </Modal>
    );
}
