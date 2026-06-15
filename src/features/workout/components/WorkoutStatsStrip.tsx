import { Dumbbell, CalendarDays, Flame } from 'lucide-react';
import type React from 'react';
import type { Workout } from '../types';
import { getCurrentStreak } from '@/shared/lib/streak';

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

interface StatItemProps {
    value: number | string;
    label: string;
    Icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

function StatItem({ value, label, Icon, iconColor, iconBg }: StatItemProps) {
    return (
        <div className="flex-1 flex flex-col items-center gap-1 py-3">
            <div className="flex items-center gap-1.5">
                <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: iconBg }}
                >
                    <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} aria-hidden="true" />
                </div>
                <span className="text-2xl font-extrabold text-foreground leading-none tabular-nums">
                    {value}
                </span>
            </div>
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
        <div className="flex rounded-2xl overflow-hidden border border-surface-200 bg-surface mb-4">
            <StatItem
                value={workouts.length}
                label="Total workouts"
                Icon={Dumbbell}
                iconColor="#2563EB"
                iconBg="rgba(37,99,235,0.10)"
            />

            <div className="w-px self-stretch my-3" style={{ backgroundColor: 'var(--color-surface-200)' }} />

            <StatItem
                value={thisWeek}
                label="This week"
                Icon={CalendarDays}
                iconColor="#059669"
                iconBg="rgba(5,150,105,0.10)"
            />

            <div className="w-px self-stretch my-3" style={{ backgroundColor: 'var(--color-surface-200)' }} />

            <StatItem
                value={streak}
                label="Day streak"
                Icon={Flame}
                iconColor="#EA580C"
                iconBg="rgba(234,88,12,0.10)"
            />
        </div>
    );
}
