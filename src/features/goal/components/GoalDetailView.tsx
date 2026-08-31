'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, Check, Flame, History, Pencil, Share2, Target, TrendingUp } from 'lucide-react';
import { Alert, Badge, Button, Card, ChipGroup, EmptyState, IconChip } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { roundTo1 } from '@/shared/lib/roundTo1';
import { usePublicGoalDetail, useMySharedGoalIds } from '@/features/social/hooks/useSocialReads';
import { useComposerDraftStore } from '@/features/social/store/composerDraftStore';
import { useArchiveGoal, useGoal, useGoalPeriods, useGoalProgress, useGoalTargetHistory, useGoalTypes } from '../hooks/useGoals';
import { getCategoryConfig } from '../categoryConfig';
import { EditGoalModal } from './EditGoalModal';

type HistoryTab = 'progress' | 'periods' | 'targets';

const TAB_OPTIONS: { value: HistoryTab; label: string }[] = [
    { value: 'progress', label: 'Progress' },
    { value: 'periods', label: 'Periods' },
    { value: 'targets', label: 'Targets' },
];

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function DetailSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-40 rounded-2xl bg-surface-100" />
            <div className="h-11 rounded-xl bg-surface-100" />
            <div className="h-48 rounded-2xl bg-surface-100" />
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-surface-100 animate-pulse" />
            ))}
        </div>
    );
}

function ProgressTab({ goalId }: { goalId: string }) {
    const { data, isLoading } = useGoalProgress(goalId);
    const entries = data?.items ?? [];

    if (isLoading) return <ListSkeleton />;
    if (entries.length === 0) return <EmptyState icon={TrendingUp} title="No progress recorded yet" description="Updates appear here as your contributions are recalculated." />;

    return (
        <div className="space-y-2">
            {entries.map((entry) => (
                <Card key={entry.id} padding="sm" className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            {roundTo1(entry.previousValue)} → {roundTo1(entry.newValue)}
                        </p>
                        <p className="text-xs text-surface-400 mt-0.5">{formatDateTime(entry.recordedAt)}{entry.source ? ` · ${entry.source}` : ''}</p>
                    </div>
                    <span className={entry.delta >= 0 ? 'text-sm font-bold text-success tabular-nums' : 'text-sm font-bold text-error tabular-nums'}>
                        {entry.delta >= 0 ? '+' : ''}{roundTo1(entry.delta)}
                    </span>
                </Card>
            ))}
        </div>
    );
}

const PERIOD_STATUS_VARIANT: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
    Active: 'primary',
    Completed: 'success',
    Failed: 'error',
};

function PeriodsTab({ goalId }: { goalId: string }) {
    const { data, isLoading } = useGoalPeriods(goalId);
    const periods = data?.items ?? [];

    if (isLoading) return <ListSkeleton />;
    if (periods.length === 0) return <EmptyState icon={History} title="No periods yet" description="Recurring goals build up period history over time." />;

    return (
        <div className="space-y-2">
            {periods.map((period) => (
                <Card key={period.id} padding="sm" className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-surface-500">{formatDate(period.startAt)} – {formatDate(period.endAt)}</p>
                        <Badge variant={PERIOD_STATUS_VARIANT[period.status] ?? 'default'} size="sm">{period.status}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{roundTo1(period.progressValue)} / {roundTo1(period.targetValue)}</p>
                </Card>
            ))}
        </div>
    );
}

function TargetsTab({ goalId }: { goalId: string }) {
    const { data, isLoading } = useGoalTargetHistory(goalId);
    const changes = data?.items ?? [];

    if (isLoading) return <ListSkeleton />;
    if (changes.length === 0) return <EmptyState icon={Pencil} title="No target changes yet" description="Changing your target creates a record here." />;

    return (
        <div className="space-y-2">
            {changes.map((change) => (
                <Card key={change.id} padding="sm" className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                        {roundTo1(change.previousTargetValue)} → {roundTo1(change.newTargetValue)}
                    </p>
                    <p className="text-xs text-surface-400">{formatDate(change.changedAt)}</p>
                </Card>
            ))}
        </div>
    );
}

// Read-only view for someone else's goal, reached from a feed post's goal badge —
// only the snapshot fields the social API exposes (no periods/progress/target history,
// no edit/archive actions).
function PublicGoalDetail({ goalId, ownerId }: { goalId: string; ownerId: string }) {
    const { data: goal, isLoading, isError } = usePublicGoalDetail(ownerId, goalId);

    if (isLoading) return <DetailSkeleton />;

    if (isError || !goal) {
        return (
            <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
                <p className="text-sm font-medium text-foreground">Couldn&apos;t load this goal</p>
                <p className="text-xs text-surface-400 mt-1">It may no longer be available.</p>
            </div>
        );
    }

    const pct = goal.targetValue > 0 ? Math.min(100, Math.max(0, Math.round((goal.currentValue / goal.targetValue) * 100))) : 0;
    const done = goal.status === 'Completed';

    return (
        <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <IconChip icon={Target} />
                    <h1 className="text-lg font-extrabold text-foreground leading-tight truncate">{goal.templateName}</h1>
                </div>
                <Badge variant={done ? 'success' : 'primary'} size="sm">{goal.status}</Badge>
            </div>

            <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                <div
                    className={done ? 'h-full rounded-full bg-success transition-all duration-500' : 'h-full rounded-full bg-gradient-primary transition-all duration-500'}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-surface-500">{roundTo1(goal.currentValue)} / {roundTo1(goal.targetValue)} {goal.unit}</span>
                <span className="text-sm font-bold text-primary-600">{pct}%</span>
            </div>
        </Card>
    );
}

export function GoalDetailView({ goalId, ownerId }: { goalId: string; ownerId?: string }) {
    if (ownerId) {
        return <PublicGoalDetail goalId={goalId} ownerId={ownerId} />;
    }

    return <PrivateGoalDetail goalId={goalId} />;
}

function PrivateGoalDetail({ goalId }: { goalId: string }) {
    const router = useRouter();
    const { data: detail, isLoading, isError } = useGoal(goalId);
    const { data: goalTypes } = useGoalTypes();
    const { data: sharedGoalIds } = useMySharedGoalIds();
    const { mutate: archiveGoal, isPending: archiving } = useArchiveGoal();
    const [editOpen, setEditOpen] = useState(false);
    const [archiveConfirming, setArchiveConfirming] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [tab, setTab] = useState<HistoryTab>('progress');

    if (isLoading) return <DetailSkeleton />;

    if (isError || !detail) {
        return (
            <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
                <p className="text-sm font-medium text-foreground">Couldn't load this goal</p>
                <p className="text-xs text-surface-400 mt-1">It may not exist, or you don't have access to it.</p>
            </div>
        );
    }

    const { goal, currentPeriod, canEdit, canArchive } = detail;
    const category = goalTypes?.find((type) => type.id === goal.goalTypeId)?.category;
    const { Icon, color, bg } = getCategoryConfig(category);
    // goal.milestonePercent is bucketed to 0/25/50/75/100 on the backend for milestone-notification
    // gating — compute the real continuous percentage here instead so the bar/label match currentValue.
    const rawPct = goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0;
    const pct = Math.min(100, Math.max(0, Math.round(rawPct)));

    const handleArchive = () => {
        if (!archiveConfirming) { setArchiveConfirming(true); return; }
        setActionError(null);
        archiveGoal(goal.id, {
            onError: (err) => { setActionError(getErrorMessage(err, 'Failed to archive goal.')); setArchiveConfirming(false); },
        });
    };

    // Mirrors AttachGoalPicker's own eligibility filter — a goal that wouldn't show up
    // there isn't shareable from here either.
    const canShare = goal.status === 'Completed' && goal.isPublic;
    const shared = (sharedGoalIds ?? []).includes(goal.id);
    const handleShare = () => {
        useComposerDraftStore.getState().setPending({
            attachment: { type: 'goal', item: goal },
            caption: 'Just completed this goal! 🎯',
        });
        router.push('/feed');
    };

    return (
        <div className="space-y-5">
            <Card padding="md" className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <IconChip icon={Icon} color={color} bg={bg} />
                        <div className="min-w-0">
                            <h1 className="text-lg font-extrabold text-foreground leading-tight">{goal.goalTypeName}</h1>
                            {goal.deadline && <p className="text-xs text-surface-400 mt-0.5">Due {formatDate(goal.deadline)}</p>}
                        </div>
                    </div>
                    <Badge variant={goal.status === 'Active' ? 'primary' : goal.status === 'Completed' ? 'success' : goal.status === 'Failed' ? 'error' : 'default'} size="sm">
                        {goal.status}
                    </Badge>
                </div>

                <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-500">{roundTo1(goal.currentValue)} / {roundTo1(goal.targetValue)} {goal.unit}</span>
                    <div className="flex items-center gap-3">
                        {goal.isRecurring && goal.currentStreak > 0 && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-warning">
                                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                                {goal.currentStreak}
                            </span>
                        )}
                        <span className="text-sm font-bold text-primary-600">{pct}%</span>
                    </div>
                </div>
            </Card>

            {(canEdit || canArchive || canShare) && (
                <div className="flex items-center gap-2 flex-wrap">
                    {canEdit && (
                        <button
                            onClick={() => setEditOpen(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                        >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                        </button>
                    )}
                    {canShare && (
                        <button
                            onClick={handleShare}
                            disabled={shared}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all disabled:opacity-50"
                        >
                            {shared ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Share2 className="h-3.5 w-3.5" aria-hidden="true" />}
                            {shared ? 'Shared to feed' : 'Share to feed'}
                        </button>
                    )}
                    {canArchive && (
                        <button
                            onClick={handleArchive}
                            disabled={archiving}
                            className={
                                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50 ' +
                                (archiveConfirming ? 'border-error text-error bg-error/5' : 'border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground')
                            }
                        >
                            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                            {archiveConfirming ? 'Confirm archive' : 'Archive'}
                        </button>
                    )}
                </div>
            )}

            {actionError && <Alert variant="error">{actionError}</Alert>}

            {currentPeriod && (
                <Card padding="sm" className="space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-widest text-surface-400">Current period</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-surface-500">{formatDate(currentPeriod.startAt)} – {formatDate(currentPeriod.endAt)}</p>
                        <Badge variant={PERIOD_STATUS_VARIANT[currentPeriod.status] ?? 'default'} size="sm">{currentPeriod.status}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{roundTo1(currentPeriod.progressValue)} / {roundTo1(currentPeriod.targetValue)}</p>
                </Card>
            )}

            <div className="space-y-2.5">
                <ChipGroup options={TAB_OPTIONS} value={tab} onChange={(v) => v && setTab(v)} />
                {tab === 'progress' && <ProgressTab goalId={goalId} />}
                {tab === 'periods' && <PeriodsTab goalId={goalId} />}
                {tab === 'targets' && <TargetsTab goalId={goalId} />}
            </div>

            <EditGoalModal goal={goal} open={editOpen} onClose={() => setEditOpen(false)} />
        </div>
    );
}
