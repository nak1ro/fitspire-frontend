import { roundTo1 } from '@/shared/lib/roundTo1';

// Backend metric codes are snake_case (see PersonalRecordMetricCatalogue.cs) — keyed
// explicitly rather than derived, since a couple (estimated_1rm) don't title-case cleanly.
const METRIC_LABELS: Record<string, string> = {
    duration: 'Duration',
    calories: 'Calories',
    distance: 'Distance',
    total_volume: 'Total Volume',
    max_weight: 'Max Weight',
    max_set_volume: 'Max Set Volume',
    max_reps: 'Max Reps',
    estimated_1rm: 'Estimated 1RM',
};

export function formatMetric(metric: string): string {
    return METRIC_LABELS[metric] ?? metric.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Consumes the backend's own `unit` field directly rather than re-guessing it from the
// metric name — that guess used to silently mismatch the catalogue (e.g. `distance`'s
// substring check for "km" could never match the literal metric code "distance").
export function formatValue(value: number, unit: string): string {
    if (unit === 'reps') return value.toLocaleString();
    // Estimated-1RM/volume metrics are derived via division and arrive with long
    // floating-point tails (e.g. 78.66666666666666) — round to at most 1 decimal place.
    return `${roundTo1(value)} ${unit}`;
}
