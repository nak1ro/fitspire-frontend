'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/shared/ui';
import { useGoals, useGoalTypes } from '@/features/goal/hooks/useGoals';
import { GoalCard } from '@/features/goal/components/GoalCard';
import { StreakCard } from '@/features/app-shell/components/StreakCard';
import { FeedAiInsightCard } from '@/features/ai-coaching/components/FeedAiInsightCard';
import { GenerateFeedAiInsightCard } from '@/features/ai-coaching/components/GenerateFeedAiInsightCard';
import { FindPeopleToFollowCard } from './FindPeopleToFollowCard';
import { useFeedRailCollapse } from '../hooks/useFeedRailCollapse';

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
    const { sectionCollapsed, aiCollapsed, streakCollapsed, collapsedGoalIds, toggleSection, toggleAi, toggleStreak, toggleGoal } = useFeedRailCollapse();

    const categoryByTypeId = useMemo(() => {
        const map = new Map<string, string>();
        for (const type of goalTypes ?? []) map.set(type.id, type.category);
        return map;
    }, [goalTypes]);

    const goals = activePage?.items ?? [];

    return (
        <section className="space-y-5" aria-labelledby="feed-rail-title">
            <div>
                <button
                    type="button"
                    onClick={toggleSection}
                    className="flex items-center gap-1.5 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    aria-expanded={!sectionCollapsed}
                    aria-controls="feed-rail-content"
                >
                    <h3 id="feed-rail-title" className="text-xs font-bold uppercase tracking-widest text-surface-400">Your updates</h3>
                    <ChevronDown className={`h-4 w-4 text-surface-400 transition-transform duration-200 ${sectionCollapsed ? '-rotate-90' : ''}`} aria-hidden="true" />
                </button>
            </div>

            {sectionCollapsed ? (
                <button type="button" onClick={toggleSection} className="flex w-full items-center justify-between rounded-xl bg-surface-50 px-4 py-3 text-left text-xs text-surface-500 hover:bg-surface-100">
                    <span>{goals.length} goal{goals.length === 1 ? '' : 's'} · AI insight · {goals.length > 0 ? 'streak' : 'updates'}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-surface-400" aria-hidden="true" />
                </button>
            ) : (
                <div id="feed-rail-content" className="space-y-5 animate-fade-in">
                    <div className="space-y-2.5">
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
                                collapsed={Boolean(collapsedGoalIds[goal.id])}
                                onToggleCollapsed={() => toggleGoal(goal.id)}
                            />
                        ))}
                    </div>
                )}
                    </div>

                    <FeedAiInsightCard collapsed={aiCollapsed} onToggleCollapsed={toggleAi} />
                    <StreakCard collapsed={streakCollapsed} onToggleCollapsed={toggleStreak} />
                    <GenerateFeedAiInsightCard />
                    <FindPeopleToFollowCard />
                </div>
            )}
        </section>
    );
}
