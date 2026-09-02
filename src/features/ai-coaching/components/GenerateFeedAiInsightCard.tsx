'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, Button, Card } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useQueueTodayDailyBriefing, useTodayDailyBriefing } from '../hooks/useCoachInteractions';

export function GenerateFeedAiInsightCard() {
    const [error, setError] = useState<string | null>(null);
    const { data: briefing } = useTodayDailyBriefing();
    const { mutateAsync: queueToday, isPending } = useQueueTodayDailyBriefing();
    const isGenerating = briefing?.status === 'Pending' || briefing?.status === 'Processing';

    if (briefing?.status === 'Completed') return null;

    const handleGenerate = async () => {
        setError(null);
        try {
            await queueToday();
        } catch (error) {
            setError(getErrorMessage(error, 'Failed to generate today’s summary.'));
        }
    };

    return (
        <Card padding="sm" className="space-y-3 border-primary-100 bg-primary-50">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-600" aria-hidden="true" />
                <p className="text-sm font-bold text-foreground">Fitspire AI summary</p>
            </div>
            {isGenerating ? (
                <div className="flex items-center gap-2 text-sm text-surface-500">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" aria-hidden="true" />
                    Creating today’s summary…
                </div>
            ) : (
                <>
                    <p className="text-xs leading-relaxed text-surface-500">Generate a fresh, data-backed insight for today.</p>
                    <Button size="sm" fullWidth onClick={handleGenerate} loading={isPending} className="gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Generate summary
                    </Button>
                </>
            )}
            {error && <Alert variant="error">{error}</Alert>}
        </Card>
    );
}
