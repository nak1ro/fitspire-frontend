import { Dumbbell, Activity, Timer, Flame, ListChecks, CheckCircle2, type LucideIcon } from 'lucide-react';
import { IconChip } from '@/shared/ui';
import { TYPE_CONFIG, resolveKnownType } from '@/features/workout/typeConfig';
import type { WorkoutSummary } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(min?: number | null): string | null {
    if (!min) return null;
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    if (h === 0) return `${m}m`;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDistance(km?: number | null): string | null {
    if (!km) return null;
    return `${km.toFixed(1)} km`;
}

function formatVolume(kg?: number | null): string | null {
    if (!kg) return null;
    return kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)} kg`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function WorkoutSummaryBlock({ summary }: { summary: WorkoutSummary }) {
    const type = resolveKnownType(summary.workoutType) ?? 'Gym';
    const { label, Icon, color, bg } = TYPE_CONFIG[type];

    const stats: Array<{ Icon: LucideIcon; value: string }> = [];

    const duration = formatDuration(summary.durationMinutes);
    if (duration) stats.push({ Icon: Timer, value: duration });

    if (summary.exerciseCount) {
        stats.push({ Icon: ListChecks, value: `${summary.exerciseCount} exercise${summary.exerciseCount === 1 ? '' : 's'}` });
    }

    const distance = formatDistance(summary.distanceKm);
    if (distance) stats.push({ Icon: Activity, value: distance });

    const volume = formatVolume(summary.totalVolumeKg);
    if (volume) stats.push({ Icon: Dumbbell, value: volume });

    if (summary.caloriesBurned) {
        stats.push({ Icon: Flame, value: `${summary.caloriesBurned} kcal` });
    }

    return (
        <div className="rounded-xl overflow-hidden border border-surface-200 mt-3 shadow-chip">
            {/* Type header */}
            <div className={`flex items-center gap-2.5 px-3.5 bg-surface-50 ${stats.length > 0 ? 'py-2.5' : 'py-3.5'}`}>
                <IconChip icon={Icon} size="sm" color={color} bg={bg} />
                <span className="text-sm font-bold" style={{ color }}>{label}</span>
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-surface-400">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Completed
                </span>
            </div>

            {/* Stats row */}
            {stats.length > 0 && (
                <div className="flex items-center flex-wrap gap-x-5 gap-y-1 px-3.5 py-3 bg-background">
                    {stats.map(({ Icon: StatIcon, value }, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <StatIcon className="h-3.5 w-3.5 text-surface-400 shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium text-foreground">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
