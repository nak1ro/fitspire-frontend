'use client';

import { Target } from 'lucide-react';
import { Badge, Card, EmptyState, IconChip } from '@/shared/ui';
import { usePublicGoals } from '../hooks/useSocialReads';
import type { PublicGoal } from '../types';

function GoalRow({ goal }: { goal: PublicGoal }) {
    const pct = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
    const done = goal.status === 'Completed';

    return (
        <Card padding="sm" className="space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <IconChip icon={Target} size="sm" />
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{goal.templateName}</p>
                </div>
                {done && <Badge variant="success" size="sm">Done</Badge>}
                {goal.isRecurring && !done && <Badge variant="outline" size="sm">Recurring</Badge>}
            </div>

            <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-success' : 'bg-gradient-primary'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <span className={`text-xs font-bold ${done ? 'text-success' : 'text-primary-600'}`}>{pct}%</span>
            </div>
        </Card>
    );
}

function GoalsSkeleton() {
    return (
        <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-surface-100 animate-pulse" />
            ))}
        </div>
    );
}

export function ProfileGoalsTab({ userId }: { userId: string }) {
    const { data: goals, isLoading } = usePublicGoals(userId);

    if (isLoading) return <GoalsSkeleton />;

    if (!goals || goals.length === 0) {
        return <EmptyState icon={Target} title="No public goals" description="This account hasn't shared any active or completed goals." />;
    }

    const active = goals.filter((g) => g.status === 'Active');
    const completed = goals.filter((g) => g.status !== 'Active');

    return (
        <div className="space-y-6">
            {active.length > 0 && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Active</h3>
                    <div className="space-y-2.5">
                        {active.map((goal) => <GoalRow key={goal.id} goal={goal} />)}
                    </div>
                </div>
            )}
            {completed.length > 0 && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Completed</h3>
                    <div className="space-y-2.5">
                        {completed.map((goal) => <GoalRow key={goal.id} goal={goal} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
