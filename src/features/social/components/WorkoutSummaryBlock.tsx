import { Dumbbell, Activity, Bike, Waves, Zap, Timer, Flame, type LucideIcon } from 'lucide-react';
import type { WorkoutSummary } from '../types';

// ─── Per-type config ───────────────────────────────────────────────────────────

type WorkoutConfig = {
    label: string;
    Icon: LucideIcon;
    color: string;
    border: string;
    headerBg: string;
    iconBg: string;
};

const TYPE_CONFIG: Record<string, WorkoutConfig> = {
    gym: {
        label: 'Gym Workout',
        Icon: Dumbbell,
        color: '#059669',
        border: 'rgba(5,150,105,0.22)',
        headerBg: 'rgba(5,150,105,0.06)',
        iconBg: 'rgba(5,150,105,0.10)',
    },
    running: {
        label: 'Run',
        Icon: Activity,
        color: '#4A7C5F',
        border: 'rgba(74,124,95,0.22)',
        headerBg: 'rgba(74,124,95,0.06)',
        iconBg: 'rgba(74,124,95,0.10)',
    },
    cycling: {
        label: 'Ride',
        Icon: Bike,
        color: '#3A7A8A',
        border: 'rgba(58,122,138,0.22)',
        headerBg: 'rgba(58,122,138,0.06)',
        iconBg: 'rgba(58,122,138,0.10)',
    },
    swimming: {
        label: 'Swim',
        Icon: Waves,
        color: '#2E6EA6',
        border: 'rgba(46,110,166,0.22)',
        headerBg: 'rgba(46,110,166,0.06)',
        iconBg: 'rgba(46,110,166,0.10)',
    },
    yoga: {
        label: 'Yoga',
        Icon: Zap,
        color: '#7B5EA7',
        border: 'rgba(123,94,167,0.22)',
        headerBg: 'rgba(123,94,167,0.06)',
        iconBg: 'rgba(123,94,167,0.10)',
    },
};

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
    const key = summary.workoutType.toLowerCase();
    const cfg = TYPE_CONFIG[key] ?? TYPE_CONFIG.gym;
    const { label, Icon, color, border, headerBg, iconBg } = cfg;

    const stats: Array<{ Icon: LucideIcon; value: string }> = [];

    const duration = formatDuration(summary.durationMinutes);
    if (duration) stats.push({ Icon: Timer, value: duration });

    const distance = formatDistance(summary.distanceKm);
    if (distance) stats.push({ Icon: Activity, value: distance });

    const volume = formatVolume(summary.totalVolumeKg);
    if (volume) stats.push({ Icon: Dumbbell, value: volume });

    if (summary.caloriesBurned) {
        stats.push({ Icon: Flame, value: `${summary.caloriesBurned} kcal` });
    }

    return (
        <div
            className="rounded-xl overflow-hidden border mt-3"
            style={{ borderColor: border }}
        >
            {/* Type header */}
            <div
                className="flex items-center gap-2.5 px-3.5 py-2.5"
                style={{ background: headerBg }}
            >
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: iconBg }}
                >
                    <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
                </div>
                <span className="text-sm font-bold" style={{ color }}>{label}</span>
                <span
                    className="ml-auto text-[11px] font-semibold"
                    style={{ color, opacity: 0.6 }}
                >
                    Completed ✓
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
