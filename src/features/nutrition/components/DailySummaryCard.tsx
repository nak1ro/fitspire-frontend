import { Settings2 } from 'lucide-react';
import { Card } from '@/shared/ui';
import type { DailyNutritionSummary, NutritionTargetProgress } from '../types';

interface Props {
    summary?: DailyNutritionSummary;
    onEditTargets: () => void;
}

function MacroBar({ label, value, progress, color }: { label: string; value: number; progress: NutritionTargetProgress; color: string }) {
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

export function DailySummaryCard({ summary, onEditTargets }: Props) {
    const totals = summary?.totals ?? { caloriesKcal: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 };
    const caloriesProgress = summary?.caloriesKcalProgress ?? {};
    const caloriesPct = caloriesProgress.percentage != null ? Math.min(100, Math.round(caloriesProgress.percentage)) : null;
    const hasTarget = Boolean(summary?.target);

    return (
        <Card padding="md" className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-extrabold text-foreground tabular-nums leading-none">
                        {Math.round(totals.caloriesKcal)}
                        <span className="text-sm font-medium text-surface-400 ml-1.5">
                            {caloriesProgress.target != null ? `/ ${Math.round(caloriesProgress.target)} kcal` : 'kcal'}
                        </span>
                    </p>
                    <p className="text-xs text-surface-500 mt-1">
                        {caloriesPct != null ? `${caloriesPct}% of your daily target` : hasTarget ? 'Calorie target not set' : 'Logged today'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onEditTargets}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all shrink-0"
                >
                    <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Targets
                </button>
            </div>

            {caloriesPct != null && (
                <div className="w-full h-2.5 rounded-full bg-surface-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${caloriesPct}%` }} />
                </div>
            )}

            <div className="flex gap-4">
                <MacroBar label="Protein" value={totals.proteinGrams} progress={summary?.proteinGramsProgress ?? {}} color="#2563EB" />
                <MacroBar label="Carbs" value={totals.carbsGrams} progress={summary?.carbsGramsProgress ?? {}} color="#C2703D" />
                <MacroBar label="Fat" value={totals.fatGrams} progress={summary?.fatGramsProgress ?? {}} color="#7B5EA7" />
            </div>
        </Card>
    );
}
