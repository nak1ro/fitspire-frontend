'use client';

import { useState } from 'react';
import { ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';
import { useGoals } from '@/features/goal/hooks/useGoals';
import { WorkoutCard } from '@/features/workout/components/WorkoutCard';
import { WorkoutDetailModal } from '@/features/workout/components/WorkoutDetailModal';
import type { Workout } from '@/features/workout/types';
import type { Goal } from '@/features/goal/types';

// ─── Goals section ─────────────────────────────────────────────────────────────

function formatDeadline(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(goal: Goal): boolean {
    if (!goal.deadline) return false;
    return new Date(goal.deadline) < new Date() && goal.milestonePercent < 100;
}

function GoalCard({ goal }: { goal: Goal }) {
    const pct = Math.min(100, Math.round(goal.milestonePercent));
    const done = pct >= 100;
    const overdue = isOverdue(goal);

    const barColor = done
        ? '#4A7C5F'
        : overdue
        ? '#C0392B'
        : '#C26D38';

    const barGradient = done
        ? 'linear-gradient(to right, #4A7C5F, #7AB895)'
        : overdue
        ? 'linear-gradient(to right, #C0392B, #E57368)'
        : 'linear-gradient(to right, #C26D38, #EDAC76)';

    return (
        <div className="rounded-xl border border-surface-200 bg-background p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground leading-tight">{goal.goalTypeName}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                    {done && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: 'rgba(74,124,95,0.10)', color: '#4A7C5F' }}>
                            Done
                        </span>
                    )}
                    {overdue && !done && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: 'rgba(192,57,43,0.10)', color: '#C0392B' }}>
                            Overdue
                        </span>
                    )}
                    {goal.deadline && !done && (
                        <span className="text-[11px] text-surface-400">by {formatDeadline(goal.deadline)}</span>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: barGradient }}
                />
            </div>

            {/* Values */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <span className="text-xs font-bold" style={{ color: barColor }}>{pct}%</span>
            </div>
        </div>
    );
}

// ─── Tab ───────────────────────────────────────────────────────────────────────

interface Props {
    workouts: Workout[];
}

export function ProfileWorkoutsTab({ workouts }: Props) {
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
    const { data: goals } = useGoals();

    const recentWorkouts = workouts.slice(0, 5);
    const activeGoals = (goals ?? [])
        .filter(g => g.milestonePercent < 100)
        .slice(0, 3);
    const completedGoals = (goals ?? [])
        .filter(g => g.milestonePercent >= 100)
        .slice(0, 2);

    const displayGoals = [...activeGoals, ...completedGoals].slice(0, 3);

    return (
        <>
            {/* Recent workouts */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Recent workouts</h3>
                    <Link
                        href="/workouts"
                        className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
                        style={{ color: '#C26D38' }}
                    >
                        See all
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                </div>

                {recentWorkouts.length === 0 ? (
                    <p className="text-sm text-surface-400 py-4 text-center">No workouts logged yet.</p>
                ) : (
                    <div className="space-y-2">
                        {recentWorkouts.map(w => (
                            <WorkoutCard
                                key={w.id}
                                workout={w}
                                onClick={() => setSelectedWorkoutId(w.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Goals */}
            {goals !== undefined && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Active goals</h3>
                        <Target className="h-4 w-4 text-surface-400" aria-hidden="true" />
                    </div>

                    {displayGoals.length === 0 ? (
                        <p className="text-sm text-surface-400 py-4 text-center">No goals set yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {displayGoals.map(g => <GoalCard key={g.id} goal={g} />)}
                        </div>
                    )}
                </div>
            )}

            {/* Detail modal */}
            <WorkoutDetailModal
                workoutId={selectedWorkoutId}
                onClose={() => setSelectedWorkoutId(null)}
            />
        </>
    );
}
