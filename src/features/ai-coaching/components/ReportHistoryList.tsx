import { Badge, Card } from '@/shared/ui';
import type { WeeklyCoachReportListItem, WeeklyCoachReportStatus } from '../types';

const STATUS_VARIANT: Record<WeeklyCoachReportStatus, 'default' | 'primary' | 'success' | 'error'> = {
    Pending: 'default',
    Processing: 'primary',
    Completed: 'success',
    Failed: 'error',
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ReportHistoryList({
    items, activeId, onSelect,
}: {
    items: WeeklyCoachReportListItem[];
    activeId?: string;
    onSelect: (id: string) => void;
}) {
    return (
        <div className="space-y-2.5">
            {items.map(item => (
                <Card
                    key={item.id}
                    padding="sm"
                    interactive
                    onClick={() => onSelect(item.id)}
                    className={`flex items-center justify-between ${item.id === activeId ? 'ring-2 ring-primary-500' : ''}`}
                >
                    <p className="text-sm font-semibold text-foreground">
                        {formatDate(item.periodStart)} – {formatDate(item.periodEnd)}
                    </p>
                    <Badge variant={STATUS_VARIANT[item.status]} size="sm">{item.status}</Badge>
                </Card>
            ))}
        </div>
    );
}
