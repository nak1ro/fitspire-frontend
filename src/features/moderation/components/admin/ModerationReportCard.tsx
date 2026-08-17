import Link from 'next/link';
import { Badge, Card } from '@/shared/ui';
import type { AdminModerationReportListItem } from '../../types';

interface Props {
    report: AdminModerationReportListItem;
}

export function ModerationReportCard({ report }: Props) {
    const statusVariant = report.status === 'Open' ? 'warning' : 'success';

    return (
        <Link href={`/admin/reports/${report.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl">
            <Card interactive padding="md" className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">{report.targetType} report</p>
                        <p className="mt-0.5 text-xs text-surface-500">{report.reason.replace(/([A-Z])/g, ' $1').trim()}</p>
                    </div>
                    <Badge variant={statusVariant}>{report.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-surface-100 pt-3 text-xs">
                    <p className="min-w-0 text-surface-500">Reporter <span className="font-semibold text-foreground">{report.reporter.displayName}</span></p>
                    <p className="min-w-0 text-surface-500">Subject <span className="font-semibold text-foreground">{report.subject.displayName}</span></p>
                </div>
                <div className="flex items-center justify-between text-xs text-surface-400">
                    <span>{new Date(report.createdAt).toLocaleString()}</span>
                    {report.isTargetCurrentlyRemoved && <span className="font-semibold text-error">Content removed</span>}
                </div>
            </Card>
        </Link>
    );
}
