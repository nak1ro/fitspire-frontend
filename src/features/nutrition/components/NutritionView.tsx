'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Utensils } from 'lucide-react';
import { Button, EmptyState, Skeleton, SkeletonCard } from '@/shared/ui';
import { useDailyNutrition } from '../hooks/useNutrition';
import { MEAL_TYPES, MEAL_TYPE_CONFIG } from '../mealTypeConfig';
import { DailySummaryCard } from './DailySummaryCard';
import { MealCard } from './MealCard';
import { MealFormModal } from './MealFormModal';
import { NutritionTargetsModal } from './NutritionTargetsModal';
import { NutritionTrendsView } from './NutritionTrendsView';
import type { Meal } from '../types';

type Tab = 'today' | 'trends';

function toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function addDays(dateStr: string, delta: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + delta);
    return toISODate(date);
}

function formatDateLabel(dateStr: string): string {
    const today = toISODate(new Date());
    if (dateStr === today) return 'Today';
    if (dateStr === addDays(today, -1)) return 'Yesterday';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function DailySkeleton() {
    return (
        <div className="space-y-6" aria-label="Loading nutrition" aria-busy="true">
            <SkeletonCard className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-28 rounded-full" />
                        <Skeleton className="h-3 w-36 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
                <div className="flex gap-4">
                    <Skeleton className="h-8 flex-1 rounded-xl" />
                    <Skeleton className="h-8 flex-1 rounded-xl" />
                    <Skeleton className="h-8 flex-1 rounded-xl" />
                </div>
            </SkeletonCard>

            <Skeleton className="h-11 w-full rounded-xl animate-pulse" />

            <div className="space-y-2.5">
                <Skeleton className="h-3 w-20 rounded-full animate-pulse" />
                <SkeletonCard className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-32 rounded-full" />
                        <Skeleton className="h-3 w-24 rounded-full" />
                    </div>
                </SkeletonCard>
            </div>
        </div>
    );
}

export function NutritionView() {
    const [tab, setTab] = useState<Tab>('today');
    const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [targetsOpen, setTargetsOpen] = useState(false);

    const { data: summary, isLoading } = useDailyNutrition(selectedDate);
    const isToday = selectedDate === toISODate(new Date());

    const groupedMeals = useMemo(() => {
        const meals = summary?.meals ?? [];
        return MEAL_TYPES
            .map(type => ({ type, meals: meals.filter(m => m.mealType === type) }))
            .filter(group => group.meals.length > 0);
    }, [summary]);

    const closeModals = () => { setEditingMeal(null); setAddOpen(false); };

    return (
        <>
            <div className="flex border-b border-surface-200 mb-5">
                {(['today', 'trends'] as Tab[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-1 mr-6 py-3 text-sm font-bold transition-colors relative capitalize ${tab === t ? 'text-primary-500' : 'text-surface-500'}`}
                    >
                        {t}
                        {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />}
                    </button>
                ))}
            </div>

            {tab === 'trends' ? (
                <NutritionTrendsView />
            ) : (
                <>
            {/* Date navigator */}
            <div className="flex items-center justify-between mb-5">
                <button
                    type="button"
                    onClick={() => setSelectedDate(d => addDays(d, -1))}
                    className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 hover:text-foreground transition-all"
                    aria-label="Previous day"
                >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <p className="text-sm font-bold text-foreground">{formatDateLabel(selectedDate)}</p>
                <button
                    type="button"
                    onClick={() => setSelectedDate(d => addDays(d, 1))}
                    disabled={isToday}
                    className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 hover:text-foreground transition-all disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Next day"
                >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {isLoading ? (
                <DailySkeleton />
            ) : (
                <div className="space-y-6">
                    <DailySummaryCard summary={summary} onEditTargets={() => setTargetsOpen(true)} />

                    <Button onClick={() => setAddOpen(true)} fullWidth className="gap-2">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Log meal
                    </Button>

                    {groupedMeals.length === 0 ? (
                        <EmptyState
                            icon={Utensils}
                            title="No meals logged"
                            description={isToday ? "Log what you've eaten today to start tracking." : "Nothing was logged on this day."}
                        />
                    ) : (
                        groupedMeals.map(group => (
                            <div key={group.type} className="space-y-2.5">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">
                                    {MEAL_TYPE_CONFIG[group.type].label}
                                </h3>
                                <div className="space-y-2.5">
                                    {group.meals.map(meal => (
                                        <MealCard key={meal.id} meal={meal} onClick={() => setEditingMeal(meal)} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
                </>
            )}

            <MealFormModal
                open={addOpen || Boolean(editingMeal)}
                onClose={closeModals}
                meal={editingMeal}
                defaultDate={selectedDate}
            />

            <NutritionTargetsModal open={targetsOpen} onClose={() => setTargetsOpen(false)} />
        </>
    );
}
