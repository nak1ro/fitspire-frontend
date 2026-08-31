'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpRight, Calendar, ChevronDown, Dumbbell, Flame, Heart, Info, Sparkles, Utensils, type LucideIcon } from 'lucide-react';
import { Button, Card, Skeleton } from '@/shared/ui';
import { useAppShellActions } from '@/features/app-shell/components/AppShellActionsProvider';
import { useTodayDailyBriefing } from '../hooks/useCoachInteractions';
import { CoachMarkdown } from './CoachMarkdown';
import type { DailyCoachFocus } from '../types';

const FOCUS_ICONS: Record<DailyCoachFocus, LucideIcon> = {
    Train: Dumbbell, Recover: Heart, StayConsistent: Flame, Plan: Calendar,
    Nutrition: Utensils, Wellbeing: Sparkles, InsufficientData: Info,
};

interface FeedAiInsightCardProps {
    collapsed?: boolean;
    onToggleCollapsed?: () => void;
}

export function FeedAiInsightCard({ collapsed = false, onToggleCollapsed }: FeedAiInsightCardProps) {
    const router = useRouter();
    const { openLogWorkout } = useAppShellActions();
    const { data: briefing, isLoading } = useTodayDailyBriefing();

    if (isLoading) return <Skeleton className="h-40 rounded-2xl" />;
    if (briefing?.status !== 'Completed' || !briefing.content) return null;

    const focus = briefing.content.focus as DailyCoachFocus;
    const Icon = FOCUS_ICONS[focus] ?? Sparkles;
    const isNutrition = focus === 'Nutrition';
    const isPlanning = focus === 'Plan';
    const handleAction = () => {
        if (isNutrition) { router.push('/nutrition'); return; }
        if (isPlanning) { router.push('/goals'); return; }
        openLogWorkout();
    };

    return (
        <Card padding="sm" className={`relative overflow-hidden bg-primary-50 ${collapsed ? '' : 'space-y-3'}`}>
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary-100" aria-hidden="true" />
            <div className="relative flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-primary-700">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    FITSPIRE AI
                </span>
                <div className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                    {onToggleCollapsed && (
                        <button
                            type="button"
                            onClick={onToggleCollapsed}
                            className="rounded-md p-0.5 text-primary-600 transition-colors hover:bg-primary-100"
                            aria-label={collapsed ? 'Expand AI insight' : 'Collapse AI insight'}
                            aria-expanded={!collapsed}
                        >
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
            <p className="relative text-sm font-bold text-foreground leading-snug">{briefing.content.headline}</p>
            <div className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                <div className="min-h-0 space-y-3 overflow-hidden">
                    <CoachMarkdown>{briefing.content.insightMarkdown}</CoachMarkdown>
                    <Button size="sm" fullWidth onClick={handleAction} className="relative gap-1.5">
                        {isNutrition ? 'Log a meal' : isPlanning ? 'View goals' : 'Log workout'}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
