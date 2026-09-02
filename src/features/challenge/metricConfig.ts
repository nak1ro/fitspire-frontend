import { Flame, Clock, Hash, type LucideIcon } from 'lucide-react';
import { TYPE_CONFIG } from '@/features/workout/typeConfig';
import type { ChallengeWorkoutType } from './types';

export interface ChallengeMetricOption {
    code: string;
    label: string;
    unit: string;
    workoutType: ChallengeWorkoutType | null;
    Icon: LucideIcon;
    color: string;
    bg: string;
}

// Mirrors the backend's challenge-supported subset of MetricCatalogue.Definitions —
// there is no metrics-catalogue endpoint for challenges (unlike Goal templates), so
// this list is hardcoded to match.
export const CHALLENGE_METRICS: ChallengeMetricOption[] = [
    { code: 'workout.count', label: 'Workouts amount', unit: 'count', workoutType: null, Icon: Hash, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
    { code: 'workout.duration.minutes', label: 'Workout duration', unit: 'minutes', workoutType: null, Icon: Clock, color: '#4A7C5F', bg: 'rgba(74,124,95,0.08)' },
    { code: 'workout.calories.kcal', label: 'Calories burned', unit: 'kcal', workoutType: null, Icon: Flame, color: '#B8860B', bg: 'rgba(184,134,11,0.08)' },
    { code: 'running.distance.km', label: 'Running distance', unit: 'km', workoutType: 'running', Icon: TYPE_CONFIG.Running.Icon, color: TYPE_CONFIG.Running.color, bg: TYPE_CONFIG.Running.bg },
    { code: 'cycling.distance.km', label: 'Cycling distance', unit: 'km', workoutType: 'cycling', Icon: TYPE_CONFIG.Cycling.Icon, color: TYPE_CONFIG.Cycling.color, bg: TYPE_CONFIG.Cycling.bg },
    { code: 'swimming.distance.m', label: 'Swimming distance', unit: 'm', workoutType: 'swimming', Icon: TYPE_CONFIG.Swimming.Icon, color: TYPE_CONFIG.Swimming.color, bg: TYPE_CONFIG.Swimming.bg },
    { code: 'yoga.duration.minutes', label: 'Yoga duration', unit: 'minutes', workoutType: 'yoga', Icon: TYPE_CONFIG.Yoga.Icon, color: TYPE_CONFIG.Yoga.color, bg: TYPE_CONFIG.Yoga.bg },
    { code: 'gym.volume.kg', label: 'Gym volume', unit: 'kg', workoutType: 'gym', Icon: TYPE_CONFIG.Gym.Icon, color: TYPE_CONFIG.Gym.color, bg: TYPE_CONFIG.Gym.bg },
    { code: 'gym.exercise_count', label: 'Gym exercises', unit: 'count', workoutType: 'gym', Icon: TYPE_CONFIG.Gym.SecondaryIcon, color: TYPE_CONFIG.Gym.color, bg: TYPE_CONFIG.Gym.bg },
];

const FALLBACK_METRIC: ChallengeMetricOption = {
    code: '', label: 'Metric', unit: '', workoutType: null, Icon: Hash, color: '#059669', bg: 'rgba(5,150,105,0.08)',
};

export function getMetricConfig(code: string): ChallengeMetricOption {
    return CHALLENGE_METRICS.find(m => m.code === code) ?? FALLBACK_METRIC;
}
