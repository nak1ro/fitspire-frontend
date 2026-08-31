import { Sparkles, Trophy } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import { getTypeConfig } from '@/features/workout/typeConfig';
import { formatMetric, formatValue } from '@/features/workout/personalRecordFormat';
import type { PersonalRecordSummary } from '../types';

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PersonalRecordSummaryBlock({ summary }: { summary: PersonalRecordSummary }) {
    const { color, bg } = getTypeConfig(summary.workoutType);
    const metricLabel = formatMetric(summary.metric);

    return (
        <div className="rounded-xl overflow-hidden border border-warning/25 mt-3 shadow-chip">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-warning/5">
                <IconChip icon={Trophy} size="sm" color={color} bg={bg} />
                <span className="text-sm font-bold text-warning truncate">{summary.exerciseName ?? metricLabel}</span>
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-warning/70 shrink-0">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    New PR!
                </span>
            </div>

            <div className="flex items-center flex-wrap gap-x-5 gap-y-1 px-3.5 py-3 bg-background">
                {summary.exerciseName && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">{metricLabel}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">{formatValue(summary.value, summary.unit)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">{formatDate(summary.achievedAt)}</span>
                </div>
            </div>
        </div>
    );
}
