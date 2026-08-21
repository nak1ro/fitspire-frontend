import { Flame } from 'lucide-react';
import { Badge, Card, IconChip } from '@/shared/ui';
import { getCategoryConfig } from '../categoryConfig';
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
    category?: string;
    onClick?: () => void;
}

export function GoalCard({ goal, category, onClick }: GoalCardProps) {
    // goal.milestonePercent is bucketed to 0/25/50/75/100 on the backend for milestone-notification
    // gating — compute the real continuous percentage here instead so the bar/label match currentValue.
    const rawPct = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
    const pct = Math.min(100, Math.max(0, Math.round(rawPct)));
    const done = goal.status === 'Completed' || pct >= 100;
    const failed = goal.status === 'Failed';
    const archived = goal.status === 'Archived';
    const overdue = !done && !failed && !archived && isOverdue(goal);
    const { Icon, color, bg } = getCategoryConfig(category);

    const barClass = done
        ? 'bg-success'
        : failed || overdue
        ? 'bg-error'
        : archived
        ? 'bg-surface-400'
        : 'bg-gradient-primary';

    const pctColor = done ? 'text-success' : failed || overdue ? 'text-error' : archived ? 'text-surface-500' : 'text-primary-600';

    return (
        <Card padding="sm" interactive onClick={onClick} className="space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <IconChip icon={Icon} size="sm" color={color} bg={bg} />
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{goal.goalTypeName}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {done && <Badge variant="success" size="sm">Done</Badge>}
                    {failed && !done && <Badge variant="error" size="sm">Failed</Badge>}
                    {archived && !done && !failed && <Badge variant="default" size="sm">Archived</Badge>}
                    {overdue && <Badge variant="error" size="sm">Overdue</Badge>}
                    {goal.deadline && !done && !failed && !archived && !overdue && (
                        <span className="text-[11px] text-surface-400">by {formatDeadline(goal.deadline)}</span>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            {/* Values */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-surface-500">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <div className="flex items-center gap-3">
                    {goal.isRecurring && goal.currentStreak > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-warning">
                            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                            {goal.currentStreak}
                        </span>
                    )}
                    <span className={`text-xs font-bold ${pctColor}`}>{pct}%</span>
                </div>
            </div>
        </Card>
    );
}
