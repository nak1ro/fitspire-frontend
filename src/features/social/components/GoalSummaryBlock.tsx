import { CheckCircle2, Trophy } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import type { GoalSummary } from '../types';

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function GoalSummaryBlock({ summary }: { summary: GoalSummary }) {
    return (
        <div className="rounded-xl overflow-hidden border border-warning/25 mt-3 shadow-chip">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-warning/5">
                <IconChip icon={Trophy} size="sm" variant="warning" />
                <span className="text-sm font-bold text-warning">{summary.goalTypeName}</span>
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-warning/70">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Achieved
                </span>
            </div>

            <div className="flex items-center flex-wrap gap-x-5 gap-y-1 px-3.5 py-3 bg-background">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">{summary.targetValue} {summary.unit}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground">{formatDate(summary.completedAt)}</span>
                </div>
            </div>
        </div>
    );
}
