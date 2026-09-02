'use client';

import { TrendingUp } from 'lucide-react';
import { Card, IconChip } from '@/shared/ui';
import { useWorkouts } from '../hooks/useWorkouts';
import type { Workout } from '../types';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface DayBucket {
    date: Date;
    minutes: number;
    isToday: boolean;
}

function bucketLastSevenDays(workouts: Workout[]): DayBucket[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: DayBucket[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return { date, minutes: 0, isToday: i === 6 };
    });

    for (const w of workouts) {
        const workoutDate = new Date(w.date);
        workoutDate.setHours(0, 0, 0, 0);
        const bucket = days.find(d => d.date.getTime() === workoutDate.getTime());
        if (bucket) bucket.minutes += w.durationMinutes ?? 0;
    }

    // Session-tracked workouts (e.g. a live-tracked run) can log fractional minutes —
    // round each day's total once bucketing is done so the header/tooltip never show
    // a float tail like "42.00350928333334m".
    for (const day of days) day.minutes = Math.round(day.minutes);

    return days;
}

function formatTotal(totalMinutes: number): string {
    if (totalMinutes === 0) return '0m';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
}

export function WorkoutActivityGraphCard() {
    const { data: workouts } = useWorkouts();
    const days = bucketLastSevenDays(workouts ?? []);
    const maxMinutes = Math.max(...days.map(d => d.minutes), 1);
    const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);

    return (
        <Card padding="sm" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <IconChip icon={TrendingUp} size="sm" variant="primary" />
                    <p className="text-sm font-semibold text-foreground leading-tight">Last 7 days</p>
                </div>
                <span className="text-xs font-bold text-primary-600 shrink-0">{formatTotal(totalMinutes)}</span>
            </div>

            <div className="flex items-end justify-between gap-1.5 h-20">
                {days.map((day, i) => {
                    const pct = day.minutes > 0 ? Math.max(8, Math.round((day.minutes / maxMinutes) * 100)) : 4;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                            <div className="w-full flex-1 flex items-end">
                                <div
                                    className={day.minutes > 0 ? 'w-full rounded-md bg-gradient-primary transition-all duration-500' : 'w-full rounded-md bg-surface-200 transition-all duration-500'}
                                    style={{ height: `${pct}%` }}
                                />
                            </div>
                            <span className={`text-[10px] font-semibold ${day.isToday ? 'text-primary-600' : 'text-surface-400'}`}>
                                {DAY_LABELS[day.date.getDay()]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
