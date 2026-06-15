import { Card } from '@/shared/ui';
import type { Goal } from '../types';

function formatDeadline(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(goal: Goal): boolean {
    if (!goal.deadline) return false;
    return new Date(goal.deadline) < new Date() && goal.milestonePercent < 100;
}

interface GoalCardProps {
    goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
    const pct = Math.min(100, Math.round(goal.milestonePercent));
    const done = pct >= 100;
    const overdue = isOverdue(goal);

    const barColor = done
        ? '#4A7C5F'
        : overdue
        ? '#C0392B'
        : '#059669';

    const barGradient = done
        ? 'linear-gradient(to right, #4A7C5F, #7AB895)'
        : overdue
        ? 'linear-gradient(to right, #C0392B, #E57368)'
        : 'linear-gradient(to right, #059669, #34D399)';

    return (
        <Card padding="sm" interactive className="space-y-2.5">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground leading-tight">{goal.goalTypeName}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                    {done && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: 'rgba(74,124,95,0.10)', color: '#4A7C5F' }}>
                            Done
                        </span>
                    )}
                    {overdue && !done && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg"
                            style={{ backgroundColor: 'rgba(192,57,43,0.10)', color: '#C0392B' }}>
                            Overdue
                        </span>
                    )}
                    {goal.deadline && !done && (
                        <span className="text-[11px] text-surface-400">by {formatDeadline(goal.deadline)}</span>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: barGradient }}
                />
            </div>

            {/* Values */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <span className="text-xs font-bold" style={{ color: barColor }}>{pct}%</span>
            </div>
        </Card>
    );
}
