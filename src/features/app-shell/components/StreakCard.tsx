'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Flame } from 'lucide-react';
import { Card, IconChip } from '@/shared/ui';
import { useWorkouts } from '@/features/workout/hooks/useWorkouts';
import { getCurrentStreak } from '@/shared/lib/streak';
import { useAppShellActions } from './AppShellActionsProvider';
import { StreakDetailModal } from './StreakDetailModal';

export function StreakCard() {
    const { data: workouts } = useWorkouts();
    const [detailOpen, setDetailOpen] = useState(false);
    const router = useRouter();
    const { openLogWorkout } = useAppShellActions();
    const streak = getCurrentStreak(workouts ?? []);

    return (
        <>
            <Card padding="sm" interactive onClick={() => setDetailOpen(true)} className="flex items-center gap-3">
                <IconChip icon={Flame} variant="warning" />
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground leading-tight">
                        {streak > 0 ? `${streak} day${streak === 1 ? '' : 's'}` : 'No streak yet'}
                    </p>
                    <p className="text-xs text-surface-500 leading-tight">
                        {streak > 0 ? 'Keep it going!' : 'Log a workout to start one'}
                    </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-surface-400" aria-hidden="true" />
            </Card>

            <StreakDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                streak={streak}
                workouts={workouts ?? []}
                onLogWorkout={() => { setDetailOpen(false); openLogWorkout(); }}
                onViewWorkouts={() => { setDetailOpen(false); router.push('/workouts'); }}
            />
        </>
    );
}
