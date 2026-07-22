import { Smile } from 'lucide-react';
import { Card } from '@/shared/ui';
import type { BodyCheckInSummary } from '../types';

interface MetricRowProps {
    label: string;
    current?: number | null;
    change?: number | null;
    unit: string;
}

function MetricRow({ label, current, change, unit }: MetricRowProps) {
    if (current == null) return null;
    const changeText = change != null && change !== 0
        ? `${change > 0 ? '+' : ''}${change.toFixed(1)}${unit}`
        : null;
    const changeColor = change == null || change === 0 ? 'text-surface-400' : change > 0 ? 'text-error' : 'text-success';

    return (
        <div className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
            <span className="text-sm text-surface-600">{label}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-foreground tabular-nums">{current.toFixed(1)}{unit}</span>
                {changeText && <span className={`text-xs font-medium tabular-nums ${changeColor}`}>{changeText}</span>}
            </div>
        </div>
    );
}

export function CheckInSummaryCard({ summary, isLoading }: { summary?: BodyCheckInSummary; isLoading?: boolean }) {
    if (isLoading) {
        return <div className="h-40 rounded-2xl bg-surface-100 animate-pulse" />;
    }

    if (!summary || summary.activeCheckInCount === 0) return null;

    const { current, changes, latestWellbeingScore } = summary;

    return (
        <Card padding="md" className="space-y-1">
            <MetricRow label="Weight" current={current.weightKg} change={changes.weightKg} unit=" kg" />
            <MetricRow label="Body fat" current={current.bodyFatPercent} change={changes.bodyFatPercent} unit="%" />
            <MetricRow label="Waist" current={current.waistCm} change={changes.waistCm} unit=" cm" />
            <MetricRow label="Chest" current={current.chestCm} change={changes.chestCm} unit=" cm" />
            <MetricRow label="Hips" current={current.hipsCm} change={changes.hipsCm} unit=" cm" />
            <MetricRow label="Arm" current={current.armCm} change={changes.armCm} unit=" cm" />
            <MetricRow label="Thigh" current={current.thighCm} change={changes.thighCm} unit=" cm" />

            {latestWellbeingScore != null && (
                <div className="flex items-center justify-between pt-2.5">
                    <span className="text-sm text-surface-600">Wellbeing</span>
                    <div className="flex items-center gap-1">
                        <Smile className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
                        <span className="text-sm font-bold text-foreground tabular-nums">{latestWellbeingScore}/5</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
