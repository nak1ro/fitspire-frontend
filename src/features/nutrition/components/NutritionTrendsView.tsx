'use client';

import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, EmptyState } from '@/shared/ui';
import { useNutritionSummary } from '../hooks/useNutrition';
import { DailyCaloriesChart } from './DailyCaloriesChart';
import type { NutritionTargetProgress } from '../types';

type RangeOption = 7 | 30 | 90;

const RANGE_OPTIONS: { value: RangeOption; label: string }[] = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
];

function toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function daysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1));
    return toISODate(d);
}

function AverageMacroBar({ label, value, progress, color }: {
    label: string;
    value: number;
    progress: NutritionTargetProgress;
    color: string;
}) {
    const pct = progress.percentage != null ? Math.min(100, Math.round(progress.percentage)) : null;

    return (
        <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-surface-500">{label}</span>
                <span className="text-xs text-surface-400 tabular-nums">
                    {Math.round(value)}{progress.target != null ? ` / ${Math.round(progress.target)}g` : 'g'}
                </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-200 overflow-hidden">
                {pct != null && (
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
                )}
            </div>
        </div>
    );
}

function TrendsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-11 rounded-xl bg-surface-100" />
            <div className="h-48 rounded-2xl bg-surface-100" />
            <div className="h-40 rounded-2xl bg-surface-100" />
        </div>
    );
}

export function NutritionTrendsView() {
    const [range, setRange] = useState<RangeOption>(7);

    const filter = useMemo(() => ({ from: daysAgo(range), to: toISODate(new Date()) }), [range]);
    const { data: summary, isLoading } = useNutritionSummary(filter);

    return (
        <div className="space-y-5">
            <div className="flex gap-2">
                {RANGE_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRange(opt.value)}
                        className={
                            'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ' +
                            (range === opt.value
                                ? 'bg-primary-50 border-primary-500 text-primary-600'
                                : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                        }
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {isLoading || !summary ? (
                <TrendsSkeleton />
            ) : summary.loggedDayCount === 0 ? (
                <EmptyState
                    icon={TrendingUp}
                    title="Nothing logged yet"
                    description="Log meals over a few days to see trends here."
                />
            ) : (
                <>
                    <Card padding="md" className="space-y-4">
                        <div>
                            <p className="text-3xl font-extrabold text-foreground tabular-nums leading-none">
                                {Math.round(summary.averagePerLoggedDay?.caloriesKcal ?? 0)}
                                <span className="text-sm font-medium text-surface-400 ml-1.5">
                                    {summary.caloriesKcalAverageProgress.target != null
                                        ? `/ ${Math.round(summary.caloriesKcalAverageProgress.target)} kcal avg`
                                        : 'kcal avg'}
                                </span>
                            </p>
                            <p className="text-xs text-surface-500 mt-1">
                                Logged {summary.loggedDayCount} of {summary.calendarDayCount} days
                            </p>
                        </div>

                        <DailyCaloriesChart points={summary.dailyTotals} targetCalories={summary.caloriesKcalAverageProgress.target} />

                        <div className="flex gap-4 pt-1">
                            <AverageMacroBar
                                label="Protein"
                                value={summary.averagePerLoggedDay?.proteinGrams ?? 0}
                                progress={summary.proteinGramsAverageProgress}
                                color="#2563EB"
                            />
                            <AverageMacroBar
                                label="Carbs"
                                value={summary.averagePerLoggedDay?.carbsGrams ?? 0}
                                progress={summary.carbsGramsAverageProgress}
                                color="#C2703D"
                            />
                            <AverageMacroBar
                                label="Fat"
                                value={summary.averagePerLoggedDay?.fatGrams ?? 0}
                                progress={summary.fatGramsAverageProgress}
                                color="#7B5EA7"
                            />
                        </div>
                    </Card>

                    <Card padding="sm" className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-surface-600">Total logged</p>
                        <p className="text-sm font-bold text-foreground tabular-nums">
                            {Math.round(summary.totals.caloriesKcal)} kcal
                        </p>
                    </Card>
                </>
            )}
        </div>
    );
}
