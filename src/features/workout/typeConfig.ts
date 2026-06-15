import { Activity, Bike, Dumbbell, Waves, Zap, type LucideIcon } from 'lucide-react';
import type { KnownWorkoutType } from './types';

export interface WorkoutTypeConfig {
    label: string;
    Icon: LucideIcon;
    color: string;
    bg: string;
    border: string;
}

export const TYPE_CONFIG: Record<KnownWorkoutType, WorkoutTypeConfig> = {
    Gym:      { label: 'Gym Workout', Icon: Dumbbell, color: '#059669', bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.20)'  },
    Running:  { label: 'Run',         Icon: Activity, color: '#4A7C5F', bg: 'rgba(74,124,95,0.08)',   border: 'rgba(74,124,95,0.20)'   },
    Cycling:  { label: 'Ride',        Icon: Bike,     color: '#3A7A8A', bg: 'rgba(58,122,138,0.08)',  border: 'rgba(58,122,138,0.20)'  },
    Swimming: { label: 'Swim',        Icon: Waves,    color: '#2E6EA6', bg: 'rgba(46,110,166,0.08)',  border: 'rgba(46,110,166,0.20)'  },
    Yoga:     { label: 'Yoga',        Icon: Zap,      color: '#7B5EA7', bg: 'rgba(123,94,167,0.08)',  border: 'rgba(123,94,167,0.20)'  },
};

const FALLBACK_CONFIG: WorkoutTypeConfig = {
    label: 'Workout',
    Icon: Dumbbell,
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.20)',
};

export function getTypeConfig(type: string): WorkoutTypeConfig {
    return TYPE_CONFIG[type as KnownWorkoutType] ?? FALLBACK_CONFIG;
}

export const KNOWN_TYPES = Object.keys(TYPE_CONFIG) as KnownWorkoutType[];

export const TYPE_SHORT_LABELS: Record<KnownWorkoutType, string> = {
    Gym: 'Gym', Running: 'Run', Cycling: 'Ride', Swimming: 'Swim', Yoga: 'Yoga',
};

export const TYPE_SUBTITLES: Record<KnownWorkoutType, string> = {
    Gym: 'Strength & weights',
    Running: 'Outdoor or treadmill',
    Cycling: 'Road, MTB, or indoor',
    Swimming: 'Pool or open water',
    Yoga: 'Stretch & mindfulness',
};
