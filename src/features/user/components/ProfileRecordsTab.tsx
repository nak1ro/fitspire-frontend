import { Trophy } from 'lucide-react';
import { getTypeConfig, KNOWN_TYPES } from '@/features/workout/typeConfig';
import type { PersonalRecord } from '@/features/workout/types';

function formatMetric(metric: string): string {
    return metric.replace(/([A-Z])/g, ' $1').trim();
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatValue(metric: string, value: number): string {
    const m = metric.toLowerCase();
    if (m.includes('weight') || m.includes('volume')) return `${value} kg`;
    if (m.includes('distance') && m.includes('km')) return `${value} km`;
    if (m.includes('distance')) return `${value} m`;
    if (m.includes('duration') || m.includes('time') || m.includes('minutes')) return `${value} min`;
    if (m.includes('step')) return value.toLocaleString();
    if (m.includes('calor')) return `${value} kcal`;
    if (m.includes('elevation')) return `${value} m`;
    return String(value);
}

interface PRCardProps {
    record: PersonalRecord;
    color: string;
    bg: string;
}

function PRCard({ record, color, bg }: PRCardProps) {
    return (
        <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
            style={{ borderColor: `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.20)` }}
        >
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: bg }}
            >
                <Trophy className="h-4 w-4" style={{ color }} aria-hidden="true" />
            </div>
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

interface Props {
    records: PersonalRecord[];
}

export function ProfileRecordsTab({ records }: Props) {
    if (records.length === 0) {
        return (
            <div className="flex flex-col items-center text-center py-16 px-6 space-y-4">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(5,150,105,0.08)' }}
                >
                    <Trophy className="h-7 w-7" style={{ color: '#059669' }} aria-hidden="true" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                    <p className="text-base font-semibold text-foreground">No records yet</p>
                    <p className="text-sm text-surface-500 leading-relaxed">
                        Keep logging workouts — your personal bests will appear here.
                    </p>
                </div>
            </div>
        );
    }

    // Group by workout type, preserving the known type order
    const grouped = new Map<string, PersonalRecord[]>();
    for (const r of records) {
        if (!grouped.has(r.workoutType)) grouped.set(r.workoutType, []);
        grouped.get(r.workoutType)!.push(r);
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
                const { label, color, bg } = getTypeConfig(workoutType);
                return (
                    <div key={workoutType}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>
                            {label}
                        </p>
                        <div className="space-y-2">
                            {typeRecords.map(r => (
                                <PRCard key={r.id} record={r} color={color} bg={bg} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
