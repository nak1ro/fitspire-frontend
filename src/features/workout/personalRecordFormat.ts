export function formatMetric(metric: string): string {
    return metric.replace(/([A-Z])/g, ' $1').trim();
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatValue(metric: string, value: number): string {
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
