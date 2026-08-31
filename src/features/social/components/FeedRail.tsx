'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/ui';
import { useGoals, useGoalTypes } from '@/features/goal/hooks/useGoals';
import { GoalCard } from '@/features/goal/components/GoalCard';
import { StreakCard } from '@/features/app-shell/components/StreakCard';

function GoalsRailSkeleton() {
    return (
        <div className="space-y-2.5" aria-label="Loading goals" aria-busy="true">
            {[1, 2, 3].map(i => <div key={i} className="h-[92px] rounded-2xl bg-surface-100 animate-pulse" />)}
        </div>
    );
}

/** Fills the empty right-hand gutter on wide viewports with an active-goals snapshot
 *  and the streak card — feed-only for now, reusing existing goal/streak components. */
export function FeedRail() {
    const router = useRouter();
    const { data: activePage, isLoading } = useGoals({ scope: 'active', pageSize: 3 });
    const { data: goalTypes } = useGoalTypes();

    const categoryByTypeId = useMemo(() => {
        const map = new Map<string, string>();
        for (const type of goalTypes ?? []) map.set(type.id, type.category);
        return map;
    }, [goalTypes]);

    const goals = activePage?.items ?? [];

    return (
        <div className="space-y-5">
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Active goals</h3>
                    <Link href="/goals" className="text-xs font-semibold text-primary-500 hover:underline">
                        See all
                    </Link>
                </div>

                {isLoading ? (
                    <GoalsRailSkeleton />
                ) : goals.length === 0 ? (
                    <Card padding="sm">
                        <p className="text-xs text-surface-400">No active goals yet.</p>
                    </Card>
                ) : (
                    <div className="space-y-2.5">
                        {goals.map(goal => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                category={categoryByTypeId.get(goal.goalTypeId)}
                                onClick={() => router.push(`/goals/${goal.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <StreakCard />
        </div>
    );
}
