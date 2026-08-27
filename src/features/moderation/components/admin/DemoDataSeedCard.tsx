'use client';

import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, Button, Card } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useDemoDataStatus, useSeedDemoData } from '../../hooks/useAdminModeration';

export function DemoDataSeedCard() {
    const status = useDemoDataStatus();
    const { mutate: seed, isPending, error } = useSeedDemoData();

    const state = status.data?.state ?? 'NotStarted';
    const running = state === 'Running' || isPending;

    return (
        <Card padding="md" className="space-y-3">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-500" aria-hidden="true" />
                <p className="text-sm font-bold text-foreground">Demo data</p>
            </div>
            <p className="text-xs text-surface-500">
                One-off: creates a showcase account with workouts, meals, goals, badges, and a challenge, plus ten
                filler accounts to populate the feed and follower lists.
            </p>

            {state === 'Completed' ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Demo data has been seeded.
                </div>
            ) : (
                <Button onClick={() => seed()} loading={running} disabled={running} className="gap-1.5">
                    {running ? 'Seeding… this can take a few minutes' : state === 'Failed' ? 'Retry seeding' : 'Seed demo data'}
                </Button>
            )}

            {state === 'Failed' && status.data?.errorMessage && (
                <Alert variant="error">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>Seeding failed: {status.data.errorMessage}</span>
                    </div>
                </Alert>
            )}
            {error && <Alert variant="error">{getErrorMessage(error, 'Failed to start demo data seeding.')}</Alert>}
        </Card>
    );
}
