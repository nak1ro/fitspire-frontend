'use client';

import { useState } from 'react';
import { ArrowRight, Dumbbell } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/shared/ui';
import { WorkoutCard } from '@/features/workout/components/WorkoutCard';
import { WorkoutDetailModal } from '@/features/workout/components/WorkoutDetailModal';
import type { Workout } from '@/features/workout/types';

interface Props {
    workouts: Workout[];
}

export function ProfileWorkoutsTab({ workouts }: Props) {
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    const recentWorkouts = workouts.slice(0, 5);

    return (
        <>
            {/* Recent workouts */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400">Recent workouts</h3>
                    <Link
                        href="/workouts"
                        className="flex items-center gap-1 text-xs font-semibold text-primary-500 transition-opacity hover:opacity-70"
                    >
                        See all
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                </div>

                {recentWorkouts.length === 0 ? (
                    <EmptyState
                        icon={Dumbbell}
                        title="No workouts yet"
                        description="Log your first workout to see it here."
                    />
                ) : (
                    <div className="space-y-2.5">
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

            {/* Detail modal */}
            <WorkoutDetailModal
                workoutId={selectedWorkoutId}
                onClose={() => setSelectedWorkoutId(null)}
            />
        </>
    );
}
