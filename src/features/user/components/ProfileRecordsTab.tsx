import { Trophy, Pin } from 'lucide-react';
import { EmptyState, IconChip } from '@/shared/ui';
import { getTypeConfig, resolveKnownType, KNOWN_TYPES } from '@/features/workout/typeConfig';
import { formatMetric, formatDate, formatValue } from '@/features/workout/personalRecordFormat';
import type { PersonalRecord } from '@/features/workout/types';

interface PRCardProps {
    record: PersonalRecord;
    color: string;
    bg: string;
    border: string;
    featured: boolean;
    onTogglePin?: (id: string) => void;
}

function PRCard({ record, color, bg, border, featured, onTogglePin }: PRCardProps) {
    return (
        <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
            style={{ borderColor: featured ? color : border }}
        >
            <IconChip icon={Trophy} size="sm" color={color} bg={bg} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{formatMetric(record.metric)}</p>
                <p className="text-[11px] text-surface-400">{formatDate(record.achievedAt)}</p>
            </div>
            <span className="text-base font-extrabold shrink-0 tabular-nums" style={{ color }}>
                {formatValue(record.metric, record.value)}
            </span>
            {onTogglePin && (
                <button
                    type="button"
                    onClick={() => onTogglePin(record.id)}
                    aria-label={featured ? 'Unpin from profile' : 'Pin to profile'}
                    title={featured ? 'Unpin from profile' : 'Pin to profile'}
                    className="shrink-0 p-1.5 rounded-lg transition-colors"
                    style={featured ? { color } : undefined}
                >
                    <Pin className={featured ? 'h-4 w-4 fill-current' : 'h-4 w-4 text-surface-300'} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

interface Props {
    records: PersonalRecord[];
    featuredRecordId?: string | null;
    onTogglePin?: (id: string) => void;
}

export function ProfileRecordsTab({ records, featuredRecordId, onTogglePin }: Props) {
    if (records.length === 0) {
        return (
            <EmptyState
                icon={Trophy}
                title="No records yet"
                description="Keep logging workouts — your personal bests will appear here."
            />
        );
    }

    // Group by workout type, preserving the known type order.
    // The API returns lowercase type strings, so normalize before grouping —
    // otherwise the known-type sort below never matches.
    const grouped = new Map<string, PersonalRecord[]>();
    for (const r of records) {
        const key = resolveKnownType(r.workoutType) ?? r.workoutType;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(r);
    }

    // Sort groups: known types first (in order), then unknown types alphabetically
    const knownOrder = KNOWN_TYPES as readonly string[];
    const sortedEntries = [...grouped.entries()].sort(([a], [b]) => {
        const ai = knownOrder.indexOf(a);
        const bi = knownOrder.indexOf(b);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="space-y-6">
            {sortedEntries.map(([workoutType, typeRecords]) => {
                const { label, color, bg, border } = getTypeConfig(workoutType);
                return (
                    <div key={workoutType}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>
                            {label}
                        </p>
                        <div className="space-y-2">
                            {typeRecords.map(r => (
                                <PRCard
                                    key={r.id}
                                    record={r}
                                    color={color}
                                    bg={bg}
                                    border={border}
                                    featured={r.id === featuredRecordId}
                                    onTogglePin={onTogglePin}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
