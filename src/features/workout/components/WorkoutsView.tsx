'use client';

import { useState, useMemo } from 'react';
import { Archive, Dumbbell } from 'lucide-react';
import { EmptyState } from '@/shared/ui';
import { useWorkouts } from '../hooks/useWorkouts';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { resolveKnownType } from '../typeConfig';
import { WorkoutStatsStrip } from './WorkoutStatsStrip';
import { WorkoutTypeFilter } from './WorkoutTypeFilter';
import { WorkoutCard } from './WorkoutCard';
import { WorkoutListSkeleton } from './WorkoutListSkeleton';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { ArchivedWorkoutDetailModal } from './ArchivedWorkoutDetailModal';
import type { KnownWorkoutType, Workout, WorkoutHistoryItem } from '../types';

type Tab = 'active' | 'archived';

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

// ─── Empty states ──────────────────────────────────────────────────────────────

function WorkoutsEmptyState({ filtered }: { filtered: boolean }) {
    return (
        <EmptyState
            icon={Dumbbell}
            title={filtered ? 'No workouts of this type' : 'No workouts yet'}
            description={filtered
                ? 'Try a different filter or log one now.'
                : 'Hit the "Log Workout" button to record your first session.'}
        />
    );
}

// ─── Active tab ────────────────────────────────────────────────────────────────

function ActiveTab() {
    const [selectedType, setSelectedType] = useState<KnownWorkoutType | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

    const { data: workouts, isLoading, isError } = useWorkouts();

    const filteredWorkouts = useMemo(() => {
        if (!workouts) return [];
        if (!selectedType) return workouts;
        return workouts.filter(w => resolveKnownType(w.workoutType) === selectedType);
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
                <WorkoutsEmptyState filtered={!!selectedType} />
            )}

            {!isLoading && !isError && grouped.map(group => (
                <div key={group.label} className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1 mb-3">
                        {group.label}
                    </p>
                    <div className="space-y-2.5">
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

// ─── Archived tab ──────────────────────────────────────────────────────────────

function ArchivedTab() {
    const [selectedItem, setSelectedItem] = useState<WorkoutHistoryItem | null>(null);
    const { data, isLoading, isError } = useWorkoutHistory(1, 50, true);
    const items = data?.items ?? [];

    if (isLoading) return <WorkoutListSkeleton />;

    if (isError) {
        return (
            <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
                <p className="text-sm font-medium text-foreground">Couldn't load archived workouts</p>
                <p className="text-xs text-surface-400 mt-1">Check your connection and try again.</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <EmptyState
                icon={Archive}
                title="No archived workouts"
                description="Deleted workouts show up here so you can restore them."
            />
        );
    }

    return (
        <>
            <div className="space-y-2.5">
                {items.map(item => (
                    <WorkoutCard
                        key={item.id}
                        workout={item}
                        onClick={() => setSelectedItem(item)}
                    />
                ))}
            </div>

            <ArchivedWorkoutDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </>
    );
}

// ─── View ──────────────────────────────────────────────────────────────────────

export function WorkoutsView() {
    const [tab, setTab] = useState<Tab>('active');

    return (
        <>
            <div className="flex border-b border-surface-200 mb-5">
                {([
                    { key: 'active', label: 'Active' },
                    { key: 'archived', label: 'Archived' },
                ] as const).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-1 mr-6 py-3 text-sm font-bold transition-colors relative ${tab === t.key ? 'text-primary-500' : 'text-surface-500'}`}
                    >
                        {t.label}
                        {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />}
                    </button>
                ))}
            </div>

            {tab === 'active' ? <ActiveTab /> : <ArchivedTab />}
        </>
    );
}
