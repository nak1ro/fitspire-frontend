'use client';

import { X } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import { getTypeConfig } from '../typeConfig';
import { WorkoutEditForm } from './WorkoutEditForm';
import type { WorkoutDetail } from '../types';

interface Props {
    workout: WorkoutDetail;
    open: boolean;
    onClose: () => void;
}

export function EditWorkoutModal({ workout, open, onClose }: Props) {
    if (!open) return null;

    const { Icon: TypeIcon, label: typeLabel, color, bg } = getTypeConfig(workout.workoutType);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            {/* Panel */}
            <div
                className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                {/* Header */}
                <div className="flex items-center gap-3.5 px-5 pt-5 pb-2 shrink-0">
                    <IconChip icon={TypeIcon} size="sm" color={color} bg={bg} />
                    <h2 className="flex-1 text-base font-bold text-foreground truncate">
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
            </div>
        </div>
    );
}
