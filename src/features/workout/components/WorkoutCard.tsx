import { Lock } from 'lucide-react';
import type { Workout } from '../types';
import { getTypeConfig } from '../typeConfig';

interface Props {
    workout: Workout;
    onClick: () => void;
}

function formatWorkoutDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function WorkoutCard({ workout, onClick }: Props) {
    const { label, Icon, color, bg, border } = getTypeConfig(workout.workoutType);
    const title = workout.isRoutine && workout.routineName ? workout.routineName : label;

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border bg-surface hover:bg-background transition-all text-left group"
            style={{ borderColor: border }}
        >
            {/* Type icon */}
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: bg }}
            >
                <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-bold text-foreground truncate">{title}</span>
                    {workout.isPrivate && (
                        <Lock className="h-3 w-3 text-surface-400 shrink-0" aria-label="Private" />
                    )}
                </div>
                <p className="text-xs text-surface-400 mt-0.5">{formatWorkoutDate(workout.date)}</p>
            </div>

            {/* Duration badge */}
            {workout.durationMinutes != null && (
                <span
                    className="shrink-0 text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{ backgroundColor: bg, color }}
                >
                    {formatDuration(workout.durationMinutes)}
                </span>
            )}
        </button>
    );
}
