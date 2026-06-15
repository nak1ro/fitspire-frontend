'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { KnownWorkoutType } from '../types';
import { WorkoutTypeStep } from './WorkoutTypeStep';
import { GymWorkoutForm } from './GymWorkoutForm';
import { CardioWorkoutForm } from './CardioWorkoutForm';

type CardioType = Exclude<KnownWorkoutType, 'Gym'>;

const TYPE_LABELS: Record<KnownWorkoutType, string> = {
    Gym: 'Gym Workout',
    Running: 'Run',
    Cycling: 'Ride',
    Swimming: 'Swim',
    Yoga: 'Yoga',
};

interface Props {
    open: boolean;
    onClose: () => void;
}

export function LogWorkoutModal({ open, onClose }: Props) {
    const router = useRouter();
    const [step, setStep] = useState<'type' | 'form'>('type');
    const [selectedType, setSelectedType] = useState<KnownWorkoutType | null>(null);

    // Reset state after close animation finishes
    useEffect(() => {
        if (!open) {
            const t = setTimeout(() => {
                setStep('type');
                setSelectedType(null);
            }, 200);
            return () => clearTimeout(t);
        }
    }, [open]);

    const handleTypeSelect = (type: KnownWorkoutType) => {
        setSelectedType(type);
        setStep('form');
    };

    const handleSuccess = () => {
        onClose();
        router.push('/feed');
        router.refresh();
    };

    if (!open) return null;

    const title = step === 'form' && selectedType ? TYPE_LABELS[selectedType] : 'Log Workout';

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal panel — bottom-sheet on mobile, centered card on desktop */}
            <div
                className="relative w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                {/* Header */}
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    {step === 'form' && (
                        <button
                            onClick={() => { setStep('type'); setSelectedType(null); }}
                            className="p-1.5 -ml-1 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                            aria-label="Back to type selection"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                    <h2 className="flex-1 text-base font-bold text-foreground">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1">
                    {step === 'type' && (
                        <WorkoutTypeStep onSelect={handleTypeSelect} />
                    )}
                    {step === 'form' && selectedType === 'Gym' && (
                        <GymWorkoutForm onSuccess={handleSuccess} />
                    )}
                    {step === 'form' && selectedType && selectedType !== 'Gym' && (
                        <CardioWorkoutForm type={selectedType as CardioType} onSuccess={handleSuccess} />
                    )}
                </div>
            </div>
        </div>
    );
}
