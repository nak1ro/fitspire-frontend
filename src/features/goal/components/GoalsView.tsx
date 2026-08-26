'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Target } from 'lucide-react';
import { Button, EmptyState, Skeleton, SkeletonCard } from '@/shared/ui';
import { useGoals, useGoalTypes } from '../hooks/useGoals';
import { GoalCard } from './GoalCard';
import { CreateGoalModal } from './CreateGoalModal';

function SkeletonGoalCard() {
    return (
        <SkeletonCard className="space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                    <Skeleton className="h-3.5 w-32 rounded-full" />
                </div>
                <Skeleton className="h-4 w-14 rounded-full shrink-0" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-3 w-8 rounded-full" />
            </div>
        </SkeletonCard>
    );
}

function GoalsSkeleton() {
    return (
        <div className="space-y-2.5" aria-label="Loading goals" aria-busy="true">
            <SkeletonGoalCard />
            <SkeletonGoalCard />
            <SkeletonGoalCard />
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
    // Fetched as two separate server-filtered scopes rather than one unfiltered list bucketed by
    // milestonePercent — a goal's Status (not its progress percentage) is what actually determines
    // whether the default "active" scope excludes it, so completed/failed/archived goals need their
    // own explicit "history" request or they simply never come back from the API at all.
    const { data: activePage, isLoading: loadingActive } = useGoals({ scope: 'active' });
    const { data: historyPage, isLoading: loadingHistory } = useGoals({ scope: 'history' });
    const { data: goalTypes } = useGoalTypes();
    const [createOpen, setCreateOpen] = useState(false);
    const router = useRouter();
    const openGoal = (id: string) => router.push(`/goals/${id}`);

    const categoryByTypeId = useMemo(() => {
        const map = new Map<string, string>();
        for (const type of goalTypes ?? []) map.set(type.id, type.category);
        return map;
    }, [goalTypes]);

    const isLoading = loadingActive || loadingHistory;
    const activeGoals = activePage?.items ?? [];
    const historyGoals = historyPage?.items ?? [];
    const isEmpty = activeGoals.length === 0 && historyGoals.length === 0;

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-surface-500">
                    {activePage ? `${activeGoals.length} active` : ''}
                </p>
                <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    New Goal
                </Button>
            </div>

            {isLoading ? (
                <GoalsSkeleton />
            ) : isEmpty ? (
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

                    {historyGoals.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">History</h3>
                            <div className="space-y-2.5">
                                {historyGoals.map((goal) => <GoalCard key={goal.id} goal={goal} category={categoryByTypeId.get(goal.goalTypeId)} onClick={() => openGoal(goal.id)} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <CreateGoalModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </div>
    );
}
