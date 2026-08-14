import { Badge, Card } from '@/shared/ui';

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
}

export function formatDuration(min: number | null | undefined): string | null {
    if (min == null) return null;
    const rounded = Math.round(min);
    if (rounded < 60) return `${rounded} min`;
    const h = Math.floor(rounded / 60);
    const m = rounded % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Splits PascalCase enum values like "FullBody" into "Full Body" for display.
export function humanize(value: string): string {
    return value.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function StatBox({ label, value }: { label: string; value: string | number }) {
    return (
        <Card variant="outlined" padding="sm" className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">{label}</span>
            <span className="text-base font-bold text-foreground">{value}</span>
        </Card>
    );
}

export function TypeBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
    return (
        <Badge size="md" style={{ backgroundColor: bg, color }}>
            {label}
        </Badge>
    );
}
