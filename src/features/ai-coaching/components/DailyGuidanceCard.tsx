'use client';

import { useState } from 'react';
import { Dumbbell, Heart, Flame, Calendar, Utensils, Sparkles, Info, Loader2, type LucideIcon } from 'lucide-react';
import { Alert, Badge, Button, Card, EmptyState, Skeleton, SkeletonCard } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useTodayDailyBriefing, useQueueTodayDailyBriefing, useRetryDailyBriefing } from '../hooks/useCoachInteractions';
import { CoachMarkdown } from './CoachMarkdown';
import type { DailyCoachFocus } from '../types';

const FOCUS_CONFIG: Record<DailyCoachFocus, { label: string; Icon: LucideIcon }> = {
    Train: { label: 'Train', Icon: Dumbbell },
    Recover: { label: 'Recover', Icon: Heart },
    StayConsistent: { label: 'Stay consistent', Icon: Flame },
    Plan: { label: 'Plan ahead', Icon: Calendar },
    Nutrition: { label: 'Nutrition', Icon: Utensils },
    Wellbeing: { label: 'Wellbeing', Icon: Sparkles },
    InsufficientData: { label: 'Getting started', Icon: Info },
};

function ViewSkeleton() {
    return (
        <div className="space-y-4" aria-label="Loading today's guidance" aria-busy="true">
            <SkeletonCard className="p-5 space-y-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full rounded-full" />
                    <Skeleton className="h-3 w-5/6 rounded-full" />
                </div>
            </SkeletonCard>

            <div className="space-y-2.5">
                <Skeleton className="h-3 w-20 rounded-full animate-pulse" />
                <SkeletonCard className="space-y-2">
                    <Skeleton className="h-3.5 w-2/3 rounded-full" />
                    <Skeleton className="h-3 w-full rounded-full" />
                </SkeletonCard>
            </div>

            <div className="space-y-2.5">
                <Skeleton className="h-3 w-14 rounded-full animate-pulse" />
                <SkeletonCard className="space-y-2">
                    <Skeleton className="h-3 w-full rounded-full" />
                    <Skeleton className="h-3 w-4/5 rounded-full" />
                </SkeletonCard>
            </div>
        </div>
    );
}

export function DailyGuidanceCard() {
    const [actionError, setActionError] = useState<string | null>(null);
    const { data: briefing, isLoading } = useTodayDailyBriefing();
    const { mutateAsync: queueToday, isPending: queuing } = useQueueTodayDailyBriefing();
    const { mutateAsync: retry, isPending: retrying } = useRetryDailyBriefing();

    const handleQueue = async () => {
        setActionError(null);
        try {
            await queueToday();
        } catch (err) {
            setActionError(getErrorMessage(err, 'Failed to get today’s guidance.'));
        }
    };

    const handleRetry = async () => {
        if (!briefing) return;
        setActionError(null);
        try {
            await retry(briefing.id);
        } catch (err) {
            setActionError(getErrorMessage(err, 'Failed to retry.'));
        }
    };

    if (isLoading) return <ViewSkeleton />;

    if (!briefing) {
        return (
            <div className="space-y-4">
                {actionError && <Alert variant="error">{actionError}</Alert>}
                <EmptyState
                    icon={Sparkles}
                    title="No guidance yet today"
                    description="Get a quick daily card with a focus for today, one suggested action, and a short insight based on your recent activity."
                    action={
                        <Button onClick={handleQueue} loading={queuing} className="gap-2">
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            Get today&apos;s guidance
                        </Button>
                    }
                />
            </div>
        );
    }

    const isPending = briefing.status === 'Pending' || briefing.status === 'Processing';
    const focus = briefing.content ? FOCUS_CONFIG[briefing.content.focus as DailyCoachFocus] : undefined;

    return (
        <div className="space-y-4">
            {actionError && <Alert variant="error">{actionError}</Alert>}

            {isPending && (
                <div className="flex flex-col items-center gap-3 py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-500" aria-hidden="true" />
                    <p className="text-sm text-surface-500">Putting together today&apos;s guidance…</p>
                </div>
            )}

            {briefing.status === 'Failed' && (
                <div className="space-y-3">
                    <Alert variant="error">{briefing.failureMessage ?? 'Failed to generate today’s guidance.'}</Alert>
                    {briefing.canRetry && (
                        <Button onClick={handleRetry} loading={retrying} fullWidth>
                            Try again
                        </Button>
                    )}
                </div>
            )}

            {briefing.status === 'Completed' && briefing.content && (
                <div className="space-y-4">
                    <Card padding="md" className="space-y-3">
                        {focus && (
                            <Badge variant="primary" size="sm" className="gap-1.5">
                                <focus.Icon className="h-3 w-3" aria-hidden="true" />
                                {focus.label}
                            </Badge>
                        )}
                        <h2 className="text-base font-extrabold text-foreground leading-snug">{briefing.content.headline}</h2>
                        <CoachMarkdown>{briefing.content.summaryMarkdown}</CoachMarkdown>
                    </Card>

                    <div className="space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">Next action</h3>
                        <Card padding="sm" className="bg-primary-50">
                            <p className="text-sm font-semibold text-foreground">{briefing.content.nextAction.title}</p>
                            <p className="text-xs text-surface-600 leading-relaxed mt-1">{briefing.content.nextAction.description}</p>
                        </Card>
                    </div>

                    <div className="space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">Insight</h3>
                        <Card padding="sm">
                            <CoachMarkdown>{briefing.content.insightMarkdown}</CoachMarkdown>
                        </Card>
                    </div>

                    {briefing.content.dataLimitations.length > 0 && (
                        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-surface-100">
                            <Info className="h-4 w-4 text-surface-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div className="space-y-1">
                                {briefing.content.dataLimitations.map((limitation, i) => (
                                    <p key={i} className="text-xs text-surface-500 leading-relaxed">{limitation}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-[11px] text-surface-400 leading-relaxed px-1">{briefing.wellnessDisclaimer}</p>
                </div>
            )}
        </div>
    );
}
