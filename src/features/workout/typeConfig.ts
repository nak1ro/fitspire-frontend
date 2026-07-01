import { Activity, Bike, Dumbbell, Waves, Zap, Weight, Footprints, Route, Droplet, Heart, type LucideIcon } from 'lucide-react';
import type { KnownWorkoutType } from './types';

export interface WorkoutTypeConfig {
    label: string;
    Icon: LucideIcon;
    /** Secondary icon for the fanned dual-chip illustration — a different,
     *  complementary glyph, not a repeat of Icon. */
    SecondaryIcon: LucideIcon;
    color: string;
    bg: string;
    border: string;
}

export const TYPE_CONFIG: Record<KnownWorkoutType, WorkoutTypeConfig> = {
    Gym:      { label: 'Gym Workout', Icon: Dumbbell, SecondaryIcon: Weight,     color: '#059669', bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.20)'  },
    Running:  { label: 'Run',         Icon: Activity, SecondaryIcon: Footprints, color: '#4A7C5F', bg: 'rgba(74,124,95,0.08)',   border: 'rgba(74,124,95,0.20)'   },
    Cycling:  { label: 'Ride',        Icon: Bike,     SecondaryIcon: Route,      color: '#3A7A8A', bg: 'rgba(58,122,138,0.08)',  border: 'rgba(58,122,138,0.20)'  },
    Swimming: { label: 'Swim',        Icon: Waves,    SecondaryIcon: Droplet,    color: '#2E6EA6', bg: 'rgba(46,110,166,0.08)',  border: 'rgba(46,110,166,0.20)'  },
    Yoga:     { label: 'Yoga',        Icon: Zap,      SecondaryIcon: Heart,      color: '#7B5EA7', bg: 'rgba(123,94,167,0.08)',  border: 'rgba(123,94,167,0.20)'  },
};

const FALLBACK_CONFIG: WorkoutTypeConfig = {
    label: 'Workout',
    Icon: Dumbbell,
    SecondaryIcon: Weight,
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.20)',
};

// The API returns lowercase workout-type strings (e.g. "running"), while
// TYPE_CONFIG is keyed by the capitalized KnownWorkoutType. Normalize before lookup.
export function resolveKnownType(type: string): KnownWorkoutType | null {
    if (!type) return null;
    const capitalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    return capitalized in TYPE_CONFIG ? (capitalized as KnownWorkoutType) : null;
}

export function getTypeConfig(type: string): WorkoutTypeConfig {
    const resolved = resolveKnownType(type);
    return resolved ? TYPE_CONFIG[resolved] : FALLBACK_CONFIG;
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
