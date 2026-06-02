import type { Workout } from '../types';

interface Props {
    workouts: Workout[];
}

function getThisWeekCount(workouts: Workout[]): number {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return workouts.filter(w => new Date(w.date) >= startOfWeek).length;
}

function getCurrentStreak(workouts: Workout[]): number {
    if (workouts.length === 0) return 0;

    const hasWorkoutOn = (d: Date): boolean => {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        return workouts.some(w => {
            const wd = new Date(w.date);
            return `${wd.getFullYear()}-${wd.getMonth()}-${wd.getDate()}` === key;
        });
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = hasWorkoutOn(today) ? today
        : hasWorkoutOn(yesterday) ? yesterday
        : null;

    if (!startDate) return 0;

    let streak = 0;
    const cursor = new Date(startDate);
    while (hasWorkoutOn(cursor)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

interface StatItemProps {
    value: number | string;
    label: string;
}

function StatItem({ value, label }: StatItemProps) {
    return (
        <div className="flex-1 flex flex-col items-center gap-0.5 py-3">
            <span className="text-2xl font-extrabold text-foreground leading-none tabular-nums">
                {value}
            </span>
            <span className="text-[11px] font-medium text-surface-500 text-center leading-tight">
                {label}
            </span>
        </div>
    );
}

export function WorkoutStatsStrip({ workouts }: Props) {
    const thisWeek = getThisWeekCount(workouts);
    const streak = getCurrentStreak(workouts);

    return (
        <div
            className="flex rounded-2xl overflow-hidden border border-surface-200 bg-surface mb-4"
        >
            <StatItem value={workouts.length} label="Total workouts" />

            <div className="w-px self-stretch my-3" style={{ backgroundColor: 'var(--color-surface-200)' }} />

            <StatItem value={thisWeek} label="This week" />

            <div className="w-px self-stretch my-3" style={{ backgroundColor: 'var(--color-surface-200)' }} />

            <StatItem value={streak} label={streak === 1 ? 'Day streak' : 'Day streak'} />
        </div>
    );
}
