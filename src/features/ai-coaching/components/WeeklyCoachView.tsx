'use client';

import { useState } from 'react';
import { Loader2, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import { Alert, Badge, Button, EmptyState } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import {
    useWeeklyCoachReports, useWeeklyCoachReport,
    useGenerateWeeklyCoachReport, useDeleteWeeklyCoachReport,
} from '../hooks/useWeeklyCoachReports';
import { ReportContent } from './ReportContent';
import { ReportHistoryList } from './ReportHistoryList';

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ViewSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-24 rounded-2xl bg-surface-100" />
            <div className="h-32 rounded-2xl bg-surface-100" />
            <div className="h-32 rounded-2xl bg-surface-100" />
        </div>
    );
}

export function WeeklyCoachView() {
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: history, isLoading: loadingHistory } = useWeeklyCoachReports({ pageSize: 20 });
    const latestId = history?.items[0]?.id ?? null;
    const activeId = viewingId ?? latestId;
    const { data: report, isLoading: loadingReport } = useWeeklyCoachReport(activeId);

    const { mutateAsync: generate, isPending: generating } = useGenerateWeeklyCoachReport();
    const { mutateAsync: remove, isPending: deleting } = useDeleteWeeklyCoachReport();

    const handleGenerateLatest = async () => {
        setActionError(null);
        try {
            const result = await generate({ periodStart: null });
            setViewingId(result.id);
        } catch (err) {
            setActionError(getErrorMessage(err, 'Failed to generate report.'));
        }
    };

    const handleRetry = async () => {
        if (!report) return;
        setActionError(null);
        try {
            await generate({ periodStart: report.periodStart });
        } catch (err) {
            setActionError(getErrorMessage(err, 'Failed to retry report.'));
        }
    };

    const handleDelete = async () => {
        if (!report) return;
        if (!confirmingDelete) { setConfirmingDelete(true); return; }
        setActionError(null);
        try {
            await remove(report.id);
            setViewingId(null);
            setConfirmingDelete(false);
        } catch (err) {
            setActionError(getErrorMessage(err, 'Failed to delete report.'));
        }
    };

    if (loadingHistory) return <ViewSkeleton />;

    if (!history || history.items.length === 0) {
        return (
            <div className="space-y-4">
                {actionError && <Alert variant="error">{actionError}</Alert>}
                <EmptyState
                    icon={Sparkles}
                    title="No reports yet"
                    description="Generate your first weekly coaching report to see wins, patterns, and next steps from your last completed week."
                    action={
                        <Button onClick={handleGenerateLatest} loading={generating} className="gap-2">
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            Generate report
                        </Button>
                    }
                />
            </div>
        );
    }

    const isPending = report?.status === 'Pending' || report?.status === 'Processing';
    const isLatest = activeId === latestId;

    return (
        <div className="space-y-6">
            {actionError && <Alert variant="error">{actionError}</Alert>}

            {loadingReport || !report ? (
                <ViewSkeleton />
            ) : (
                <>
                    <div className="flex items-center justify-between px-1">
                        <div>
                            <p className="text-sm font-bold text-foreground">{formatDate(report.periodStart)} – {formatDate(report.periodEnd)}</p>
                            <Badge
                                variant={report.status === 'Completed' ? 'success' : report.status === 'Failed' ? 'error' : report.status === 'Processing' ? 'primary' : 'default'}
                                size="sm"
                                className="mt-1"
                            >
                                {report.status}
                            </Badge>
                        </div>
                        {isLatest && !isPending && (
                            <button
                                type="button"
                                onClick={handleGenerateLatest}
                                disabled={generating}
                                className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:opacity-70 transition-opacity disabled:opacity-50"
                            >
                                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                                Refresh
                            </button>
                        )}
                    </div>

                    {isPending && (
                        <div className="flex flex-col items-center gap-3 py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-primary-500" aria-hidden="true" />
                            <p className="text-sm text-surface-500">Generating your report…</p>
                        </div>
                    )}

                    {report.status === 'Failed' && (
                        <div className="space-y-3">
                            <Alert variant="error">{report.failureMessage ?? 'Report generation failed.'}</Alert>
                            {report.canRetry && (
                                <Button onClick={handleRetry} loading={generating} fullWidth>
                                    Try again
                                </Button>
                            )}
                        </div>
                    )}

                    {report.status === 'Completed' && <ReportContent report={report} />}

                    {!isPending && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-error hover:opacity-70 transition-opacity disabled:opacity-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            {confirmingDelete ? 'Tap again to confirm delete' : 'Delete this report'}
                        </button>
                    )}
                </>
            )}

            {history.items.length > 1 && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">History</h3>
                    <ReportHistoryList items={history.items} activeId={activeId ?? undefined} onSelect={setViewingId} />
                </div>
            )}
        </div>
    );
}
