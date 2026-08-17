'use client';

import { useState } from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Button, Card, EmptyState } from '@/shared/ui';
import { useAdminModerationReports, useAdminModerationSummary } from '../../hooks/useAdminModeration';
import type { AdminModerationReportFilter } from '../../types';
import { ModerationQueueFilters } from './ModerationQueueFilters';
import { ModerationReportCard } from './ModerationReportCard';

export function AdminModerationView() {
    const [filter, setFilter] = useState<AdminModerationReportFilter>({ status: 'Open', page: 1, pageSize: 20 });
    const summary = useAdminModerationSummary();
    const reports = useAdminModerationReports(filter);
    const page = reports.data?.page ?? filter.page ?? 1;
    const pageSize = reports.data?.pageSize ?? filter.pageSize ?? 20;
    const totalCount = reports.data?.totalCount ?? 0;

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-extrabold text-foreground">Moderation</h1>
                <p className="mt-1 text-sm text-surface-500">Review user reports and apply reversible actions.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Card padding="md"><p className="text-xs font-semibold text-surface-500">Open reports</p><p className="mt-1 text-2xl font-extrabold text-foreground">{summary.data?.openReports ?? '—'}</p></Card>
                <Card padding="md"><p className="text-xs font-semibold text-surface-500">Resolved reports</p><p className="mt-1 text-2xl font-extrabold text-foreground">{summary.data?.resolvedReports ?? '—'}</p></Card>
            </div>
            <ModerationQueueFilters filter={filter} onChange={setFilter} />
            {reports.isError ? <EmptyState icon={AlertCircle} title="Couldn't load reports" description="Try refreshing the page." /> : null}
            {reports.isLoading ? <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl bg-surface-100" />)}</div> : null}
            {!reports.isLoading && !reports.isError && reports.data?.items.length === 0 ? <EmptyState icon={ShieldAlert} title="No reports found" description="There are no reports matching these filters." /> : null}
            <div className="space-y-3">{reports.data?.items.map((report) => <ModerationReportCard key={report.id} report={report} />)}</div>
            {totalCount > pageSize && <div className="flex items-center justify-between gap-3"><Button variant="secondary" disabled={page <= 1} onClick={() => setFilter({ ...filter, page: page - 1 })}>Previous</Button><span className="text-sm text-surface-500">Page {page} of {Math.ceil(totalCount / pageSize)}</span><Button variant="secondary" disabled={page * pageSize >= totalCount} onClick={() => setFilter({ ...filter, page: page + 1 })}>Next</Button></div>}
        </div>
    );
}
