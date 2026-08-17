'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Badge, Card, EmptyState } from '@/shared/ui';
import { useAdminModerationReport } from '../../hooks/useAdminModeration';
import { ModerationActionPanel } from './ModerationActionPanel';
import { ModerationHistory } from './ModerationHistory';

export function AdminModerationDetailView({ reportId }: { reportId: string }) {
    const { data: report, isLoading, isError } = useAdminModerationReport(reportId);
    if (isLoading) return <div className="h-80 animate-pulse rounded-2xl bg-surface-100" />;
    if (isError || !report) return <EmptyState icon={AlertCircle} title="Couldn't load this report" description="It may not exist or your access may have changed." />;

    return (
        <div className="space-y-5">
            <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-surface-500 transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to moderation</Link>
            <Card padding="md" className="space-y-4"><div className="flex items-start justify-between gap-3"><div><h1 className="text-xl font-extrabold text-foreground">{report.targetType} report</h1><p className="mt-1 text-sm text-surface-500">{report.reason.replace(/([A-Z])/g, ' $1').trim()}</p></div><Badge variant={report.status === 'Open' ? 'warning' : 'success'}>{report.status}</Badge></div>{report.details && <p className="rounded-xl bg-background p-3 text-sm text-surface-600">{report.details}</p>}<div className="grid gap-3 border-t border-surface-100 pt-3 sm:grid-cols-2"><p className="text-sm text-surface-500">Reporter <span className="font-semibold text-foreground">{report.reporter.displayName}</span></p><p className="text-sm text-surface-500">Subject <span className="font-semibold text-foreground">{report.subject.displayName}</span></p></div></Card>
            <Card padding="md" className="space-y-3"><h2 className="text-sm font-bold text-foreground">Current target</h2>{!report.currentTarget.exists ? <p className="text-sm text-surface-500">This target no longer exists. The original snapshot remains below.</p> : <><p className="text-sm text-surface-600">{report.currentTarget.content || report.currentTarget.profile?.displayName || 'Image target'}</p>{report.currentTarget.isRemoved && <Badge variant="error">Removed from public view</Badge>}{report.currentTarget.media?.primary?.url && <img src={report.currentTarget.media.primary.url} alt="Reported content" className="max-h-96 w-full rounded-xl object-cover" />}{report.currentTarget.media && !report.currentTarget.media.primary?.url && <div className="flex items-center gap-2 text-sm text-surface-500"><ImageIcon className="h-4 w-4" aria-hidden="true" />Preview unavailable</div>}</>}</Card>
            <Card padding="md" className="space-y-2"><h2 className="text-sm font-bold text-foreground">Submission snapshot</h2><pre className="overflow-x-auto rounded-xl bg-background p-3 text-xs text-surface-600">{report.targetSnapshotJson}</pre></Card>
            <ModerationActionPanel report={report} />
            <ModerationHistory actions={report.actions} />
        </div>
    );
}
