import { Trophy } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import { formatMetric, formatDate, formatValue } from '../personalRecordFormat';
import { getTypeConfig } from '../typeConfig';

export interface FeaturedPersonalRecordItem {
    id: string;
    workoutType: string;
    metric: string;
    value: number;
    achievedAt: string;
}

export function FeaturedPersonalRecordCard({ record }: { record: FeaturedPersonalRecordItem }) {
    const { color, bg, border } = getTypeConfig(record.workoutType);

    return (
        <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border mb-4"
            style={{ borderColor: border }}
        >
            <IconChip icon={Trophy} size="sm" color={color} bg={bg} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{formatMetric(record.metric)}</p>
                <p className="text-[11px] text-surface-400">{formatDate(record.achievedAt)}</p>
            </div>
            <span className="text-base font-extrabold shrink-0 tabular-nums" style={{ color }}>
                {formatValue(record.metric, record.value)}
            </span>
        </div>
    );
}
