'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Target } from 'lucide-react';
import { Button, EmptyState } from '@/shared/ui';
import { useGoals, useGoalTypes } from '../hooks/useGoals';
import { GoalCard } from './GoalCard';
import { CreateGoalModal } from './CreateGoalModal';

function GoalsSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-surface-100 animate-pulse" />
            ))}
        </div>
    );
}

function GoalsEmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <EmptyState
            icon={Target}
            title="No goals yet"
            description="Set a goal to start tracking your progress."
            action={
                <Button onClick={onCreate} className="gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    New Goal
                </Button>
            }
        />
    );
}

export function GoalsView() {
    const { data: goalsPage, isLoading } = useGoals();
    const { data: goalTypes } = useGoalTypes();
    const [createOpen, setCreateOpen] = useState(false);
    const router = useRouter();
    const openGoal = (id: string) => router.push(`/goals/${id}`);

    const categoryByTypeId = useMemo(() => {
        const map = new Map<string, string>();
        for (const type of goalTypes ?? []) map.set(type.id, type.category);
        return map;
    }, [goalTypes]);

    const goals = goalsPage?.items ?? [];
    const activeGoals = goals.filter((g) => g.milestonePercent < 100);
    const completedGoals = goals.filter((g) => g.milestonePercent >= 100);

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-surface-500">
                    {goalsPage ? `${activeGoals.length} active` : ''}
                </p>
                <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    New Goal
                </Button>
            </div>

            {isLoading ? (
                <GoalsSkeleton />
            ) : goals.length === 0 ? (
                <GoalsEmptyState onCreate={() => setCreateOpen(true)} />
            ) : (
                <div className="space-y-6">
                    {activeGoals.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Active</h3>
                            <div className="space-y-2.5">
                                {activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} category={categoryByTypeId.get(goal.goalTypeId)} onClick={() => openGoal(goal.id)} />)}
                            </div>
                        </div>
                    )}

                    {completedGoals.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Completed</h3>
                            <div className="space-y-2.5">
                                {completedGoals.map((goal) => <GoalCard key={goal.id} goal={goal} category={categoryByTypeId.get(goal.goalTypeId)} onClick={() => openGoal(goal.id)} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <CreateGoalModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </div>
    );
}
