'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Flame } from 'lucide-react';
import { Card, IconChip } from '@/shared/ui';
import { useWorkouts } from '@/features/workout/hooks/useWorkouts';
import { getCurrentStreak } from '@/shared/lib/streak';
import { useAppShellActions } from './AppShellActionsProvider';
import { StreakDetailModal } from './StreakDetailModal';

interface StreakCardProps {
    collapsed?: boolean;
    onToggleCollapsed?: () => void;
}

export function StreakCard({ collapsed = false, onToggleCollapsed }: StreakCardProps) {
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
                    {!collapsed && (
                        <p className="text-xs text-surface-500 leading-tight">
                            {streak > 0 ? 'Keep it going!' : 'Log a workout to start one'}
                        </p>
                    )}
                </div>
                {onToggleCollapsed ? (
                    <button
                        type="button"
                        onClick={(event) => { event.stopPropagation(); onToggleCollapsed(); }}
                        className="rounded-md p-0.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-foreground"
                        aria-label={collapsed ? 'Expand streak' : 'Collapse streak'}
                        aria-expanded={!collapsed}
                    >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} aria-hidden="true" />
                    </button>
                ) : <ChevronRight className="h-4 w-4 shrink-0 text-surface-400" aria-hidden="true" />}
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
