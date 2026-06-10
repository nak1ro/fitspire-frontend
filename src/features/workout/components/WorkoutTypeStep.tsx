import { Dumbbell, Activity, Bike, Waves, Zap, ChevronRight } from 'lucide-react';
import type { KnownWorkoutType } from '../types';

const WORKOUT_TYPES = [
    { type: 'Gym'      as KnownWorkoutType, label: 'Gym',  subtitle: 'Strength & weights',      Icon: Dumbbell, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
    { type: 'Running'  as KnownWorkoutType, label: 'Run',  subtitle: 'Outdoor or treadmill',     Icon: Activity, color: '#4A7C5F', bg: 'rgba(74,124,95,0.08)'  },
    { type: 'Cycling'  as KnownWorkoutType, label: 'Ride', subtitle: 'Road, MTB, or indoor',     Icon: Bike,     color: '#3A7A8A', bg: 'rgba(58,122,138,0.08)' },
    { type: 'Swimming' as KnownWorkoutType, label: 'Swim', subtitle: 'Pool or open water',       Icon: Waves,    color: '#2E6EA6', bg: 'rgba(46,110,166,0.08)' },
    { type: 'Yoga'     as KnownWorkoutType, label: 'Yoga', subtitle: 'Stretch & mindfulness',    Icon: Zap,      color: '#7B5EA7', bg: 'rgba(123,94,167,0.08)' },
] as const;

interface Props {
    onSelect: (type: KnownWorkoutType) => void;
}

export function WorkoutTypeStep({ onSelect }: Props) {
    return (
        <div className="space-y-2.5">
            <p className="text-sm text-surface-500 mb-4">What kind of workout did you do?</p>
            {WORKOUT_TYPES.map(({ type, label, subtitle, Icon, color, bg }) => (
                <button
                    key={type}
                    onClick={() => onSelect(type)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-surface-200 bg-background hover:bg-surface transition-all text-left group"
                >
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: bg }}
                    >
                        <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">{label}</p>
                        <p className="text-xs text-surface-400">{subtitle}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-surface-300 group-hover:text-surface-500 transition-colors shrink-0" aria-hidden="true" />
                </button>
            ))}
        </div>
    );
}
