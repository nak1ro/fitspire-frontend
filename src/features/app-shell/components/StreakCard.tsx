'use client';

import { Flame } from 'lucide-react';
import { Card, IconChip } from '@/shared/ui';
import { useWorkouts } from '@/features/workout/hooks/useWorkouts';
import { getCurrentStreak } from '@/shared/lib/streak';

export function StreakCard() {
    const { data: workouts } = useWorkouts();
    const streak = getCurrentStreak(workouts ?? []);

    return (
        <Card padding="sm" className="flex items-center gap-3">
            <IconChip icon={Flame} variant="warning" />
            <div className="min-w-0">
                <p className="text-sm font-bold text-foreground leading-tight">
                    {streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : 'No streak yet'}
                </p>
                <p className="text-xs text-surface-500 leading-tight">
                    {streak > 0 ? 'Keep it going!' : 'Log a workout to start one'}
                </p>
            </div>
        </Card>
    );
}
