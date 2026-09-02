'use client';

import { Clock } from 'lucide-react';
import { Card, IconChip } from '@/shared/ui';
import { useWorkouts } from '../hooks/useWorkouts';
import { formatDuration } from './workoutDetailFormatters';

function isToday(dateStr: string): boolean {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function TodaysDurationCard() {
    const { data: workouts } = useWorkouts();
    const totalMinutes = (workouts ?? [])
        .filter(w => isToday(w.date))
        .reduce((sum, w) => sum + (w.durationMinutes ?? 0), 0);

    return (
        <Card padding="sm" className="flex items-center gap-3">
            <IconChip icon={Clock} size="sm" variant="primary" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground leading-tight">
                    {formatDuration(totalMinutes) ?? '0 min'}
                </p>
                <p className="text-xs text-surface-500 leading-tight">Today&apos;s workout duration</p>
            </div>
        </Card>
    );
}
