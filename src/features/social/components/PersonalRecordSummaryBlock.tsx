import { Sparkles, Trophy } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import { getTypeConfig } from '@/features/workout/typeConfig';
import { formatMetric, formatValue } from '@/features/workout/personalRecordFormat';
import type { PersonalRecordSummary } from '../types';

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Matches the Gym workout type color (TYPE_CONFIG.Gym / the app's primary emerald) — the same
// green as the "workout" chip these PR badges sit right next to on a workout-share post.
const RECORD_ACCENT = '#059669';
const RECORD_ACCENT_BG = 'rgba(5,150,105,0.08)';
const RECORD_ACCENT_BORDER = 'rgba(5,150,105,0.3)';

export function PersonalRecordSummaryBlock({ summary }: { summary: PersonalRecordSummary }) {
    const { color, bg } = getTypeConfig(summary.workoutType);
    const metricLabel = formatMetric(summary.metric);

    return (
        <div className="rounded-xl overflow-hidden mt-3 shadow-chip" style={{ border: `1px solid ${RECORD_ACCENT_BORDER}` }}>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ backgroundColor: RECORD_ACCENT_BG }}>
                <IconChip icon={Trophy} size="sm" color={color} bg={bg} />
                <span className="text-sm font-bold truncate" style={{ color: RECORD_ACCENT }}>{summary.exerciseName ?? metricLabel}</span>
                <span className="ml-auto flex items-center gap-1 text-xs font-bold shrink-0" style={{ color: RECORD_ACCENT }}>
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
