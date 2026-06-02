'use client';

import { useState, useMemo } from 'react';
import { Dumbbell } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { WorkoutStatsStrip } from './WorkoutStatsStrip';
import { WorkoutTypeFilter } from './WorkoutTypeFilter';
import { WorkoutCard } from './WorkoutCard';
import { WorkoutListSkeleton } from './WorkoutListSkeleton';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import type { KnownWorkoutType, Workout } from '../types';

// ─── Month grouping ────────────────────────────────────────────────────────────

interface MonthGroup {
    label: string;
    items: Workout[];
}

function groupByMonth(workouts: Workout[]): MonthGroup[] {
    const groups = new Map<string, Workout[]>();
    for (const w of workouts) {
        const key = new Date(w.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(w);
    }
    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

// ─── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
    return (
        <div className="flex flex-col items-center text-center py-16 px-6 space-y-4">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(194,109,56,0.08)' }}
            >
                <Dumbbell className="h-7 w-7" style={{ color: '#C26D38' }} aria-hidden="true" />
            </div>
            <div className="space-y-1.5 max-w-xs">
                <p className="text-base font-semibold text-foreground">
                    {filtered ? 'No workouts of this type' : 'No workouts yet'}
                </p>
                <p className="text-sm text-surface-500 leading-relaxed">
                    {filtered
                        ? 'Try a different filter or log one now.'
                        : 'Hit the "Log Workout" button to record your first session.'}
                </p>
            </div>
        </div>
    );
}

// ─── View ──────────────────────────────────────────────────────────────────────

export function WorkoutsView() {
    const [selectedType, setSelectedType] = useState<KnownWorkoutType | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    const { data: workouts, isLoading, isError } = useWorkouts();

    const filteredWorkouts = useMemo(() => {
        if (!workouts) return [];
        if (!selectedType) return workouts;
        return workouts.filter(w => w.workoutType === selectedType);
    }, [workouts, selectedType]);

    const grouped = useMemo(() => groupByMonth(filteredWorkouts), [filteredWorkouts]);

    return (
        <>
            {/* Stats strip — always uses unfiltered list */}
            <WorkoutStatsStrip workouts={workouts ?? []} />

            {/* Type filter chips */}
            <WorkoutTypeFilter value={selectedType} onChange={setSelectedType} />

            {/* List */}
            {isLoading && <WorkoutListSkeleton />}

            {isError && (
                <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
                    <p className="text-sm font-medium text-foreground">Couldn't load workouts</p>
                    <p className="text-xs text-surface-400 mt-1">Check your connection and try again.</p>
                </div>
            )}

            {!isLoading && !isError && filteredWorkouts.length === 0 && (
                <EmptyState filtered={!!selectedType} />
            )}

            {!isLoading && !isError && grouped.map(group => (
                <div key={group.label} className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1 mb-2">
                        {group.label}
                    </p>
                    <div className="space-y-2">
                        {group.items.map(w => (
                            <WorkoutCard
                                key={w.id}
                                workout={w}
                                onClick={() => setSelectedWorkoutId(w.id)}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {/* Detail modal */}
            <WorkoutDetailModal
                workoutId={selectedWorkoutId}
                onClose={() => setSelectedWorkoutId(null)}
            />
        </>
    );
}
